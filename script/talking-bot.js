var audio = new Audio("audio/phone-lock.wav");
var alarm = new Audio("audio/battleship-alarm.wav");
var coin = new Audio("audio/coin.wav");

var sw = window.innerWidth;
var sh = window.innerHeight;

var playerId = new Date().getTime();

var remoteObj = {
    locked: true,
    pin: "0000", //"1432", //"0000",
    mistakes: 0,
    timestamp: 0
};

var requestUID = function() {
    subtitle.innerText = "ID: xxxxxxxxxxx";
    $.ajax({
        url: "ajax/get-uid.php",
        method: "GET"
    }).done(function(data, status, xhr) {
        var pos = JSON.parse(data);
        //console.log(pos.uid);
        subtitle.innerText = 
        "ID: "+getVerification(pos.uid);
    });
};

var getPin = function() {
    var result = 
    pinInput.value + 
    pinInput1.value + 
    pinInput2.value + 
    pinInput3.value;
    return result;
};

var updateScreen = function(remote=false) {
    if (remoteObj.locked) {
        stopTimer();
        $("#title")[0].innerText = remote ? 
        "FFECHADO" : "FECHADO";
        //content.style.display = "none";
        //renderer.domElement.style.display = "none";
    }
    else {
        startTimer();
        $("#title")[0].innerText = remote ? 
        "AABERTO" : "ABERTO";
        //content.style.display = "initial";
        //renderer.domElement.style.display = "initial";
    }
    if (remoteObj.mistakes > 0) {
        mistakeCount.innerHTML = 
        readInput(getPin()) +"<br>falhou "+
        remoteObj.mistakes + " vez";
        mistakeCount.innerHTML += remoteObj.mistakes > 1 ?
        "es" : "";
    }
    else {
        mistakeCount.innerText = "";
    }
    debugElem.innerHTML = "PIN: "+remoteObj.pin;
    /*circle.className = remoteObj.locked ? 
    "fa-solid fa-mars" : "fa-solid fa-venus";*/
};

var requestPIN = function() {
    $.ajax({
        url: "ajax/get-pin.php",
        method: "GET"
    }).done(function(data, status, xhr) {
        var obj = JSON.parse(data);
        remoteObj.pin = obj.pin;
        updateScreen();
    });
};

