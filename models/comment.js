const mongoose = require('mongoose');

const { Schema } = mongoose;

const CommentSchema = new Schema(
  {
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    likes: { type: Number, default: 0 },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Comment', CommentSchema);
