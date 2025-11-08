// sidepanel.js (비주얼 쇼퍼 API용으로 수정)

// --- 0. Lambda API 엔드포인트 ---
const API_ENDPOINT = "https://fne8x5xlc6.execute-api.us-east-1.amazonaws.com/identify-food";
const SAVE_API_ENDPOINT = "https://fne8x5xlc6.execute-api.us-east-1.amazonaws.com/save";

// --- 0.5. DOM 요소 선택 (새 HTML 구조에 맞게 수정) ---
const loader = document.getElementById("loader");
const errorMessage = document.getElementById("error-message");
const shopperCard = document.getElementById("shopper-card");
const capturedImage = document.getElementById("captured-image");
const itemName = document.getElementById("item-name");
const keyFeaturesContainer = document.getElementById("key-features-container");
const buyLinksContainer = document.getElementById("buy-links-container");
let currentItemData = null;


// --- 1. 백그라운드 메시지 수신 (🚨 [수정됨] sendToLambda 호출) ---
chrome.runtime.onMessage.addListener((message) => {
  // 1A. 이미지 처리 요청
  if (message.action === "processImage") {
    hideAllCards();
    showElement(loader);

    // ⭐️ [수정] dpr을 payload에서 추출
    const { imageUrl, crop, dpr } = message.payload;

    const img = new Image();
    img.onload = async () => {
      try {
        // ⭐️ [수정] 모든 좌표와 크기에 dpr을 곱해 '네이티브' 값으로 변환
        const nativeLeft = crop.left * dpr;
        const nativeTop = crop.top * dpr;
        const nativeWidth = crop.width * dpr;
        const nativeHeight = crop.height * dpr;

        const canvas = document.createElement("canvas");
        // 캔버스 자체의 크기도 네이티브 픽셀 크기여야 함
        canvas.width = nativeWidth;
        canvas.height = nativeHeight;

        const ctx = canvas.getContext("2d");

        // 네이티브 스크린샷(img)에서 네이티브 좌표/크기를 사용해 크롭
        ctx.drawImage(
          img,
          nativeLeft, nativeTop, nativeWidth, nativeHeight, // [소스] 이미지에서 잘라낼 영역
          0, 0, nativeWidth, nativeHeight                  // [대상] 캔버스에 그릴 영역
        );

        // (품질 0.7)
        const croppedUrl = canvas.toDataURL("image/jpeg", 0.7);

        await sendToLambda(croppedUrl);

      } catch (err) {
        console.error("Image processing failed:", err);
        showError("이미지 처리에 실패했습니다.");
      }
    };
    img.onerror = () => {
      showError("캡처한 이미지를 불러오는 데 실패했습니다.");
    };
    img.src = imageUrl;
  }

  // 1B. 캡처 실패 오류 메시지
  if (message.action === "showError") {
    showError(message.payload.message);
  }
});


// --- 2. (삭제됨) cropImageToBase64 함수 ---
// onMessage 리스너 내부 로직으로 통합되었습니다.


// --- 3. Lambda 호출 (오류 처리 강화) ---
async function sendToLambda(base64Image) {
  console.log("🛰 Lambda로 요청 전송 시작:", API_ENDPOINT);

  try {
    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image_base64: base64Image }),
    });

    console.log("✅ Lambda 응답 수신:", response.status);

    const responseText = await response.text();
    let data;

    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error("❌ Lambda 응답이 JSON이 아님:", responseText);
      throw new Error(`서버 오류 (${response.status}): 응답 형식이 올바르지 않습니다.`);
    }

    if (!response.ok) {
      console.error("❌ Lambda 응답 오류 (JSON):", data);
      const errorMsg = data.error || data.message || "Lambda 응답 오류";
      throw new Error(`${errorMsg}`);
    }

    // (response.ok === true) 성공!
    console.log("[SIDE] Lambda 응답 데이터:", data);
    hideElement(loader);
    renderUI(data); // 새 렌더링 함수 호출

  } catch (err) {
    console.error("❌ Lambda 요청 또는 파싱 실패:", err);
    showError(err.message || "분석에 실패했습니다. 잠시 후 다시 시도해주세요.");
  }
}

