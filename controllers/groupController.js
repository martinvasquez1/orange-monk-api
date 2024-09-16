const asyncHandler = require('express-async-handler');
const { handleNotFoundError } = require('../middlewares/errorHandlers');

const Group = require('../models/group');
const Post = require('../models/post');
const Comment = require('../models/comment');
const User = require('../models/user');

const getGroups = asyncHandler(async (req, res) => {
  const filter = {};

  if (req.query.name) {
    filter.name = { $regex: req.query.name, $options: 'i' }; // Case-insensitive search
  }

  const groups = await Group.find(filter).sort({ username: 1 }).exec();
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
    owner: req.body.owner,
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
  const groupId = req.params.id;
  const group = await Group.findByIdAndDelete(groupId).exec();

  if (!group) {
    handleNotFoundError(req, res, 'Group');
    return;
  }

  // Remove the group from users' groups array
  await User.updateMany({ groups: groupId }, { $pull: { groups: groupId } });
  // Delete all comments
  const posts = await Post.find({ group: groupId }).exec();
  const postIds = posts.map((post) => post._id);
  await Comment.deleteMany({ author: { $in: postIds } }).exec();
  // Delete all posts
  await Post.deleteMany({ group: groupId }).exec();

  res.status(200).json({ status: 'success', data: null });
});

const getGroupPosts = asyncHandler(async (req, res) => {
  const group = await Group.findById(req.params.id);

  if (!group) {
    handleNotFoundError(req, res, 'Group');
    return;
  }

  const posts = await Post.find({ group: req.params.id }).populate("author");

  res.status(200).json({ status: 'success', data: {posts} });
});

const join = asyncHandler(async (req, res) => {
  const group = await Group.findById(req.params.id);

  if (!group) {
    handleNotFoundError(req, res, 'Group');
    return;
  }

  if (group.private) {
    if (group.joinRequests.includes(userId)) {
      return res.status(400).json({
        status: 'fail',
        data: { message: 'You have already requested to join this group.' },
      });
    }

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
