import json
import base64
import boto3
import uuid
import os
import urllib.parse

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

        # --- 4. Bedrock 2차 호출 (삭제) ---
# (기존의 "Bedrock 호출 2" try-except 블록 전체를 삭제합니다)


# --- 4. (변경) 검색 링크 직접 생성 ---
    try:
        # 1차 Bedrock 호출에서 받은 검색 키워드 활용
        if not search_keywords:
            # 키워드가 비어있으면 식별된 아이템 이름을 기본값으로 사용
            primary_keyword = identified_item
        else:
            # 1순위 키워드 사용
            primary_keyword = search_keywords[0] 

        # URL에 사용하기 위해 키워드를 인코딩합니다 (예: "불닭 볶음면" -> "불닭%20볶음면")
        query = urllib.parse.quote(primary_keyword)

        # 실제 쇼핑몰의 검색 URL을 생성합니다
        buy_links = {
            "네이버쇼핑 검색": [f"https://search.shopping.naver.com/search/all?query={query}"],
            "쿠팡에서 검색": [f"https://www.coupang.com/np/search?q={query}"],
            "G마켓에서 검색": [f"https://browse.gmarket.co.kr/search?keyword={query}"]
        }

        # Bedrock 2차 호출 결과 대신, 위에서 직접 만든 링크로 응답을 구성합니다.
        final_response_body = {
            "status": "success",
            "identifiedItem": identified_item,
            "keyFeatures": key_features,
            "buyLinks": buy_links,  # ⭐️ 직접 생성한 링크 딕셔너리
            "capturedImageUrl": presigned_url,
            "capturedImageS3Url": f"https://{S3_BUCKET_NAME}.s3.amazonaws.com/uploads/{image_key}"
        }

        return create_response(200, final_response_body)

    except Exception as e:
        return create_response(500, {
            'error': 'Failed - Link Generation.',
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
