const opn = require("better-opn");
const validUrl = require("valid-url");
import { showHUD, Clipboard } from "@raycast/api";

export default async function main() {
  // Get the URL from the clipboard
  const { text: urlDirty } = await Clipboard.read();

  // Regex to remove IP addresses from the URL
  const ipRegex =
    /\[?\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b\]?/g;

  const urlClean = urlDirty
    .toLowerCase()
    .replace(/hxxps/g, "https")
    .replace(/hxxp/g, "http")
    .replace(/\[\.\]/g, ".")
    .replace(/\[dot\]/g, ".")
    .replace(/\(\.\)/g, ".")
    .replace(/\[\:\]/g, ":")
    .replace(ipRegex, "")
    .replace(/- /g, "-")
    .replace(/\. /g, ".")
    .replace(/^\s+|\s+$/g, "");

  let urlWithProtocol = urlClean;

  if (!/^https?:\/\//i.test(urlClean)) {
    urlWithProtocol = "https://" + urlClean;
  }

  // Copy the cleaned URL to the clipboard (mainly for debugging)
  await Clipboard.copy(urlWithProtocol);

  try {
    // Check to see if the URL is valid else throw
    if (!validUrl.isUri(urlWithProtocol)) {
      throw new Error("invalid-url");
    }

    // Open the URL in the default browser
    opn(urlWithProtocol);

    // Show a notification
    await showHUD("New tab opened 🎉");

    // Error handling
  } catch (error) {
    // @ts-ignore
    switch (error.message) {
      case "invalid-url":
        await showHUD("Invalid URL found 🚫 - " + urlWithProtocol);
        break;
      default:
        // @ts-ignore
        await showHUD("Error 🚫" + error.message);
        break;
    }
  }
}
