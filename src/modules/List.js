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

module.exports = { getList, getAllLists }