const { app, BrowserWindow } = require('electron');
import { readUsers, writeUsers } from './fsUserHandler.js';
const path = require('path');
function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, 'icon.ico'),
    webPreferences: {
      nodeIntegration: true
    }
  });

  win.loadURL('http://localhost:5173');



  // Uncomment this line if you want to open DevTools automatically
  // win.webContents.openDevTools();
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
