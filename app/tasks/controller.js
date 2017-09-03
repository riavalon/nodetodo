const express = require('express');
const router = express.Router();

const Task = require('./models');


router
  .get('/', (req, res) => {
    Task.findAll().then(tasks => {
      res.json(tasks);
    });
  })
  .get('/:id', (req, res) => {
    const {id} = req.params;
    Task.findById(id).then(task => {
      res.json(task);
    });
  });

router.post('/new', (req, res) => {
  const {title, complete} = req.body;
  Task.create({title, complete})
    .then(task => res.send(task))
    .catch(err => res.send(err));
});

router.put('/:id', (req, res) => {
  const {id} = req.params;
  const {title, complete} = req.body;
  Task.findById(id).then(task => {
    task.update({
      title: title ? title : task.dataValues.title,
      complete: complete ? complete : task.dataValues.complete,
    }).then((updatedTask => res.send(updatedTask)));
  });
});

router.delete('/:id', (req, res) => {
  const {id} = req.params;
  Task.findById(id).then(task => {
    task.destroy();
    res.send({result: true});
  });
});

module.exports = router;
