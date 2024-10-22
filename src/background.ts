chrome.runtime.onMessage.addListener(function (request, _, sendResponse) {
  if (request.query === "getURL") {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      var activeTab = tabs[0];
      sendResponse({ tabURL: activeTab.url });
    });
    return true;
  }

  if (request.action === "setLikeThreshold") {
    chrome.storage.local.set({ likeThreshold: request.threshold }, function () {
      console.log("Like threshold is set to " + request.threshold);
    });
    return true;
  }

  if (request.action === "getLikeThreshold") {
    chrome.storage.local.get(["likeThreshold"], function (result) {
      console.log("Value currently is " + result.likeThreshold);
      sendResponse({ data: result.likeThreshold || 10000 });
    });
    return true;
  }
  if (request.action === "saveToLocalStorage") {
    chrome.storage.local.set(
      { tweetBookmarks: JSON.stringify(request.tweets) },
      function () {
        console.log("Value is set to " + request.data);
      }
    );
    return true;
  }
  if (request.action === "getLocalStorage") {
    chrome.storage.local.get(["tweetBookmarks"], function (result) {
      console.log("Value currently is " + result.tweetBookmarks);
      sendResponse({ data: JSON.parse(result.tweetBookmarks ?? "[]") });
    });
    return true;
  }
  if (request.action === "isHideHighLikes") {
    // check if isHideHighLikes to true
    chrome.storage.local.get(["isHideHighLikes"], function (result) {
      console.log("Value currently is " + result.isHideHighLikes);
      sendResponse({ data: result.isHideHighLikes });
    });
    return true;
  }
  if (request.action === "setHideHighLikes") {
    console.log("setHideHighLikes");
    console.log(request.isHideHighLikes);
    chrome.storage.local.set(
      { isHideHighLikes: request.isHideHighLikes },
      function () {
        console.log("Value is set to " + request.isHideHighLikes);
      }
    );
    return true;
  }
  if (request.message === "injectScript") {
    console.log("helloooooooo");
    chrome.tabs.create({ url: "https://x.com/i/bookmarks/all" }).then((tab) => {
      console.log(tab.id);

      setTimeout(() => {
        console.log("hello");
        chrome.tabs.sendMessage(tab.id!, { action: "triggerFunction" });
      }, 5000);
    });
    return true;
  }
});

// }
