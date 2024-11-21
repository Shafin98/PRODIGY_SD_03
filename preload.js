const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    showDialog: (options) => ipcRenderer.invoke('show-dialog', options),
});
