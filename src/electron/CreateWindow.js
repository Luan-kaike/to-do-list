const { BrowserWindow } = require('electron')
const { join } = require('path')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 800,
    minWidth: 600,
    minHeight: 600,
    frame: false,
    icon: join(__dirname, 'public', 'assets', 'icon-win-512.ico'),
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      contextIsolation: true,
      sandbox: false,
    },
  });

  win.loadFile('public/index.html');

  return win;
};

module.exports = createWindow();