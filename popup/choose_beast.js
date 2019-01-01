/**
 * There was an error executing the script.
 * Display the popup's error message, and hide the normal UI.
 */
function reportExecuteScriptError(error) {
    printError();
    // document.querySelector("#popup-content").classList.add("hidden");
    // document.querySelector("#error-content").classList.remove("hidden");
    console.error(`Failed to execute content script: ${error.message}`);
}


function printError(errStr) {
    errStr = errStr || 'Error !';

    document.querySelector('div#footer p.status').innerText = errStr;
}

/**
 * When the popup loads, inject a content script into the active tab,
 * and add a click handler.
 * If we couldn't inject the script, handle the error.
 */
browser.tabs.executeScript({file: "/content_scripts/beastify.js"})
    .catch(reportExecuteScriptError);

// for communication
browser.runtime.onMessage.addListener(notify);

function notify(message) {

    var isgdUrl_str = "";

    console.log("In message()");
    // document.getElementById("urlinfo").innerText = message.url;

    // var url = 'https://www.pbs.org/video/great-conversations-great-conversations-siddhartha-mukherjee';
    var url_encoded = encodeURIComponent(message.url);

    var apiUrl = 'https://is.gd/create.php?format=json&url=' + url_encoded;
    console.log("URL: " + apiUrl);

    var xhttp = new XMLHttpRequest();

    if (!xhttp) {
        return false;
    }

    // xhttp.onreadystatechange = function() {
    xhttp.onload = function() {
        var resp = undefined;
        var isError = false;

        console.log("http response: " + this.status);

        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
            console.log("1: " + this.response);
            console.log("2: " + this.responseText);

            try {
                var resp = JSON.parse(this.responseText);
            } catch (e) {
                isError = true;
            }

            if (typeof resp !== 'undefined' && resp.hasOwnProperty('shorturl')) {
                document.querySelector('div#footer p.status').innerText = 'loading qr code...';
                isgdUrl_str = resp.shorturl;
                var isgdUrl_str_formatted = isgdUrl_str.substring(8);

                document.getElementById("urlinfo").innerText = isgdUrl_str_formatted;

                url_qr = 'https://chart.googleapis.com/chart?cht=qr&chs=500x500&chld=M|0&chl='
                    + encodeURIComponent(isgdUrl_str);

                console.log(url_qr);

                var image = document.getElementById("qrimg");
                var downloadingImage = new Image();

                downloadingImage.onload = function(){
                    image.src = this.src;
                    document.querySelector('div#footer p.status').innerText = '';
                };

                downloadingImage.onerror = function() {
                    console.log("image error.");
                    printError();
                };

                downloadingImage.src =  url_qr;


                function copy() {
                    navigator.clipboard.writeText(isgdUrl_str).then(function() {
                        /* clipboard successfully set */
                        console.log("success");
                    }, function() {
                        /* clipboard write failed */
                        console.log("error");
                    });
                }

                document.querySelector('input#copybtn').addEventListener("click", copy);

            } else if (typeof resp !== 'undefined' && resp.hasOwnProperty('errorcode')) {
                isError = true;
                console.log("error response");
            }
        } else {
            isError = true;
            console.log("error");
        }

        if (isError) {
            printError();
        }
    };


    var oldStStr = '';


    var likeIcon_obj = document.querySelector('div#footer div.about a');

    likeIcon_obj.addEventListener("mouseover", function () {
        console.log("mouseover");
        oldStStr = document.querySelector('div#footer p.status').innerText;
        document.querySelector('div#footer p.status').innerText = 'GOTO homepage';
    });

    likeIcon_obj.addEventListener("mouseout", function () {
        console.log("mouseout");
        document.querySelector('div#footer p.status').innerText = oldStStr;
    });


    var isCopyClicked = false;
    var copyStatusTimeout = undefined;

    var copyIcon_obj = document.querySelector('input#copybtn');

    copyIcon_obj.addEventListener("mouseover", function () {
        if (isCopyClicked == true) {
            isCopyClicked = false;
        } else {
            oldStStr = document.querySelector('div#footer p.status').innerText;
            document.querySelector('div#footer p.status').innerText = 'Click to copy url';
        }
    });

    copyIcon_obj.addEventListener("mouseout", function () {
        console.log("mouseout");

        if (isCopyClicked == true) {
            isCopyClicked = setTimeout(function () {
                document.querySelector('div#footer p.status').innerText = oldStStr;
            }, 1800);
        } else {
            document.querySelector('div#footer p.status').innerText = oldStStr;
        }
    });

    copyIcon_obj.addEventListener("click", function () {
        isCopyClicked = true;
        console.log("clicked");
        document.querySelector('div#footer p.status').innerText = 'copied !';
    });

    xhttp.open("GET", apiUrl, true);
    xhttp.setRequestHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    xhttp.overrideMimeType("application/json");
    xhttp.send();
}



