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
    });
});


browser.contextMenus.onClicked.addListener(function(info, tab) {
    switch (info.menuItemId) {
        case "ext_shorturl_is-gd":
            browser.tabs.executeScript({file: "/content_scripts/contentscript.js"})
                .catch(function () {
                    // nothing
                });

            break;
    }
});

