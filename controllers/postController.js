const asyncHandler = require('express-async-handler');
const { handleNotFoundError } = require('../middlewares/errorHandlers');
const { paginated } = require('../middlewares/paginated');

const Post = require('../models/post');
const Group = require('../models/group');

const getPosts = [
  paginated(Post),
  asyncHandler(async (req, res) => {
    const results = res.paginated;
    res.status(200).json({ status: 'success', data: { results } });
  }),
];

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

  if (!post) {
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

  const post = await post.findByIdAndDelete(req.params.id).exec();

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
