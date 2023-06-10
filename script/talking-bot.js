var audio = new Audio("audio/phone-lock.wav");
var alarm = new Audio("audio/battleship-alarm.wav");
var coin = new Audio("audio/coin.wav");

var sw = window.innerWidth;
var sh = window.innerHeight;

var playerId = new Date().getTime();

var remoteObj = {
    locked: true,
    pin: "0000", //"1432", //"0000",
    hls_source: "",
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

var input_buttons = false;
var getPin = function() {
    if (input_buttons) {
        var result = 
        pinInput.innerText + 
        pinInput1.innerText + 
        pinInput2.innerText + 
        pinInput3.innerText;
        return result;
    }

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
        remoteVideo.style.display = "none";
        remoteVideo.pause();
    }
    else {
        startTimer();
        $("#title")[0].innerText = remote ? 
        "AABERTO" : "ABERTO";
        //content.style.display = "initial";
        //renderer.domElement.style.display = "initial";
        remoteVideo.src = remoteObj.hls_source;
        remoteVideo.style.display = "initial";
        remoteVideo.load();

        var rnd = new Date().getTime();
        remoteVideo.style.backgroundImage = 
        "url("+(remoteObj.img_source+"&f="+rnd)+")";
    }
    if (remoteObj.mistakes > 0) {
        mistakeCount.innerHTML = 
        readInput_icons3(getPin()) +"<br>falhou "+
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
        remoteObj.pin = obj.pin1;
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
    var debug = true; //false;
    if (params.has("debug")) {
        debug = params.get("debug") == "true";
    }

    requestPIN();
    //requestPIN_cb();

    width = sw/1.2;

    if (input_buttons)
    pinInput = document.createElement("span");
    else
    pinInput = document.createElement("input");

    pinInput.style.position = "fixed";
    pinInput.style.background = "#333";
    pinInput.style.color = "#fff";

    if (input_buttons)
    pinInput.innerText = "0";
    else
    pinInput.value = "";

    pinInput.type = debug ? "text" : "password";
    pinInput.style.textAlign = "center";
    //pinInput.style.letterSpacing = "25px";
    //pinInput.style.paddingLeft = "25px";
    pinInput.maxLength = "4";
    pinInput.style.lineHeight = "50px";
    pinInput.style.left = ((sw/2)-(75))+"px";
    pinInput.style.top = ((sh/2)-(25))+"px";

    if (input_buttons)
    pinInput.style.width = (25)+"px"
    else
    pinInput.style.width = (150)+"px"; //(25)+"px";;

    pinInput.style.height = (50)+"px";
    pinInput.style.border = "1px solid #fff";
    pinInput.style.outline = "none";
    pinInput.style.zIndex = "3";
    document.body.appendChild(pinInput);

    var pinOninput = function() {
       /*if (this.nextInput && this.value.length) this.nextInput.focus();
       if (this.previousInput && !this.value.length) 
       this.previousInput.focus();*/
       var value = parseInt(this.innerText);
       value += 1;
       value = value > 9 ? 0 : value;
       this.innerText = value;
    };
    if (input_buttons)
    pinInput.onclick = pinOninput;
    else
    pinInput.onkeyup = pinOninput;

    var space = 50/3;

    pinInput1 = pinInput.cloneNode();
    pinInput1.innerText = "0";
    pinInput.nextInput = pinInput1;
    pinInput1.previousInput = pinInput;
    pinInput1.onclick = pinOninput;
    pinInput1.style.left = ((sw/2)-(50-space))+"px";
    if (input_buttons)
    document.body.appendChild(pinInput1);

    pinInput2 = pinInput.cloneNode();
    pinInput2.innerText = "0";
    pinInput1.nextInput = pinInput2;
    pinInput2.previousInput = pinInput1;
    pinInput2.onclick = pinOninput;
    pinInput2.style.left = ((sw/2)+(25-space))+"px";
    if (input_buttons)
    document.body.appendChild(pinInput2);

    pinInput3 = pinInput.cloneNode();
    pinInput3.innerText = "0";
    pinInput2.nextInput = pinInput3;
    pinInput3.previousInput = pinInput2;
    pinInput3.onclick = pinOninput;
    pinInput3.style.left = ((sw/2)+(50))+"px";
    if (input_buttons)
    document.body.appendChild(pinInput3);

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

    pinBotAdvice = document.createElement("span");
    pinBotAdvice.style.position = "fixed";
    pinBotAdvice.style.color = "#ff0";
    pinBotAdvice.innerText = "0000";
    pinBotAdvice.style.lineHeight = "50px";
    pinBotAdvice.style.textAlign = "right";
    pinBotAdvice.style.left = ((sw/2)-(185))+"px";
    pinBotAdvice.style.top = ((sh/2)-(25))+"px";
    pinBotAdvice.style.width = (100)+"px";
    pinBotAdvice.style.height = (50)+"px";
    //pinBotAdvice.style.border = "1px solid #fff";
    pinBotAdvice.style.borderRadius = "10px";
    pinBotAdvice.style.animationDuration = "3s";
    pinBotAdvice.style.zIndex = "3";
    pinBotAdvice.onclick = function() {
        if (input_buttons) {
            pinInput.innerText = pinBotAdvice.innerText[0];
            pinInput1.innerText = pinBotAdvice.innerText[1];
            pinInput2.innerText = pinBotAdvice.innerText[2];
            pinInput3.innerText = pinBotAdvice.innerText[3];
        }
        else
        pinInput.value = pinBotAdvice.innerText;
    };
    document.body.appendChild(pinBotAdvice);

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
    debugElem.style.left = ((sw/2)-(50))+"px";
    debugElem.style.top = ((sh/2)+(175))+"px";
    debugElem.style.width = (100)+"px";
    debugElem.style.height = (50)+"px";
    debugElem.style.zIndex = "3";
    debugElem.onclick = function() {
        remoteObj.pin = prompt();
        updateScreen();
    };
    if (debug)
    document.body.appendChild(debugElem);

    debugElemToggle = document.createElement("i");
    debugElemToggle.style.position = "fixed";
    debugElemToggle.className = "fa-solid fa-paperclip";
    debugElemToggle.style.color = "#fff";
    debugElemToggle.style.fontSize = "25px";
    debugElemToggle.style.left = ((sw/2)+(50))+"px";
    debugElemToggle.style.top = ((sh/2)+(175))+"px";
    debugElemToggle.style.width = (50)+"px";
    debugElemToggle.style.height = (50)+"px";
    debugElemToggle.style.zIndex = "3";
    debugElemToggle.onclick = function() {
        if (debugElem.style.display == "none")
        debugElem.style.display = "initial";
        else
        debugElem.style.display = "none";
    };
    if (debug)
    document.body.appendChild(debugElemToggle);

    debugElemBot = document.createElement("img");
    debugElemBot.style.position = "fixed";
    debugElemBot.src = "img/bot-icon.png";
    debugElemBot.className = "fa-solid fa-robot";
    debugElemBot.style.color = "#ff0";
    debugElemBot.style.fontSize = "25px";
    debugElemBot.style.left = ((sw/2)-(90))+"px";
    debugElemBot.style.top = ((sh/2)+(175))+"px";
    debugElemBot.style.width = (30)+"px";
    debugElemBot.style.height = (30)+"px";
    debugElemBot.style.animationDuration = "5s";
    debugElemBot.style.zIndex = "3";
    debugElemBot.onclick = function() {
        pinBot.start(pinInput, pinConfirm);
    };
    if (debug)
    document.body.appendChild(debugElemBot);

    debugElemBotKeyboard = document.createElement("img");
    debugElemBotKeyboard.style.position = "fixed";
    debugElemBotKeyboard.src = "img/keyboard.png";
    debugElemBotKeyboard.className = "fa-solid fa-robot";
    debugElemBotKeyboard.style.color = "#ff0";
    debugElemBotKeyboard.style.fontSize = "25px";
    debugElemBotKeyboard.style.left = ((sw/2)-(100))+"px";
    debugElemBotKeyboard.style.top = ((sh/2)+(205))+"px";
    debugElemBotKeyboard.style.width = (50)+"px";
    debugElemBotKeyboard.style.height = (50)+"px";
    debugElemBotKeyboard.style.animationDuration = "5s";
    debugElemBotKeyboard.style.transform = "rotateZ(180deg)";
    debugElemBotKeyboard.style.zIndex = "3";
    debugElemBotKeyboard.onclick = function() {
         if (botHistory.style.display == "none") {
             botHistory.style.display = "initial";
         }
         else {
             botHistory.style.display = "none";
         }
    };
    if (debug)
    document.body.appendChild(debugElemBotKeyboard);

    remoteVideo = document.createElement("video");
    remoteVideo.style.position = "fixed";
    remoteVideo.style.backgroundPosition = "center";
    remoteVideo.style.backgroundSize = "contain";
    remoteVideo.style.backgroundImage = "initial"
    remoteVideo.autoplay = true;
    remoteVideo.style.display = "none";
    remoteVideo.style.left = ((sw/2)-(100))+"px";
    remoteVideo.style.top = ((sh/2)+(100))+"px";
    remoteVideo.style.width = (200)+"px";
    remoteVideo.style.height = (100)+"px";
    remoteVideo.style.zIndex = "3";
    document.body.appendChild(remoteVideo);

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

    invert = false;
    invertBtn = document.createElement("span");
    invertBtn.style.position = "fixed";
    invertBtn.innerHTML = "0101";
    invertBtn.style.color = "#fff";
    invertBtn.style.fontSize = "18px";
    invertBtn.style.left = ((sw/2)-(50))+"px";
    invertBtn.style.top = ((sh/2)+(225))+"px";
    invertBtn.style.width = (100)+"px";
    invertBtn.style.height = (50)+"px";
    invertBtn.style.zIndex = "3";
    invertBtn.onclick = function() {
        invert = !invert;
        if (invert) {
            invertBtn.innerHTML = "1010";
            $("*").not("html,body,img,#pin-output").css("filter","invert(100%)");
            $("html,body").css("background", "#fff");
        }
        else {
            invertBtn.innerHTML = "0101";
            $("*").not("html,body,img,#pin-output").css("filter","invert(0%)");
            $("html,body").css("background", "#000");
        }
    };
    if (debug)
    document.body.appendChild(invertBtn);

    $("#title")[0].innerText = "FECHADO";
    $("*").not("i").css("font-family", "Khand");

    $(".result-icon").css({
        "display": "inline-block",
        "width": "25px",
        "height": "25px"
    });

    botHistory = document.createElement("span");
    botHistory.style.position = "fixed";
    botHistory.style.display = "none";
    botHistory.style.fontFamily = "courier, courier new, sans-serif";
    botHistory.innerHTML = "";
    botHistory.style.textAlign = "left";
    botHistory.style.fontSize = "15px";
    botHistory.style.background = "#fff";
    botHistory.style.color = "#000";
    botHistory.style.left = ((sw/2)-140)+"px";
    botHistory.style.top = ((sh/2)-135)+"px";
    botHistory.style.width = (130)+"px";
    botHistory.style.height = (300)+"px";
    botHistory.style.overflowY = "auto";
    botHistory.style.zIndex = "3";
    document.body.appendChild(botHistory);

    machine = new PinMachine();
    pinBot = new PinBot(botHistory, pinBotAdvice);

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
        "class=\"result-icon\" src=\"img/icons/done.png\"/>",
        "<img "+
        "style=\"display:inline-block;width:25px;height:25px;\" "+
        "class=\"result-icon\" src=\"img/icons/almost.png\"/>",
        "<img "+
        "style=\"display:inline-block;width:25px;height:25px;\" "+
        "class=\"result-icon\" src=\"img/icons/almost-almost.png\"/>",
        "<img "+
        "style=\"display:inline-block;width:25px;height:25px;\" "+
        "class=\"result-icon\" src=\"img/icons/error.png\"/>"
    ];
    return readInput(pin, icons);
};

