const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { readUsers, writeUsers } = require('./fsUserHandler.js');

function createWindow () {

  const win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, 'icon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,

    }
  });

  win.loadURL('http://localhost:5173');



  ipcMain.handle('get-users', () => {
    return readUsers();
  });

  // Handle requests from renderer to add a new user
  ipcMain.handle('add-user', (event, newUser) => {
    const users = readUsers();
    users.push(newUser);  // Add the new user
    writeUsers(users);  // Write back to userData.json
  });

  // Handle requests from renderer to delete a user
  ipcMain.handle('delete-user', (event, userId) => {
    let users = readUsers();
    users = users.filter(user => user.id !== userId);  // Remove the user
    writeUsers(users);  // Write back to userData.json
  });


  // Uncomment this line if you want to open DevTools automatically
  win.webContents.openDevTools();


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
