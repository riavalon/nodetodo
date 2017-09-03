const express = require('express'),
  router = express.Router();


router.use((req, res, next) => {
  console.log('Connected to the user resource!');
  next();
});

router.get('/', (req, res) => {
  res.send('users resource');
});

module.exports = router;
