const asyncHandler = require('express-async-handler');
const { handleNotFoundError } = require('../middlewares/errorHandlers');
const { paginate } = require('../middlewares/paginate');

const Group = require('../models/group');
const UserGroup = require('../models/userGroup');
const Post = require('../models/post');
const Comment = require('../models/comment');
const User = require('../models/user');
const JoinRequest = require('../models/joinRequest');

const getGroups = asyncHandler(async (req, res) => {
  const filter = {};

  if (req.query.name) {
    filter.name = { $regex: req.query.name, $options: 'i' }; // Case-insensitive search
  }

  let groups = await paginate(Group, req.query.page, req.query.limit, filter);

  // TODO: Clean. Too messy!
  if (req.query.userJoined && req.query.userId) {
    const userJoinedGroups = await UserGroup.find({ user: req.query.userId }).select(
      'group',
    );
    const joinedGroupIds = new Set(
      userJoinedGroups.map((group) => group.group.toString()),
    );

    // Add isJoined
    const groupArr = groups.results;
    let modifiedGroups = groupArr.map((group) => ({
      ...group.toObject(),
      isJoined: joinedGroupIds.has(group._id.toString()),
    }));

    // Add requestStatus
    const joinRequests = await JoinRequest.find({ user: req.query.userId });
    modifiedGroups = modifiedGroups.map((group) => {
      const matchingRequest = joinRequests.find(
        (request) => request.group.toString() === group._id.toString(),
      );
      return {
        ...group,
        requestStatus: matchingRequest ? matchingRequest.status : null,
      };
    });

    groups.results = modifiedGroups;
  }

  res.status(200).json({ status: 'success', data: groups });
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
    role: 'admin',
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
    sidebar: req.body.sidebar,
    previewImage: req.body.previewImage,
    bannerImage: req.body.bannerImage,
    theme: req.body.theme,
    private: req.body.private,
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

  // Delete all comments
  const posts = await Post.find({ group: groupId }).exec();
  const postIds = posts.map((post) => post._id);
  await Comment.deleteMany({ author: { $in: postIds } }).exec();

  // Delete all posts
  await Post.deleteMany({ group: groupId }).exec();

  // Delete all userGroup
  await UserGroup.deleteMany({ group: groupId }).exec();

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
    { createdAt: -1 },
  );

  res.status(200).json({ status: 'success', data });
});

const getGroupUsers = asyncHandler(async (req, res) => {
  const data = await paginate(
    UserGroup,
    req.query.page,
    req.query.limit,
    { group: req.params.id },
    ['user'],
  );
  res.status(200).json({ status: 'success', data });
});

const leave = asyncHandler(async (req, res) => {
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
  if (!userGroup) {
    return handleNotFoundError(req, res, 'UserGroup');
  }

  await userGroup.deleteOne({ user: req.body.userId, group: req.params.id });

  res.status(200).json({ status: 'success', data: null });
});

module.exports = {
  getGroups,
  getGroup,
  createGroup,
  updateGroup,
  deleteGroup,
  getGroupPosts,
  getGroupUsers,
  leave,
};
