const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const IoTData = sequelize.define('IoTData', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  sensorId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  latitude: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  longitude: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  temperature: {
    type: DataTypes.FLOAT
  },
  motion: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  batteryLevel: {
    type: DataTypes.INTEGER,
    defaultValue: 100
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

module.exports = IoTData;