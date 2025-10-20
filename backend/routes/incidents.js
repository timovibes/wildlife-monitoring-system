const express = require('express');
const { Incident, User } = require('../models');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
  try {
    const incidents = await Incident.findAll({
      include: [
        { model: User, as: 'reporter', attributes: ['id', 'name', 'email'] }
      ],
      order: [['incidentDate', 'DESC']]
    });
    res.json(incidents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', authenticate, async (req, res) => {
  try {
    const incident = await Incident.create({
      ...req.body,
      reportedBy: req.user.id
    });
    
    const fullIncident = await Incident.findByPk(incident.id, {
      include: [
        { model: User, as: 'reporter', attributes: ['id', 'name', 'email'] }
      ]
    });
    
    res.status(201).json(fullIncident);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', authenticate, async (req, res) => {
  try {
    const incident = await Incident.findByPk(req.params.id);
    if (!incident) {
      return res.status(404).json({ error: 'Incident not found' });
    }
    await incident.update(req.body);
    
    const updated = await Incident.findByPk(incident.id, {
      include: [
        { model: User, as: 'reporter', attributes: ['id', 'name', 'email'] }
      ]
    });
    
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', authenticate, async (req, res) => {
  try {
    const incident = await Incident.findByPk(req.params.id);
    if (!incident) {
      return res.status(404).json({ error: 'Incident not found' });
    }
    await incident.destroy();
    res.json({ message: 'Incident deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;