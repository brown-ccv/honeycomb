/** ELECTRON PRELOAD PROCESS */
const { contextBridge, ipcRenderer } = require("electron");

/** Load bridges between the main and renderer processes when the preload process is first loaded */
process.once("loaded", () => {
  // Expose an electronAPI for inter-process communication
  contextBridge.exposeInMainWorld("electronAPI", {
    USE_ELECTRON: true,
    setConfig: (config) => ipcRenderer.send("setConfig", config),
    getCredentials: () => ipcRenderer.invoke("getCredentials"),
  });
});
