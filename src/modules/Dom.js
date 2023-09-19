const { ipcRenderer } = require('electron');
const elements = require('./Elements')

const createItemList = ({id, title, checked}) => {

  const currentList = document.querySelector('body > h1').innerHTML;
  const paramsEdit = `/lists/${currentList}/${id}`;
  const item = document.createElement('li');

  const inputCheck = elements.inputCheck(checked, paramsEdit)
  item.appendChild(inputCheck);

  const inputTitle = elements.inputTitle(title, paramsEdit);
  item.appendChild(inputTitle);

  const buttonEdit = elements.buttonEdit(inputTitle);
  item.appendChild(buttonEdit);

  const deleteCallback = () => item.remove();
  const buttonDelete = elements.buttonDelete(item, paramsEdit, deleteCallback);
  item.appendChild(buttonDelete);

  return item;
}

const populateElement = (dadElement, content, tag='span', callback) => {
  Array.isArray(content)? content : content = [content];
  
  content.forEach(c => {
    const childElement = document.createElement(tag);
    childElement.innerHTML = c;
    childElement.addEventListener('click', callback);
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
  const currentList = document.querySelector('body > h1').innerHTML;
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

  const button = document.createElement('button');
  button.innerHTML = 'criar';
  button.addEventListener('click', () => input.value.trim()? 
    callback(input) : null);
  label.appendChild(button);
};

module.exports = { populateElement, populateList, createNewItemField }