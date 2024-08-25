const jwt = require('jsonwebtoken');

const authUser = (req, res, next) => {
  let token = req.headers['x-access-token'] || req.query.token;

  if (!token) {
    return res.status(401).json({ status: 'fail', data: { message: 'Unauthorized.' } });
  }

  // Remove 'Bearer'. Verify won't accept the token with it
  token = token.substr(7);

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res
        .status(401)
        .json({ status: 'fail', data: { message: 'Invalid token.' } });
    }

    // If the token is valid, set it as a request property
    req.user = decoded;
    next();
  });
};

const authRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(401).json({ status: 'fail', data: { message: 'Not allowed.' } });
    }

    next();
  };
};

module.exports = {
  authUser,
  authRole,
};
