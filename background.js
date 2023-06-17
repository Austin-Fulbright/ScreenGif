const startRecording = async () => {
  await chrome.tabs.query({'active': true, 'lastFocusedWindow': true, 'currentWindow': true}, async function (tabs) {

    const currentTab = tabs[0];

    const tab = await chrome.tabs.create({
      url: chrome.runtime.getURL('recording_screen.html'),
      pinned: true,
      active: true,
    });

    // Wait for recording screen tab to be loaded and send message to it with the currentTab
    chrome.tabs.onUpdated.addListener(async function listener(tabId, info) {
      if (tabId === tab.id && info.status === 'complete') {
        chrome.tabs.onUpdated.removeListener(listener);
        console.log(currentTab);
        await chrome.tabs.sendMessage(tabId, {
          name: 'startRecordingOnBackground',
          body: {
            currentTab: currentTab,
          },
        });
      }
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

