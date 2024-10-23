const mongoose = require('mongoose');

const { Schema } = mongoose;

const GroupSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: 'Welcome!' },
    private: { type: Boolean, required: true, default: true },
    sidebar: { type: String, default: '' },
    previewImage: { type: String, default: null },
    bannerImage: { type: String, default: null },
    theme: { type: String, default: '' },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Group', GroupSchema);
