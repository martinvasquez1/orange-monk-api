const asyncHandler = require('express-async-handler');
const { handleNotFoundError } = require('../middlewares/errorHandlers');
const { paginate } = require('../middlewares/paginate');

const Post = require('../models/post');
const Comment = require('../models/comment');
const Group = require('../models/group');

const getPosts = asyncHandler(async (req, res) => {
  const data = await paginate(Post, req.query.page, req.query.limit);
  res.status(200).json({ status: 'success', data });
});

const getPost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id).populate('author');

  if (!post) {
    handleNotFoundError(req, res, 'Post');
    return;
  }

  res.status(200).json({ status: 'success', data: { post } });
});

const createPost = asyncHandler(async (req, res) => {
  const group = await Group.findById(req.body.groupId);

  if (!group) {
    handleNotFoundError(req, res, 'Group');
    return;
  }

  const newPost = new Post({
    title: req.body.title,
    content: req.body.content,
    author: req.body.author,
    group: req.body.groupId,
  });

  const savedPost = await newPost.save();
  res.status(200).json({ status: 'success', data: { savedPost } });
});

const updatePost = asyncHandler(async (req, res) => {
  const group = await Group.findById(req.body.groupId);

  if (!group) {
    handleNotFoundError(req, res, 'Group');
    return;
  }

  const id = req.params.id;
  const payload = new Post({
    title: req.body.title,
    content: req.body.content,
    author: req.user.id,
    group: req.body.groupId,
    _id: id,
  });

  const updatedPost = await Post.findByIdAndUpdate(id, payload, { new: true });

  if (!updatedPost) {
    handleNotFoundError(req, res, 'Post');
    return;
  }

  res.status(200).json({ status: 'success', data: { updatedPost } });
});

const deletePost = asyncHandler(async (req, res) => {
  const group = await Group.findById(req.body.groupId);

  if (!group) {
    handleNotFoundError(req, res, 'Group');
    return;
  }

  const post = await Post.findByIdAndDelete(req.params.id).exec();

  if (!post) {
    handleNotFoundError(req, res, 'Post');
    return;
  }

  res.status(200).json({ status: 'success', data: null });
});

module.exports = {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
};
