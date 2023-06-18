const startRecording = async () => {
  await chrome.tabs.query({'active': true, 'lastFocusedWindow': true, 'currentWindow': true}, async function (tabs) {

    const currentTab = tabs[0];

    chrome.windows.create({
      url: chrome.runtime.getURL('recording_screen.html'),
      type: 'popup',
      left: 0,
      top: 0, 
      width: 375,
      height: 667
  }, function(window) {
    // Listen for tab updates
    chrome.tabs.onUpdated.addListener(function listener(tabId, info, tab) {
        // Check if the updated tab belongs to the new window and its status is 'complete'
        if (tab.windowId === window.id && info.status === 'complete' && tab.url === chrome.runtime.getURL('recording_screen.html')) {
            // Remove the listener
            chrome.tabs.onUpdated.removeListener(listener);

            // Send the message
            chrome.tabs.sendMessage(tabId, {
                name: 'startRecordingOnBackground',
                body: {
                    currentTab: currentTab,
                },
            });
        }
    });
});
  });
};


// Listen for startRecording message from popup.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.name === 'startRecording') {
    console.log("started recording");
    startRecording();
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.name === 'stop') {
    console.log("Stoped recording");
   
  }
});


// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.name === "myMessage") {
    console.log(request.data);  // "Hello from recording_screen.js"
  }
});

