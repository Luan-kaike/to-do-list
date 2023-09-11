const express = require('express');
const app = express();
const port = 3000;
const List = require('../modules/List')

app.use(express.json());

app.get('/lists', (req, res) => {
  List.getAllLists()
  .then(data => {
    if(req.query.names) data = Object.keys(data);
    res.send(data);
  })
  .catch(err => res.sendStatus(err));
})

app.get('/lists/:list', (req, res) => {
  const list = req.params.list;
  
  List.getList(list)
  .then(data => res.send(data))
  .catch(err => res.send(err));
})

app.listen(port, () => {
  console.log(`backend rodando em http://localhost:${port}`);
})