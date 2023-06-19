document.addEventListener('DOMContentLoaded', function() {

  
    chrome.runtime.sendMessage({ name: 'editGifOpen' }, function(response) {
        const base64VideoData = response.data; // This should log base64Videoleach
        const vid = document.getElementById('video');
        vid.src = base64VideoData;
        vid.autoplay = true;
    });
    $(function() {
      $("#cropArea").resizable({ containment: "#videoContainer" }).draggable({ containment: "#videoContainer" });
    });
  
    // When the user is done resizing and dragging the crop area, you can calculate the relative position and size like this:
    
    var cropArea = document.getElementById('cropArea');
    var video = document.getElementById('video');
    
    var cropX = cropArea.offsetLeft / video.videoWidth;
    var cropY = cropArea.offsetTop / video.videoHeight;
    var cropWidth = cropArea.offsetWidth / video.videoWidth;
    var cropHeight = cropArea.offsetHeight / video.videoHeight;
    // You can then use these values to crop the video with ffmpeg.js.
  });

  document.getElementById('cropButton').addEventListener('click', function() {
    // Calculate the crop values
    var cropArea = document.getElementById('cropArea');
    var video = document.getElementById('video');
    
    var cropX = cropArea.offsetLeft / video.videoWidth;
    var cropY = cropArea.offsetTop / video.videoHeight;
    var cropWidth = cropArea.offsetWidth / video.videoWidth;
    var cropHeight = cropArea.offsetHeight / video.videoHeight;
  
    // Use ffmpeg.js to crop the video
    // This is a placeholder - you'll need to replace this with actual ffmpeg.js code
    var croppedVideoData = cropVideoWithFfmpeg(base64VideoData, cropX, cropY, cropWidth, cropHeight);
  
    // Set the src of the video element to the cropped video
    video.src = croppedVideoData;
  });
  
  