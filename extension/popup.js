import * as communication from "./communication.js"

let sharingDiv = document.getElementById('share');
let recvDiv = document.getElementById('receive');
let shareButton = document.getElementById('shareButton');
let submitButton = document.getElementById('submit');
let unopenedUrls = [];
shareButton.addEventListener('click', function() {
    // to see logs of from this file, right-click on the button > inspect element
    chrome.tabs.getSelected(null, function(tab){
        share(tab.url);
    });
});

submitButton.addEventListener('click', (data) => {
    communication.sendName(document.getElementById('username').value)
        .catch(communication.handleError.bind(null, "sending name"));
});

function share(url) {
    const chooseText = document.createTextNode("Pick your friend");
    sharingDiv.appendChild(chooseText);
    shareButton.style.display = "none";
    communication.getAddressBook()
        .then((addressBook) => {
            for (let friend of addressBook) {
                const friendButton = document.createElement("button");
                friendButton.innerHTML = friend;
                friendButton.style.background = "white";
                friendButton.style.display = "float:right"
                friendButton.addEventListener('click', function() {
                    console.log("Sharing " + url + " to " + friend);
                    const sharingText = document.createTextNode("Sharing this tab to " + friend + "...");
                    sharingDiv.appendChild(sharingText);
                    communication.sendUrl(url, friend)
                        .catch(communication.handleError.bind(null, "sharing tab"));
                });
                sharingDiv.appendChild(friendButton);
            }
        })

}

export function receiveTabs(sharedTabs) {
    sharingDiv.style.display = "none";
    chrome.tabs.getSelected(null, function(tab){
        if (sharedTabs.length > 0) {
            document.body.appendChild(recvDiv);
            for (let sharedTab of sharedTabs){
                const recvText = document.createTextNode(`${sharedTab[1]} sent a tab\n`);
                recvDiv.appendChild(recvText);
                const openButton = document.createElement("button");
                openButton.innerHTML = "open";
                openButton.style.background  = "green"
                openButton.addEventListener('click', function() {
                    chrome.tabs.create({
                        active: true,
                        url: sharedTab[0],
                    });
                });
                const laterButton = document.createElement("button");
                laterButton.style.background = "orange"
                laterButton.innerHTML = "reject";
                laterButton.addEventListener('click', function() {
                    localStorage.setItem("saved_urls", sharedTab[0])
                    window.close();
                });
                recvDiv.appendChild(openButton);
                recvDiv.appendChild(laterButton);
                recvDiv.style.background = "yellow";
            }
        }
    });
}
