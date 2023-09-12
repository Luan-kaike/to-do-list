const express = require('express');
const app = express();
let port = 3000

const List = require('../modules/List');

app.use(express.json());

app.get('/lists', (req, res) => {
  List.getAllLists()
  .then(data => {
    if(req.query.names) data = Object.keys(data);
    res.send(data);
  })
  .catch(err => res.sendStatus(err));
});

app.get('/lists/:list', (req, res) => {
  const list = req.params.list;
  
  List.getList(list)
  .then(data => res.send(data))
  .catch(err => res.send(err));
});

const createServer = () => {
  const server = app.listen(port, () => {
    console.log(`backend rodando em http://localhost:${port}`);
  });
  
  server.on('error', (err) => {
    if(err.code === 'EADDRINUSE'){
      port += 1
      createServer()
    }
  })
};

module.exports = { createServer }