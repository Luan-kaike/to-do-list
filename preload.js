const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('communicate', {
  API: (params) => {
    console.log(`in contextBridgeProcess: ${JSON.stringify(params)}`)
    ipcRenderer.send('API', params);
  }
});

