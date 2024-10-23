const asyncHandler = require('express-async-handler');
const { handleNotFoundError } = require('../middlewares/errorHandlers');
const { paginate } = require('../middlewares/paginate');

const Group = require('../models/group');
const UserGroup = require('../models/userGroup');
const Post = require('../models/post');
const Comment = require('../models/comment');
const User = require('../models/user');
const JoinRequest = require('../models/joinRequest');

const getJoinRequests = asyncHandler(async (req, res) => {
	const group = await Group.findById(req.params.id);
  if (!group) {
    return handleNotFoundError(req, res, 'Group');
  }

	const joinRequests = await JoinRequest.find({ group: req.params.id });
  res.status(200).json({ status: 'success', data: joinRequests });
})

const joinRequest = asyncHandler(async (req, res) => {
  // TODO: Avoid repetition creating middleware
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

  const existingRequest = await JoinRequest.findOne({
    user: req.body.userId,
    group: req.params.id,
  });

  if (existingRequest) {
    if (existingRequest.status === 'denied') {
      return res.status(403).json({
        status: 'fail',
        data: { message: 'Your join request has been denied.' },
      });
    } else {
      return res.status(409).json({
        status: 'fail',
        data: { message: 'You have already requested to join this group.' },
      });
    }
  }

  if (group.private) {
    const newRequest = new JoinRequest({
      user: req.body.userId,
      group: req.params.id,
    });

    await newRequest.save();
    res.status(200).json({ status: 'success', data: newRequest });
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

const acceptJoinRequest = asyncHandler(async (req, res) => {
  const joinRequest = await JoinRequest.findById(req.params.requestId);
  if (!joinRequest) {
    return res.status(404).json({ message: 'Join request not found.' });
  }
  const group = await Group.findById(joinRequest.group);
  if (!group) {
    return res.status(404).json({ message: 'Group not found.' });
  }

	const newUserGroup = new UserGroup({
    user: joinRequest.user,
    group: joinRequest.group,
    role: 'member',
  });
  const savedUserGroup = await newUserGroup.save();
	await JoinRequest.findByIdAndDelete(req.params.requestId);

  res.status(200).json({ status: 'success', data: savedUserGroup });
});

const denyJoinRequest = asyncHandler(async (req, res) => {
	const request = await JoinRequest.findById(req.params.requestId);
  if (!request) {
    return res.status(404).json({ message: 'Join request not found.' });
  }

  const group = await Group.findById(request.group);
  if (!group) {
    return res.status(404).json({ message: 'Group not found.' });
  }

	request.status = 'denied'
	await request.save()

  res.status(200).json({ status: 'success', data: request });
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
	getJoinRequests,
  joinRequest,
  acceptJoinRequest,
	denyJoinRequest,
};
