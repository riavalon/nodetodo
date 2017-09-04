const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const config = require('config');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const db = require('./database');
const tasks = require('./app/tasks');
const users = require('./app/users');


const app = express();

// database init
db.authenticate()
  .then(() => 
    config.util.getEnv('NODE_ENV') !== 'testing' ?
    console.log('Connection has been established successfully') : null)
  .catch((err) => console.error('Unabled to connect to the database: ', err));

// Middleware
app.use(helmet());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Resources
app.use('/tasks', tasks.routes);
app.use('/users', users.routes);

app.get('/', (req, res) => {
  res.json({env: process.env.NODE_ENV});
});

app.listen(3000, () => {
  console.log('Nodetodo listening on port 3000');
});


module.exports = app;
