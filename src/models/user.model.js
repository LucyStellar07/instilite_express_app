const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config/config');

// Initialize Sequelize with database configuration
const sequelize = new Sequelize(config.mysql.database, config.mysql.username, config.mysql.password, {
  host: config.mysql.host,
  dialect: 'mysql',
  logging: false,
});

// Define the User model to match the users table
const User = sequelize.define('User', {
  user_id: {
    type: DataTypes.STRING(20),
    allowNull: false,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING(10),
    allowNull: false,
  },
  pass_word: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('0', '1'),
    allowNull: false,
  },
  smail: {
    type: DataTypes.STRING(25),
    allowNull: false,
  },
  events_attended: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: null,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
  },
}, {
  tableName: 'users',
  timestamps: false, // Since created_at and updated_at are manually managed
  underscored: true, // If you want to match the snake_case naming convention
});

module.exports = User;
