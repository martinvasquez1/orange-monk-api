const asyncHandler = require('express-async-handler');
const { handleNotFoundError } = require('../middlewares/errorHandlers');

const Post = require('../sqlModels/post');
const Group = require('../sqlModels/group');

const getPosts = asyncHandler(async (req, res) => {
  const posts = await Post.findAll();
  res.status(200).json({ status: 'success', posts });
});

const getPost = asyncHandler(async (req, res) => {
  const post = await Post.findByPk(req.params.id);

  if (!post) {
    handleNotFoundError(req, res, 'Post');
    return;
  }

  res.status(200).json({ status: 'success', data: { post } });
});

const createPost = asyncHandler(async (req, res) => {
  const group = await Group.findByPk(req.body.groupId);

  if (!group) {
    handleNotFoundError(req, res, 'Group');
    return;
  }

  const newPost = await Post.create({
    title: req.body.title,
    content: req.body.content,
    author: req.body.author,
    group: req.body.groupId,
  });

  res.status(200).json({ status: 'success', data: { newPost } });
});

const updatePost = asyncHandler(async (req, res) => {
  const post = await Post.findByPk(req.params.id);

  if (!post) {
    handleNotFoundError(req, res, 'Post');
    return;
  }

  const payload = {
    title: req.body.title,
    content: req.body.content,
    author: req.body.id,
    group: req.body.groupId,
  };

  const updatedPost = await post.update(payload);

  res.status(200).json({ status: 'success', data: { updatedPost } });
});

const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findByPk(req.params.id);
  if (!post) {
    handleNotFoundError(req, res, 'Post');
    return;
  }
  await post.destroy();
  res.status(200).json({ status: 'success', data: null });
});

module.exports = {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
};
