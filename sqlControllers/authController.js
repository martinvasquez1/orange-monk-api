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
    password: hashedPassword,
  });

  const jwt = issueJWT(newUser);
  return res.status(201).json({ status: 'success', data: { user: newUser, token: jwt } });
});

const signIn = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const jwt = issueJWT(user);
  res.status(200).json({ status: 'success', data: { user, token: jwt } });
});

module.exports = {
  signUp,
  signIn,
};
