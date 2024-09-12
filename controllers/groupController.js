const asyncHandler = require('express-async-handler');
const { handleNotFoundError } = require('../middlewares/errorHandlers');

const Group = require('../models/group');

const getGroups = asyncHandler(async (req, res) => {
  const groups = await Group.find().sort({ username: 1 }).exec();
  res.status(200).json({ status: 'success', data: { groups } });
});

const getGroup = asyncHandler(async (req, res) => {
  const group = await Group.findById(req.params.id).exec();

  if (!group) {
    handleNotFoundError(req, res, 'Group');
    return;
  }

  res.status(200).json({ status: 'success', data: { group } });
});

const createGroup = asyncHandler(async (req, res) => {
  const newGroup = new Group({
    name: req.body.name,
    description: req.body.description,
    owner: req.user.id,
  });

  const savedGroup = await newGroup.save();
  res.status(200).json({ status: 'success', data: { savedGroup } });
});

const updateGroup = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const payload = new Group({
    name: req.body.name,
    description: req.body.description,
    owner: req.user.id,
    _id: req.params.id,
  });

  const group = await Group.findByIdAndUpdate(id, payload, { new: true });

  if (!group) {
    handleNotFoundError(req, res, 'Group');
    return;
  }

  res.status(200).json({ status: 'success', data: { group } });
});

const deleteGroup = asyncHandler(async (req, res) => {
  const group = await Group.findByIdAndDelete(req.params.id).exec();

  if (!group) {
    handleNotFoundError(req, res, 'Group');
    return;
  }

  res.status(200).json({ status: 'success', data: null });
});

const getGroupPosts = asyncHandler(async (req, res) => {
  const group = await Group.findById(req.params.id);

  if (!group) {
    handleNotFoundError(req, res, 'Group');
    return;
  }

  const posts = await Post.find({ group: req.params.id });

  res.status(200).json({ status: 'success', data: posts });
});

module.exports = {
  getGroups,
  getGroup,
  createGroup,
  updateGroup,
  deleteGroup,
  getGroupPosts,
};
