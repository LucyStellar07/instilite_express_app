const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config/config');

const sequelize = new Sequelize(config.mysql.database, config.mysql.username, config.mysql.password, {
    host: config.mysql.host,
    dialect: 'mysql',
    logging: false,
  });

const Club = sequelize.define('Club', {
  club_name: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true
  },
  club_desc: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: false
  },
  club_web: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: false
  },
  club_apps: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: false
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    primaryKey: false
  },
}, {
  tableName: 'club',
  timestamps: false
});
console.log("created");
module.exports = Club;
