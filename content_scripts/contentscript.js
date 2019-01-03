(function() {
    /**
     * Check and set a global guard variable.
     * If this content script is injected into the same page again,
     * it will do nothing next time.
     */
    if (typeof window.isContentScriptRunning !== "undefined" && window.isContentScriptRunning == 1) {
        console.log("returning.");
        return;
    }


    console.log("not returning.");

    window.isContentScriptRunning = 1;

    browser.runtime.sendMessage({"url": window.location.href});
    console.log("sent");

    window.isContentScriptRunning = 0;
})();
