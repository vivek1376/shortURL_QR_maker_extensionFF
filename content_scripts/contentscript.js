(function() {
    /* Check and set a global guard variable.
     * If this content script is injected into the same page again,
     * it will do nothing next time. */
    if (typeof window.isContentScriptRunning !== "undefined" && window.isContentScriptRunning === 1) {
        return;
    }

    window.isContentScriptRunning = 1;

    if (typeof window.isgdshortURL !== "undefined") {
        browser.runtime.sendMessage({"isgdurl": window.isgdshortURL});
        window.isContentScriptRunning = 0;

        return;
    }

    var url_encoded = encodeURIComponent(window.location.href);

    var apiUrl = 'https://is.gd/create.php?format=json&url=' + url_encoded;

    var xhttp = new XMLHttpRequest();

    if (!xhttp) {
        browser.runtime.sendMessage({"error": "error"});
        window.isContentScriptRunning = 0;
        return;
    }

    xhttp.onload = function() {
        var resp = undefined;
        var isError = false;

        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
            try {
                var resp = JSON.parse(this.responseText);
            } catch (e) {
                isError = true;
            }

            if (typeof resp !== 'undefined' && resp.hasOwnProperty('shorturl')) {
                window.isgdshortURL = resp.shorturl;
                browser.runtime.sendMessage({'isgdurl': window.isgdshortURL});
            } else {
                browser.runtime.sendMessage({'error': 'error'});
            }
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
