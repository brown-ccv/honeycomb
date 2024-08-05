import { contextBridge, ipcRenderer } from "electron";
import log from "electron-log";

log.info("PRELOAD");
/** Load bridges between the main and renderer processes when the preload process is first loaded */
process.once("loaded", () => {
  // TODO: The "loaded" state is never executed for some reason
  console.log("PRELOAD LOADED");
  log.info("PRELOAD LOADED");
  contextBridge.exposeInMainWorld("electronAPI", {
    setConfig: (config) => ipcRenderer.send("setConfig", config),
    setTrigger: (triggerCodes) => ipcRenderer.send("setTrigger", triggerCodes),
    getCredentials: () => ipcRenderer.invoke("getCredentials"),
    getCommit: () => ipcRenderer.invoke("getCommit"),
    on_data_update: (data) => ipcRenderer.send("onDataUpdate", data),
    on_finish: () => ipcRenderer.invoke("onFinish"),
    photodiodeTrigger: (data) => ipcRenderer.send("photodiodeTrigger", data),
    saveVideo: (data) => ipcRenderer.send("saveVideo", data),
    checkSerialPort: () => ipcRenderer.invoke("checkSerialPort"),
  });
});
