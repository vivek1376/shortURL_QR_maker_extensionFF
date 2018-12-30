/**
 * CSS to hide everything on the page,
 * except for elements that have the "beastify-image" class.
 */
const hidePage = `body > :not(.beastify-image) {
                    display: none;
                  }`;

/**
 * Listen for clicks on the buttons, and send the appropriate message to
 * the content script in the page.
 */
function listenForClicks() {
  document.addEventListener("click", (e) => {

    /**
     * Given the name of a beast, get the URL to the corresponding image.
     */
    function beastNameToURL(beastName) {
      switch (beastName) {
        case "Frog":
          return browser.extension.getURL("beasts/frog.jpg");
        case "Snake":
          return browser.extension.getURL("beasts/snake.jpg");
        case "Turtle":
          return browser.extension.getURL("beasts/turtle.jpg");
      }
    }

    /**
     * Insert the page-hiding CSS into the active tab,
     * then get the beast URL and
     * send a "beastify" message to the content script in the active tab.
     */
    function beastify(tabs) {
      browser.tabs.insertCSS({code: hidePage}).then(() => {
        let url = beastNameToURL(e.target.textContent);
        browser.tabs.sendMessage(tabs[0].id, {
          command: "beastify",
          beastURL: url
        });
      });
    }

    /**
     * Remove the page-hiding CSS from the active tab,
     * send a "reset" message to the content script in the active tab.
     */
    function reset(tabs) {
      browser.tabs.removeCSS({code: hidePage}).then(() => {
        browser.tabs.sendMessage(tabs[0].id, {
          command: "reset",
        });
      });
    }

    /**
     * Just log the error to the console.
     */
    function reportError(error) {
      console.error(`Could not beastify: ${error}`);
    }

    /**
     * Get the active tab,
     * then call "beastify()" or "reset()" as appropriate.
     */
    if (e.target.classList.contains("beast")) {
      browser.tabs.query({active: true, currentWindow: true})
        .then(beastify)
        .catch(reportError);
    }
    else if (e.target.classList.contains("reset")) {
      browser.tabs.query({active: true, currentWindow: true})
        .then(reset)
        .catch(reportError);
    }
  });
}

/**
 * There was an error executing the script.
 * Display the popup's error message, and hide the normal UI.
 */
function reportExecuteScriptError(error) {
  document.querySelector("#popup-content").classList.add("hidden");
  document.querySelector("#error-content").classList.remove("hidden");
  console.error(`Failed to execute beastify content script: ${error.message}`);
}

/**
 * When the popup loads, inject a content script into the active tab,
 * and add a click handler.
 * If we couldn't inject the script, handle the error.
 */


// document.getElementById("urlinfo").innerText="sdfsdfsdfsd32432";

// document.getElementsByClassName("info")[0].innerHTML = browser.downloads.search({
//   limit: 10,
//   orderBy: ["-startTime"]
// });

//document.body.innerText = "abcd" ;//window.location.href;
// "Page location is " + window.location.href;

//document.body.innerText = "abcd";


browser.tabs.executeScript({file: "/content_scripts/beastify.js"})
.then(listenForClicks)
.catch(reportExecuteScriptError);

// for communication
browser.runtime.onMessage.addListener(notify);

function notify(message) {
  console.log("In message()");
  // document.getElementById("urlinfo").innerText = message.url;

  // var url = 'https://www.pbs.org/video/great-conversations-great-conversations-siddhartha-mukherjee';
  var url_encoded = encodeURIComponent(message.url);

  var apiUrl = 'https://is.gd/create.php?format=json&url=' + url_encoded;
  console.log("URL: " + apiUrl);

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    console.log("http response: " + this.status);

    if (this.readyState == 4 && this.status == 200) {
      console.log(this.response);
      var resp = JSON.parse(this.responseText);
      document.getElementById("urlinfo").innerText = resp.shorturl;
    } else {
      console.log("error");
      console.log(this.response);
    }
  };

  xhttp.open("GET", apiUrl, true);
  xhttp.send();

}



