const { BrowserWindow } = require('electron')
const { join } = require('path')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 800,
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      contextIsolation: true,
      sandbox: false,
      frame: false
    }
  });

  win.loadFile('public/index.html');

  return win;
};

module.exports = createWindow();