const { DataTypes } = require('sequelize');
const { sequelize } = require('./../config/postgres');
const User = require('./user');
const Group = require('./group');

const UserGroup = sequelize.define(
  'UserGroup',
  {
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'member',
    },
  },
  {
    timestamps: false,
  },
);

User.belongsToMany(Group, {
  through: UserGroup,
  foreignKey: 'userId',
  onDelete: 'CASCADE',
});
Group.belongsToMany(User, {
  through: UserGroup,
  foreignKey: 'groupId',
  onDelete: 'CASCADE',
});

module.exports = UserGroup;
