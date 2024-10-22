import getAllBookmarks from "./bookmark-tojson";

console.log("content.js loaded");
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "triggerFunction") {
    injectScript();
  }
});

function injectScript() {
  console.log("injecting script");
  setTimeout(() => {
    console.log("injecting script");
    getAllBookmarks();
  }, 1500);
}

// chrome.runtime.sendMessage({ action: "isHideHighLikes" }, (response) => {
//   console.log(response.data);
//   if (response.data) {
//     console.log("hiding tweets");

//     setTimeout(() => {
//       logLikesForTweets();
//     }, 5000);
//     const observer = new MutationObserver((mutations) => {
//       mutations.forEach((mutation) => {
//         if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
//           logLikesForTweets();
//         }
//       });
//     });

//     observer.observe(document.body, { childList: true, subtree: true });

//     return;
//   }
// });

function logLikesForTweets() {
  const tweets = document.querySelectorAll('article[data-testid="tweet"]');
  tweets.forEach((tweet) => {
    const likeButton = tweet.querySelector('button[data-testid="like"]');
    if (likeButton && likeButton.getAttribute("aria-label")) {
      let likeCount = likeButton.getAttribute("aria-label")?.split(".")[0];
      const tweetText =
        tweet.querySelector('div[data-testid="tweetText"]')?.textContent ||
        "No text";
      likeCount = likeCount.replace(/\D/g, "");
      if (likeCount > 10000) {
        tweet.style.display = "none";
        console.log(
          `hiding tweet: ${tweetText.substring(0, 50)} link: ${
            tweet.querySelectorAll("a")[0].href
          }`
        );
      }
    } else {
      console.log("no like button");
    }
  });
}


// content.js

let hideHighLikes = false;
let likeThreshold = 10000;

// Function to parse like count from a tweet
function parseLikeCount(likeButton) {
  if (!likeButton || !likeButton.getAttribute("aria-label")) return 0;
  const likeText = likeButton.getAttribute("aria-label").split(".")[0];
  return parseInt(likeText.replace(/\D/g, ""), 10) || 0;
}

// Function to hide tweets based on like count
function hideTweetsAboveThreshold() {
  const tweets = document.querySelectorAll('article[data-testid="tweet"]');
  tweets.forEach((tweet) => {
    const likeButton = tweet.querySelector('button[data-testid="like"]');
    const likeCount = parseLikeCount(likeButton);
    
    if (likeCount > likeThreshold) {
      tweet.style.display = "none";
      console.log(`Hiding tweet with ${likeCount} likes`);
    } else if (tweet.style.display === "none") {
      tweet.style.display = ""; // Show previously hidden tweets if they're now below the threshold
    }
  });
}

// Set up MutationObserver to handle dynamically loaded tweets
function setupMutationObserver() {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
        hideTweetsAboveThreshold();
      }
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

// Initialize the content script
function initialize() {
  chrome.runtime.sendMessage({ action: "isHideHighLikes" }, (response) => {
    if (chrome.runtime.lastError) {
      console.error("Error getting hideHighLikes setting:", chrome.runtime.lastError);
      return;
    }
    
    hideHighLikes = response.data;
    
    if (hideHighLikes) {
      chrome.runtime.sendMessage({ action: "getLikeThreshold" }, (thresholdResponse) => {
        if (chrome.runtime.lastError) {
          console.error("Error getting likeThreshold:", chrome.runtime.lastError);
          return;
        }
        
        likeThreshold = thresholdResponse.data || 10000;
        console.log(`Hiding tweets with more than ${likeThreshold} likes`);
        
        hideTweetsAboveThreshold();
        setupMutationObserver();
      });
    }
  });
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "updateSettings") {
    hideHighLikes = request.hideHighLikes;
    likeThreshold = request.likeThreshold;
    
    if (hideHighLikes) {
      hideTweetsAboveThreshold();
      setupMutationObserver();
    } else {
      // Show all hidden tweets when the feature is turned off
      document.querySelectorAll('article[data-testid="tweet"]').forEach(tweet => {
        tweet.style.display = "";
      });
    }
  }
});

// Initialize the content script when the page loads
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initialize);
} else {
  initialize();
}
