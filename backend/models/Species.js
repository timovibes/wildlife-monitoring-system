const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Species = sequelize.define('Species', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  commonName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  scientificName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false // Mammal, Bird, Reptile, etc.
  },
  conservationStatus: {
    type: DataTypes.ENUM('LC', 'NT', 'VU', 'EN', 'CR', 'EW', 'EX'),
    defaultValue: 'LC' // Least Concern, Near Threatened, Vulnerable, Endangered, Critically Endangered, Extinct in Wild, Extinct
  },
  habitat: {
    type: DataTypes.STRING
  },
  population: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  description: {
    type: DataTypes.TEXT
  }
});

module.exports = Species;