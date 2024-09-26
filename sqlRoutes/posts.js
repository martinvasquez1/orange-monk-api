const express = require('express');
const router = express.Router();
const controller = require('../sqlControllers/postController');

router.get('/', controller.getPosts);
router.get('/:id', controller.getPost);
router.post('/', controller.createPost);
router.put('/:id', controller.updatePost);
router.delete('/:id', controller.deletePost);

module.exports = router;
