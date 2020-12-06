//const serverAddr = "http://128.112.224.96:8080";
const serverAddr = "http://localhost:8080";

function sendFetch(data, method, path) {
    let options;
    if (method === 'POST') {
        options = {
            method: method,
            body: JSON.stringify(data),
        };
    } else {
        options = {
            method: method,
        }
    }
    return new Promise((resolve, reject) => {
        fetch(serverAddr.concat(path ? path : ""), options)
            .then((response) => {
                response.json()
                    .then((reply) => {
                        if ("error" in reply) reject(reply);
                        else resolve(reply);
                    })
                    .catch(handleError.bind(null, "decoding JSON response"));
            })
            .catch(reject);
    });
}

function postData(data) {
    return sendFetch(data, 'POST');
}

function getData(path) {
    return sendFetch(null, 'GET', path);
}

/* prints error message
 * params: context: a string of what was supposed to be happening
 *         error: the object returned from a fetch call
 * returns: nothing
 */
export function handleError(context, error) {
    console.log(`Error ${context}: ${"error" in error ? error["error"] : error}`);
}

/* get a list of tabs shared for this user
 * params: none
 * returns: a Promise that resolves with an array of shared tabs
 *          tabs are arrays with two elements: 1. url 2. name of sender
 *          e.g.: one shared tab might look like ["https://google.com", "Anne"]
 */
export function checkForTabs() {
    return new Promise((resolve, reject) => {
        getData("/checkTabs")
            .then((response) => {
                if ("urls" in response) resolve(response["urls"]);
            })
            .catch(reject);
    });
}

/* get a list of all the names of registered users
 * params: none
 * returns: a Promise that resolves with an array of strings
 */
export function getAddressBook() {
    return new Promise((resolve, reject) => {
        getData("/checkNames")
            .then((response) => {
                if ("allNames" in response) resolve(response["allNames"]);
            })
            .catch(reject);
    });
}

/* register self as a client
 * params: name: string of this user's name
 * returns: a Promise that resolves with the server's response
 */
export function sendName(name) {
    let toSend = {
        type: "register",
        name: name,
    };
    return postData(JSON.stringify(toSend));
}

/* share a tab to another user
 * params: url: a string of the url to share
 *         recipientName: a string of the name of the recipient
 */
export function sendUrl(url, recipientName) {
    let toSend = {
        type: "share",
        url: url,
        recipientName: recipientName,
    };
    return postData(JSON.stringify(toSend));
}
