const asyncHandler = require('express-async-handler');
const { handleNotFoundError } = require('../middlewares/errorHandlers');

const Group = require('../models/group');
const Room = require('../models/room');

const checkGroup = asyncHandler(async (req, res, next) => {
  const group = await Group.findById(req.params.id).exec();

  if (!group) {
    handleNotFoundError(req, res, 'Group');
    return;
  }

  next();
});

const getRooms = [
  checkGroup,
  asyncHandler(async (req, res) => {
    const rooms = await Room.find({ group: req.params.id }).exec();
    res.status(200).json({ status: 'success', data: rooms });
  }),
];

const getRoom = [
  checkGroup,
  asyncHandler(async (req, res) => {
    const room = await Room.findById(req.params.roomId).exec();

    if (!room) {
      handleNotFoundError(req, res, 'Room');
      return;
    }

    res.status(200).json({ status: 'success', data: room });
  }),
];

const createRoom = [
  checkGroup,
  asyncHandler(async (req, res) => {
    const newRoom = new Room({
      name: req.body.name,
      group: req.params.id,
    });

    const savedRoom = await newRoom.save();
    res.status(200).json({ status: 'success', data: { savedRoom } });
  }),
];

const updateRoom = [
  checkGroup,
  asyncHandler(async (req, res) => {
    const id = req.params.roomId;
    const payload = new Room({
      name: req.body.name,
      group: req.params.id,
      _id: id,
    });

    const updatedRoom = await Room.findByIdAndUpdate(id, payload, { new: true });

    if (!updatedRoom) {
      handleNotFoundError(req, res, 'Room');
      return;
    }

    res.status(200).json({ status: 'success', data: { updatedRoom } });
  }),
];

const deleteRoom = [
  checkGroup,
  asyncHandler(async (req, res) => {
    const room = await Room.findByIdAndDelete(req.params.roomId).exec();

    if (!room) {
      handleNotFoundError(req, res, 'Room');
      return;
    }

    res.status(200).json({ status: 'success', data: null });
  }),
];

module.exports = {
  getRooms,
  getRoom,
  createRoom,
  updateRoom,
  deleteRoom,
};
