const mongoose = require('mongoose');

const { Schema } = mongoose;

const GroupSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: 'Welcome!' },
    private: { type: Boolean, required: true, default: true },
    joinRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Group', GroupSchema);
