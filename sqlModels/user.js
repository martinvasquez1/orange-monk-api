const { DataTypes } = require('sequelize');
const { sequelize } = require('./../config/postgres');

const User = sequelize.define(
  'User',
  {
    username: {
      type: DataTypes.STRING(32),
      allowNull: false,
      unique: true,
      validate: {
        len: [3, 32],
      },
    },
    email: {
      type: DataTypes.STRING(256),
      allowNull: false,
      unique: true,
      validate: {
        len: [5, 256],
      },
    },
    password: {
      type: DataTypes.STRING(512),
      allowNull: false,
      validate: {
        len: [3, 512],
      },
    },
    profilePicture: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bio: {
      type: DataTypes.STRING,
      defaultValue: 'I like ice cream.',
    },
    role: {
      type: DataTypes.ENUM('basic', 'admin'),
      defaultValue: 'basic',
      allowNull: false,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = User;
