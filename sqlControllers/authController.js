const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const { issueJWT } = require('../utils/issueJWT');
const User = require('./../sqlModels/user');

const signUp = asyncHandler(async (req, res, next) => {
  const { username, email, password } = req.body;
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  const newUser = await User.create({
    username,
    email,
    password,
  });

  const jwt = issueJWT(newUser);
  return res.status(201).json({ status: 'success', data: { user: newUser, token: jwt } });
});

const signIn = asyncHandler(async (req, res) => {
  /*
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
  */
  res.status(200).json({ status: 'success', data: 'Sign in!' });
});

module.exports = {
  signUp,
  signIn,
};
