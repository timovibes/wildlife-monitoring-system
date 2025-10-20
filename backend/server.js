const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./models');
const authRoutes = require('./routes/auth');
const speciesRoutes = require('./routes/species');
const sightingsRoutes = require('./routes/sightings');
const incidentsRoutes = require('./routes/incidents');
const reportsRoutes = require('./routes/reports');
const iotRoutes = require('./routes/iot');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/species', speciesRoutes);
app.use('/api/sightings', sightingsRoutes);
app.use('/api/incidents', incidentsRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/iot', iotRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Wildlife Monitoring API is running' });
});

// Sync database and start server
const startServer = async () => {
  try {
    await db.sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
    
    await db.sequelize.sync({ alter: true });
    console.log('✅ Database models synchronized.');
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    process.exit(1);
  }
};

startServer();