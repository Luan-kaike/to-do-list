const { app, ipcMain } = require('electron');
const path = require('path');
const axios = require('axios');

let http
require('../backend/main')
.then(baseURL => http = axios.create({ baseURL }))
.catch(err => console.log(err));

app.whenReady().then(() => {
  const win = require('./CreateWindow.js');
  require('./CreateTray.js');
  win.webContents.openDevTools();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) 
      createWindow();
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') 
      app.quit();
  });

  ipcMain.on('API', (e, {params, method, content, response}) => {
    response? null : response = 'null';
    http[method](params, content)
    .then(({data}) => e.sender.send(response, data))
    .catch(err => console.log(err));
  });

  ipcMain.on('manipulate-window', (e, action) => {
    typeof action === 'object'? win[action[0]][action[1]]() : win[action]();
  });

  ipcMain.on('open-link', (e, link) => {
    const { shell } = require('electron');
    shell.openExternal(link);
  })
});