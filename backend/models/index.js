const sequelize = require('../config/database');
const User = require('./User');
const Species = require('./Species');
const Sighting = require('./Sighting');
const Incident = require('./Incident');
const IoTData = require('./IoTData');

// Define associations
Species.hasMany(Sighting, { foreignKey: 'speciesId', as: 'sightings' });
Sighting.belongsTo(Species, { foreignKey: 'speciesId', as: 'species' });

User.hasMany(Sighting, { foreignKey: 'userId', as: 'sightings' });
Sighting.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Incident, { foreignKey: 'reportedBy', as: 'incidents' });
Incident.belongsTo(User, { foreignKey: 'reportedBy', as: 'reporter' });

const db = {
  sequelize,
  User,
  Species,
  Sighting,
  Incident,
  IoTData
};

module.exports = db;