const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema({
  username: { type: String, minLength: 3, maxLength: 32, required: true },
  email: { type: String, minLength: 5, maxLength: 256, required: true },
  password: { type: String, minLength: 3, maxLength: 512, required: true },
  role: {
    type: String,
    enum: ['basic', 'admin'],
    default: 'basic',
    required: true,
  },
});

module.exports = mongoose.model('User', UserSchema);
