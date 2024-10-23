const mongoose = require('mongoose');

const { Schema } = mongoose;

const JoinRequestSchema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
    status: { type: String, enum: ['pending', 'denied'], default: 'pending' },
    deniedAt: { type: Date },
  },
  { timestamps: true },
);

module.exports = mongoose.model('JoinRequest', JoinRequestSchema);
