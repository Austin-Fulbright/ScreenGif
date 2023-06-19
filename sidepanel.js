
  
  
  
  const startRecording = () => {
    chrome.runtime.sendMessage({ name: 'startRecording' });
  };
  
  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('startRecordingButton').addEventListener('click', startRecording);
  });

  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('editGifButton').addEventListener('click', editGif);
  });

  const editGif = () => {
    const video = document.getElementById('recordedVideo');
    const videoDataURL = video.src; // This should already be a base64 data URL
  
    chrome.runtime.sendMessage({ 
      name: 'editgif', 
      data: videoDataURL 
    });
  }
  

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.name === 'sendVideo') {
    console.log("Received video data from background.js");
    const base64VideoData = request.data.value;

    const video = document.getElementById('recordedVideo');

    video.src = base64VideoData;
    video.autoplay = true;

  }
});

