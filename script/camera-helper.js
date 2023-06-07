var vw = 0;
var vh = 0;

var videoDevices = [];
var deviceNo = 0;

if (navigator.mediaDevices) {
    navigator.mediaDevices.enumerateDevices()
    .then(function(devices) {
         devices.forEach(function(device) {
             if (device.kind == "videoinput")
             videoDevices.push({
                 kind: device.kind,
                 label: device.label,
                 deviceId: device.deviceId
             });
         });
        window.deviceNo = videoDevices.length > 1 ? 
        deviceNo : 0;
    })
    .catch(function(err) {
         console.log(err.name + ": " + err.message);
    });
}

function startCamera(color=true) {
    if (navigator.mediaDevices) {
          navigator.mediaDevices
          .getUserMedia({ 
          video: videoDevices.length == 0 ? true : {
          deviceId: { 
               exact: videoDevices[deviceNo].deviceId
          } }, 
          audio: false })
          .then((stream) => {
               subtitle0.srcObject = stream;
               var display = stream.
               getVideoTracks()[0].getSettings();
               vw = display.width;
               vh = display.height;
          });
    }
}
function stopCamera() {
    if (subtitle0.srcObject) {
         subtitle0.srcObject.getTracks().forEach(t => t.stop());
         subtitle0.srcObject = null;
    }
}

// 640x480 => 240x180
/*
    240
    (480/640)*240
*/
// 480x640 => 240x180

var fitImage = function(img, frame) {
    var obj = {
        left: 0,
        top: 0,
        width: 0,
        height: 0
    };

    var left, top, width, height;

    if (frame.width > img.width) {
        width = frame.width;
        height = (img.height/img.width)*frame.width;

        left = 0;
        top = -(height-frame.height)/2;
    }
    else {
        height = frame.height;
        width = (img.width/img.height)*frame.height;

        top = 0;
        left = -(width-frame.width)/2;
    }

    obj.left = left;
    obj.top = top;
    obj.width = width;
    obj.height = height;

    return obj;
};