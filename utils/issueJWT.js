const jwt = require('jsonwebtoken');

const issueJWT = (user) => {
  const _id = user._id || user.id;
  const expiresIn = '2d';

  const payload = {
    sub: _id,
    id: _id,
    role: user.role,
  };

  const signedToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: expiresIn,
  });

  return 'Bearer ' + signedToken;
};

module.exports = { issueJWT };
