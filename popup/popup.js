/**
 * There was an error executing the script.
 * Display the popup's error message, and hide the normal UI.
 */
// document.querySelector('div#aboutBox').classList.add('hidden');


// custom_var = "custom_val";

var isErrorFlag = false;

function reportExecuteScriptError(error) {
    printError();
}


function printError(errStr) {
    errStr = errStr || 'Error !';

    document.querySelector('div#footer p.status').innerText = errStr;
}

/* When the popup loads, inject a content script into the active tab,
 * and add a click handler.
 * If we couldn't inject the script, handle the error. */
browser.tabs.executeScript({file: "/content_scripts/contentscript.js"})
    .catch(reportExecuteScriptError);

/* for communication; to get url string from content-script */
browser.runtime.onMessage.addListener(notify);

function notify(message) {

    console.log("got message" + JSON.stringify(message));

    if (message.hasOwnProperty('error')) {
        printError();
        return;
    }


    var isgdUrl_str = message.isgdurl;

    console.log("isgdurl: " + isgdUrl_str);

    var isgdUrl_str_formatted = isgdUrl_str.substring(8);

    document.getElementById("urlinfo").innerText = isgdUrl_str_formatted;

    url_qr = 'https://chart.googleapis.com/chart?cht=qr&chs=250x250&chld=M|0&chl='
        + encodeURIComponent(isgdUrl_str);

    console.log(url_qr);

    var image = document.getElementById("qrimg");
    var downloadingImage = new Image();

    downloadingImage.onload = function () {
        image.src = this.src;
        document.querySelector('div#footer p.status').innerText = '';
    };

    downloadingImage.onerror = function () {
        console.log("image error.");
        printError();
    };

    downloadingImage.src = url_qr;

    // copy button handler
    function copy() {
        console.log("url copied");
        navigator.clipboard.writeText(isgdUrl_str).then(function () {
            /* clipboard successfully set */
            console.log("success");
        }, function () {
            /* clipboard write failed */
            console.log("error");
        });
    }

    document.querySelector('input#copybtn').addEventListener("click", copy);

    var isCopyClicked = false;

    var copyIcon_obj = document.querySelector('input#copybtn');

    copyIcon_obj.addEventListener("mouseover", function () {
        if (isCopyClicked == true) {
            isCopyClicked = false;
        } else {
            document.querySelector('div#footer p.status').innerText = 'Click to copy url';
        }
    });

    copyIcon_obj.addEventListener("mouseout", function () {
        console.log("mouseout");

        if (isCopyClicked == true) {
            isCopyClicked = setTimeout(function () {
                if (isErrorFlag == true) {
                    printError();
                } else {
                    document.querySelector('div#footer p.status').innerText = '';
                }
            }, 1800);
        } else {
            if (isErrorFlag == true) {
                printError();
            } else {
                document.querySelector('div#footer p.status').innerText = '';
            }
        }
    });

    copyIcon_obj.addEventListener("click", function () {
        isCopyClicked = true;
        console.log("clicked");
        document.querySelector('div#footer p.status').innerText = 'copied !';
    });
}


var likeIcon_obj = document.querySelector('div#footer div.about a#likelink');

likeIcon_obj.addEventListener("mouseover", function () {
    console.log("mouseover");
    // oldStStr = document.querySelector('div#footer p.status').innerText;
    document.querySelector('div#footer p.status').innerText = 'GOTO homepage';
});

likeIcon_obj.addEventListener("mouseout", function () {
    console.log("mouseout");
    if (isErrorFlag == true) {
        printError();
        // document.querySelector('div#footer p.status').innerText = oldStStr;
    } else {
        document.querySelector('div#footer p.status').innerText = '';
    }
});

var isAboutDisplay = false;

var divmain_obj = document.querySelector('div#wrap');
var divAbtBox_obj = document.querySelector('div#aboutBox');
var divlike_obj = document.querySelector('div#footer div.about');

likeIcon_obj.addEventListener("click", function () {
    divAbtBox_obj.classList.remove('hidden');
    divmain_obj.classList.add('hidden');

    divlike_obj.classList.add('hidden');
});

document.querySelector('a#closeabt').addEventListener("click", function () {
    divmain_obj.classList.remove('hidden');
    divlike_obj.classList.remove('hidden');
    divAbtBox_obj.classList.add('hidden');
});




