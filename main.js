const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { exec } = require('child_process');


// init backend

const backend = exec('node src/backend/main.js', (error, stdout, stderr) => {
  if (error) {
    console.error(`Erro: ${error}`);
    return;
  }
  console.log(`Saída padrão: ${stdout}`);
  console.error(`Saída de erro: ${stderr}`);
});

process.on('exit', () => {
  backend.kill();
});


// init frontend

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

  ipcMain('getListsNames')
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') 
    app.quit();
});