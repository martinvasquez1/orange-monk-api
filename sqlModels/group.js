const { DataTypes } = require('sequelize');
const { sequelize } = require('./../config/postgres');

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
  },
  {
    timestamps: true,
  },
);

module.exports = Group;