var readInput_icons2 = function(pin) {
    var icons = [
        "<img "+
        "style=\"display:inline-block;width:25px;height:25px;\" "+
        "class=\"result-icon\" src=\"img/icons2/done.png\"/>",
        "<img "+
        "style=\"display:inline-block;width:25px;height:25px;"+
        "border-radius:50%;\" "+
        "class=\"result-icon\" src=\"img/icons2/almost.png\"/>",
        "<img "+
        "style=\"display:inline-block;width:25px;height:25px;"+
        "border-radius:50%;\" "+
        "class=\"result-icon\" src=\"img/icons2/almost-almost.png\"/>",
        "<img "+
        "style=\"display:inline-block;width:25px;height:25px;"+
        "border-radius:50%;\" "+
        "class=\"result-icon\" src=\"img/icons2/error.png\"/>"
    ];
    return readInput(pin, icons);
};

var readInput_icons3 = function(pin) {
    var icons = [
        "<img "+
        "style=\"display:inline-block;width:25px;height:25px;"+
        "border-radius:50%;\" "+
        "class=\"result-icon\" src=\"img/icons3/circle.png\"/>",
        "<img "+
        "style=\"display:inline-block;width:25px;height:25px;"+
        "border-radius:50%;\" "+
        "class=\"result-icon\" src=\"img/icons3/triangle.png\"/>",
        "<img "+
        "style=\"display:inline-block;width:25px;height:25px;"+
        "border-radius:50%;\" "+
        "class=\"result-icon\" src=\"img/icons3/square.png\"/>",
        "<img "+
        "style=\"display:inline-block;width:25px;height:25px;"+
        "border-radius:50%;\" "+
        "class=\"result-icon\" src=\"img/icons3/xmark.png\"/>"
    ];
    return readInput(pin, icons);
};