// Botão de gravação
$(document).ready(function() {
    $("html, body").css("overscroll-behavior", "none");
    //$("html, body").css("background", "#fff");
    $("#title").css("font-size", "30px");
    $("#title").css("color", "#fff");

    var params = new URLSearchParams(document.location.search);
    var debug = false;
    if (params.has("debug")) {
        debug = params.get("debug") == "true";
    }

    requestPIN();

    width = sw/1.2;

    pinInput = document.createElement("input");
    pinInput.style.position = "fixed";
    pinInput.style.background = "#333";
    pinInput.style.color = "#fff";
    pinInput.value = "";
    pinInput.type = debug ? "text" : "password";
    pinInput.style.textAlign = "center";
    //pinInput.style.letterSpacing = "25px";
    //pinInput.style.paddingLeft = "25px";
    pinInput.maxLength = "4";
    pinInput.style.lineHeight = "50px";
    pinInput.style.left = ((sw/2)-(75))+"px";
    pinInput.style.top = ((sh/2)-(25))+"px";
    pinInput.style.width = (150)+"px"; //(25)+"px";
    pinInput.style.height = (50)+"px";
    pinInput.style.border = "1px solid #fff";
    pinInput.style.outline = "none";
    pinInput.style.zIndex = "3";
    document.body.appendChild(pinInput);

    var pinOninput = function() {
       if (this.nextInput && this.value.length) this.nextInput.focus();
       if (this.previousInput && !this.value.length) 
       this.previousInput.focus();
    };
    //pinInput.onkeyup = pinOninput;

    var space = 50/3;

    pinInput1 = pinInput.cloneNode();
    pinInput.nextInput = pinInput1;
    pinInput1.previousInput = pinInput;
    pinInput1.onkeyup = pinOninput;
    pinInput1.style.left = ((sw/2)-(50-space))+"px";
    //document.body.appendChild(pinInput1);

    pinInput2 = pinInput.cloneNode();
    pinInput1.nextInput = pinInput2;
    pinInput2.previousInput = pinInput1;
    pinInput2.onkeyup = pinOninput;
    pinInput2.style.left = ((sw/2)+(25-space))+"px";
    //document.body.appendChild(pinInput2);

    pinInput3 = pinInput.cloneNode();
    pinInput2.nextInput = pinInput3;
    pinInput3.previousInput = pinInput2;
    pinInput3.onkeyup = pinOninput;
    pinInput3.style.left = ((sw/2)+(50))+"px";
    //document.body.appendChild(pinInput3);

    pinConfirm = document.createElement("span");
    pinConfirm.style.position = "fixed";
    pinConfirm.style.color = "#fff";
    pinConfirm.innerText = "PRONTO";
    pinConfirm.style.lineHeight = "50px";
    pinConfirm.style.textAlign = "center";
    pinConfirm.style.left = ((sw/2)-(75))+"px";
    pinConfirm.style.top = ((sh/2)+(35))+"px";
    pinConfirm.style.width = (150)+"px";
    pinConfirm.style.height = (50)+"px";
    pinConfirm.style.border = "1px solid #fff";
    pinConfirm.style.borderRadius = "10px";
    pinConfirm.style.zIndex = "3";
    pinConfirm.onclick = function() {
        var pin = getPin();
        if (pin.length < 4) return;
        if (remoteObj.locked) {
            if (pin == remoteObj.pin) {
                remoteObj.locked = false;
                remoteObj.timestamp = new Date().getTime();
                ws.send("PAPER|"+playerId+"|pin-update|"+
                JSON.stringify(remoteObj));

                updateScreen();
            }
            else {
                remoteObj.mistakes += 1;

                updateScreen();
               //$(".pin-input").css("border", "");
            }
        }
        else {
            remoteObj.locked = true;
            remoteObj.pin = pin;
            remoteObj.timestamp = new Date().getTime();
            ws.send("PAPER|"+playerId+"|pin-update|"+
            JSON.stringify(remoteObj));

            updateScreen();
        }
    };
    document.body.appendChild(pinConfirm);

    ws.onmessage = function(e) {
        var msg = e.data.split("|");
        if (msg[0] == "PAPER" &&
            msg[1] != playerId &&
            msg[2] == "pin-update") {

            var obj = JSON.parse(msg[3]);
            //console.log(obj);
            remoteObj = obj;

            updateScreen(true);
        }
        else if (msg[0] == "PAPER" &&
            msg[1] != playerId &&
            msg[2] == "timer-replacement") {

            location.reload();
        }
        else if (msg[0] == "PAPER" &&
            msg[1] != playerId &&
            msg[2] == "call-devices") {

            var timestamp = new Date().getTime()
            var obj = {
                playerId: playerId,
                timestamp: timestamp,
                readable: moment().format('MMMM Do YYYY, h:mm:ss a')
            };
            ws.send("PAPER|"+playerId+"|device-connected|"+
            JSON.stringify(obj));
        }
        else if (msg[0] == "PAPER" &&
            msg[1] != playerId &&
            msg[2] == "device-connected") {

            var obj = JSON.parse(msg[3]);
            placeDevice(obj);
        }
    };

    circle = document.createElement("span");
    circle.style.position = "fixed";
    circle.innerText = "00:00";
    /*circle.className = "fa-solid fa-venus";*/
    circle.style.color = "#fff";
    circle.style.left = ((sw/2)-(25))+"px";
    circle.style.top = ((sh/2)-(100))+"px";
    circle.style.width = (50)+"px";
    circle.style.height = (50)+"px";
    circle.style.zIndex = "3";
    circle.onclick = function() {
        ws.send("PAPER|"+playerId+"|timer-replacement");
    };
    document.body.appendChild(circle);

    mistakeCount = document.createElement("span");
    mistakeCount.style.position = "fixed";
    mistakeCount.innerHTML = "";
    mistakeCount.style.color = "#fff";
    mistakeCount.style.fontSize = "18px";
    mistakeCount.style.left = ((sw/2)-(125))+"px";
    mistakeCount.style.top = ((sh/2)-(175))+"px";
    mistakeCount.style.width = (250)+"px";
    mistakeCount.style.height = (50)+"px";
    mistakeCount.style.zIndex = "3";
    document.body.appendChild(mistakeCount);

    debugElem = document.createElement("span");
    debugElem.style.position = "fixed";
    debugElem.innerHTML = "PIN: 0000";
    debugElem.style.color = "#fff";
    debugElem.style.fontSize = "25px";
    debugElem.style.left = ((sw/2)-(125))+"px";
    debugElem.style.top = ((sh/2)+(175))+"px";
    debugElem.style.width = (250)+"px";
    debugElem.style.height = (50)+"px";
    debugElem.style.zIndex = "3";
    debugElem.onclick = function() {
        remoteObj.pin = prompt();
        updateScreen();
    };
    if (debug)
    document.body.appendChild(debugElem);

    statusElem = document.createElement("span");
    statusElem.style.position = "fixed";
    statusElem.innerHTML = "";
    statusElem.style.textAlign = "left";
    statusElem.style.fontSize = "10px";
    statusElem.style.color = "#fff";
    statusElem.style.left = (10)+"px";
    statusElem.style.top = (10)+"px";
    statusElem.style.width = (50)+"px";
    statusElem.style.height = (10)+"px";
    statusElem.style.zIndex = "3";
    document.body.appendChild(statusElem);

    //setupWorld();

    $("#title")[0].innerText = "FECHADO";
    $("*").css("font-family", "Khand");

    $(".result-icon").css({
        "display": "inline-block",
        "width": "25px",
        "height": "25px"
    });

    monitorWebsocket();
});

