const { contextBridge, ipcRenderer } = require('electron')
const Dom = require('./src/modules/Dom');

contextBridge.exposeInMainWorld('communicate', {
  API: (params) => {
    ipcRenderer.send('API', params);
  }
});

ipcRenderer.on('populateNav', (e, data) => {
  const nav = document.querySelector('nav > ul');
  nav.innerHTML = ''
  const callback = (e) => {
    const params = `/lists/${e.target.innerHTML}`
  const method = 'get'
  const content = null
  const response = 'populateNav'
  ipcRenderer.send('API', { params, method, content, response });
  };

  Dom.populateElement(nav, data, 'li', callback);
})

