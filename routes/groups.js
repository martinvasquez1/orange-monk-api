const express = require('express');
const router = express.Router();
const controller = require('../controllers/groupController');
const { authUser } = require('../middlewares/auth');

router.use(authUser);

router.get('/', controller.getGroups);
router.get('/:id', controller.getGroup);
router.post('/', controller.createGroup);
router.put('/:id', controller.updateGroup);
router.delete('/:id', controller.deleteGroup);

router.get('/:id/posts', controller.getGroupPosts);

module.exports = router;
