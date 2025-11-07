// background.js (이미지 crop은 sidepanel.js에서 수행)

console.log("[BG] Service Worker loaded ✅");

let tabScreenshots = {};

chrome.action.onClicked.addListener(async (tab) => {
  console.log("[BG] Icon clicked");

  try {
    await chrome.sidePanel.open({ tabId: tab.id });
    console.log("[BG] Side panel opened successfully.");
  } catch (err) {
    console.error("[BG] Failed to open side panel:", err);
    return;
  }

  try {
    const dataUrl = await chrome.tabs.captureVisibleTab(tab.windowId, {
      format: "jpeg",
    });

    tabScreenshots[tab.id] = dataUrl;
    console.log("[BG] Screenshot captured and stored.");
    await chrome.tabs.sendMessage(tab.id, { action: "initiateCapture" });
  } catch (err) {
    console.error("[BG] captureVisibleTab failed:", err.message);

    let hostname = "이 페이지";
    try {
      hostname = new URL(tab.url).hostname;
    } catch { }

    const captureErrorMsg = `캡처 실패: '${hostname}' 페이지는 캡처할 수 없습니다.`;
    if (tabScreenshots[tab.id]) delete tabScreenshots[tab.id];

    setTimeout(() => {
      chrome.runtime.sendMessage({
        action: "showError",
        payload: { message: captureErrorMsg }
      }).catch((e) => console.warn("Could not send error to side panel", e.message));
    }, 100);
  }
});

// contentScript → background.js
chrome.runtime.onMessage.addListener(async (request, sender) => {
  console.log("[BG] Message received:", request);

  if (request.action === "capture") {
    // ⭐️ [수정] dpr을 payload에서 추출
    const { left, top, width, height, dpr } = request.payload;
    const tabId = sender.tab.id;
    const dataUrl = tabScreenshots[tabId];

    if (!dataUrl) {
      console.error("[BG] No stored screenshot found for tab:", tabId);
      return;
    }

    // ✅ crop 좌표 + 전체 이미지 dataUrl + dpr 전달
    try {
      const message = {
        action: "processImage",
        payload: {
          imageUrl: dataUrl,
          crop: { left, top, width, height },
          dpr: dpr || 1 // ⭐️ [수정] dpr을 sidepanel로 함께 전달
        },
      };
      chrome.runtime.sendMessage(message).catch((e) => {
        console.warn("[BG] Side panel not open or error sending:", e.message);
      });
      console.log("[BG] Image info sent to sidepanel");
    } finally {
      if (tabScreenshots[tabId]) {
        delete tabScreenshots[tabId];
        console.log("[BG] Stored screenshot cleaned up for tab:", tabId);
      }
    }
  }
});

chrome.tabs.onRemoved.addListener((tabId) => {
  if (tabScreenshots[tabId]) {
    delete tabScreenshots[tabId];
    console.log(`[BG] Cleaned up screenshot for closed tab: ${tabId}`);
  }
});

chrome.tabs.onUpdated.addListener((tabId) => {
  if (tabScreenshots[tabId]) {
    delete tabScreenshots[tabId];
    console.log(`[BG] Cleaned up screenshot for updated tab: ${tabId}`);
  }
});