var devices = [];

var connectionRefresh = 10000;
var connectionExpirationTime = 30000;

var placeDevice = function(obj) {
    devices = devices.filter((o) => {
        return obj.playerId != o.playerId &&
        (new Date().getTime() - o.timestamp) < 
        connectionExpirationTime;
    });
    devices.push(obj);
    showConnections();
};

var monitorWebsocket = function() {
    setInterval(function() {
        ws.send("PAPER|"+playerId+"|call-devices");
        showConnections();
    }, 10000);
};

var showConnections = function() {
    liveConnections = devices.filter((o) => {
        return (new Date().getTime() - o.timestamp) < 
        connectionExpirationTime;
    });

    var innerHtml = ""; //liveConnections.length + 
    //"&nbsp;<i class=\"fa-solid fa-circle\"></i>";
    for (var n = 0; n < liveConnections.length; n < 0) {
        console.log(liveConnections[n].playerId);
        innerHtml += "<i class=\"fa-solid fa-circle\"></i>&nbsp;"+
        liveConnections[n].playerId;
        if (n < (liveConnections.length-1))
        innerHtml += "<br>";
    }

    statusElem.innerHTML = innerHtml;
};

// 1535
// 5555
// oo<<<<<<
// oo--

// 1535
// 5755
// o<<<<<<
// o<--

// 0123456789

// 3535
// 5353
// <<<<
// <<<<

// 1575
// 3353
// <<--
// <---

// 5

var result_icons = [
    "<i class=\"fa-solid fa-circle\"></i>",
    "<i class=\"fa-solid fa-arrow-rotate-left\"></i>",
    "<i class=\"fa-solid fa-arrow-rotate-right\"></i>",
    "<i class=\"fa-regular fa-circle-xmark\"></i>"
];

