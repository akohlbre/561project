
let shareButton = document.getElementById('shareButton');
shareButton.addEventListener('click', function() {
  // to see logs of from this file, right-click on the button > inspect element
  console.log("Popup working");
  chrome.tabs.getSelected(null, function(tab){
      console.log(tab.url);
      const sharingDiv = document.createElement("div");
      const sharingText = document.createTextNode("Sharing this tab to Pi...");
      sharingDiv.appendChild(sharingText);
      document.body.appendChild(sharingDiv);
      shareTo("pi", tab.url);
  });

})
const net = require('net');
function shareTo(name, url) {
  console.log("Sharing " + url + " to Pi");
  const client = new net.Socket();
  client.connect({ port: 10000 }, "ec2-3-22-221-12.us-east-2.compute.amazonaws.com", () => {
    client.write("Hi Pi");
  });
  client.on('data', (data) => {
    console.log("Server says: ${data.toString('utf-8')}");
    client.destroy();
  });
}
