const express = require('express');
const router = express.Router();
const controller = require('./../sqlControllers/userController');

router.get('/', controller.getUsers);
router.get('/:id', controller.getUser);
router.put('/:id', controller.updateUser);
router.delete('/:id', controller.deleteUser);
router.get('/:id/groups', controller.getUserGroups);

module.exports = router;
