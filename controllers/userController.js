const asyncHandler = require('express-async-handler');
const { handleNotFoundError } = require('../middlewares/errorHandlers');
const bcrypt = require('bcryptjs');
const { paginate } = require('../middlewares/paginate');

const User = require('../models/user');
const UserGroup = require('../models/userGroup');
const { scopedUsers } = require('../permissions/userPermission');

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort({ username: 1 }).exec();
  const data = scopedUsers(req.user, users);
  res.status(200).json({ status: 'success', data: { data } });
});

const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).exec();

  if (!user) {
    handleNotFoundError(req, res, 'User');
    return;
  }

  res.status(200).json({ status: 'success', data: { user } });
});

const updateUser = asyncHandler(async (req, res, next) => {
  bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
    if (err) {
      return next(err);
    }

    const id = req.params.id;
    const payload = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      _id: req.params.id,
    });

    const user = await User.findByIdAndUpdate(id, payload, { new: true });

    if (!user) {
      handleNotFoundError(req, res, 'User');
      return;
    }

    res.status(200).json({ status: 'success', data: { user } });
  });
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id).exec();

  if (!user) {
    handleNotFoundError(req, res, 'User');
    return;
  }

  res.status(200).json({ status: 'success', data: null });
});

const getUserGroups = asyncHandler(async (req, res) => {
  const filter = { user: req.params.id };
  const populate = ['group'];
  const userGroups = await paginate(
    UserGroup,
    req.query.page,
    req.query.limit,
    filter,
    populate,
  );
  userGroups.results = userGroups.results.map((result) => result.group);
  res.status(200).json({ status: 'success', data: { groups: userGroups } });
});

module.exports = {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getUserGroups,
};
