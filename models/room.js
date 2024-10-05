const mongoose = require('mongoose');

const { Schema } = mongoose;

const RoomSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
    /*messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],*/
  },
  { timestamps: true },
);

module.exports = mongoose.model('Room', RoomSchema);
