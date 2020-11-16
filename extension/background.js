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
}

startup();
