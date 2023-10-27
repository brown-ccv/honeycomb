const { contextBridge, ipcRenderer } = require("electron");

/** Load bridges between the main and renderer processes when the preload process is first loaded */
process.once("loaded", () => {
  contextBridge.exposeInMainWorld("electronAPI", {
    USE_ELECTRON: true,
    setConfig: (config) => ipcRenderer.send("setConfig", config),
    setTrigger: (triggerCodes) => ipcRenderer.send("setTrigger", triggerCodes),
    getCredentials: () => ipcRenderer.invoke("getCredentials"),
    on_data_update: (data) => ipcRenderer.send("onDataUpdate", data),
    on_finish: () => ipcRenderer.send("onFinish"),
    photodiodeTrigger: () => ipcRenderer.send("photodiodeTrigger"),
    saveVideo: (data) => ipcRenderer.send("saveVideo", data),
    checkEegPort: () => ipcRenderer.invoke("checkEegPort"),
  });
});
