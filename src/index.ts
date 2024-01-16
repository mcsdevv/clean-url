const opn = require("better-opn");
const validUrl = require("valid-url");
import { showHUD, Clipboard } from "@raycast/api";

export default async function main() {
  // Get the URL from the clipboard
  const { text: urlDirty } = await Clipboard.read();

  const ipRegex =
    /\[?\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b\]?/g;

  const urlClean = urlDirty
    .toLowerCase()
    .replace(/hxxps/g, "https")
    .replace(/hxxp/g, "http")
    .replace(/\[\.\]/g, ".")
    .replace(/\[dot\]/g, ".")
    .replace(/\[\:\]/g, ":")
    .replace(ipRegex, "")
    .replace(/- /g, "-")
    .replace(/\. /g, ".");

  try {
    // Check to see if the URL is valid else throw
    if (!validUrl.isUri(urlClean)) {
      throw new Error("invalid-url");
    }

    // Open the URL in the default browser
    opn(urlClean);

    // Show a notification
    await showHUD("New tab opened 🎉");

    // Error handling
  } catch (error) {
    // @ts-ignore
    switch (error.message) {
      case "invalid-url":
        await showHUD("Invalid URL found 🚫 - " + urlClean);
        break;
      default:
        // @ts-ignore
        await showHUD("Error 🚫" + error.message);
        break;
    }
  }
}
