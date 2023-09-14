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
  data.forEach(d => {
    const item = createItemList(d);
    element.appendChild(item);
  })
}

module.exports = { populateElement, populateList }