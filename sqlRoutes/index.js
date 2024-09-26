const express = require('express');
const router = express.Router();
const authRouter = require('./auth');
const userRouter = require('./users');
const groupsRouter = require('./groups');

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/groups', groupsRouter);

module.exports = router;
