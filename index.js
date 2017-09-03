const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');

const db = require('./db');
const tasks = require('./app/tasks');
const users = require('./app/users');


const app = express();

// database init
db.authenticate()
  .then(() => console.log('Connection has been established successfully'))
  .catch((err) => console.error('Unabled to connect to the database: ', err));

// Middleware
app.use(helmet());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Resources
app.use('/tasks', tasks.routes);
app.use('/users', users.routes);

app.get('/', (req, res) => {
  res.json({status: 'online'});
});

app.listen(3000, () => {
  console.log('Nodetodo listening on port 3000');
});
