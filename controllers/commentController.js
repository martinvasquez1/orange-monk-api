const asyncHandler = require('express-async-handler');
const { handleNotFoundError } = require('../middlewares/errorHandlers');

const Post = require('../models/post');
const Comment = require('../models/comment');
const User = require('../models/user');

const checkAuthor = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.body.userId).exec();

  if (!user) {
    handleNotFoundError(req, res, 'User');
    return;
  }

  next();
});

const checkPost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id).exec();

  if (!post) {
    handleNotFoundError(req, res, 'Post');
    return;
  }

  next();
});

// Get all comments for a specific post
const getComments = asyncHandler(async (req, res) => {
  const comments = await Comment.find({ post: req.params.id }).exec();
  res.status(200).json({ status: 'success', data: { comments } });
});

const getComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.commentId).populate('author').exec();

  if (!comment) {
    handleNotFoundError(req, res, 'Comment');
    return;
  }

  res.status(200).json({ status: 'success', data: { comment } });
});

const createComment = asyncHandler(async (req, res, next) => {
  checkAuthor(req, res, next);
  checkPost(res, res, next);

  const newComment = new Comment({
    content: req.body.content,
    author: req.user.id,
    post: req.params.id,
  });

  const savedComment = await newComment.save();
  res.status(200).json({ status: 'success', data: { savedComment } });
});

const updateComment = asyncHandler(async (req, res, next) => {
  checkAuthor(req, res, next);
  checkPost(res, res, next);

  const id = req.params.id;
  const payload = new Comment({
    content: req.body.content,
    author: req.user.id,
    post: req.params.id,
    _id: req.params.commentId,
  });

  const comment = await Comment.findByIdAndUpdate(id, payload, { new: true });

  if (!Comment) {
    handleNotFoundError(req, res, 'Comment');
    return;
  }

  res.status(200).json({ status: 'success', data: { comment } });
});

const deleteComment = asyncHandler(async (req, res, next) => {
  checkAuthor(req, res, next);
  checkPost(res, res, next);

  const comment = await Comment.findByIdAndDelete(req.params.commentId).exec();

  if (!comment) {
    handleNotFoundError(req, res, 'Comment');
    return;
  }

  res.status(200).json({ status: 'success', data: null });
});

module.exports = {
  getComments,
  getComment,
  createComment,
  updateComment,
  deleteComment,
};
