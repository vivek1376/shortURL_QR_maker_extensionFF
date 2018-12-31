


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
browser.tabs.executeScript({file: "/content_scripts/beastify.js"})
  .catch(reportExecuteScriptError);

// for communication
browser.runtime.onMessage.addListener(notify);

function notify(message) {

  var isgdUrl = "";

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

  xhttp.onreadystatechange = function() {
    console.log("http response: " + this.status);

    if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
      console.log(this.response);
      var resp = JSON.parse(this.responseText);
      if (resp.hasOwnProperty('shorturl')) {
        isgdUrl = resp.shorturl;
        var isgdUrlNoHttp = isgdUrl.substring(8);

        document.getElementById("urlinfo").innerText = isgdUrlNoHttp;


        //
        // var xhttp2 = new XMLHttpRequest();
        //
        // if (!xhttp2) {
        //   return false;
        // }
        //
        //
        // xhttp2.onload = function(ovent) {
        //   // var blob = new Blob([this.response], {type: 'image/png'});
        //   // var blob = xhttp2.response;
        //
        //   console.log("onload function");
        //
        //
        //   var imageEl = document.getElementById("qrimg");
        //   imageEl.src = this.
        //
        //   //for downlaoding
        //   // var a = document.createElement("a");
        //   // a.style = "display: none";
        //   // document.body.appendChild(a);
        //   // var url = window.URL.createObjectURL(blob);
        //   //
        //   // a.href = url;
        //   // a.download = 'myqrimage.png';
        //   //
        //   // a.click();
        //   //
        //   // window.URL.revokeObjectURL(url);
        // };
        //
        url2 = 'https://chart.googleapis.com/chart?cht=qr&chs=500x500&chld=M|0&chl='
          + encodeURIComponent(isgdUrl);

        console.log(url2);
        // xhttp2.open("GET", url2, true);
        // xhttp2.setRequestHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        // xhttp2.responseType = 'arraybuffer'; //'blob';
        // xhttp2.send();


        var image = document.getElementById("qrimg");
        var downloadingImage = new Image();

        downloadingImage.onload = function(){
          image.src = this.src;

        };

        downloadingImage.src =  url2;
      }
    } else {
      console.log("error");
      console.log(this.response);
    }
  };


  xhttp.open("GET", apiUrl, true);
  xhttp.setRequestHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  xhttp.send();





}



