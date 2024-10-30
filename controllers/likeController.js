const asyncHandler = require('express-async-handler');

const Like = require('../models/like');

const getLikes = asyncHandler(async (req, res) => {
  const likesCount = await Like.countDocuments({ post: req.params.id });
  res.status(200).json({ status: 'success', data: likesCount });
});

const likePost = asyncHandler(async (req, res) => {
  const hasUserLiked = await Like.findOne({ user: req.body.userId, post: req.params.id });

  if (hasUserLiked) {
    return res
      .status(409)
      .json({ status: 'success', data: 'You have already liked this post.' });
  }

  const like = new Like({ user: req.body.userId, post: req.params.id });
  await like.save();
  res.status(200).json({ status: 'success', data: like });
});

const removeLike = asyncHandler(async (req, res) => {
  const hasNotLiked = !(await Like.findOne({
    user: req.body.userId,
    post: req.params.id,
  }));

  if (hasNotLiked) {
    return res
      .status(400)
      .json({ status: 'success', data: 'You cannot dislike a post you have not liked.' });
  }

  await Like.deleteOne({ user: req.body.userId, post: req.params.id });
  res.status(200).json({ status: 'success', data: null });
});

module.exports = {
  getLikes,
  likePost,
  removeLike,
};
