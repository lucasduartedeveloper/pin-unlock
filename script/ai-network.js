var input_layer = [
    0, 0, 0, 0
];

var hidden_layer0 = [
    0, 0, 0, 0
];

var result_layer0 = [
    0, 0, 0, 0
];

var hidden_layer1 = [
    1, 1, 1, 1
];

var output_layer0 = [
    0, 0, 0, 0
];

var residue_layer = [
    0, 0, 0, 0
];

var output_layer1 = [
    0, 0, 0, 0
];

var reinput_layer = [
    0, 0, 0, 0
];

var reset_network = function() {
    input_layer = [ 0, 0, 0, 0 ];
    hidden_layer0 = [ 0.5, 0.5, 0.5, 0.5 ];
    result_layer0 = [ 0.5, 0.5, 0.5, 0.5 ];
    hidden_layer1 = [ 0.5, 0.5, 0.5, 0.5 ];
    output_layer0 = [ 0, 0, 0, 0 ];
    residue_layer = [ 0, 0, 0, 0 ];
    output_layer1 = [ 0, 0, 0, 0 ];
    reinput_layer = [ 0, 0, 0, 0 ];
};

var process_input = function(pin_input, output) {
    var result = pin_input.split("");
    for (var n = 0; n < 4; n++) {
        result[n] = parseInt(result[n]);
    }
    input_layer = [ ...result ];

    var output_value = "x><o";
    for (var n = 0; n < 4; n++) {
        var value = output_value.indexOf(output[n]);
        hidden_layer0[n] = parseFloat((0.1+(value/10)).toFixed(2));
    };

    for (var n = 0; n < 4; n++) {
        result_layer0[n] = input_layer[n];
        var weight = 0;
        for (var k = 0; k < hidden_layer0.length; k++) {
            weight += hidden_layer0[n];
        }
        result_layer0[n] = result_layer0[n]*weight;
        result_layer0[n] = parseFloat(result_layer0[n].toFixed(2));
    }

    for (var n = 0; n < 4; n++) {
        output_layer0[n] = result_layer0[n];
        var weight = 0;
        for (var k = 0; k < hidden_layer1.length; k++) {
            weight += hidden_layer1[n];
        }
        output_layer0[n] = output_layer0[n]*weight;
        output_layer0[n] = parseFloat(output_layer0[n].toFixed(2));
    }

    output_layer1 = [ ...output_layer0 ];
    for (var n = 0; n < 4; n++) {
        output_layer1[n] = Math.round(output_layer1[n]);
    }

    drawNetwork();
    return output_layer1.join("");
};

var back_propagate = function(expected_ouput) {
    var result = expected_ouput.split("");
    for (var n = 0; n < 4; n++) {
        result[n] = parseInt(result[n]);
    }

    reinput_layer = [ ...result ];

    /*var weight = 0;
    for (var k = 0; k < hidden_layer1.length; k++) {
        weight += hidden_layer1[n];
    }
    var new_weight = (weight/output_layer1[n])*result[n];

    for (var n = 0; n < 4; n++) {
        hidden_layer1[n] = new_weight;
        hidden_layer1[n] = parseFloat(hidden_layer1[n].toFixed(2));
    }*/

    for (var n = 0; n < 4; n++) {
        for (var k = 0; k < hidden_layer1.length; k++) {
             residue_layer[n] = output_layer0[n] - result[n];
             residue_layer[n] = parseFloat(residue_layer[n].toFixed(2));
        }
    }

    for (var n = 0; n < 4; n++) {
        result[n] = Math.round(result[n]);
    }
    //output_layer1 = [ ...result ];

    drawNetwork();
};

