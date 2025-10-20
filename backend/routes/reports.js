const express = require('express');
const { Species, Sighting, Incident, sequelize } = require('../models');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/biodiversity', authenticate, async (req, res) => {
  try {
    const totalSpecies = await Species.count();
    const endangeredSpecies = await Species.count({
      where: {
        conservationStatus: ['EN', 'CR']
      }
    });

    const speciesByStatus = await Species.findAll({
      attributes: [
        'conservationStatus',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['conservationStatus']
    });

    const speciesByCategory = await Species.findAll({
      attributes: [
        'category',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['category']
    });

    const totalSightings = await Sighting.count();
    const totalIncidents = await Incident.count();

    res.json({
      totalSpecies,
      endangeredSpecies,
      totalSightings,
      totalIncidents,
      speciesByStatus,
      speciesByCategory
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/sightings-over-time', authenticate, async (req, res) => {
  try {
    const sightings = await Sighting.findAll({
      attributes: [
        [sequelize.fn('DATE', sequelize.col('sightingDate')), 'date'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: [sequelize.fn('DATE', sequelize.col('sightingDate'))],
      order: [[sequelize.fn('DATE', sequelize.col('sightingDate')), 'ASC']],
      limit: 30
    });

    res.json(sightings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/incidents-summary', authenticate, async (req, res) => {
  try {
    const incidentsByType = await Incident.findAll({
      attributes: [
        'type',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['type']
    });

    const incidentsBySeverity = await Incident.findAll({
      attributes: [
        'severity',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['severity']
    });

    const incidentsByStatus = await Incident.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['status']
    });

    res.json({
      byType: incidentsByType,
      bySeverity: incidentsBySeverity,
      byStatus: incidentsByStatus
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;