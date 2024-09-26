const { DataTypes } = require('sequelize');
const { sequelize } = require('./../config/postgres');
const User = require('./user');
const Post = require('./post');

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

Comment.belongsTo(Post, { foreignKey: 'postId', onDelete: 'CASCADE' });
Comment.belongsTo(User, { foreignKey: 'authorId' });

Post.hasMany(Comment, { foreignKey: 'postId' });

module.exports = Comment;
