const sequelize = require('../config/database');
const User = require('./User');
const MaintenanceBill = require('./MaintenanceBill');
const Complaint = require('./Complaint');
const Notice = require('./Notice'); // <--- 1. Import Notice

// Relationships
User.hasMany(MaintenanceBill, { foreignKey: 'userId' });
MaintenanceBill.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Complaint, { foreignKey: 'userId' });
Complaint.belongsTo(User, { foreignKey: 'userId' });

const db = {
  sequelize,
  User,
  MaintenanceBill,
  Complaint,
  Notice, // <--- 2. Export Notice
};

module.exports = db;