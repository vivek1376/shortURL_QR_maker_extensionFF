(function() {
  /**
   * Check and set a global guard variable.
   * If this content script is injected into the same page again,
   * it will do nothing next time.
   */
  if (typeof isContentScriptRunning !== "undefined" && isContentScriptRunning == 1) {
    return;
  }

  isContentScriptRunning = 1;

  browser.runtime.sendMessage({"url": window.location.href});
  console.log("sent");



  window.addEventListener("click", notifyExtension);



  function notifyExtension(e) {
    // if (e.target.tagName != "A") {
    //   return;
    // }
    // browser.runtime.sendMessage({"url": e.target.href});
    browser.runtime.sendMessage({"url": window.location.href});
    console.log("sent");
  }


  console.log("here bottom");
  isContentScriptRunning = 0;
})();
