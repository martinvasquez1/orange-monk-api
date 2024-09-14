const asyncHandler = require('express-async-handler');
const { handleNotFoundError } = require('../middlewares/errorHandlers');

const Group = require('../models/group');
const Post = require('../models/post');
const User = require('../models/user');

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
    private: req.body.private,
    // TODO: Fix. This is true in most cases but an admin should be able to
    // create a group for another user. In this case req.user.id is the admin
    // user and not the real owner id.
    owner: req.user.id,
  });

  const savedGroup = await newGroup.save();

  // Add owner to the group
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { $addToSet: { groups: savedGroup.id } },
    { new: true },
  );

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

  // TODO: Delete all users from this group.

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

const join = asyncHandler(async (req, res) => {
  const group = await Group.findById(req.params.id);

  if (!group) {
    handleNotFoundError(req, res, 'Group');
    return;
  }

  if (group.private) {
    // Add user to join requests list
    group.joinRequests.push(req.params.id);
    await group.save();
    res.status(200).json({ status: 'success', data: group });
  } else {
    // Add group to user's groups
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $addToSet: { groups: req.params.id } },
      { new: true },
    );
    res.status(200).json({ status: 'success', data: user });
  }
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
