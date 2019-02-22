const express = require('express');
const helmet = require('helmet');
const knex = require('knex');
const knexConfig = require('./knexfile');

const db = knex(knexConfig.development);

const server = express();

server.use(express.json());
server.use(helmet());

// endpoints here

// GET
server.get('/api/zoos', (req, res) => {
  db('zoos')
    .then(zoos => {
      res.status(200).json({ zoos })
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: 'Could not get zoos information' })
    })
});

// GET by id

server.get('/api/zoos/:id', (req, res) => {
  db('zoos')
  .where({ id: req.params.id })
  .first()
    .then(zoo => {
      res.status(200).json({ zoo })
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: 'Could not get zoo information' })
    })
});

// POST
server.post('/api/zoos', (req, res) => {
  const zoo = req.body;
  if(!zoo.name){
    res.status(400).json({ error: 'Zoo must have a name' })
  } else {
    db('zoos')
      .insert(zoo)
      .then(id => {
        res.status(201).json({ id: id[0] })
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ error: 'Could not add zoo' })
      })
  }
});

// DELETE

server.delete('/api/zoos/:id', (req, res) => {
  db('zoos')
    .where({ id: req.params.id})
    .del()
    .then(count => {
      res.status(204).end()
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: 'Could not remove zoo' })
    })
});

//PUT

server.put('/api/zoos/:id', (req, res) => {
  const changes = req.body;
  db('zoos')
    .where({ id: req.params.id})
    .update(changes)
    .then(didUpdate => {
      didUpdate ?
      res.status(200).json({ message: 'Zoo updated' })
      : res.status(404).json({ error: 'Zoo with that id does not exist' })
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: 'Could not update zoo' })
    })
});

const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
