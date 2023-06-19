


chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })
const startRecording = async () => {
  await chrome.tabs.query({'active': true, 'lastFocusedWindow': true, 'currentWindow': true}, async function (tabs) {

    const currentTab = tabs[0];

    chrome.windows.create({
      url: chrome.runtime.getURL('recording_screen.html'),
      type: 'popup',
      left: 0,
      top: 0, 
      width: 10,
      height: 10
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

base64Videoleach =  null;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.name === 'editGifOpen') {
    console.log("the gif is open ll");
    sendResponse({data: base64Videoleach})
  }
});
// Listen for startRecording message from popup.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.name === 'startRecording') {
    console.log("started recording");
    startRecording();
  }
});


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.name === 'editgif') {
    base64Videoleach = request.data;
    chrome.sidePanel.setOptions({ path: "editGifPanel.html" });
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


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.name === 'videoData') {
    console.log("Received video data");
    // Handle the base64 video data
    const base64VideoData = request.data;
    chrome.runtime.sendMessage({
      name: 'sendVideo',
      data: { value: base64VideoData }
    });
    
  }
});

