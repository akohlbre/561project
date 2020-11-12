# 561project
## Running
The extension is written to run in Google Chrome, though likely works in Firefox as well.
The easiest way to run it is to install
[`web-ext`]("https://extensionworkshop.com/documentation/develop/getting-started-with-web-ext/"),
and then use the makefile
(`make` or `make build`) to issue the command `web-ext run -t chromium` from the directory named
`extension`.

If you don't want to install `web-ext`, you can directly load the extension into Chrome yourself:
1. Open the Extension Management page by navigating to `chrome://extensions`.
1. Enable Developer Mode by clicking the toggle switch next to Developer mode.
1. Click the LOAD UNPACKED button and select the `extension` directory.

Once the extension is loaded, you can view logging output:
1. Go to `chrome://extensions`
1. Toggle developer mode on
1. Find this extension in the list and click "Details"
1. Under "Inspect views", click "background page"
1. Use the tabs at the top to view console output, network activity, etc

If you use `web-ext`, it will automatically update the extension whenever you edit a file that's
part of the extension. Otherwise, you will need to click the "Update" button on the extension's
page on `chrome://extensions`.
