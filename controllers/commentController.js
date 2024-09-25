const asyncHandler = require('express-async-handler');
const { handleNotFoundError } = require('../middlewares/errorHandlers');

const Post = require('../models/post');
const Comment = require('../models/comment');
const User = require('../models/user');

const checkAuthor = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.body.author).exec();

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
  const post = await Post.findById(req.params.id).populate({
    path: 'comments',
    populate: {
      path: 'author',
      select: 'username',
    },
  });
  const comments = post.comments;
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

const createComment = [
  checkAuthor,
  checkPost,
  asyncHandler(async (req, res, next) => {
    const newComment = new Comment({
      content: req.body.content,
      author: req.body.author,
      likes: req.body.likes,
    });

    const savedComment = await newComment.save();

    await Post.findByIdAndUpdate(req.params.id, {
      $push: { comments: savedComment._id },
    });

    res.status(200).json({ status: 'success', data: { savedComment } });
  }),
];

const updateComment = [
  checkAuthor,
  checkPost,
  asyncHandler(async (req, res, next) => {
    const id = req.params.commentId;
    const payload = new Comment({
      content: req.body.content,
      author: req.body.author,
      likes: req.body.likes,
      _id: id,
    });

    const comment = await Comment.findByIdAndUpdate(id, payload, { new: true });

    if (!Comment) {
      handleNotFoundError(req, res, 'Comment');
      return;
    }

    res.status(200).json({ status: 'success', data: { comment } });
  }),
];

const deleteComment = [
  checkAuthor,
  checkPost,
  asyncHandler(async (req, res, next) => {
    const comment = await Comment.findByIdAndDelete(req.params.commentId).exec();

    if (!comment) {
      handleNotFoundError(req, res, 'Comment');
      return;
    }

    res.status(200).json({ status: 'success', data: null });
  }),
];

module.exports = {
  getComments,
  getComment,
  createComment,
  updateComment,
  deleteComment,
};
