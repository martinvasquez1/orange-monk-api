const express = require('express');
const router = express.Router();
const controller = require('../controllers/postController');
const commentController = require('../controllers/commentController');
const likeController = require('../controllers/likeController');
const { authUser } = require('../middlewares/auth');

router.use(authUser);

router.get('/', controller.getPosts);
router.get('/:id', controller.getPost);
router.post('/', controller.createPost);
router.put('/:id', controller.updatePost);
router.delete('/:id', controller.deletePost);

router.get('/:id/likes', likeController.getLikes);
router.post('/:id/likes', likeController.likePost);
router.delete('/:id/likes', likeController.removeLike);

router.get('/:id/comments', commentController.getComments);
router.get('/:id/comments/:commentId', commentController.getComment);
router.post('/:id/comments', commentController.createComment);
router.put('/:id/comments/:commentId', commentController.updateComment);
router.delete('/:id/comments/:commentId', commentController.deleteComment);

module.exports = router;