var drawNetwork = function() {
    var ctx = pinNetwork.getContext("2d");
    var width = pinNetwork.width;
    var height = pinNetwork.height;

    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = "rgba(150, 255, 150, 255)";
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 1;

    ctx.font = "15px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    var diam = width/8;
    var space = (width-(diam*4))/5;
    var paddingTop = space+(diam/2);
    var points = [];

    for (var n = 0; n < 4; n++) {
        var x = (space*(n+1))+(diam*(n+0.5));
        var y = paddingTop;

        ctx.beginPath();
        ctx.arc(x, y, (diam/2), 0, Math.PI*2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#000";
        ctx.fillText(input_layer[n], x, y);
        ctx.fillStyle = "rgba(150, 255, 150, 255)";

        var pos = {
            x: x, y: y
        };
        points.push(pos);
    }

    ctx.font = "10px sans-serif";
    ctx.fillStyle = "rgba(150, 255, 150, 255)";
    ctx.strokeStyle = "#000";
    paddingTop = space+(diam/2)+(diam*2);
    var points2 = [];

    for (var n = 0; n < 4; n++) {
        var x = (space*(n+1))+(diam*(n+0.5));
        var y = paddingTop;

        ctx.beginPath();
        ctx.arc(x, y, (diam/2), 0, Math.PI*2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#000";
        ctx.fillText(hidden_layer0[n].toFixed(2), x, y);
        ctx.fillStyle = "rgba(150, 255, 150, 255)";

        var pos = {
            x: x, y: y
        };
        points2.push(pos);
    }

    ctx.fillStyle = "rgba(150, 150, 255, 255)";
    ctx.strokeStyle = "#000";
    paddingTop = space+(diam/2)+(diam*4);
    var points3 = [];

    for (var n = 0; n < 4; n++) {
        var x = (space*(n+1))+(diam*(n+0.5));
        var y = paddingTop;

        ctx.beginPath();
        ctx.arc(x, y, (diam/2), 0, Math.PI*2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#000";
        ctx.fillText(result_layer0[n].toFixed(2), x, y);
        ctx.fillStyle = "rgba(150, 150, 255, 255)";

        var pos = {
            x: x, y: y
        };
        points3.push(pos);
    }

    ctx.fillStyle = "rgba(150, 255, 150, 255)";
    ctx.strokeStyle = "#000";
    paddingTop = space+(diam/2)+(diam*6);
    var points4 = [];

    for (var n = 0; n < 4; n++) {
        var x = (space*(n+1))+(diam*(n+0.5));
        var y = paddingTop;

        ctx.beginPath();
        ctx.arc(x, y, (diam/2), 0, Math.PI*2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#000";
        ctx.fillText(hidden_layer1[n], x, y);
        ctx.fillStyle = "rgba(150, 255, 150, 255)";

        var pos = {
            x: x, y: y
        };
        points4.push(pos);
    }

    ctx.fillStyle = "rgba(150, 255, 150, 255)";
    ctx.strokeStyle = "#000";
    paddingTop = space+(diam/2)+(diam*8);
    var points5 = [];

    for (var n = 0; n < 4; n++) {
        var x = (space*(n+1))+(diam*(n+0.5));
        var y = paddingTop;

        ctx.beginPath();
        ctx.arc(x, y, (diam/2), 0, Math.PI*2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#000";
        ctx.fillText(output_layer0[n].toFixed(2), x, y);
        ctx.fillStyle = "rgba(150, 255, 150, 255)";

        var pos = {
            x: x, y: y
        };
        points5.push(pos);
    }

    ctx.fillStyle = "rgba(200, 255, 150, 255)";
    ctx.strokeStyle = "#000";
    paddingTop = space+(diam/2)+(diam*10);
    var points6 = [];

    for (var n = 0; n < 4; n++) {
        var x = (space*(n+1))+(diam*(n+0.5));
        var y = paddingTop;

        ctx.beginPath();
        ctx.arc(x, y, (diam/2), 0, Math.PI*2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#000";
        ctx.fillText(residue_layer[n].toFixed(2), x, y);
        ctx.fillStyle = "rgba(200, 255, 150, 255)";

        var pos = {
            x: x, y: y
        };
        points6.push(pos);
    }

    ctx.strokeRect((space/2), paddingTop-(diam/2)-(space/2), 
    (width)-(space), (diam)+(space));

    ctx.font = "15px sans-serif";
    ctx.fillStyle = "rgba(255, 200, 150, 255)";
    ctx.strokeStyle = "#000";
    paddingTop = space+(diam/2)+(diam*12);
    var points7 = [];

    for (var n = 0; n < 4; n++) {
        var x = (space*(n+1))+(diam*(n+0.5));
        var y = paddingTop;

        ctx.beginPath();
        ctx.arc(x, y, (diam/2), 0, Math.PI*2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#000";
        ctx.fillText(output_layer1[n], x, y);
        ctx.fillStyle = "rgba(255, 200, 150, 255)";

        var pos = {
            x: x, y: y
        };
        points7.push(pos);
    }

    ctx.font = "15px sans-serif";
    ctx.fillStyle = "rgba(255, 200, 150, 255)";
    ctx.strokeStyle = "#000";
    paddingTop = space+(diam/2)+(diam*13.5);
    var points8 = [];

    for (var n = 0; n < 4; n++) {
        var x = (space*(n+1))+(diam*(n+0.5));
        var y = paddingTop;

        ctx.beginPath();
        ctx.arc(x, y, (diam/2), 0, Math.PI*2);
        ctx.stroke();
        //ctx.strokeRect(x-(diam/2), y-(diam/2), (diam), (diam));

        ctx.fillStyle = "#000";
        ctx.fillText(reinput_layer[n], x, y);
        ctx.fillStyle = "rgba(255, 200, 150, 255)";
    }

    ctx.lineWidth = 1;
    var connections = [];
    connections = [ ...getConnectionPoints(points, points2, diam/2) ];
    connections = [ ...connections, 
    ...getEndConnectionPoints(points2, points3, diam/2) ];
    connections = [ ...connections, 
    ...getConnectionPoints(points3, points4, diam/2) ];
    connections = [ ...connections, 
    ...getEndConnectionPoints(points4, points5, diam/2) ];
    connections = [ ...connections, 
    ...getEndConnectionPoints(points5, points6, diam/2) ];
    connections = [ ...connections, 
    ...getEndConnectionPoints(points6, points7, diam/2) ];

    //console.log(connections);
    for (var n = 0; n < connections.length; n++) {
        ctx.beginPath();
        ctx.moveTo(connections[n].pos0.x, connections[n].pos0.y);
        ctx.lineTo(connections[n].pos1.x, connections[n].pos1.y);
        ctx.stroke();
    }
};

var getConnectionPoints = function(points, points2, radius) {
    var connections = [];
    for (var n = 0; n < points.length; n++) {
        for (var k = 0; k < points2.length; k++) {
            var c0 = { x: points[n].x, y: points[n].y };
            var p0 = { x: points[n].x, y: points[n].y+radius };

            var c1 = { x: points2[k].x, y: points2[k].y };
            var p1 = { x: points2[k].x, y: points2[k].y-radius };

            var pos = {
                pos0: p0,
                pos1: p1
            };
            connections.push(pos);
        }
    }
    return connections;
}

var getEndConnectionPoints = function(points, points2, radius) {
    var connections = [];
    for (var n = 0; n < points.length; n++) {
            var c0 = { x: points[n].x, y: points[n].y };
            var p0 = { x: points[n].x, y: points[n].y+radius };

            var c1 = { x: points2[n].x, y: points2[n].y };
            var p1 = { x: points2[n].x, y: points2[n].y-radius };

            var pos = {
                pos0: p0,
                pos1: p1
            };
            connections.push(pos);
    }
    return connections;
}