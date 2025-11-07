let overlay = null;
let dragBox = null;
let startX, startY;

// 1️⃣ 캡처 모드 진입
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'initiateCapture') {
    document.body.style.cursor = 'crosshair';

    if (!overlay) {
      overlay = document.createElement('div');
      overlay.style.position = 'fixed';
      overlay.style.top = '0';
      overlay.style.left = '0';
      overlay.style.width = '100%';
      overlay.style.height = '100%';
      overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
      overlay.style.zIndex = '9999998';
      document.body.appendChild(overlay);
    }

    document.addEventListener('mousedown', onMouseDown, false);
  }
});

// 2️⃣ 드래그 시작
function onMouseDown(e) {
  e.preventDefault();
  e.stopPropagation();

  startX = e.clientX;
  startY = e.clientY;

  if (!dragBox) {
    dragBox = document.createElement('div');
    dragBox.id = 'drag-box';
    dragBox.style.position = 'fixed';
    dragBox.style.border = '2px dashed #fff';
    dragBox.style.zIndex = '9999999';
    document.body.appendChild(dragBox);
  }

  document.addEventListener('mousemove', onMouseMove, false);
  document.addEventListener('mouseup', onMouseUp, false);
}

// 3️⃣ 드래그 중
function onMouseMove(e) {
  const endX = e.clientX;
  const endY = e.clientY;

  dragBox.style.left = Math.min(startX, endX) + 'px';
  dragBox.style.top = Math.min(startY, endY) + 'px';
  dragBox.style.width = Math.abs(endX - startX) + 'px';
  dragBox.style.height = Math.abs(endY - startY) + 'px';
}

// 4️⃣ 드래그 종료
function onMouseUp(e) {
  document.removeEventListener('mousedown', onMouseDown, false);
  document.removeEventListener('mousemove', onMouseMove, false);
  document.removeEventListener('mouseup', onMouseUp, false);

  document.body.style.cursor = 'default';
  if (overlay) {
    document.body.removeChild(overlay);
    overlay = null;
  }
  if (dragBox) {
    document.body.removeChild(dragBox);
    dragBox = null;
  }

  const endX = e.clientX;
  const endY = e.clientY;
  const left = Math.min(startX, endX);
  const top = Math.min(startY, endY);
  const width = Math.abs(endX - startX);
  const height = Math.abs(endY - startY);

  if (width < 10 || height < 10) return;

  // DPR 계산만 포함
  const dpr = window.devicePixelRatio || 1;
  const scrollX = window.scrollX;
  const scrollY = window.scrollY;

  chrome.runtime.sendMessage({
    action: 'capture',
    payload: {
      left,
      top,
      width,
      height,
      scrollX: window.scrollX,
      scrollY: window.scrollY,
      dpr: window.devicePixelRatio || 1
    }
  });
}
