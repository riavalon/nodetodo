const express = require('express'),
  router = express.Router();

const User = require('./models');
const utils = require('./utils');


router.route('/:id')

  .get((req, res) => {
    const {id} = req.params;
    User.findOne({
      where: {id},
      attributes: {exclude: ['pwdHash']}
    }).then(user => {
      res.json(user);
    });
  })

  .put((req, res) => {
    const {id} = req.params;
    const {email} = req.body;
    User.findById(id).then(user => {
      if (user) {
        user.update({email}).then(() => {
          User.findOne({
            where: {id},
            attributes: {exclude: ['pwdHash']},
          }).then(user => res.json(user));
        });
      } else {
        res.status(404).json({error: `No user found by id: ${id}`});
      }
    });
  })

  .delete((req, res) => {
    const {id} = req.params;
    User.findById(id).then(user => {
      if (!user) return res.json({result: `Error: no user found by id ${id}.`});
      user.destroy();
      res.json({result: true});
    });
  });

router.post('/new', (req, res) => {
  const {email, password} = req.body;
  if (!email || !password) {
    return res.status(400).end({error: 'Missing email or password'});
  }

  utils.createPasswordHash(password).then(hash => {
    User.create({email, pwdHash: hash}).then(user => {
      User.findOne({
        where: {id: user.id},
        attributes: {exclude: ['pwdHash']},
      }).then(userf => res.json(userf));
    });
  });
});

router.post('/auth', (req, res) => {
  const {email, password} = req.body;
  if (!email || !password) {
    return res.status(400).end({error: 'Username or password missing'});
  }

  User.findOne({where: {email}}).then(user => {
    user ?
    utils.verifyPassword(user.dataValues.pwdHash, password).then(result => {
      result ? 
        User.findOne({
          where: {email}, 
          attributes: {exclude: ['pwdHash']}
        }).then(user => res.json(user)) :
        res.status(400).json({error: 'Username or password is incorrect'});
    }) :
    res.status(400).json({error: 'Username or password is incorrect'});
  });
});


module.exports = router;
