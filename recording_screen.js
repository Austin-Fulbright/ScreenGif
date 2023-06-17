const fetchBlob = async (url) => {
  const response = await fetch(url);
  const blob = await response.blob();
  const base64 = await convertBlobToBase64(blob);

  return base64;
};

const convertBlobToBase64 = (blob) => {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      const base64data = reader.result;

      resolve(base64data);
    };
  });
};

chrome.runtime.onMessage.addListener((message) => {
  if (message.name === 'startRecordingOnBackground') {
   console.log(message);
  // Send a message to the background script
chrome.runtime.sendMessage({name: "myMessage", data: "Hello from recording_screen.js"});

  // Prompt user to choose screen or window
  chrome.desktopCapture.chooseDesktopMedia(
    ['screen', 'window'],
    function (streamId) {
      if (streamId == null) {
        return;
      }

      // Once user has chosen screen or window, create a stream from it and start recording
      navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          mandatory: {
            chromeMediaSource: 'desktop',
            chromeMediaSourceId: streamId,
          }
        }
      }).then(stream => {
        const mediaRecorder = new MediaRecorder(stream);

        const chunks = [];

        mediaRecorder.ondataavailable = function(e) {
          chunks.push(e.data);
        };

        mediaRecorder.onstop = async function(e) {
          const blobFile = new Blob(chunks, { type: "video/webm" });
          const base64 = await fetchBlob(URL.createObjectURL(blobFile));
        
          // Create a new video element
          const video = document.createElement('video');
          video.src = base64;
          video.controls = true;
          video.autoplay = true;
        
          // Append the video element to the body of the document
          document.body.appendChild(video);
        
          // Stop all tracks of stream
          stream.getTracks().forEach(track => track.stop());
        }
        

        mediaRecorder.start();
      }).finally(async () => {
        // After all setup, focus on previous tab (where the recording was requested)
        await chrome.tabs.update(message.body.currentTab.id, { active: true, selected: true })
      });
    })
  }
});