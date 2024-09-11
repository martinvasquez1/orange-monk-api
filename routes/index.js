const express = require('express');
const router = express.Router();
const authRouter = require('./auth');
const userRouter = require('./users');
const groupRouter = require('./groups');
const postRouter = require('./posts');

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/groups', groupRouter);
router.use('/posts', postRouter);

module.exports = router;