var readInput_bot = function(pin) {
    var icons = [
        "o", "<", ">", "x"
    ];
    return readInput(pin, icons);
};

// 3527
// 5317

// 5389
// 9880
// <---
// o---

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
    //console.log(pinCopy.join());
    return output;
};

var debugMark = {
    x: -1,
    offsetX: 0
};

var value = function(output) {
    var replace = output.replaceAll("o", "3");
    replace = replace.replaceAll("<", "2");
    replace = replace.replaceAll(">", "1");
    replace = replace.replaceAll("x", "0");
    var result = 0;
    for (var n = 0; n < 4; n++) {
        result += parseInt(replace[n]);
    }
    return result;
};

class PinMachine {

    constructor(pin) {
        this.pin = pin;
    }

    unlock(pin_attempt) {
        return readInput_bot(pin_attempt);
    }

};

class PinBot {

    historyElem = null;
    attemptElem = null;

    constructor(historyElem, attemptElem, 
        speed=1000, setup_callback=false) {
        this.historyElem = historyElem;
        this.attemptElem = attemptElem;

        this.setup_callback = false;
        this.setup(speed);
    }

    setup(speed) {
        this.running = false;
        this.output_history = [];
        this.pin_attempts = [];
        this.not_last_digit = -1;

        this.pin_attempt = 
        Math.floor(Math.random()*10000).
        toString().padStart(4, "0");
        this.output =
        readInput_bot(this.pin_attempt);

        this.interval = false;
        this.speed = speed;

        this.attemptElem.innerText = this.pin_attempt;
        //this.setup_callback(this.pin_attempt);
    }

