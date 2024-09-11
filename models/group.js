const mongoose = require('mongoose');

const { Schema } = mongoose;

const GroupSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: 'Welcome!' },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Group', GroupSchema);
