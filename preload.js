const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  invoke: (channel, data) => ipcRenderer.invoke(channel, data),
  getUsers: () => ipcRenderer.invoke('get-users'),
  addUser: (newUser) => ipcRenderer.invoke('add-user', newUser),
  deleteUser: (userId) => ipcRenderer.invoke('delete-user', userId),
  createFolderAndFile: (tabData) => ipcRenderer.invoke('create-folder-and-file', tabData),
  getTabs: () => ipcRenderer.invoke('get-tabs'),
  deleteTab: (tabId) => ipcRenderer.invoke('delete-tabs', tabId),
  addMeasure: (measureData) => ipcRenderer.invoke('addMeasure', measureData),
  deleteMeasure: (deleteMeasure) => ipcRenderer.invoke('deleteMeasure', deleteMeasure),
  moveFolder: (folderName, folderDate) => ipcRenderer.invoke("move-folder-to-archive", folderNam, folderDate),
});

