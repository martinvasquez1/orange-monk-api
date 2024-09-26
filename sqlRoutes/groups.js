const express = require('express');
const router = express.Router();
const controller = require('./../sqlControllers/groupController');

router.get('/', controller.getGroups);
router.get('/:id', controller.getGroup);
router.post('/', controller.createGroup);
router.put('/:id', controller.updateGroup);
router.delete('/:id', controller.deleteGroup);

router.get('/:id/posts', controller.getGroupWithPosts);
router.post('/:id/join', controller.join);

module.exports = router;
