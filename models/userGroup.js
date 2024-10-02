const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserGroupSchema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
    role: {
      type: String,
      enum: ['member', 'moderator', 'admin'],
      default: 'member',
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('UserGroup', UserGroupSchema);
