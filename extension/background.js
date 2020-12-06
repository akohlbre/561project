import * as communication from "./communication.js";
import { receiveTabs } from "./popup.js";
let done = false;

const millisecondsPerSecond = 1000;
//const millisecondsPerSecond = 10000000000;

function sayHello() {
    console.log("Extension running!");
}

function startup() {
    sayHello();
    communication.sendName("Anne")
        .catch(communication.handleError.bind(null, "sending name"));
    communication.getAddressBook()
        .then((addressBook) => {
            console.log("Address Book:", addressBook);
        })
        .catch(communication.handleError.bind(null, "getting address book"));
}

function openSharedTabs() {
    communication.checkForTabs()
        .then((sharedTabs) => {
            receiveTabs(sharedTabs);
        })
        .catch(communication.handleError.bind(null, "sharing tab"));
}

function pollForShares(interval=10) {
    window.setInterval(openSharedTabs, interval * millisecondsPerSecond);
}

startup();
pollForShares();
