const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Complaint = sequelize.define('Complaint', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  imageUrl: {
    type: DataTypes.STRING, // Store the Cloudinary URL here
  },
  status: {
    type: DataTypes.ENUM('pending', 'resolved', 'in-progress'), 
    defaultValue: 'pending',
  },
});

module.exports = Complaint;