    start(inputElem, confirmElem) {
        if (this.running) return;
        this.setup(this.speed);

        this.interval = setInterval(function() {
            this.unlock();
            inputElem.value = this.pin_attempt;
            confirmElem.click();
            if (value(machine.unlock(this.pin_attempt)) == 12)
            this.stop();
        }.bind(this), this.speed);
    }

    unlock() {
        var pin_attempt = this.pin_attempt;
        var output = this.output;

        console.log("--- iteration start ---");
        console.log(pin_attempt + " - " + output + " - " + 
        value(output) + " - previous");

        var move = null;
        if (output.includes("<"))
        move = this._move(pin_attempt, 1);
        else if (output.includes(">"))
        move = this._move(pin_attempt, 2);
        else if (output.includes("x"))
        move = this._change(pin_attempt, this.not_last_digit);
        pin_attempt = move.result;

        output = machine.unlock(pin_attempt);
        console.log(pin_attempt + " - " + output + " - " + 
        value(output) + " - " + move.info);

        var temp_pin = pin_attempt;
        var unchanged_value = (value(output) == value(this.output));
        var decreased_value = (value(output) < value(this.output));

        if (unchanged_value)
        move = this._change(pin_attempt);
        pin_attempt = move.result;

        var info = unchanged_value ? "no signal" : "ok";

        output = machine.unlock(pin_attempt);
        console.log(pin_attempt + " - " + output + " - " + 
        value(output) + " - " + move.info + " - " + info);

        if (decreased_value)
        pin_attempt = this.pin_attempt;

        output = machine.unlock(pin_attempt);
        console.log(pin_attempt + " - " + output + " - " + 
        value(output) + " - best");

        decreased_value = (value(output) < value(this.output));

        this.historyElem.innerHTML = 
        this.historyElem.innerHTML.length > 0 ? 
        this.historyElem.innerHTML + "<br>" : 
        this.historyElem.innerHTML;
        this.historyElem.innerHTML += 
        "<span " + (decreased_value ? "style=\"color:red;\">" : ">") + 
        pin_attempt + "&nbsp;" + 
        output + "&nbsp;" + value(output) + 
        "</span>";
        this.historyElem.scrollTo(0, this.historyElem.scrollHeight);

        if (value(this.output) > 6 && 
        value(this.output) < 9 && value(output) == 9)
        this.not_last_digit = 
        this.get_digit(pin_attempt, "last");

        this.attemptElem.innerText = pin_attempt;

        this.output = output;
        this.pin_attempt = pin_attempt;
    }

