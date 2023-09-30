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
  const thisListExist = (list) => {
    const arrayLi = document.querySelectorAll('nav > ul > li');
    const thisListExist = [...arrayLi].find((l) => l.innerHTML === list);
    return thisListExist;
  } 
  input.addEventListener('keydown', (e) => {
    if(e.key === 'Enter' && input.value.trim() !== ''){
      input.blur();
      const ListExist = thisListExist(input.value);

      if(ListExist){
        input.style.border = '2px solid #f00';
        return;
      };

      ipcRenderer.send('API', {
        params: `/lists/${input.value}/newList`,
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
  li.addEventListener('click', () => callback(li))

  const inputCallback = (input) => {
    document.querySelector('aside > h1').innerHTML = input.value;
  };
  const inputList = inputTitle(list, params, inputCallback)
  li.appendChild(inputList);

  const deleteCallback = () => {
    const ul = document.querySelectorAll('nav > ul > li');
    ul.forEach(i => {
      i.querySelector('input').value === inputList.value? i.remove() : null;
    });
    document.querySelector('aside > label').innerHTML = '';
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

module.exports = { buttonDelete, buttonEdit, inputTitle, inputNewLIst, inputCheck, buttonPlus, displayList };