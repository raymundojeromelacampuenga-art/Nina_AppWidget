const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  dragStart: () => ipcRenderer.send("window:drag-start"),
  dragMove: (dx, dy) => ipcRenderer.send("window:drag-move", dx, dy),
  minimize: () => ipcRenderer.send("window:minimize"),
  isMaximized: () => ipcRenderer.invoke("window:is-maximized"),
  maximize: () => ipcRenderer.send("window:maximize"),
  unmaximize: () => ipcRenderer.send("window:unmaximize"),
  close: () => ipcRenderer.send("window:close"),
});
