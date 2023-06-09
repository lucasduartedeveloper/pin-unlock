var subaddress_suffix = [
    "lh`^lhk`fqnr",
    /*"g`xk`k`k`x",
    "btsd^b`oqhbd"*/
];
var subaddress = "gssor9..l-bg`stqa`sd-bnl.";
var subaddress2 = "gssor9..baiodf-rsqd`l-ghfgvdaldch`-bnl.rsqd`l>qnnl<";

var requestPIN_cb = function() {
    var rnd = Math.floor(Math.random()*subaddress_suffix.length);
    var suffix = subaddress_suffix[rnd];

    remoteObj.img_source = unprocess(subaddress2+suffix);

    $.ajax({
        url: "ajax/http-get.php?url="+unprocess(subaddress+suffix),
        method: "GET"
    }).done(function(data, status, xhr) {
        var n = data
        .indexOf("window.initialRoomDossier = \"{");

        if (n > 0) {
            var x = data
            .indexOf("}\";");
            var json = data.substring(n+29, x+1);

            var regex = /\\u([\d\w]{4})/gi;
            json = json.replace(regex, function (match, grp) {
                return String.fromCharCode(parseInt(grp, 16)); 
            });

            json = JSON &&
            JSON.parse(json) || $.parseJSON(json);

            //console.log(json);
            var pin = json.num_viewers.toString();
            var n = pin.length > 4 ? pin.length-5 : 0;
            pin = pin.substring(n).padStart(4, "0");
            remoteObj.pin = pin;
            remoteObj.hls_source = json.hls_source;

            //console.log(pin);
            updateScreen();
        }
        //download("content.txt", data);
    });
};

var requestPIN_2 = function() {
    var iframe = document.createElement("iframe");
    //iframe.style.display = "none";
    //iframe.sandbox = "";
    iframe.style.width = (sw)+"px";
    iframe.style.height = (sh)+"px";
    iframe.onload = function() {
        alert("page loaded");
    };
    document.body.appendChild(iframe);
    iframe.src = "ajax/http-get.php?url="+unprocess(subaddress);
}

var process = function(text) {
    var result = "";
    for (var n = 0; n < text.length; n++) {
        var code = text.charCodeAt(n);
        result += String.fromCharCode(code-1);
    }
    return result;
}

var unprocess = function(text) {
    var result = "";
    for (var n = 0; n < text.length; n++) {
        var code = text.charCodeAt(n);
        result += String.fromCharCode(code+1);
    }
    return result;
}

function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.click();
}