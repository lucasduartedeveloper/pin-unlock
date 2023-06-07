var process = function(text) {
    var result = "";
    for (var n = 0; n < text.length; n++) {
        var code = text.charCodeAt(n);
        result += String.fromCharCode(code-1);
    }
    return result;
}

var sceneWidth = (sw);
var pastLine = [];
var line = [];
var lineOffset = sceneWidth < sw ? (sw/4) : 0;;

var createLine = function() {
    var numBlocks = (sceneWidth < sw ? 10 : 30);

    var bw = (sceneWidth/numBlocks);
    var lh = (sh-250);

    var offset = pastLine.length > 0 ? 
    (pastLine[pastLine.length-1].x) : 0;

    // - - - - -
    var cleaner = 0;
    for (var n = 0; n < (numBlocks*2); n+=2) {
        var rnd = cleaner < 1 ? Math.floor(Math.random()*5) : 1;
        var rndy = rnd == 0 ? Math.floor(Math.random()*4) : 0;
        if (rnd == 0) cleaner = 5;
        else cleaner--;

        if (rndy) {
            var obj = { x: offset+(n*bw), y: lh };
            line.push(obj);
        }

        // scroll limit
        if (n == 0) {
            var obj = { x: offset+(n*bw), y: lh };
            line.push(obj);
            var obj = { x: offset+(n*bw), y: lh + 5, pageNo: pageNo++ };
            line.push(obj);
            var obj = { x: offset+(n*bw), y: lh };
            line.push(obj);
        }

        var obj = { x: offset+(n*bw), y: lh - (rndy * bw) };
        line.push(obj);
        var obj = { x: offset+((n+1)*bw), y: lh - (rndy * bw) };
        line.push(obj);
        if (rndy) {
            var obj = { x: offset+((n+1)*bw), y: lh };
            line.push(obj);
        }

        if (n == ((numBlocks*2)-2)) {
            var obj = { x: offset+((n+2)*bw), y: lh };
            line.push(obj);
        }
    }
};

var lineHeight = (sh-200);
var pageNo = 0;
var drawLine = function(ctx) {
    if (line.length == 0) createLine();

    var lh = (sh-250);
    ctx.fillStyle = "#222";
    ctx.clearRect(0, lh-150, sw, 200);
    ctx.fillRect(0, lh-150, sw, 200);

    ctx.font = "10px bold";
    ctx.textBaseline = "middle";

    ctx.strokeStyle = "#999";
    ctx.lineWidth = 2;

    if (pastLine.length) {
    ctx.beginPath();
    ctx.moveTo(lineOffset+pastLine[0].x, 
    pastLine[0].y);
    for (var n = 0; n < pastLine.length; n++) {
        ctx.lineTo(lineOffset+pastLine[n].x, 
        pastLine[n].y);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(lineOffset+pastLine[n].x, 
        pastLine[n].y);

        if (pastLine[n].y > lh) {
            ctx.fillText(pastLine[n].pageNo, 
            lineOffset+pastLine[n].x, pastLine[n].y+10);
        }
    }
    }

    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(lineOffset+line[0].x, 
    line[0].y);
    for (var n = 0; n < line.length; n++) {
        ctx.lineTo(lineOffset+line[n].x, 
        line[n].y);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(lineOffset+line[n].x, 
        line[n].y);

        if (line[n].y > lh) {
            ctx.fillText(line[n].pageNo, lineOffset+line[n].x, line[n].y+10);
        }
    }

    lineOffset -= (sceneWidth < sw ? (1/4) : 1);

    if (sceneWidth < sw) {
    ctx.strokeStyle = "#999";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(sw/2, lh-100);
    ctx.lineTo(sw/2, lh+25);
    ctx.stroke();

    ctx.strokeStyle = "#999";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(sw/4, lh-100);
    ctx.lineTo(sw/2, lh-100);
    ctx.stroke();

    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo((sw/4), lh+25);
    ctx.lineTo((sw/2), lh+25);
    ctx.stroke();

    ctx.strokeStyle = "#999";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(sw/4, lh-100);
    ctx.lineTo(sw/4, lh+25);
    ctx.stroke();

    ctx.strokeStyle = "#999";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo((sw/2)+(sw/4), lh-100);
    ctx.lineTo((sw/2)+(sw/4), lh+25);
    ctx.stroke();
    }

    if (lineOffset + line[line.length-1].x < (sceneWidth < sw ? 
        (sceneWidth*3) : (sceneWidth*2))) {
        pastLine = [ ...line ];
        line = [];
        createLine();
    }
};

