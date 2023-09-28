const { contextBridge, ipcRenderer } = require('electron');
const Dom = require('./src/modules/Dom');

contextBridge.exposeInMainWorld('communicate', {
  API: (params) => {
    ipcRenderer.send('API', params);
  },
  init: () => Dom.initVerticalBar()
});

ipcRenderer.on('populateNav', (e, data) => {
  const nav = document.querySelector('nav > ul');
  nav.innerHTML = '';

  const callback = (e) => {
    const list = e.target.innerHTML
    document.querySelector('body > h1 > input').value = list
    ipcRenderer.send('API', { 
      params: `/lists/${list}`, 
      method: 'get', 
      content: '', 
      response: 'populateUl' 
    });
  };

  Dom.populateElement(nav, data, 'li', callback);
});

ipcRenderer.on('populateUl', (e, data) => {
  Dom.createNewItemField();

  const ul = document.querySelector('body > ul');
  ul.innerHTML = '';
  Dom.populateList(ul, data);

  Dom.createMainTitle();
});

ipcRenderer.on('newItem', (e, data) => {
  const ul = document.querySelector('body > ul');

  Dom.populateList(ul, data, 1);
});

ipcRenderer.on('newList', (e, data) => {
  const nav = document.querySelector('nav > ul');
  const callback = (e) => {
    const list = e.target.innerHTML
    document.querySelector('body > h1 > input').value = list
    ipcRenderer.send('API', { 
      params: `/lists/${list}`, 
      method: 'get', 
      content: '', 
      response: 'populateUl' 
    });
  };
  console.log(data)
  Dom.populateElement(nav, data, 'li', callback);
});

