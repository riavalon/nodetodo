const express = require('express');
const router = express.Router();

const Task = require('./models');


router
  .get('/', (req, res) => {
    const {userId} = req.query;
    if (!userId) return res.status(400).json({error: 'Must specify user id'});
    Task.findAll({where: {userId}}).then(tasks => {
      res.json(tasks);
    });
  })

router.route('/:id')
  .get((req, res) => {
    const {id} = req.params;
    const {userId} = req.query;
    if (!userId) return res.status(400).json({error: 'Must specify user id'});
    Task.findOne({
      where: {id, userId}
    }).then(task => {
      res.json(task);
    });
  })

  .put((req, res) => {
    const {id} = req.params;
    const {title, complete} = req.body;
    const {userId} = req.query;
    if (!userId) return res.status(400).json({error: 'Must specify user id'});
    Task.findOne({
      where: {id, userId},
    }).then(task => {
      task.update({
        title: title ? title : task.dataValues.title,
        complete: complete ? complete : task.dataValues.complete,
      }).then((updatedTask => res.send(updatedTask)));
    });
  })

  .delete((req, res) => {
    const {id} = req.params;
    const {userId} = req.query;
    if (!userId) return res.status(400).json({error: 'Must specify user id'});
    Task.findOne({
      where: {id, userId},
    }).then(task => {
      task.destroy();
      res.send({result: true});
    });
  });


router.post('/new', (req, res) => {
  const {title, complete, userId} = req.body;
  if (!userId) return res.status(400).json({error: 'Must specify user id'});
  Task.create({title, complete, userId})
    .then(task => res.send(task))
    .catch(err => res.send(err));
});

module.exports = router;
