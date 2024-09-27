const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const mongoDB =
  process.env.NODE_ENV === 'test'
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI;

async function connectMongoDB() {
  if (!mongoDB) {
    console.log('MongoDB connection URL is not defined.');
    return;
  }

  try {
    await mongoose.connect(mongoDB);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error: ', err);
  }
}

module.exports = connectMongoDB;
