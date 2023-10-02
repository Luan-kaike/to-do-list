const { ipcRenderer } = require('electron');
const Elements = require('./Elements');

const createItemList = ({id, title, checked}) => {

  const currentList = document.querySelector('aside > h1').innerHTML;
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
  const currentList = document.querySelector('aside > h1').innerHTML;
  const label = document.querySelector('aside > label');
  label.innerHTML = '';

  const callback = (input) => {
    const tasks = document.querySelectorAll('aside > ul > li > input');
    const title = input.value

    console.log(tasks)
    const isTaskExist = [...tasks]?.find(({value}) => value === title);

    if(!isTaskExist){
      input.value = ''
      ipcRenderer.send('API', {
        params: `/lists/${currentList}/newItem`, 
        method: 'post',
        content: { title },
        response: 'newItem'
      });
    } else {
      Elements.showAlert('essa tarefa já existe');
    };
  };

  const input = document.createElement('input');
  input.placeholder = 'limpar a casa';
  input.addEventListener('keydown', (e) => {
    e.key === 'Enter' && input.value.trim()? callback(input) : null;
  });
  label.appendChild(input);

  const btnAddCallback = () => input.value.trim()? callback(input) : null;
  const buttonAdd = Elements.buttonPlus(btnAddCallback);
  label.appendChild(buttonAdd);
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

module.exports = { populateElement, populateList, createNewItemField, initVerticalBar };