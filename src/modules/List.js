const fs = require('fs');
const path = require('path');

const listsDb = path.join(__dirname,'..','backend','listsDb.json')

const modificationJson = (manipulate) => {
  return new Promise((resolve, reject) => {
    fs.readFile(listsDb, 'utf-8', (err, data) => {
      !err?? reject(err);

      const {response, dataStr} = manipulate(data);

      fs.writeFile(listsDb, dataStr,'utf-8', (err, data) => {
        !err?? reject(err);

        resolve(response);
      })
    })
  });
}

// GETS
const getAllLists = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(listsDb, 'utf-8', (err, data) => {
      if(err) reject(err);
      resolve(JSON.parse(data));
    })
  })
}

const getList = (list) => {
  return new Promise((resolve, reject) => {
    getAllLists()
    .then(data => resolve(data[list]))
    .catch(err => reject(err));
  })
}

// POSTS
const newItem = (list, title) => {
  return new Promise((resolve, reject) => {
    const manipulate = (data) => {
      const dataJson = JSON.parse(data);
      const newItem = {title, id: dataJson[list].length, checked: false};
      dataJson[list].push(newItem);

      const dataStr = JSON.stringify(dataJson, null, 2);
      return { dataStr, response: newItem };
    };

    modificationJson(manipulate)
    .then(data => resolve(data))
    .catch(err => reject(err));
  });
};

// PUTS
const editItem = (list, id, mod) => {
  return new Promise((resolve, reject) => {
    const manipulate = (data) => {
      const dataJson = JSON.parse(data);
      id = Number.parseInt(id)
      mod.id = id;
      dataJson[list] = dataJson[list].map(i => (i.id === id? mod : i = i) );

      const dataStr = JSON.stringify(dataJson, null, 2);
      return { dataStr, response: mod };
    };
    modificationJson(manipulate)
    .then(data => resolve(data))
    .catch(err => reject(err));
  })
};

// DELETES
const deleteItem = (list, id) => {
  return new Promise((resolve, reject) => {
    const manipulate = (data) => {
      const dataJson = JSON.parse(data);
      dataJson[list] = dataJson[list].filter(i => i.id !== Number.parseInt(id));

      const dataStr = JSON.stringify(dataJson, null, 2);
      return { dataStr, response: 200 };
    };

    modificationJson(manipulate)
    .then(data => resolve(data))
    .catch(err => reject(err));
  });
};

module.exports = { getList, getAllLists, newItem, deleteItem, editItem }