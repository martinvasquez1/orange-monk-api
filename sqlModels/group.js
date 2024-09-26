const { DataTypes } = require('sequelize');
const { sequelize } = require('./../config/postgres');
const User = require('./user');

const Group = sequelize.define(
  'Group',
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      trim: true,
    },
    description: {
      type: DataTypes.STRING,
      defaultValue: 'Welcome!',
    },
    private: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
    joinRequests: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: true,
    },
    owner: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  },
);

Group.belongsTo(User, { foreignKey: 'owner' });

module.exports = Group;
