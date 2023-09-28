const { ipcRenderer } = require('electron');
const Elements = require('./Elements')

const createItemList = ({id, title, checked}) => {

  const currentList = document.querySelector('body > h1 > input').value;
  const paramsEdit = `/lists/${currentList}/${id}`;
  const item = document.createElement('li');

  const inputCheck = Elements.inputCheck(checked, paramsEdit)
  item.appendChild(inputCheck);

  const inputTitle = Elements.inputTitle(title, paramsEdit);
  item.appendChild(inputTitle);

  const buttonEdit = Elements.buttonEdit(inputTitle);
  item.appendChild(buttonEdit);

  const deleteCallback = () => item.remove();
  const buttonDelete = Elements.buttonDelete(paramsEdit, deleteCallback);
  item.appendChild(buttonDelete);

  return item;
};

const populateElement = (dadElement, content, tag='span', callback) => {
  Array.isArray(content)? content : content = [content];
  
  content.forEach(c => {
    const childElement = document.createElement(tag);
    c? childElement.innerHTML = c : null;
    callback? childElement.addEventListener('click', callback) : null;
    dadElement.appendChild(childElement);
  });
};

const populateList = (element, data) => {
  Array.isArray(data)? data : data = [data];

  data.forEach(d => {
    const item = createItemList(d);
    element.firstChild? element.insertBefore(item, element.firstChild)
      : element.appendChild(item);
  });
};

const createNewItemField = () => {
  const currentList = document.querySelector('body > h1 > input').value;
  const label = document.querySelector('body > label');
  label.innerHTML = '';

  const callback = (input) => {
    const title = input.value
    input.value = ''
    ipcRenderer.send('API', {
      params: `/lists/${currentList}/newItem`, 
      method: 'post',
      content: { title },
      response: 'newItem'
    });
  };

  const input = document.createElement('input');
  input.placeholder = 'limpar a casa';
  input.addEventListener('keydown', (e) => e.key === 'Enter' && input.value.trim()
    ? callback(input) : null);
  label.appendChild(input);

  const btnAddCallback = () => input.value.trim()? callback(input) : null;
  const buttonAdd = Elements.buttonPlus(btnAddCallback);
  label.appendChild(buttonAdd);
};

const createMainTitle = () => {
  const contentTitle = document.querySelector('body > h1 > span');
  const inputList = document.querySelector('body > h1 > input');
  const elementList = document.querySelector('body > ul');

  contentTitle.innerHTML = '';
  const params = `/lists/${inputList.value}`;

  const inputCallback = () => {
    const nav = document.querySelectorAll('nav > ul > li')
    const inputList = document.querySelector('body > h1 > input');
    nav.forEach(l => {
      l.innerHTML === inputList.oldValue? l.innerHTML = inputList.value : null;
    });
    inputList.oldValue = inputList.value
  };
  Elements.inputTitle(inputList.value, params, inputCallback, inputList);
  inputList.setAttribute('oldValue', '');
  inputList.oldValue = inputList.value;

  const deleteCallback = () => {
    const nav = document.querySelectorAll('nav > ul > li');
    nav.forEach(l => l.innerHTML === inputList.value? l.remove() : null);
    inputList.value = 'uma lista';
    elementList.innerHTML = '';
    document.querySelector('body > label').innerHTML = '';
  };
  const buttonDelete = Elements.buttonDelete(params, deleteCallback);
  contentTitle.appendChild(buttonDelete);

  const editCallback = (btn) => {
    btn.classList.add('disabled');
    setTimeout(() => btn.classList.remove('disabled'), 1000);
  };
  const btnEdit = Elements.buttonEdit(inputList, editCallback);
  contentTitle.appendChild(btnEdit);
};

const initVerticalBar = () => {
  const label = document.querySelector('nav > label');

  const input = Elements.inputNewLIst()
  input.placeholder = 'nova lista';
  label.appendChild(input);

  const callback = () => {
    const eventKeyEnter = new KeyboardEvent('keydown', { key: 'Enter' });
    input.dispatchEvent(eventKeyEnter);
  };
  const btnPlus = Elements.buttonPlus(callback);
  label.appendChild(btnPlus);
};

module.exports = { populateElement, populateList, createNewItemField, createMainTitle, initVerticalBar };