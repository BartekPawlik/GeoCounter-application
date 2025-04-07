const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  getUsers: () => ipcRenderer.invoke('get-users'),
  addUser: (newUser) => ipcRenderer.invoke('add-user', newUser),
  deleteUser: (userId) => ipcRenderer.invoke('delete-user', userId),
});