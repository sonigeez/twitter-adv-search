export default function getAllBookmarks() {
    const TWITTER_BOOKMARKS_URL = "https://x.com/i/bookmarks";
    const SCROLL_INTERVAL = 800;
    const SCROLL_STEP = 5000;
    const MAX_UNCHANGED_COUNT = 10;

    if (!location.href.startsWith(TWITTER_BOOKMARKS_URL)) {
        return;
    }

    const tweets = [];
    let previousTweetCount = 0;
    let unchangedCount = 0;

    const scrollToEnd = () => {
        window.scrollBy(0, SCROLL_STEP);
        const currentTweetCount = tweets.length;
        //update the number
        const number = document.getElementById('toast-indicator').getElementsByTagName('span')[0];
        number.innerText = currentTweetCount;
        //

        if (currentTweetCount === previousTweetCount) {
            unchangedCount++;
            if (unchangedCount >= MAX_UNCHANGED_COUNT) {
                console.log("Scraping complete");
                console.log("Total tweets scraped: ", tweets.length);
                console.log("Downloading tweets as JSON...");
                stopScraping();
                chrome.runtime.sendMessage({ action: 'saveToLocalStorage', tweets: tweets });
            }
        } else {
            unchangedCount = 0;
        }

        previousTweetCount = currentTweetCount;
    };

    const scrollToEndIntervalID = setInterval(scrollToEnd, SCROLL_INTERVAL);

    const extractTweetData = (tweetElement) => {
        const tweetText = tweetElement.querySelector('[data-testid="tweetText"]')?.innerText || null;
        const userInfo = tweetElement.querySelector('[data-testid="User-Name"]').innerText.split("\n");
        const [authorName, authorHandle] = userInfo.length === 3 ? [userInfo[0], userInfo[0]] : userInfo;
        const authorProfilePic = tweetElement.querySelector('img[src^="https://pbs.twimg.com/profile_images"]')?.src;
        const tweetTimeEl = tweetElement.querySelector("time");
        const tweetUrl = tweetTimeEl.parentElement.href;
        const tweetImgsSrc = Array.from(tweetElement.querySelectorAll('[data-testid="tweetPhoto"] img')).map((img) => img.src);
        const tweetVideoThumbnails = Array.from(tweetElement.querySelectorAll('[data-testid="videoPlayer"] video')).map((video) => video.poster);

        return {
            text: tweetText,
            authorName: authorName,
            authorHandle: authorHandle,
            authorProfilePic: authorProfilePic,
            date: tweetTimeEl.getAttribute("datetime"),
            url: tweetUrl,
            media: {
                images: tweetImgsSrc.length > 0 ? tweetImgsSrc : null,
                videoThumbnails: tweetVideoThumbnails.length > 0 ? tweetVideoThumbnails : null,
            },
        };
    };

    const updateTweets = () => {
        try {
            document.querySelectorAll('article[data-testid="tweet"]').forEach((tweetElement) => {
                const tweet = extractTweetData(tweetElement);
                const existingTweetIndex = tweets.findIndex((t) => t.url === tweet.url);

                if (existingTweetIndex === -1) {
                    console.log("total tweets: ", tweets.length);
                    tweets.push(tweet);
                } else {
                    const existingTweet = tweets[existingTweetIndex];
                    existingTweet.authorProfilePic = existingTweet.authorProfilePic || tweet.authorProfilePic;
                    existingTweet.media.images = tweet.media.images || existingTweet.media.images;
                    existingTweet.media.videoThumbnails = tweet.media.videoThumbnails || existingTweet.media.videoThumbnails;
                }
            });
        } catch (error) {
            console.error("Error scraping tweet: ", error, " previous tweet: ", tweets.slice(-1));
        }
    };

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                updateTweets();
            }
        });
    });

    const startScraping = () => {
        creatToast();
        updateTweets();
        observer.observe(document.body, { childList: true, subtree: true });
    };

    const stopScraping = () => {
        clearInterval(scrollToEndIntervalID);
        removeToast();
        injectSuccessToast()
        observer.disconnect();
    };



    startScraping();
};

function removeToast() {
    const indicator = document.getElementById('toast-indicator');
    indicator.remove();
}

function injectSuccessToast() {
    const toast = document.createElement('div');
    toast.classList.add('toast');
    toast.classList.add('toast-success');
    toast.innerHTML = 'Successfully scraped tweets!';
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.right = '20px';
    toast.style.zIndex = '9999';
    toast.style.padding = '10px';
    toast.style.backgroundColor = '#3498db';
    toast.style.color = 'white';
    toast.style.borderRadius = '5px';
    toast.style.fontSize = '16px';
    toast.style.fontWeight = 'bold';
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.5s ease-in-out';
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '1';
    }, 1000);
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => {
            toast.remove();
        }, 5000);
    }, 3000);


}

function creatToast() {
    const indicator = document.createElement('div');
    //give it a id
    indicator.id = 'toast-indicator';
    indicator.style.position = 'fixed';
    indicator.style.bottom = '20px';
    indicator.style.right = '20px';
    indicator.style.width = '40px';
    indicator.style.height = '40px';
    indicator.style.borderRadius = '50%';
    indicator.style.border = '4px solid #f3f3f3';
    indicator.style.borderTopColor = '#3498db';
    indicator.style.animation = 'spin 2s linear infinite';
    indicator.style.backgroundColor = 'white'; // Add white background

    const number = document.createElement('span');
    number.style.position = 'absolute';
    number.style.top = '50%';
    number.style.left = '50%';
    number.style.transform = 'translate(-50%, -50%)';
    number.style.color = '#3498db';
    number.style.fontWeight = 'bold';
    number.style.fontSize = '16px';
    number.innerText = '0'; // Replace with the desired number

    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;

    document.head.appendChild(style);
    indicator.appendChild(number); // Add the number to the indicator
    document.body.appendChild(indicator);
}
