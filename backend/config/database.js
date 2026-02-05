require('dotenv').config();
const { Sequelize } = require('sequelize');

// Update these with your local Postgres credentials
const sequelize = new Sequelize(
  process.env.DB_NAME,     // e.g., 'society_db'
  process.env.DB_USER,     // e.g., 'postgres'
  process.env.DB_PASS,     // e.g., 'your_password'
  {
    host: process.env.DB_HOST, // 'localhost'
    dialect: 'postgres',
    logging: false, // Set to true if you want to see raw SQL queries
  }
);

module.exports = sequelize;