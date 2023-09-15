const { contextBridge, ipcRenderer } = require('electron')
const Dom = require('./src/modules/Dom');

let currentList = ''
contextBridge.exposeInMainWorld('communicate', {
  API: (params) => {
    ipcRenderer.send('API', params);
  }
});

ipcRenderer.on('populateNav', (e, data) => {
  const nav = document.querySelector('nav > ul');
  nav.innerHTML = '';

  const callback = (e) => {
    currentList = e.target.innerHTML
    const params = `/lists/${e.target.innerHTML}`;
    const method = 'get';
    const content = null;
    const response = 'populateUl';
    ipcRenderer.send('API', { params, method, content, response });
  };

  Dom.populateElement(nav, data, 'li', callback);
});

ipcRenderer.on('populateUl', (e, data) => {
  const callback = (input) => {
    const params = `/lists/${currentList}/newItem`;
    const method = 'post';
    const content = { title: input.value };
    const response = 'newItem';
    input.value  = '';
    ipcRenderer.send('API', { params, method, content, response });
  };
  Dom.createNewItemField(callback);

  const ul = document.querySelector('body > ul');
  ul.innerHTML = '';
  Dom.populateList(ul, data);
});

ipcRenderer.on('newItem', (e, data) => {
  const ul = document.querySelector('body > ul');

  Dom.populateList(ul, data, 1);
});

