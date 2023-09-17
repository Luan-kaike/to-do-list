const express = require('express');
const app = express();

const List = require('../modules/List');

app.use(express.json());

app.get('/lists', (req, res) => {
  List.getAllLists()
  .then(data => {
    if(req.query.names) data = Object.keys(data);
    res.send(data);
  })
  .catch(err => res.send(err));
});

app.get('/lists/:list', (req, res) => {
  const list = req.params.list;
  
  List.getList(list)
  .then(data => res.send(data))
  .catch(err => res.send(err));
});


app.post('/lists/:list/newItem', (req, res) => {
  const title = req.body.title;
  const list = req.params.list;
  
  List.newItem(list, title)
  .then(data => res.send(data))
  .catch(err => res.send(err));
});


app.delete('/lists/:list/:id', (req, res) => {
  const list = req.params.list;
  const id = req.params.id;
  List.deleteItem(list, id)
  .then(status => res.sendStatus(200))
  .catch(err => res.send(err))
});
const createServer = async () => {
  return new Promise((resolve, reject) => {
    const newPort = (port) => {
      const server = app.listen(port, '::1', () => {
        console.log(`backend rodando em http://localhost:${port}`);
        const Url = server.address()
        resolve(`http://[${Url.address}]:${Url.port}`);
      });

      server.on('error', (err) => {
        if(err.code === 'EADDRINUSE'){
          newPort(port+1)
        }else 
          reject(err);
      })
    }

    newPort(3000)
  })
};

module.exports = { createServer }