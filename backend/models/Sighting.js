const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Sighting = sequelize.define('Sighting', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  speciesId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Species',
      key: 'id'
    }
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  latitude: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: -90,
      max: 90
    }
  },
  longitude: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: -180,
      max: 180
    }
  },
  count: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  behavior: {
    type: DataTypes.STRING
  },
  notes: {
    type: DataTypes.TEXT
  },
  sightingDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

module.exports = Sighting;