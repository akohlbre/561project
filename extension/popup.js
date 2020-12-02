import * as communication from "./communication.js"

let shareButton = document.getElementById('shareButton');

shareButton.addEventListener('click', function() {
    // to see logs of from this file, right-click on the button > inspect element
    console.log("Popup working");
    chrome.tabs.getSelected(null, function(tab){
        console.log(tab.url);
        const sharingDiv = document.createElement("div");
        const sharingText = document.createTextNode("Sharing this tab to Anne...");
        sharingDiv.appendChild(sharingText);
        document.body.appendChild(sharingDiv);
        shareTo("Anne", tab.url);
    });

})

function shareTo(name, url) {
    console.log("Sharing " + url + " to Anne");
    communication.sendUrl(url, name)
            .catch(communication.handleError.bind(null, "sharing tab"));
}
