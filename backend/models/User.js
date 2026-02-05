const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('admin', 'resident'),
    defaultValue: 'resident',
  },
  wing: {
    type: DataTypes.STRING, 
    allowNull: true,
  },
  flatNumber: {
    type: DataTypes.STRING, 
    allowNull: true,
  },
  // === NEW FIELDS FOR INVITE FLOW ===
  invitationToken: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  isSetup: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  }
});

module.exports = User;