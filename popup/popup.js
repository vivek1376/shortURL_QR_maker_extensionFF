var isErrorFlag = false;
var prevErrStr = '';

function reportExecuteScriptError(error) {
    printError();
}

function printError(errStr) {
    errStr = errStr || 'Error !';
    prevErrStr = errStr;

    document.querySelector('div#footer p.status').innerText = errStr;
}

/* When the popup loads, inject a content script into the active tab,
 * and add a click handler.
 * If we couldn't inject the script, handle the error. */
browser.tabs.executeScript({file: "/content_scripts/contentscript.js"})
    .catch(reportExecuteScriptError);

/* for communication; to get short url string from content-script */
browser.runtime.onMessage.addListener(notify);

function notify(message) {

    if (message.hasOwnProperty('error')) {
        isErrorFlag = true;
        printError('short url error');
        return;
    }

    var isgdUrl_str = message.isgdurl;

    var isgdUrl_str_formatted = isgdUrl_str.substring(8);

    document.getElementById("urlinfo").innerText = isgdUrl_str_formatted;

    var url_qr = 'https://chart.googleapis.com/chart?cht=qr&chs=250x250&chld=M|0&chl='
        + encodeURIComponent(isgdUrl_str);

    var image = document.getElementById("qrimg");
    var downloadingImage = new Image();

    downloadingImage.onload = function () {
        image.src = this.src;
        document.querySelector('div#footer p.status').innerText = '';
    };

    downloadingImage.onerror = function () {
        isErrorFlag = true;
        printError('qr code error');
    };

    downloadingImage.src = url_qr;

    // copy button handler
    function copy() {
        navigator.clipboard.writeText(isgdUrl_str).then(function () {
            /* clipboard successfully set */
        }, function () {
            /* clipboard write failed */
            printError('error copying');
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

        if (isCopyClicked === true) {
            isCopyClicked = setTimeout(function () {
                if (isErrorFlag === true) {
                    printError(prevErrStr);
                } else {
                    document.querySelector('div#footer p.status').innerText = '';
                }
            }, 1400);
        } else {
            if (isErrorFlag == true) {
                printError(prevErrStr);
            } else {
                document.querySelector('div#footer p.status').innerText = '';
            }
        }
    });

    copyIcon_obj.addEventListener("click", function () {
        isCopyClicked = true;
        document.querySelector('div#footer p.status').innerText = 'copied !';
    });
}


var likeIcon_obj = document.querySelector('div#footer div.about a#likelink');

likeIcon_obj.addEventListener("mouseover", function () {
    document.querySelector('div#footer p.status').innerText = 'see about';
});

likeIcon_obj.addEventListener("mouseout", function () {
    if (isErrorFlag === true) {
        printError(prevErrStr);
    } else {
        document.querySelector('div#footer p.status').innerText = '';
    }
});

var divmain_obj = document.querySelector('div#wrap');
var divAbtBox_obj = document.querySelector('div#aboutBox');
var divlike_obj = document.querySelector('div#footer div.about');

likeIcon_obj.addEventListener("click", function () {
    divAbtBox_obj.classList.remove('hidden');
    divmain_obj.classList.add('hidden');

    divlike_obj.classList.add('hidden');
});

document.querySelector('p#closeabt a').addEventListener("click", function () {
    divmain_obj.classList.remove('hidden');
    divlike_obj.classList.remove('hidden');
    divAbtBox_obj.classList.add('hidden');
});




