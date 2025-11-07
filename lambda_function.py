import json
import base64
import boto3
import uuid
import os

# --- 1. 환경 설정 ---
S3_BUCKET_NAME = os.environ.get('S3_BUCKET_NAME', 'smct-ht-10-extention')
BEDROCK_MODEL_ID = "anthropic.claude-3-sonnet-20240229-v1:0"

s3_client = boto3.client('s3')
bedrock_client = boto3.client('bedrock-runtime', region_name='us-east-1')

def lambda_handler(event, context):
    # --- 2. 이미지 업로드 ---
    try:
        body = json.loads(event['body'])
        image_base64 = body['image_base64']

        # Base64 헤더 제거
        image_data_str = image_base64.split(',')[-1]
        image_bytes = base64.b64decode(image_data_str)

        image_key = f"uploads/{uuid.uuid4()}.jpg"
        s3_client.put_object(
            Bucket=S3_BUCKET_NAME, Key=image_key,
            Body=image_bytes, ContentType='image/jpeg'
        )

        # presigned URL (1시간 유효)
        presigned_url = s3_client.generate_presigned_url(
            'get_object',
            Params={'Bucket': S3_BUCKET_NAME, 'Key': image_key},
            ExpiresIn=3600
        )

    except Exception as e:
        print(str(e))
        return create_response(400, {
            'error': 'Failed to parse request or upload to S3.',
            'details': str(e)
        })

    # --- 3. Bedrock 호출: 비주얼 쇼퍼 분석 ---
    try:
        # STEP 1️⃣ 이미지 분석 + 주요 대상 파악
        prompt_config = {
            "type": "text",
            "text": """당신은 '비주얼 쇼퍼(Visual Shopper)' AI입니다.
당신의 임무는 사용자가 업로드한 이미지를 분석하고, 그 속의 '주요 대상(제품 또는 음식)'을 식별하여
사용자가 실제로 구매할 수 있는 링크를 제공합니다.

## 지시사항:
1. 이미지를 세밀하게 분석하고, 사용자가 궁금해할 주요 대상을 1개 선정하세요.
2. 그 대상의 구체적인 정보를 추론하세요.
   - 제품/의류라면: 브랜드(추정), 색상, 디자인 특징
   - 음식이라면: 요리 이름 또는 제품 브랜드명
3. 그 정보를 바탕으로 다음 JSON 포맷으로 응답하세요:

{
  "identifiedItem": "불닭볶음면 컵라면",
  "keyFeatures": ["삼양 브랜드", "매운맛", "컵라면"],
  "searchKeywords": ["불닭볶음면 컵라면", "삼양 라면 매운맛"],
  "category": "food"
}

오직 JSON만 반환하세요."""
        }

        vision_data = invoke_bedrock_multimodal(image_data_str, prompt_config)
        identified_item = vision_data.get('identifiedItem', 'Unknown item')
        key_features = vision_data.get('keyFeatures', [])
        search_keywords = vision_data.get('searchKeywords', [])
        category = vision_data.get('category', 'general')

    except Exception as e:
        return create_response(500, {
            'error': 'Failed - Bedrock Visual Analysis',
            'details': str(e)
        })

        # --- 4. Bedrock 호출 2: 검색 및 링크 추천 (안전 버전) ---
    try:

        # keyFeatures를 JSON 문자열로 변환
        key_features_json = json.dumps(key_features, ensure_ascii=False)

        prompt_text_2 = f"""당신은 '비주얼 쇼퍼(Visual Shopper)' AI 어시스턴트입니다.

    아래는 이미지 분석 결과입니다:
    - 식별된 대상: "{identified_item}"
    - 주요 특징: {key_features_json}

    이 정보를 바탕으로 실제 구매 가능한 링크를 제공하세요.

    ## 출력 형식(JSON)
    아래 예시 형식을 그대로 따라 JSON으로만 응답하세요:

    {{
    "identifiedItem": "{identified_item}",
    "keyFeatures": {key_features_json},
    "buyLinks": {{
        "정확한 제품": ["링크1 (공식 스토어 또는 동일 제품)"],
        "유사한 제품": ["링크2 (비슷한 디자인/브랜드)", "링크3 (대체 가능한 상품)"]
    }}
    }}

    ## 추가 지침:
    - 실제 존재하는 한국 전자상거래 사이트(쿠팡, 네이버쇼핑, 무신사, 지마켓 등)의 링크를 사용하세요.
    - 정확한 제품을 찾을 수 없을 경우, '유사한 제품'만 제공해도 괜찮습니다.
    - 절대로 설명 문장이나 분석 문장을 추가하지 말고, JSON만 반환하세요."""

        # 모델 호출
        result_str = invoke_bedrock_text(prompt_text_2)
        print("Bedrock Call 2 Response:", result_str)  # CloudWatch에 확인용 로그

        # 안전하게 JSON 파싱
        try:
            result_data = json.loads(result_str)
        except json.JSONDecodeError:
            print("Bedrock Call 2 - JSON 파싱 실패, 기본값 사용")
            result_data = {
                "identifiedItem": identified_item,
                "keyFeatures": key_features,
                "buyLinks": {}
            }

        final_response_body = {
            "status": "success",
            "identifiedItem": result_data.get("identifiedItem", identified_item),
            "keyFeatures": result_data.get("keyFeatures", key_features),
            "buyLinks": result_data.get("buyLinks", {}),
            "capturedImageUrl": presigned_url,
            "capturedImageS3Url": f"https://{S3_BUCKET_NAME}.s3.amazonaws.com/uploads/{image_key}"
        }

        return create_response(200, final_response_body)

    except Exception as e:
        return create_response(500, {
            'error': 'Failed - Bedrock Call 2 (Shopping Links).',
            'details': str(e)
        })


# --- Helper: Bedrock 멀티모달 호출 ---
def invoke_bedrock_multimodal(image_data_str, prompt_config):
    request_body = {
        "anthropic_version": "bedrock-2023-05-31",
        "max_tokens": 1024,
        "messages": [
            {
                "role": "user",
                "content": [
                    {
                        "type": "image",
                        "source": {
                            "type": "base64",
                            "media_type": "image/jpeg",
                            "data": image_data_str
                        }
                    },
                    prompt_config
                ]
            }
        ]
    }

    response = bedrock_client.invoke_model(
        body=json.dumps(request_body),
        modelId=BEDROCK_MODEL_ID,
        contentType='application/json',
        accept='application/json'
    )

    response_body = json.loads(response.get('body').read())
    result_str = response_body['content'][0]['text']
    return json.loads(result_str)

# --- Helper: Bedrock 텍스트 호출 ---
def invoke_bedrock_text(prompt_text):
    request_body = {
        "anthropic_version": "bedrock-2023-05-31",
        "max_tokens": 1024,
        "messages": [
            {"role": "user", "content": [{"type": "text", "text": prompt_text}]}
        ]
    }
    response = bedrock_client.invoke_model(
        body=json.dumps(request_body),
        modelId=BEDROCK_MODEL_ID,
        contentType='application/json',
        accept='application/json'
    )
    response_body = json.loads(response.get('body').read())
    return response_body['content'][0]['text']

# --- Helper: CORS 포함 공통 응답 ---
def create_response(status_code, body):
    return {
        'statusCode': status_code,
        'headers': {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS'
        },
        'body': json.dumps(body, indent=2, ensure_ascii=False)
    }
