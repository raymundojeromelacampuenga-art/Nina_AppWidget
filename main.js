const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("node:path");

let win;
function createWindow() {
  win = new BrowserWindow({
    width: 400,
    height: 460,
    minWidth: 280,
    minHeight: 320,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    resizable: true,
    backgroundColor: "#00000000",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  win.loadFile("index.html");
}

let dragStart = null;
ipcMain.on("window:drag-start", () => {
  if (win) dragStart = win.getBounds();
});
ipcMain.on("window:drag-move", (_e, dx, dy) => {
  if (!win || !dragStart) return;
  win.setBounds({
    x: Math.round(dragStart.x + dx),
    y: Math.round(dragStart.y + dy),
    width: dragStart.width,
    height: dragStart.height,
  });
});

ipcMain.on("window:minimize", () => win?.minimize());
ipcMain.handle("window:is-maximized", () => win?.isMaximized() ?? false);
ipcMain.on("window:maximize", () => {
  if (win && !win.isMaximized()) win.maximize();
});
ipcMain.on("window:unmaximize", () => {
  if (win?.isMaximized()) win.unmaximize();
});
ipcMain.on("window:close", () => win?.close());

app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
