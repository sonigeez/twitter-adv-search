chrome.runtime.onMessage.addListener(function (request, _, sendResponse) {
  if (request.query === "getURL") {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      var activeTab = tabs[0];
      sendResponse({ tabURL: activeTab.url });
    });
    return true;
  }
});