var readInput_emoji = function(pin) {
    var icons = [
        "<img "+
        "style=\"display:inline-block;width:25px;height:25px;\" "+
        "class=\"result-icon\" src=\"img/done.png\"/>",
        "<img "+
        "style=\"display:inline-block;width:25px;height:25px;\" "+
        "class=\"result-icon\" src=\"img/almost.png\"/>",
        "<img "+
        "style=\"display:inline-block;width:25px;height:25px;\" "+
        "class=\"result-icon\" src=\"img/almost-almost.png\"/>",
        "<img "+
        "style=\"display:inline-block;width:25px;height:25px;\" "+
        "class=\"result-icon\" src=\"img/error.png\"/>"
    ];
    return readInput(pin, icons);
};

// 3527
// 5317

var readInput = function(pin, icons=result_icons) {
    var output = "";
    var exact = 0;
    var present = 0;
    var present_far = 0;
    var pinCopy = remoteObj.pin.split("");
    for (var n = 0; n < 4; n++) {
        var add_exact = false;
        var add_present = false;
        var add_present_far = false;
        for (var k = 0; k < 4; k++) {
            if (pin[n] == pinCopy[k] && n == k)
            add_exact = true;
            else if (pin[n] == pinCopy[k] && Math.abs(n-k) == 1)
            add_present = true;
            else if (pin[n] == pinCopy[k] && Math.abs(n-k) == 2)
            add_present_far = true;
            if (add_exact || add_present || add_present_far) {
                pinCopy[k] = "x";
                break;
            }
        }
        if (add_exact) exact += 1;
        else if (add_present) present += 1;
        else if (add_present_far) present_far += 1;
    }
    for (var n = 0; n < exact; n++) {
        output += icons[0];
    }
    for (var n = 0; n < present; n++) {
        output += icons[1];
    }
    for (var n = 0; n < present_far; n++) {
        output += icons[2];
    }
    for (var n = 0; n < 4-(exact+present+present_far); n++) {
        output += icons[3];
    }
    console.log(pinCopy.join());
    return output;
};

var debugMark = {
    x: -1,
    offsetX: 0
};

var timerInterval = false;
var startTimer = function() {
    timerInterval = setInterval(function() {
        var time = new Date().getTime() - remoteObj.timestamp;
        var hours = Math.floor((time/1000)/3600);
        var minutes = Math.floor((time/1000)/60)%60;
        var seconds = Math.floor(time/1000)%60;
        circle.innerText = minutes.toString().padStart(2,"0") + ":" + 
        seconds.toString().padStart(2,"0");
    }, 1000);
};

var stopTimer = function() {
    clearInterval(timerInterval);
    circle.innerText = "00:00";
};

var formatTime = function(value) {
    var time = new Date().getTime() - remoteObj.timestamp;
    var hours = Math.floor((time/1000)/3600);
    var minutes = Math.floor((time/1000)/60)%60;
    var seconds = Math.floor(time/1000)%60;
    return hours.toString().padStart(2,"0") + ":" + 
    minutes.toString().padStart(2,"0") + ":" + 
    seconds.toString().padStart(2,"0");
};

var speaking = false;
var lastText = "";
var say = function(text, lang) {
    lastText = text;
    var msg = new SpeechSynthesisUtterance();
    msg.lang = lang;
    //msg.lang = "ru-RU";
    //msg.lang = "pt-BR";
    //msg.lang = "en-US";
    msg.text = text;
    msg.onend = function(event) {
         if (afterAudio) afterAudio();
    };
    window.speechSynthesis.speak(msg);
}

var cancelText = function() {
    window.speechSynthesis.cancel();
}

var getRandom = function(callback) {
    $.ajax({
        url: "ajax/get-random.php",
        method: "GET"
    }).done(function(data, status, xhr) {
        var pos = JSON.parse(data);
        pos.x = (1/1000)*pos.x;
        pos.y = (1/1000)*pos.y;
        callback(pos);
    });
};