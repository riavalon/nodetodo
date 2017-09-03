const express = require('express');
const router = express.Router();

const Task = require('./models');


router.get('/', (req, res) => {
  Task.findAll().then(tasks => {
    res.json(tasks);
  });
});


module.exports = router;
