const express = require('express');
const { IoTData } = require('../models');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.post('/data', async (req, res) => {
  try {
    const iotData = await IoTData.create(req.body);
    res.status(201).json(iotData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/latest', authenticate, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const iotData = await IoTData.findAll({
      order: [['timestamp', 'DESC']],
      limit
    });
    res.json(iotData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/sensors/:sensorId', authenticate, async (req, res) => {
  try {
    const { sensorId } = req.params;
    const limit = parseInt(req.query.limit) || 20;
    
    const data = await IoTData.findAll({
      where: { sensorId },
      order: [['timestamp', 'DESC']],
      limit
    });
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;