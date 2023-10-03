const { contextBridge, ipcRenderer } = require('electron');
const Dom = require('../modules/Dom');
const { displayList } = require('../modules/Elements');

contextBridge.exposeInMainWorld('communicate', {
  API: (params) => {
    ipcRenderer.send('API', params);
  },
  ACTION: (action) => {
    ipcRenderer.send('manipulate-window', action);
  },
});

const listCallback = (li) => {
  const input = li.querySelector('input');
  const list = input.value;
  document.querySelector('aside > h1').innerHTML = list;
  document.querySelector('body > div').style.zIndex = -1;

  document.querySelectorAll('nav > ul > li').forEach(l => {
    l.style.transform = ''
  });
  li.style.transform = 'translateX(5px)';
  ipcRenderer.send('API', { 
    params: `/lists/${list}`,
    method: 'get',
    content: '', 
    response: 'populateUl' 
  });
};

ipcRenderer.on('populateNav', (e, data) => {
  Array.isArray(data)? data : data = [data];
  const nav = document.querySelector('nav > ul');

  data.forEach(d => {
    const li = displayList(d, listCallback);
    nav.appendChild(li);
  });

  Dom.initBarTitle();
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

  const newList = displayList(data, listCallback);
  nav.appendChild(newList);
});

document.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  ipcRenderer.send('manipulate-window', ['webContents', 'openDevTools']);
})
