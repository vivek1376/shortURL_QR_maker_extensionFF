// window.myglobalvar = "globalval";



browser.contextMenus.create({
    id: "ext_shorturl_is-gd",
    title: "Copy short URL to clipboard",
    contexts: ["all"]
});

var reportExecuteScriptError = function() {
    return;
};

browser.contextMenus.onClicked.addListener(function(info, tab) {
    switch (info.menuItemId) {
        case "ext_shorturl_is-gd":
            console.log("right clicked");
            // console.log(window.location.href);
            // console.log("val" + custom_var);
            browser.tabs.executeScript({file: "/content_scripts/contentscript.js"})
                .catch(reportExecuteScriptError);

            browser.runtime.onMessage.addListener(function (message) {
                console.log(message.url);
            });

            break;
    }
});

