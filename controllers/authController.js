const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const issueJWT = require('../utils/issueJWT');
const User = require('../models/user');

const signUp = asyncHandler(async (req, res, next) => {
  bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
    if (err) {
      return next(err);
    }

    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    const jwt = issueJWT(savedUser);
    res.status(200).json({ status: 'success', data: { user: newUser, token: jwt } });
  });
});

const signIn = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(401).json({
      status: 'fail',
      data: { message: 'Invalid email or password.' },
    });
  }

  const match = await bcrypt.compare(req.body.password, user.password);

  if (!match) {
    return res.status(401).json({
      status: 'fail',
      data: { message: 'Invalid email or password' },
    });
  }

  const jwt = issueJWT(user);
  res.status(200).json({ status: 'success', data: { user, token: jwt } });
});

module.exports = {
  signUp,
  signIn,
};
