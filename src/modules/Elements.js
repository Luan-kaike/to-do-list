const icons = require('./Icons');
const { ipcRenderer } = require('electron')

const createSvg = (icon) => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute('xmlns', "http://www.w3.org/2000/svg");
  svg.setAttribute('viewBox', icon.viewBox);
  svg.setAttribute('height', '1rem');

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', icon.d);
  svg.appendChild(path);

  return { path, svg };
};

const buttonDelete = (params, callback) => {
  const { svg } = createSvg(icons.trash);
  
  svg.addEventListener('click', () => {
    ipcRenderer.send('API', { 
      params: params,
      method: 'delete'
    });
    callback();
  });

  return svg;
};

const buttonEdit = (input) => {
  const { svg } = createSvg(icons.edit);

  svg.addEventListener('click', () => {
    input.disabled = false;
    input.focus();
  });

  return svg;
};

const inputTitle = (title, params) => {
  const inputTitle = document.createElement('input');
  inputTitle.value = title;
  inputTitle.disabled = true;
  const handleKeyDownInFocus = (e) => {
    inputTitle.disabled = e.key === 'Enter'
  }
  inputTitle.addEventListener('blur', () => {
    ipcRenderer.send('API', { 
      params,
      method: 'put', 
      content: {
        title: inputTitle.value,
      },
    });
    inputTitle.disabled = true
    inputTitle.removeEventListener('keydown', handleKeyDownInFocus);
  })
  inputTitle.addEventListener('focus', () => {
    inputTitle.addEventListener('keydown', handleKeyDownInFocus);
  });

  return inputTitle;
};

const inputCheck = (checked, params) => {
  const inputCheck = document.createElement('input');
  inputCheck.type = 'checkbox';
  inputCheck.checked = checked;
  inputCheck.addEventListener('click', () => {
    ipcRenderer.send('API', { 
      params,
      method: 'put', 
      content: { 
        checked: inputCheck.checked
      },
    });
  });

  return inputCheck;
};

module.exports = { buttonDelete, buttonEdit, inputTitle, inputCheck }