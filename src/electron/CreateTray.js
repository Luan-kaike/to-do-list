const { Tray } = require('electron');
const { join } = require('path');

const createTray = () => {
  const iconPath = join(__dirname, '..', '..', 'public', 'assets', 'icon-win-512.png');
  const tray = new Tray(iconPath);
  tray.setToolTip('to-do-list');

  return tray;
};

module.exports = createTray();