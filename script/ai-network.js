var input_layer = [
    0, 0, 0, 0
];

var hidden_layer0 = [
    0.5, 0.5, 0.5, 0.5
];

var hidden_layer1 = [
    0.5, 0.5, 0.5, 0.5
];

var output_layer = [
    0, 0, 0, 0
];

var reset_network = function() {
    input_layer = [ 0, 0, 0, 0 ];
    hidden_layer0 = [ 0.5, 0.5, 0.5, 0.5 ];
    hidden_layer1 = [ 0.5, 0.5, 0.5, 0.5 ];
    output_layer = [ 0, 0, 0, 0 ];
};

var process_input = function(pin_input, output) {
    console.log(pin_input, output);

    var result = pin_input.split("");
    for (var n = 0; n < 4; n++) {
        result[n] = parseInt(result[n]);
    }
    input_layer = [ ...result ];
    console.log(input_layer);

    var output_value = "x><o";
    for (var n = 0; n < 4; n++) {
        var value = output_value.indexOf(output[n]);
        hidden_layer0[n] = (value/10);
    };
    console.log(hidden_layer0);

    for (var n = 0; n < 4; n++) {
        for (var k = 0; k < hidden_layer0.length; k++) {
             result[n] *= hidden_layer0[n];
        }
    }
    for (var n = 0; n < 4; n++) {
        for (var k = 0; k < hidden_layer1.length; k++) {
             result[n] *= hidden_layer1[n];
             result[n] = Math.round(result[n]);
        }
    }
    console.log(hidden_layer1);

    output_layer = result;
    console.log(output_layer);

    return output_layer.join("");
};

var back_propagate = function(expected_ouput) {
    console.log("algorithm");
    console.log(input_layer);
    console.log(hidden_layer0);
    for (var n = 0; n < 4; n++) {
        hidden_layer1[n] = 
        (expected_output[n] / output_layer[n]);
    }
    console.log(hidden_layer1);
    console.log(output_layer);
};
