const express = require('express');
const router = express.Router();
const controller = require('./../sqlControllers/userController');

router.delete('/table', controller.deleteTable);

router.get('/', controller.getUsers);
router.get('/:id', controller.getUser);
router.put('/:id', controller.updateUser);
router.delete('/:id', controller.deleteUser);
router.get('/:id/groups', controller.getUserWithGroups);

router.patch('/addPicture2', controller.addPictureColumn);
router.patch('/removePicture2', controller.removePictureColumn);

module.exports = router;