    _move(pin_attempt, amt) {
        var n = Math.floor(Math.random()*4);
        var dir = n > 1 ? amt*-1 : amt*1;
        var split = pin_attempt.split("");
        var temp = split[n];
        var temp2 = split[n+dir];
        split[n] = split[n+dir];
        split[n+dir] = temp;
        var obj = {
            info: "[" + temp + ", " + temp2 + "]",
            result: split.join("")
        };
        return obj;
    };

    numbers = "0123456789";
    digits = "0123";
    _change(pin_attempt, ignore_digit=-1) {
        var digits = this.digits.replace(ignore_digit.toString(), "");

        var n = Math.floor(Math.random()*digits.length);
        n = parseInt(digits[n]);

        var rnd = Math.floor(Math.random()*2);
        var amt = Math.floor(Math.random()*10);
        var k = Math.floor(Math.random()*this.numbers.length);

        var split = pin_attempt.split("");
        var temp = split[n];
        var temp2 = this.numbers[k];
        split[n] = this.numbers[k];

        var obj = {
            info: "[" + temp + ", " + temp2 + "]",
            result: split.join("")
        };
        return obj;
    };

    get_digit = function(pin_attempt, digit_name) {
        var digit = 0;
        if (digit_name == "last") {
            var contains = [];
            for (var n = 0; n < 4; n++) {
                if (pin_attempt[n] != this.pin_attempt[n])
                digit = n;
            }
        }
        this.not_last_digit = digit;
    };

    stop() {
        this.running = false;
        clearInterval(this.interval);
        return;

        pinBotLastAdvice.className = 
        "animate__animated animate__slideOutLeft";
        pinBotAdvice.className = 
        "animate__animated animate__slideOutLeft";
        pinBotAdviceAlerts.className = 
        "animate__animated animate__slideOutLeft";
        debugElemBot.className = 
        "animate__animated animate__slideOutLeft";
    }

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