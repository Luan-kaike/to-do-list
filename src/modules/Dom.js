const { ipcRenderer } = require('electron');

const createItemList = ({id, title, checked}) => {
  const currentList = document.querySelector('body > h1').innerHTML
  const item = document.createElement('li');
  item.setAttribute('id', id);

  const inputTitle = document.createElement('input');
  inputTitle.value = title;
  item.appendChild(inputTitle);

  const inputCheck = document.createElement('input');
  inputCheck.type = 'checkbox';
  inputCheck.checked = checked;
  inputCheck.addEventListener('click', () =>{
    console.log(`/lists/${currentList}/${id}`)
    ipcRenderer.send('API', { 
      params: `/lists/${currentList}/${id}`,
      method: 'put', 
      content: { 
        title: inputTitle.value, 
        checked: inputCheck.checked 
      },
    });
  });
  item.appendChild(inputCheck);

  const buttonDelete = document.createElement('button');
  buttonDelete.innerHTML = 'X';
  buttonDelete.addEventListener('click', () => {
    ipcRenderer.send('API', { 
      params:`/lists/${currentList}/${id}`,
      method: 'delete'
    });
    item.remove();
  });
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
    ipcRenderer.send('API', {
      params: `/lists/${currentList}/newItem`, 
      method: 'post',
      content: { title },
      response: 'newItem'
    });
  };

  const input = document.createElement('input');
  input.placeholder = 'limpar a casa';
  input.addEventListener('keydown', (e) => e.key === 'Enter'? callback(input) : null);
  label.appendChild(input);

  const button = document.createElement('button');
  button.innerHTML = 'criar';
  button.addEventListener('click', () => callback(input));
  label.appendChild(button);
};

module.exports = { populateElement, populateList, createNewItemField }