const { DataTypes } = require('sequelize');
const { sequelize } = require('./../config/postgres');
const User = require('./User');
const Group = require('./Group');

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

Post.belongsTo(User, { foreignKey: 'authorId' });
Post.belongsTo(Group, { foreignKey: 'groupId' });

module.exports = Post;
