const express = require('express');
const router = express.Router();
const controller = require('../controllers/groupController');
const joinRequestController = require('../controllers/joinRequestController');
const {
    validateGroupCreation, validateGroupUpdate
  } = require('../middlewares/validators/groupValidator');
const roomController = require('../controllers/roomController');
const { authUser } = require('../middlewares/auth');

router.use(authUser);

router.get('/', controller.getGroups);
router.get('/:id', controller.getGroup);
router.post('/', validateGroupCreation, controller.createGroup);
router.put('/:id', validateGroupUpdate, controller.updateGroup);
router.delete('/:id', controller.deleteGroup);

router.get('/:id/posts', controller.getGroupPosts);
router.get('/:id/users', controller.getGroupUsers);
router.delete('/:id/leave', controller.leave);

router.get('/:id/join-requests', joinRequestController.getJoinRequests);
router.post('/:id/join-requests', joinRequestController.joinRequest);
router.post('/:id/join-requests/:requestId/accept', joinRequestController.acceptJoinRequest);
router.post('/:id/join-requests/:requestId/deny', joinRequestController.denyJoinRequest);

router.get('/:id/rooms', roomController.getRooms);
router.get('/:id/rooms/:roomId', roomController.getRoom);
router.post('/:id/rooms', roomController.createRoom);
router.put('/:id/rooms/:roomId', roomController.updateRoom);
router.delete('/:id/rooms/:roomId', roomController.deleteRoom);

router.get('/:id/isAdmin', controller.isAdmin);

module.exports = router;
