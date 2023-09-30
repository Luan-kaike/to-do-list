const { contextBridge, ipcRenderer } = require('electron');
const Dom = require('./src/modules/Dom');
const Elements = require('./src/modules/Elements');

contextBridge.exposeInMainWorld('communicate', {
  API: (params) => {
    ipcRenderer.send('API', params);
  }
});

ipcRenderer.on('populateNav', (e, data) => {
  Array.isArray(data)? data : data = [data];
  const nav = document.querySelector('nav > ul');

  const callback = (li) => {
    const input = li.querySelector('input');
    const list = input.value;
    document.querySelector('aside > h1').innerHTML = list;
    ipcRenderer.send('API', { 
      params: `/lists/${list}`,
      method: 'get',
      content: '', 
      response: 'populateUl' 
    });
  };
  data.forEach(d => {
    const li = Elements.displayList(d, callback);
    nav.appendChild(li);
  });

  Dom.initVerticalBar();
});

ipcRenderer.on('populateUl', (e, data) => {
  Dom.createNewItemField();

  const ul = document.querySelector('aside > ul');
  ul.innerHTML = '';
  Dom.populateList(ul, data);
});

ipcRenderer.on('newItem', (e, data) => {
  const ul = document.querySelector('aside > ul');

  Dom.populateList(ul, data, 1);
});

ipcRenderer.on('newList', (e, data) => {
  const nav = document.querySelector('nav > ul');

  const callback = (li) => {
    const input = li.querySelector('input');
    const list = input.value;
    document.querySelector('aside > h1').innerHTML = list;
    ipcRenderer.send('API', { 
      params: `/lists/${list}`,
      method: 'get',
      content: '', 
      response: 'populateUl' 
    });
  };
  const newList = Elements.displayList(data, callback);
  nav.appendChild(newList);
});

