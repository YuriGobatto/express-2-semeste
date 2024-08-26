var express = require('express');
var router = express.Router();
var fs = require('fs')

if (!fs.existsSync('users.json')) {
  fs.writeFileSync('users.json', JSON.stringify({id: 0, items: []}))
}

/* GET users listing. */
router.get('/', function(req, res, next) {
  const data = JSON.parse(fs.readFileSync('users.json', 'utf-8'))
  res.json(data.items)
});

router.get('/:id', function(req, res, next) {
  const id = parseInt(req.params.id, 10)
  const data = JSON.parse(fs.readFileSync('users.json', 'utf-8'))
  const entity = data.items.find(d => d.id === id)
  if (!entity) {
    res.status(404).json({ message: 'Não foi possível encontrar o usuário' })
  }
  res.json(entity)
});

router.post('/', function(req, res, next) {
  const body = req.body
  const data = JSON.parse(fs.readFileSync('users.json', 'utf-8'))
  const lastId = data.id + 1
  body.id = lastId
  data.id = lastId
  data.items.push(body)
  fs.writeFileSync('users.json', JSON.stringify(data))
  res.status(201).json(body)
});

router.put('/:id', function(req, res, next) {
  const id = parseInt(req.params.id, 10)
  const data = JSON.parse(fs.readFileSync('users.json', 'utf-8'))
  const index = data.items.findIndex(d => d.id === id)
  if (index < 0) {
    res.status(404).json({ message: 'Não foi possível encontrar o usuário' })
  }

  let entity = data.items[index]
  const body = req.body
  entity = { ...entity, ...body }
  data.items[index] = entity
  fs.writeFileSync('users.json', JSON.stringify(data))
  res.status(200).json(entity)
});

router.delete('/:id', function(req, res, next) {
  const id = parseInt(req.params.id, 10)
  const data = JSON.parse(fs.readFileSync('users.json', 'utf-8'))
  const index = data.items.findIndex(d => d.id === id)
  if (index < 0) {
    res.status(404).json({ message: 'Não foi possível encontrar o usuário' })
  }

  data.items.splice(index, 1)
  fs.writeFileSync('users.json', JSON.stringify(data))
  res.status(204)
});

module.exports = router;
