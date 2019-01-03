browser.contextMenus.create({
    id: "ext_shorturl_is-gd",
    title: "Copy short URL to clipboard",
    contexts: ["all"]
});

browser.runtime.onMessage.addListener(function (message) {
    navigator.clipboard.writeText(message.isgdurl).then(function () {
        /* clipboard successfully set */
    }, function () {
        /* clipboard write failed */
        // console.log("error");
    });
});


var reportExecuteScriptError = function() {
    // nothing
    return;
};


browser.contextMenus.onClicked.addListener(function(info, tab) {
    switch (info.menuItemId) {
        case "ext_shorturl_is-gd":
            console.log("right clicked");
            browser.tabs.executeScript({file: "/content_scripts/contentscript.js"})
                .catch(reportExecuteScriptError);

            break;
    }
});

