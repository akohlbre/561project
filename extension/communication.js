//const serverAddr = "http://128.112.224.96:8080";
const serverAddr = "http://localhost:8080";

function sendFetch(data, method) {
    if (method === 'POST')
        return fetch(serverAddr, {
            method: method,
            body: JSON.stringify(data),
        });
    return fetch(serverAddr, {
        method: method,
    });
}

export function postData(data) {
    return sendFetch(data, 'POST');
}

export function getData(data) {
    return sendFetch(data, 'GET');
}

export function sendName(name) {
    let toSend = {
        type: "register",
        name: name,
    };
    return postData(JSON.stringify(toSend));
}

export function sendUrl(url, recipientName) {
    let toSend = {
        type: "share",
        url: url,
        recipientName: recipientName,
    };
    return postData(JSON.stringify(toSend));
}

