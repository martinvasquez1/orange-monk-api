const asyncHandler = require('express-async-handler');
const { handleNotFoundError } = require('../middlewares/errorHandlers');
const { paginate } = require('../middlewares/paginate');

const Group = require('../models/group');
const UserGroup = require('../models/userGroup');
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

  const newUserGroup = new UserGroup({
    user: req.body.owner,
    group: savedGroup._id,
    role: 'member',
  });

  const savedUserGroup = await newUserGroup.save();

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

  const data = await paginate(
    Post,
    req.query.page,
    req.query.limit,
    { group: req.params.id },
    ['author'],
  );

  res.status(200).json({ status: 'success', data });
});

const getGroupUsers = asyncHandler(async (req, res) => {
  const userGroup = await UserGroup.find({ group: req.params.id });
  const users = userGroup.map((data) => data.user);
  res.status(200).json({ status: 'success', data: users });
});

const join = asyncHandler(async (req, res) => {
  const group = await Group.findById(req.params.id);
  if (!group) {
    return handleNotFoundError(req, res, 'Group');
  }
  const user = await User.findById(req.body.userId);
  if (!user) {
    return handleNotFoundError(req, res, 'User');
  }
  const userGroup = await UserGroup.findOne({
    user: req.body.userId,
    group: req.params.id,
  });
  if (userGroup) {
    return res.status(400).json({
      status: 'fail',
      data: { message: 'You are already a member of this group.' },
    });
  }

  if (group.private) {
    if (group.joinRequests.includes(req.body.userId)) {
      return res.status(400).json({
        status: 'fail',
        data: { message: 'You have already requested to join this group.' },
      });
    }

    // Add user to join requests list
    group.joinRequests.push(req.params.userId);
    await group.save();
    res.status(200).json({ status: 'success', data: group });
  } else {
    const newUserGroup = new UserGroup({
      user: req.body.userId,
      group: req.params.id,
      role: 'member',
    });
    const savedUserGroup = await newUserGroup.save();
    res.status(200).json({ status: 'success', data: savedUserGroup });
  }
});

module.exports = {
  getGroups,
  getGroup,
  createGroup,
  updateGroup,
  deleteGroup,
  getGroupPosts,
  getGroupUsers,
  join,
};
