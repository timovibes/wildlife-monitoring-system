const express = require('express');
const { Sighting, Species, User } = require('../models');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
  try {
    const sightings = await Sighting.findAll({
      include: [
        { model: Species, as: 'species' },
        { model: User, as: 'user', attributes: ['id', 'name', 'email'] }
      ],
      order: [['sightingDate', 'DESC']]
    });
    res.json(sightings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', authenticate, async (req, res) => {
  try {
    const sighting = await Sighting.create({
      ...req.body,
      userId: req.user.id
    });
    
    const fullSighting = await Sighting.findByPk(sighting.id, {
      include: [
        { model: Species, as: 'species' },
        { model: User, as: 'user', attributes: ['id', 'name', 'email'] }
      ]
    });
    
    res.status(201).json(fullSighting);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', authenticate, async (req, res) => {
  try {
    const sighting = await Sighting.findByPk(req.params.id);
    if (!sighting) {
      return res.status(404).json({ error: 'Sighting not found' });
    }
    await sighting.update(req.body);
    
    const updated = await Sighting.findByPk(sighting.id, {
      include: [
        { model: Species, as: 'species' },
        { model: User, as: 'user', attributes: ['id', 'name', 'email'] }
      ]
    });
    
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', authenticate, async (req, res) => {
  try {
    const sighting = await Sighting.findByPk(req.params.id);
    if (!sighting) {
      return res.status(404).json({ error: 'Sighting not found' });
    }
    await sighting.destroy();
    res.json({ message: 'Sighting deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;