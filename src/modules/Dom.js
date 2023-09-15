const createItemList = ({id, title, checked}) => {
  const item = document.createElement('li');
  item.setAttribute('id', id);

  const inputTitle = document.createElement('input');
  inputTitle.value = title;
  item.appendChild(inputTitle);

  const inputCheck = document.createElement('input');
  inputCheck.type = 'checkbox';
  inputCheck.checked = checked;
  item.appendChild(inputCheck);

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
    if (element.firstChild) {
      element.insertBefore(item, element.firstChild);
    } else {
      element.appendChild(item);
    }
  });
};

const createNewItemField = (callback) => {
  const label = document.querySelector('body > label');
  label.innerHTML = '';

  const input = document.createElement('input');
  input.placeholder = 'limpar a casa';
  input.addEventListener('keydown', (e) => 
    e.key === 'Enter'? callback(input) : null);
  label.appendChild(input);

  const button = document.createElement('button');
  button.innerHTML = 'criar';
  button.addEventListener('click', () => callback(input));
  label.appendChild(button);
};

module.exports = { populateElement, populateList, createNewItemField }