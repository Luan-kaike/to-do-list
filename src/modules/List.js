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
const newObj = (list, title, isList) => {
  return new Promise((resolve, reject) => {
    const manipulate = (data) => {
      const dataJson = JSON.parse(data);

      isList? 
        dataJson[list] = [] 
      :
        dataJson[list].push(
          {title, id: `${title}-${dataJson[list].length}`, checked: false}
        );

      const dataStr = JSON.stringify(dataJson, null, 2);
      return { dataStr, response: isList? dataJson[list] : 
        {title, id: `${title}-${dataJson[list].length}`, checked: false} };
    };

    modificationJson(manipulate)
    .then(data => resolve(data))
    .catch(err => reject(err));
  });
};

// PUTS
const editObj = (list, id, mod, isList) => {
  return new Promise((resolve, reject) => {
    const manipulate = (data) => {
      const dataJson = JSON.parse(data);

      if (isList){
        const dataJsonKeys = Object.keys(dataJson);
        const listContentKey = dataJsonKeys.find(l => l === list);
        dataJson[mod] = dataJson[listContentKey];
        delete dataJson[list];
      }else{
        mod.id = id;
        dataJson[list] = dataJson[list].map(i => {
          if(i.id === id){
            typeof mod.checked === 'boolean'? null : mod.checked = i.checked;
            mod.title? null : mod.title = i.title;
            return mod;
          };
          return i;
        });
      }

      const dataStr = JSON.stringify(dataJson, null, 2);
      return { dataStr, response: mod };
    };
    modificationJson(manipulate)
    .then(data => resolve(data))
    .catch(err => reject(err));
  })
};

// DELETES
const deleteObj = (list, id, isList) => {
  return new Promise((resolve, reject) => {
    const manipulate = (data) => {
      const dataJson = JSON.parse(data);

      isList?
        delete dataJson[list]
      :
        dataJson[list] = dataJson[list].filter(i => i.id ==! id);

      const dataStr = JSON.stringify(dataJson, null, 2);
      return { dataStr, response: dataJson[list] };
    };

    modificationJson(manipulate)
    .then(data => resolve(data))
    .catch(err => reject(err));
  });
};

module.exports = { getList, getAllLists, newObj, deleteObj, editObj }