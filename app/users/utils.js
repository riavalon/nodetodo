const bcrypt = require('bcrypt');


const createPasswordHash = (password) => {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
};

const verifyPassword = (passwordHash, password) => {
  return bcrypt.compare(password, passwordHash);
};

const validateSession = (req, res, next) => {
  if (req.session && req.session.authenticated)
    return next();
  res.json({error: 'Invalid session token'});
};


module.exports = {
  createPasswordHash,
  verifyPassword,
  validateSession,
};
