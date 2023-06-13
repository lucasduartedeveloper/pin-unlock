var run = function() {
  var text = "";

  var hour = 0;
  var minute = 0;

  var values = [];
  for (var n = 0; n < 24; n++) {
    hour = n;
    for (var k = 0; k < 60; k++) {
      minute = k;

      var _hour = hour.toString().padStart(2, "0");
      var _minute = minute.toString().padStart(2, "0");

      values.push(_hour + ":" + _minute);
    }
  }

  var line = "";
  for (var n = 0; n < values.length; n++) {
    line += values[n];
    if (n < (values.length-1))
    line += String.fromCharCode(9);
    if ((n+1) % 10 == 0)
    line += "\r\n";
  }

  document.body.innerHTML = line;
};

run();