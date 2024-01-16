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
    .replace(ipRegex, "");

  // Copy the cleaned URL back to the clipboard
  await Clipboard.paste(urlClean);

  // Show a notification
  await showHUD("Cleaned URL copied to clipboard");
}
