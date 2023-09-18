const { ipcRenderer } = require('electron');

const createItemList = ({id, title, checked}) => {

  const sendMsgEditBackEnd = (title, checked) => {
    ipcRenderer.send('API', { 
      params: `/lists/${currentList}/${id}`,
      method: 'put', 
      content: { 
        title: title, 
        checked: checked
      },
    });
  }

  const currentList = document.querySelector('body > h1').innerHTML
  const item = document.createElement('li');
  item.setAttribute('id', id);

  const inputTitle = document.createElement('input');
  inputTitle.value = title;
  inputTitle.disabled = true
  inputTitle.addEventListener('blur', (e) => {
    const input = e.target;
    input.disabled = true;
    sendMsgEditBackEnd(input.value, inputCheck.checked)
  });
  item.appendChild(inputTitle);

  const inputCheck = document.createElement('input');
  inputCheck.type = 'checkbox';
  inputCheck.checked = checked;
  inputCheck.addEventListener('click', () =>
    sendMsgEditBackEnd(inputTitle.value, inputCheck.checked));
  item.appendChild(inputCheck);

  const buttonEdit = document.createElement('button');
  buttonEdit.innerHTML = 'EDIT'
  buttonEdit.addEventListener('click', () => {
    inputTitle.disabled = !inputTitle.disabled;
    inputTitle.disabled? inputTitle.blur() : inputTitle.focus()
  })
  item.appendChild(buttonEdit);

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