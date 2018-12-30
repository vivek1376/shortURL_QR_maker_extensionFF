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


  // if (window.hasRun) {
  //   return;
  // }
  // window.hasRun = true;

  /**
   * Given a URL to a beast image, remove all existing beasts, then
   * create and style an IMG node pointing to
   * that image, then insert the node into the document.
   */
  function insertBeast(beastURL) {
    removeExistingBeasts();
    let beastImage = document.createElement("img");
    beastImage.setAttribute("src", beastURL);
    beastImage.style.height = "100vh";
    beastImage.className = "beastify-image";
    document.body.appendChild(beastImage);
  }

  /**
   * Remove every beast from the page.
   */
  function removeExistingBeasts() {
    let existingBeasts = document.querySelectorAll(".beastify-image");
    for (let beast of existingBeasts) {
      beast.remove();
    }
  }

  /**
   * Listen for messages from the background script.
   * Call "beastify()" or "reset()".
  */

  //just testing
  //document.body.innerHTML = window.location.href;
  // window.addEventListener("click", notifyExtension);

  window.addEventListener("click", notifyExtension);



  function notifyExtension(e) {
    // if (e.target.tagName != "A") {
    //   return;
    // }
    // browser.runtime.sendMessage({"url": e.target.href});
    browser.runtime.sendMessage({"url": window.location.href});
    console.log("sent");
  }


  browser.runtime.onMessage.addListener((message) => {
    if (message.command === "beastify") {
      insertBeast(message.beastURL);
    } else if (message.command === "reset") {
      removeExistingBeasts();
    }
  });

  console.log("here bottom");
  isContentScriptRunning = 0;
})();
