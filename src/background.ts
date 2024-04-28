chrome.runtime.onMessage.addListener(function (request, _, sendResponse) {
  if (request.query === "getURL") {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      var activeTab = tabs[0];
      sendResponse({ tabURL: activeTab.url });
    });
    return true;
  }
  if(request.action === "saveToLocalStorage"){
    // localStorage.setItem("tweetBookmarks", JSON.stringify(request.data));
    chrome.storage.local.set({tweetBookmarks: JSON.stringify(request.tweets)}, function() {
      console.log('Value is set to ' + request.data);
    });
    return true;
  }
  if(request.action === "getLocalStorage"){
    // const data = localStorage.getItem("tweetBookmarks");
    // sendResponse({data: JSON.parse(data?? "[]")});
     chrome.storage.local.get(['tweetBookmarks'], function(result) {
      console.log('Value currently is ' + result.tweetBookmarks);
      sendResponse({data: JSON.parse(result.tweetBookmarks?? "[]")});
    });
    return true;
  }
  // clicked_browser_action
  if (request.message === "injectScript") {
    //create a new tab
    console.log("helloooooooo")
    chrome.tabs.create({ url: "https://twitter.com/i/bookmarks/all" }).then((tab) => {
      console.log(tab.id);

      //wait for the 5 second
      setTimeout(() => {
        //execrut content.js
        console.log("hello")
        //send message to content.js
        // chrome.tabs.sendMessage(tab.id, { action: "triggerFunction" });
        chrome.tabs.sendMessage(tab.id!, { action: 'triggerFunction' });

      }, 5000);
  });
    return true;
  }
});


// chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
//   if(changeInfo.url === "https://twitter.com/i/bookmarks/all"){

//      console.log("onUpdated." + " url is "+changeInfo.url);
//   chrome.tabs.sendMessage(tabId, {action: "triggerFunction"});


//   }

// });

// function showNotification() {

//   console.log("showNotification");
// }
