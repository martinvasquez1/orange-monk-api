const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/postgres');
const User = require('./user');
const Group = require('./group');

const Post = sequelize.define(
  'Post',
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      trim: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    timestamps: true,
  },
);

Post.belongsTo(User, { foreignKey: 'author' });
Post.belongsTo(Group, { foreignKey: 'group', onDelete: 'CASCADE' });

module.exports = Post;
