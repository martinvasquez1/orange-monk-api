const express = require('express');
const router = express.Router();
const authRouter = require('./auth');
const userRouter = require('./users');
const groupsRouter = require('./groups');
const postsRouter = require('./posts');

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/groups', groupsRouter);
router.use('/posts', postsRouter);

module.exports = router;
