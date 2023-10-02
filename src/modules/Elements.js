const icons = require('./Icons');
const { ipcRenderer } = require('electron')

const showAlert = (msg, time=1) => {
  const playSound = () => {
    const audioContext = new window.AudioContext();
    const oscillator = audioContext.createOscillator();
    oscillator.connect(audioContext.destination);

    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    gainNode.gain.value = 0.05;

    oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + .10);
  };
  playSound();
  const alert = document.querySelector('body > span');
  alert.innerHTML = msg;
  const visibleAlert = alert.style.transform === 'translateX(-15vw)'
  visibleAlert? null :alert.style.transform = 'translateX(-15vw)';
  setTimeout(() => alert.style.transform = 'translateX(15vw)', time * 1000);
};

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
    callback? callback() : null;
  });

  return svg;
};

const buttonEdit = (input, callback) => {
  const { svg } = createSvg(icons.edit);

  svg.addEventListener('click', (e) => {
    callback? callback(svg) : null;
    input.disabled = false;
    input.focus();
  });

  return svg;
};

const buttonPlus = (callback) => {
  const { svg } = createSvg(icons.plus);

  svg.addEventListener('click', () => {
    callback(svg);
  });

  return svg;
};

const inputCheck = (checked, params) => {
  const icon = checked? icons.checkTrue : icons.checkFalse;

  const { svg, path } = createSvg(icon);
  svg.setAttribute('checked', '');
  svg.checked = checked;

  svg.addEventListener('click', () => {
    svg.checked = !svg.checked;

    path.setAttribute('d', svg.checked? icons.checkTrue.d : icons.checkFalse.d);

    ipcRenderer.send('API', { 
      params,
      method: 'put',
      content: { 
        checked: svg.checked
      },
    });
  });

  return svg;
};

const inputTitle = (value, params, callback) => {
  const inputTitle = document.createElement('input');
  inputTitle.value = value;
  inputTitle.disabled = true;
  const handleKeyDownInFocus = (e) => {
    inputTitle.disabled = e.key === 'Enter';
  }
  inputTitle.addEventListener('blur', () => {
    callback? callback(inputTitle) : null;
    ipcRenderer.send('API', {
      params,
      method: 'put',
      content: {
        title: inputTitle.value,
      },
    });
    inputTitle.disabled = true;
    inputTitle.removeEventListener('keydown', handleKeyDownInFocus);
  });
  inputTitle.addEventListener('focus', () => {
    inputTitle.addEventListener('keydown', handleKeyDownInFocus);
  });

  return inputTitle;
};

const inputNewLIst = () => {
  const input = document.createElement('input');
  const thisListExist = () => {
    const arrayLi = document.querySelectorAll('nav > ul > li');
    const thisListExist = [...arrayLi].find((l) => {
      const title = l.querySelector('input').value;
      return title === input.value.trim();
    });
    return thisListExist;
  };
  input.addEventListener('keydown', (e) => {
    if(e.key === 'Enter' && input.value.trim() !== ''){
      input.blur();

      const isListExist = thisListExist();
      if(isListExist){
        showAlert('essa lista já existe', 2.5);
        return;
      };

      if(input.value.trim().length > 20){
        showAlert('máximo de 20 caracteres', 2.5);
        return;
      };

      ipcRenderer.send('API', {
        params: `/lists/${input.value.trim()}/newList`,
        method: 'post',
        response: 'newList'
      });
      input.value = '';
    };
  });
  return input;
};

const displayList = (list, callback) => {
  const params = `/lists/${list}`;
  const li = document.createElement('li');
  li.addEventListener('click', () => callback(li));

  const inputCallback = (input) => {
    document.querySelector('aside > h1').innerHTML = input.value;
  };
  const inputList = inputTitle(list, params, inputCallback)
  li.appendChild(inputList);

  const deleteCallback = () => {
    const toHideHomeScreen = () => {
      const div = document.querySelector('body > div');
      setTimeout(() => div.style.zIndex = 1, 1);
    };
    toHideHomeScreen();
    const ul = document.querySelectorAll('nav > ul > li');
    ul.forEach(i => {
      i.querySelector('input').value === inputList.value? i.remove() : null;
    });
  };
  const btnDelete = buttonDelete(params, deleteCallback);
  li.appendChild(btnDelete);

  const editCallback = (btn) => {
    btn.classList.add('disabled');
    setTimeout(() => btn.classList.remove('disabled'), 1000);
  };
  const btnEdit = buttonEdit(inputList, editCallback);
  li.appendChild(btnEdit);

  return li
};

module.exports = { buttonDelete, buttonEdit, inputTitle, inputNewLIst, inputCheck, buttonPlus, displayList, showAlert };