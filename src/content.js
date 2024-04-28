import getAllBookmarks from './bookmark-tojson';

console.log('content.js loaded');
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === 'triggerFunction') {
        injectScript();
    }
});


function injectScript() {
    console.log('injecting script');
    //wait for 5 secon before injecting the script
    setTimeout(() => {
        console.log('injecting script');
        getAllBookmarks()
    }, 1500);
}
