const asyncHandler = require('express-async-handler');
const { handleNotFoundError } = require('../middlewares/errorHandlers');
const bcrypt = require('bcryptjs');
const User = require('./../sqlModels/user');
const { sequelize } = require('./../config/postgres');

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.findAll();
  res.status(200).json({ status: 'success', data: users });
});

const getUser = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) {
    return handleNotFoundError('User');
  }
  res.status(200).json({ status: 'success', data: { user } });
});

const updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByPk(req.params.id);
  if (!user) {
    return handleNotFoundError('User');
  }

  const hashedPassword = req.body.password
    ? await bcrypt.hash(req.body.password, 10)
    : null;

  const payload = {
    username: req.body.username,
    email: req.body.email,
  };

  if (hashedPassword) {
    payload.password = hashedPassword;
  }

  const updatedUser = await user.update(payload);

  res.status(200).json({ status: 'success', data: { updatedUser } });
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) {
    return handleNotFoundError('User');
  }
  await user.destroy();
  res.status(200).json({ status: 'success', data: null });
});

const getUserGroups = asyncHandler(async (req, res) => {
  res.status(200).json({ status: 'success', data: 'Return user groups' });
});

const addPictureColumn = asyncHandler(async (req, res) => {
  const queryInterface = sequelize.getQueryInterface();
  await queryInterface.addColumn('Users', 'profilePicture2', {
    type: sequelize.Sequelize.STRING,
    allowNull: true,
  });
  res.status(200).json({ status: 'success', data: 'Add new column!' });
});

const removePictureColumn = asyncHandler(async (req, res) => {
  const queryInterface = sequelize.getQueryInterface();
  await queryInterface.removeColumn('Users', 'profilePicture2');
  res.status(200).json({ status: 'success', data: 'Column removed!' });
});

const deleteTable = asyncHandler(async (req, res) => {
  try {
    await sequelize.query('DROP TABLE "Users" CASCADE;');
    res.status(200).json({ status: 'success', data: 'Table deleted...' });
  } catch (error) {
    res.status(404).json({ status: 'failed', data: 'No User table.' });
  }
});

module.exports = {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getUserGroups,
  addPictureColumn,
  removePictureColumn,
  deleteTable,
};
