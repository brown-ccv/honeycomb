/** ELECTRON PRELOAD PROCESS */
const { contextBridge } = require("electron");

/** Load bridges between the main and renderer processes when the preload process is first loaded */
process.once("loaded", () => {
  // Tell renderer we're running in electron (window.IN_ELECTRON)
  contextBridge.exposeInMainWorld("IN_ELECTRON", true);
  // TODO: Expose ipcRenderer calls here? Don't want to use window.require("electron")
});
