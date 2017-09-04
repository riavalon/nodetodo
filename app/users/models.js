const Sequelize = require('sequelize');

const db = require('../../database');
const utils = require('./utils');


const User = db.define('user', {
  email: {type: Sequelize.STRING, unique: true},
  pwdHash: Sequelize.STRING,
});

User.sync({force: true, logging: false}).then(() => {
  utils.createPasswordHash('testadmin').then(hash => {
    User.create({
      email: 'raven@admin.com',
      pwdHash: hash,
    });
  });
});

module.exports = User;
