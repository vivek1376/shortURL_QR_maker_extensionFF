(function() {
    /* Check and set a global guard variable.
     * If this content script is injected into the same page again,
     * it will do nothing next time. */
    if (typeof window.isContentScriptRunning !== "undefined" && window.isContentScriptRunning == 1) {
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

    console.log("inside content script");

    var pageURL = window.location.href;

    var url_encoded = encodeURIComponent(pageURL);

    var apiUrl = 'https://is.gd/create.php?format=json&url=' + url_encoded;
    console.log("URL: " + apiUrl);

    var xhttp = new XMLHttpRequest();

    if (!xhttp) {
        window.isContentScriptRunning = 0;
        return;
    }

    xhttp.onload = function() {
        var resp = undefined;
        var isError = false;

        console.log("http response: " + this.status);

        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
            // console.log("2: " + this.responseText);

            try {
                var resp = JSON.parse(this.responseText);
            } catch (e) {
                isError = true;
            }

            if (typeof resp !== 'undefined' && resp.hasOwnProperty('shorturl')) {
                window.isgdshortURL = resp.shorturl;
                browser.runtime.sendMessage({"isgdurl": window.isgdshortURL});
            } else {
                if (resp.hasOwnProperty('errorcode')) {
                    browser.runtime.sendMessage({"error": resp.errorcode});
                } else {
                    browser.runtime.sendMessage({"error": "error"});
                }
            }
        } else {
            console.log("in ELSE part.");  //???
        }
    };

    xhttp.open("GET", apiUrl, true);
    xhttp.setRequestHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    xhttp.overrideMimeType("application/json");
    xhttp.send();

    window.isContentScriptRunning = 0;
})();
