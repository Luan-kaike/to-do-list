const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

app.get('/task', (req, res) => {
  const list = req.query.list
  res.send(list)
})

app.listen(port, () => {
  console.log(`backend rodando em http://localhost:${port}/`);
})