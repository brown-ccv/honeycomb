/** ELECTRON PRELOAD PROCESS
 *
 * Note this process has access to bot renderer globals (window and document)
 */
const { contextBridge } = require("electron");

// As an example, here we use the exposeInMainWorld API to expose the browsers
// and node versions to the main window.
// They'll be accessible at "window.versions".
process.once("loaded", () => {
  console.log("ONCE");
  contextBridge.exposeInMainWorld("versions", process.versions);
});
