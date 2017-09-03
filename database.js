const path = require('path');

const Sequelize = require('sequelize');
const config = require('config');


const sequelize = new Sequelize(
  config.get('db_name'),
  config.get('username'),
  config.get('password'),
  {
    host: config.get('host'),
    dialect: 'sqlite',
    logging: config.util.getEnv('NODE_ENV') === 'testing' ? () => {} : console.log,

    pool: {
      max: 5,
      min: 0,
      idle: 10000,
    },

    storage: path.join(__dirname, `${config.get('db_name')}.sqlite`),
  }
);

module.exports = sequelize;
