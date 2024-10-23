const express = require('express');
const router = express.Router();
const controller = require('../controllers/groupController');
const joinRequestController = require('../controllers/joinRequestController');
const roomController = require('../controllers/roomController');
const { authUser } = require('../middlewares/auth');

router.use(authUser);

router.get('/', controller.getGroups);
router.get('/:id', controller.getGroup);
router.post('/', controller.createGroup);
router.put('/:id', controller.updateGroup);
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

module.exports = router;
