const { DataTypes } = require('sequelize');
const { sequelize } = require('./../config/postgres');
const User = require('./User');
const Post = require('./Post');

const Comment = sequelize.define(
  'Comment',
  {
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

Comment.belongsTo(Post, { foreignKey: 'postId' });
Comment.belongsTo(User, { foreignKey: 'authorId' });

Post.hasMany(Comment, { foreignKey: 'postId' });

module.exports = Comment;
