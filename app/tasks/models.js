const Sequelize = require('sequelize');

const db = require('../../database');


const Task = db.define('task', {
  title: Sequelize.STRING,
  complete: Sequelize.BOOLEAN,
});


Task.sync({force: true, logging: false}).then(() => {
  Array.from({length: 5}).forEach((_, idx) => {
    Task.create({
      title: `Task number ${idx+1}`,
      complete: !!idx === 3,
    });
  });
});

module.exports = Task;
