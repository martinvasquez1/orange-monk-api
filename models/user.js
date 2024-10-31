const mongoose = require('mongoose');
const getRandomColor = require('./../utils/getRandomColor');

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    username: { type: String, minLength: 3, maxLength: 32, unique: true, required: true },
    email: { type: String, minLength: 5, maxLength: 256, unique: true, required: true },
    password: { type: String, minLength: 3, maxLength: 512, required: true },
    profilePicture: { type: String },
    placeholderColor: { type: String, default: getRandomColor, required: true },
    bio: { type: String, default: 'I like ice cream.' },
    role: { type: String, enum: ['basic', 'admin'], default: 'basic', required: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model('User', UserSchema);
