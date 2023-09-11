const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('communicate', {
  closedApp: () => {
    ipcRenderer.send('closed');
  }
});

