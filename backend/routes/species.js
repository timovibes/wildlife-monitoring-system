const express = require('express');
const { Species } = require('../models');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
  try {
    const species = await Species.findAll({ order: [['commonName', 'ASC']] });
    res.json(species);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', authenticate, async (req, res) => {
  try {
    const species = await Species.findByPk(req.params.id);
    if (!species) {
      return res.status(404).json({ error: 'Species not found' });
    }
    res.json(species);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', authenticate, authorize('Admin'), async (req, res) => {
  try {
    const species = await Species.create(req.body);
    res.status(201).json(species);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', authenticate, authorize('Admin'), async (req, res) => {
  try {
    const species = await Species.findByPk(req.params.id);
    if (!species) {
      return res.status(404).json({ error: 'Species not found' });
    }
    await species.update(req.body);
    res.json(species);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', authenticate, authorize('Admin'), async (req, res) => {
  try {
    const species = await Species.findByPk(req.params.id);
    if (!species) {
      return res.status(404).json({ error: 'Species not found' });
    }
    await species.destroy();
    res.json({ message: 'Species deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;