// --- 4. UI 렌더링 (🚨 [수정됨] 비주얼 쇼퍼용) ---
function renderUI(data) {
  hideAllCards();

  if (data.status === "success") {
    currentItemData = data;
    // (1) 이미지, 아이템 이름 설정
    // ⭐️ 참고: Lambda 응답의 'capturedImageUrl' 키를 사용합니다.
    capturedImage.src = data.capturedImageUrl;
    itemName.textContent = data.identifiedItem || "아이템";

    // (2) 키 특징(Key Features) 렌더링
    keyFeaturesContainer.innerHTML = ''; // 초기화
    if (data.keyFeatures && data.keyFeatures.length > 0) {
      data.keyFeatures.forEach(feature => {
        const tag = document.createElement('span');
        tag.className = 'tag';
        tag.textContent = feature;
        keyFeaturesContainer.appendChild(tag);
      });
    }

    // (3) 구매 링크(Buy Links) 렌더링
    buyLinksContainer.innerHTML = ''; // 초기화
    if (data.buyLinks) {

      // ⭐️ [이 부분 수정] ⭐️
      // "정확한 제품" 대신, 객체에 있는 모든 키를 순회합니다.
      Object.keys(data.buyLinks).forEach(key => {
        const links = data.buyLinks[key];

        if (links && links.length > 0) {
          // key("네이버쇼핑 검색")를 헤더로 사용
          buyLinksContainer.appendChild(createLinkHeader(key));

          links.forEach(link => {
            // "구매하기" 대신 "검색하러 가기"
            buyLinksContainer.appendChild(createLinkElement(link, "검색하러 가기"));
          });
        }
      });
      // ⭐️ [수정 끝] ⭐️
    }

    showElement(shopperCard);

  } else {
    // Case: 람다가 status: "error"를 보낸 경우
    const errorMsg = data.error || data.message || "알 수 없는 오류입니다.";
    showError(errorMsg);
  }
}

// 링크 헤더 생성 헬퍼
function createLinkHeader(text) {
  const header = document.createElement('h4');
  header.textContent = text;
  return header;
}

// 링크 <a> 태그 생성 헬퍼
function createLinkElement(url, text) {
  const a = document.createElement('a');
  a.href = url;
  a.textContent = text;
  a.className = 'buy-link';
  a.target = '_blank'; // 새 탭에서 열기
  return a;
}


// --- 5. (삭제됨) "More Info" 링크 및 토글 로직 ---
// 비주얼 쇼퍼 UI에서는 해당 로직이 필요 없으므로 삭제합니다.


// --- 6. 유틸리티 (🚨 [수정됨] hideAllCards) ---
function showElement(el) { el.classList.remove("hidden"); }
function hideElement(el) { el.classList.add("hidden"); }

function hideAllCards() {
  hideElement(loader);
  hideElement(errorMessage);
  hideElement(shopperCard); // (수정)
}

function showError(msg) {
  hideAllCards();
  errorMessage.textContent = msg;
  showElement(errorMessage);
}
// sidepanel.js 파일 하단에 추가

// ⭐️ 3. "저장" 버튼 클릭 이벤트 리스너
document.getElementById('cart-button').addEventListener('click', async () => {
  // 1단계에서 저장해 둔 데이터가 없으면 실행 중단
  if (!currentItemData) {
    alert("저장할 아이템이 없습니다.");
    return;
  }

  // ⭐️ 4. Lambda가 요구하는 페이로드(payload) 생성
  const payload = {
    identifiedItem: currentItemData.identifiedItem,
    buyLinks: currentItemData.buyLinks,
    capturedImageS3Url: currentItemData.capturedImageS3Url
  };

  console.log("Saving item:", payload);

  try {
    const response = await fetch(SAVE_API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      // 서버에서 4xx, 5xx 응답을 보낸 경우
      throw new Error('서버 저장에 실패했습니다.');
    }

    const result = await response.json();
    console.log('Save success:', result);

    // ⭐️ 5. 사용자에게 피드백
    alert('아이템이 저장되었습니다!');
    // 여기에 웹사이트 링크

  } catch (error) {
    console.error('Error saving item:', error);
    alert('저장 중 오류가 발생했습니다.');
  }
});