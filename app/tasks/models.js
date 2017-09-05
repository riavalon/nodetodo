const Sequelize = require('sequelize');

const db = require('../../database');


const Task = db.define('task', {
  title: Sequelize.STRING,
  complete: Sequelize.BOOLEAN,
  userId: Sequelize.INTEGER,
});


Task.sync({force: true, logging: false}).then(() => {
  Array.from({length: 5}).forEach((_, idx) => {
    Task.create({
      title: `Task number ${idx+1}`,
      complete: false,
      userId: 1,
    });
  });

  Task.create({
    title: 'testing task with diff user id',
    complete: false,
    userId: 2,
  });
});

module.exports = Task;
