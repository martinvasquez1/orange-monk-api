const asyncHandler = require('express-async-handler');
const { handleNotFoundError } = require('../middlewares/errorHandlers');

const Group = require('./../sqlModels/group');
const User = require('../sqlModels/user');
const UserGroup = require('../sqlModels/userGroup');

const getGroups = asyncHandler(async (req, res) => {
  const groups = await Group.findAll();
  res.status(200).json({ status: 'success', data: { groups } });
});

const getGroup = asyncHandler(async (req, res) => {
  const group = await Group.findByPk(req.params.id);
  if (!group) {
    return handleNotFoundError('Group');
  }
  res.status(200).json({ status: 'success', data: { group } });
});

const createGroup = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.body.owner);
  if (!user) {
    return handleNotFoundError('User');
  }

  const newGroup = await Group.create({
    name: req.body.name,
    description: req.body.description,
    private: req.body.private,
    owner: req.body.owner,
  });

  const savedGroup = await newGroup.save();

  await UserGroup.create({
    role: 'admin',
    groupId: newGroup.id,
    userId: req.body.owner,
  });

  res.status(200).json({ status: 'success', data: { savedGroup } });
});

const updateGroup = asyncHandler(async (req, res) => {
  const group = await Group.findByPk(req.params.id);
  if (!group) {
    return handleNotFoundError('Group');
  }

  const payload = {
    name: req.body.name,
    description: req.body.description,
    private: req.body.private,
  };

  await group.update(payload);

  res.status(200).json({ status: 'success', data: { group } });
});

const deleteGroup = asyncHandler(async (req, res) => {
  const group = await Group.findByPk(req.params.id);
  if (!group) {
    return res.status(404).json({ message: 'Group not found.' });
  }

  await group.destroy();

  res.status(200).json({ status: 'success', data: null });
});

const getGroupPosts = asyncHandler(async (req, res) => {
  res.status(200).json({ status: 'success', data: 'Hi!' });
});

const join = asyncHandler(async (req, res) => {
  res.status(200).json({ status: 'success', data: 'Hi!' });
});

module.exports = {
  getGroups,
  getGroup,
  createGroup,
  updateGroup,
  deleteGroup,
  getGroupPosts,
  join,
};
