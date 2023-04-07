console.log('This is the background page.');
console.log('Put the background scripts here.');

// chrome.webRequest.onCompleted.addListener(
//   function(details) {
//     if (details.url.startsWith('https://twitter.com/') && details.url.endsWith('/profile')) {
//       chrome.tabs.executeScript(details.tabId, {file: 'Content/index.js'});
//     }
//   },
//   {urls: ['<all_urls>']}
// );
