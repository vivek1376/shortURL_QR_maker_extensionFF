(function() {
    /* Check and set a global guard variable.
     * If this content script is injected into the same page again,
     * it will do nothing next time. */
    if (typeof window.isContentScriptRunning !== "undefined" && window.isContentScriptRunning === 1) {
        console.log("returning.");
        return;
    }

    window.isContentScriptRunning = 1;

    if (typeof window.isgdshortURL !== "undefined") {
        console.log("found isgd cached url. returning.");
        console.log(window.isgdshortURL);

        browser.runtime.sendMessage({"isgdurl": window.isgdshortURL});
        window.isContentScriptRunning = 0;

        return;
    }

    var url_encoded = encodeURIComponent(window.location.href);

    var apiUrl = 'https://is.gd/create.php?format=json&url=' + url_encoded;
    console.log("URL: " + apiUrl);

    var xhttp = new XMLHttpRequest();

    if (!xhttp) {
        browser.runtime.sendMessage({"error": "error"});
        window.isContentScriptRunning = 0;
        return;
    }

    xhttp.onload = function() {
        console.log("onload");
        var resp = undefined;
        var isError = false;

        console.log("http response: " + this.status);

        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
            console.log("status 200");
            try {
                var resp = JSON.parse(this.responseText);
            } catch (e) {
                console.log("error catch");
                isError = true;
            }

            if (typeof resp !== 'undefined' && resp.hasOwnProperty('shorturl')) {
                window.isgdshortURL = resp.shorturl;
                browser.runtime.sendMessage({'isgdurl': window.isgdshortURL});
            } else {
                console.log("resp undefined.");
                browser.runtime.sendMessage({'error': 'error'});
            }
        } else {
            console.log("status ELSE");
            // console.log("in ELSE part.");  //???
        }
    };

    xhttp.onerror = function() {
        browser.runtime.sendMessage({"error": "error"});
    };

    xhttp.open("GET", apiUrl, true);
    xhttp.setRequestHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    xhttp.overrideMimeType("application/json");
    xhttp.send();

    window.isContentScriptRunning = 0;
})();
