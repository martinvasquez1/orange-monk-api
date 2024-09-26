const { DataTypes } = require('sequelize');
const { sequelize } = require('./../config/postgres');
const User = require('./User');
const Group = require('./Group');

const UserGroup = sequelize.define(
  'UserGroup',
  {
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'member',
    },
    joinedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
  },
);

User.belongsToMany(Group, { through: UserGroup });
Group.belongsToMany(User, { through: UserGroup });

module.exports = UserGroup;
