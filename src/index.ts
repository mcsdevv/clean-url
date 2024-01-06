import { showHUD, Clipboard } from "@raycast/api";

export default async function main() {
  // Get the URL from the clipboard
  const { text: urlDirty } = await Clipboard.read();

  // Replace hxxps with https and [.] with .
  const urlClean = urlDirty
    .toLowerCase()
    .replace(/hxxps/g, "https")
    .replace(/\[\.\]/g, ".")
    .replace(/\[\:\]/g, ":");

  // Copy the cleaned URL back to the clipboard
  await Clipboard.paste(urlClean);

  // Show a notification
  await showHUD("Cleaned URL copied to clipboard");
}
