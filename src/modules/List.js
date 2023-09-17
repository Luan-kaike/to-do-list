const fs = require('fs');
const path = require('path');

const listsDb = path.join(__dirname,'..','backend','listsDb.json')

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


const newItem = (list, title) => {
  return new Promise((resolve, reject) => {
    fs.readFile(listsDb, 'utf-8', (err, data) => {
      !err?? reject(err);

      const dataJson = JSON.parse(data);
      const newItem = {title, id: dataJson[list].length, checked: false}
      dataJson[list].unshift(newItem);
      const dataStr = JSON.stringify(dataJson, null, 2);

      fs.writeFile(listsDb, dataStr,'utf-8', (err, data) => {
        !err?? reject(err);

        resolve(newItem);
      })
    })
  });
};


const deleteItem = (list, id) => {
  return new Promise((resolve, reject) => {
    fs.readFile(listsDb, 'utf-8', (err, data) => {
      !err?? reject(err);

      const dataJson = JSON.parse(data);
      console.log(dataJson[list], typeof id)
      dataJson[list] = dataJson[list].filter(i => i.id !== Number.parseInt(id))
      console.log()
      console.log(dataJson[list])
      const dataStr = JSON.stringify(dataJson, null, 2);

      fs.writeFile(listsDb, dataStr,'utf-8', (err, data) => {
        !err?? reject(err);

        resolve(200);
      })
    })
  });
};

module.exports = { getList, getAllLists, newItem, deleteItem }