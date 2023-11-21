const { contextBridge, ipcRenderer } = require("electron");

/** Load bridges between the main and renderer processes when the preload process is first loaded */
process.once("loaded", () => {
  contextBridge.exposeInMainWorld("electronAPI", {
    setConfig: (config) => ipcRenderer.send("setConfig", config),
    getCredentials: () => ipcRenderer.invoke("getCredentials"),
    on_data_update: (data) => ipcRenderer.send("onDataUpdate", data),
    on_finish: () => ipcRenderer.send("onFinish"),
    photodiodeTrigger: () => ipcRenderer.send("photodiodeTrigger"),
    saveVideo: (data) => ipcRenderer.send("saveVideo", data),
  });
});