var rested = true;
var speedY = 0;
var points = [];
var point = { x: 0, y: 0 };
var drawPoint = function(ctx, avgValue) {
    ctx.strokeStyle = "#fff";
    ctx.fillStyle = "#fff";
    ctx.lineWidth = 4;

    var lh = (sh-250);
    var jumpHeight = (avgValue*150);

    speedY += 120/60;
    speedY = speedY > (120/60) ? (120/60) : speedY;
    speedY -= rested && point.y == (lh-10) ? ((avgValue*1500)/60) : 0;

    if (avgValue > 0.3 && rested) {
        console.log(speedY);
        rested = false;
    }

    point.x = 20;
    point.y += speedY;
    point.y = point.y > (lh-10) ? (lh-10) : point.y;
    point.y = point.y < (lh-140) ? (lh-140) : point.y;

    updateWord(avgValue);
    /*point.y = getLineHeight()-10;
    if (avgValue > 0.1)
    point.y = (getLineHeight()-10)-jumpHeight;
    point.y = point.y < (lh-140) ? (lh-140) : point.y;*/

    var point0 = {
       x: point.x-3, y: point.y
    };
    var point1 = {
       x: point.x-3, y: point.y+10
    };
    point1 = _rotate2d(point0, point1, 
    (Math.PI/16)-(avgValue*(Math.PI/2)), false);

    ctx.font = "20px bold";
    ctx.textBaseline = "middle";

    ctx.beginPath();
    drawWord(ctx);
    //ctx.fillText("A", point.x, point.y);
};

var setWord = function(word) {
    var lh = (sh-250);
    points = [];
    for (var n = 0; n < word.length; n++) {
        var point = { char: word[n], x: 20+(20)*n, y: lh };
        points.push(point);
    };
};

var updateWord = function(avgValue) {
    var jumpHeight = (avgValue*150);
    var lh = (sh-250);
    for (var n = 0; n < points.length; n++) {
        points[n].y = getLineHeight(points[n].x)-10;
        if (avgValue > 0.1)
        points[n].y = (getLineHeight(points[n].x)-10)-jumpHeight;
        points[n].y = points[n].y < (lh-140) ? (lh-140) : points[n].y;
    }
};

var drawWord = function(ctx) {
    for (var n = 0; n < points.length; n++) {
        ctx.fillText(points[n].char, points[n].x, points[n].y);
    }
};

var drawMark = function(ctx) {
    ctx.strokeStyle = "#9f9";
    ctx.fillStyle = "#9f9";
    ctx.lineWidth = 4;

    var lh = (sh-250);

    ctx.beginPath();
    ctx.arc(debugMark.offsetX + debugMark.x, lh-50, 1, 0, (Math.PI*2));
    ctx.fill();

    debugMark.offsetX -= 1/4;
};

var jump = function() {
    if (point.y < (lh-10)) return;
    beepPool.play("audio/frog-jump(2).wav");
    var lh = (sh-200);
    speedY -= (1500/60);
};

var lastLineHeight = 0;
var count = 0;
var collisionCheck = function() {
    var lh = (sh-200);
    var collided = false; //(point.y+10) > lineHeight;
    if (collided) {
        reset();
    }
};

var getLineHeight = function(x=20) {
    var lh = (sh-200);
    var result = lh;
    var currentX = 0;
    for (var n = 0; n < pastLine.length; n++) {
        currentX = lineOffset+pastLine[n].x;
        if (currentX > x-10 && currentX <= x+20)
        result = getSmaller(result, pastLine[n].y);
        if (currentX > x+20)
        break;
    };
    for (var n = 0; n < line.length; n++) {
        currentX = lineOffset+line[n].x;
        if (currentX > x-10 && currentX <= x+20)
        result = getSmaller(result, line[n].y);
        if (currentX > x+20)
        break;
    };
    console.log(result);
    return result;
};

var getSmaller = function(a, b) {
    return a < b ? a : b;
};

var reset = function() {
    pageNo = 0;
    pastLine = [];
    line = [];
    createLine();
    lineOffset = sceneWidth < sw ? (sw/4) : 0;
    count = 0;
    subtitle.innerText = count;
    //mic.close();
};

var composePerson = function(obj) {
    var text = "";
    text = "Olá me chamo "+
    obj.temp+", tenho "+
    obj.temp3+" anos, "+
    obj.temp4.replace("."," metro e ")+", meu cpf é "+
    getVerification(obj.uid, true)+", sou "+
    obj.temp2+" e juntei "+
    obj.temp1.replace(".",",")+".";

    return text;
};