const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');

function resolveServerUrl() {
  if (process.env.PONG_SERVER_URL) return process.env.PONG_SERVER_URL;
  const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), 'utf8'));
  return config.serverUrl;
}

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 650,
    resizable: true,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
    },
  });

  win.loadURL(resolveServerUrl());
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
