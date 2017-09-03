const path = require('path');

const Sequelize = require('sequelize');


const sequelize = new Sequelize('nodetodo_dev_db', 'nodetodo', 'supersecret', {
  host: 'localhost',
  dialect: 'sqlite',

  pool: {
    max: 5,
    min: 0,
    idle: 10000,
  },

  storage: path.join(__dirname, 'database.sqlite'),
});

module.exports = sequelize;
