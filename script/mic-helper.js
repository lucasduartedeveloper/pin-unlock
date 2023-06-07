class EasyMicrophone {

    constructor() {
        var scope = this;

        // wave drawing setup
        this.audioContent = new AudioContext();
        this.analyser = 0;
        this.frequencyArray = [];
        this.audioStream = 0;
        this.frequencyLength = 0;

        // recording setup
        this.audio = new Audio();
        this.mediaRecorder = 0;
        this.audioBlob = [];

        this.curve = false;
        this.clipArray = 0;

        this.onsuccess = function() { };
        this.onupdate = function() { };
        this.onclose = function() { };
        this.closed = true;
    }

    open(curve, clipArray=0) {
        this.closed = false;
        var scope = this;

        // configuration
        this.audioContent = new AudioContext();
        this.curve = curve;
        this.clipArray = clipArray;

        function soundAllowed(stream) {
            // configuration
            scope.audioStream = 
            scope.audioContent.createMediaStreamSource(stream);
            scope.analyser = scope.audioContent.createAnalyser();
            scope.audioStream.connect(scope.analyser);
            //scope.analyser.minDecibels = -200;
            scope.analyser.fftSize = 1024;

            scope.frequencyArray = 
            new Uint8Array(scope.analyser.frequencyBinCount);

            // enter rendering loop
            scope.onsuccess();
            scope.animate();
        }

        function soundNotAllowed(error) {
            console.log("EasyMicrophone: " + error);
        }

        // request microphone access
        navigator.mediaDevices.getUserMedia({audio:true}).
        then((stream) => {
            soundAllowed(stream);
        }).
        catch((err) => {
            soundNotAllowed(err);
        });
    }

    close() {
        this.closed = true;

        // check stream is open
        if (this.audioStream.mediaStream)
        this.audioStream.mediaStream.getTracks()[0].stop();

        if(this.mediaRecorder) {
            this.mediaRecorder.stop();
        }
        this.onclose();
    }

    record() {
        this.mediaRecorder = 
        new MediaRecorder(this.audioStream.mediaStream);

        var mimeType = this.mediaRecorder.mimeType;
        this.mediaRecorder.ondataavailable = 
        function(e) {
            this.audioBlob.push(e.data);
        }.bind(this);
        this.mediaRecorder.onstop = 
        function(e) {
            var url = URL.createObjectURL(
            new Blob(this.audioBlob, { type: mimeType }));
            this.audioBlob = [];
            this.audio = new Audio(url);
        }.bind(this);

        this.mediaRecorder.start();
    }

    animate() {
        var animate = function() {
            this.animate()
        }.bind(this);

        this.analyser.getByteFrequencyData(this.frequencyArray);
        //console.log(this.frequencyArray.join(","));

        var floatArray = [];
        var sum = 0;
        var averageValue = 0;
        var topValue = 0;
        var reachedFrequency = 0;
        var adjustedLength = 0;

        // clip to reached frequency
        for (var i = 0 ; i < 255 ; i++) {
            if (this.frequencyArray[i] < topValue)
            topValue = this.frequencyArray[i];
            adjustedLength = this.frequencyArray[i];

            if (adjustedLength > 0) reachedFrequency = (i+1);
        }
        reachedFrequency = 
            reachedFrequency < this.clipArray ? 
            this.clipArray : (this.clipArray > 0 ? reachedFrequency : 
            this.frequencyArray.length);

        for (var i = 0 ; i < reachedFrequency ; i++) {
            if (this.frequencyArray[i] < topValue)
            topValue = this.frequencyArray[i];

            adjustedLength = this.frequencyArray[i];
            adjustedLength = (1/255)*adjustedLength;
            sum += adjustedLength;

            if (this.curve) {
                adjustedLength = 
                curve(adjustedLength);
            }

            floatArray.push(adjustedLength);
        }

        averageValue = (sum/reachedFrequency);
        averageValue = isNaN(averageValue) ? 0 : averageValue;
        this.onupdate(floatArray, reachedFrequency, averageValue);

        if (!this.closed) requestAnimationFrame(animate);
    }
}

function curve(value, limit=1) {
    var a = ((Math.PI*2)/limit)*value;
    var c = { x: 0, y: 0 };
    var p0 = { x: -1, y: 0 };
    var p1 = _rotate2d(c, p0, a, false);
    return (limit*p1.y)/2;
}

function _rotate2d(c, p, angle, deg=true) {
    var cx = c.x;
    var cy = c.y;
    var x = p.x;
    var y = p.y;
    var radians = deg ? (Math.PI / 180) * angle : angle,
    cos = Math.cos(parseFloat(radians.toFixed(2))),
    sin = Math.sin(parseFloat(radians.toFixed(2))),
    nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
    ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
    return { x: nx, y: ny };
};