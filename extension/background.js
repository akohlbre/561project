import * as communication from "./communication.js"
let done = false;

const millisecondsPerSecond = 1000;
//const millisecondsPerSecond = 10000000000;

function sayHello() {
    console.log("Extension running!");
}

// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {
    // No tabs or host permissions needed!
    console.log('Turning ' + tab.url + ' red!');

});

function startup() {
    sayHello();
    communication.sendName("Anne");
}

function checkForShares(name) {
    communication.getData(name).then((serverResponse) => {
        serverResponse.text().then((textResponse) => {
            if (textResponse && textResponse != "") {
                chrome.tabs.create({
                    active: true,
                    url: textResponse,
                });
            }
        });
    });
}

function pollForShares(name, interval=10) {
    window.setInterval(checkForShares, interval * millisecondsPerSecond, name);
}

startup();
pollForShares("Anne");
