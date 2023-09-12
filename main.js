const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const axios = require('axios');
let http

const backend = require('./src/backend/main');
backend.createServer()
.then(baseURL => http = axios.create({ baseURL }))
.catch(err => console.log(err));


require('electron-reload')(__dirname, {
  electron: require(`${__dirname}/node_modules/electron`)
});

let win;
const createWindow = () => {
  win = new BrowserWindow({
    width: 800,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      sandbox: false,
    }
  });

  win.loadFile('./public/index.html');
};

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) 
      createWindow();
  });

  ipcMain.on('closed', () => {
    app.quit();
  });

  ipcMain.on('API', (evet, {params, method, content}) => {
    http[method](params, content)
    .then(({data}) => console.log(data))
    .catch(err => console.log(err));
  })
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') 
    app.quit();
});