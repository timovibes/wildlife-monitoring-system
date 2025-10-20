const axios = require('axios');

const API_URL = 'http://localhost:5000/api/iot/data';

// Simulate 5 different wildlife tracking sensors
const sensors = [
  {
    id: 'SENSOR-001',
    name: 'Elephant Tracker Alpha',
    baseLocation: { lat: -1.2921, lng: 36.8219 },
    movementPattern: 'slow' // elephants move slowly
  },
  {
    id: 'SENSOR-002',
    name: 'Cheetah Tracker Beta',
    baseLocation: { lat: -1.3521, lng: 36.7819 },
    movementPattern: 'fast' // cheetahs move quickly
  },
  {
    id: 'SENSOR-003',
    name: 'Rhino Tracker Gamma',
    baseLocation: { lat: -1.2321, lng: 36.8619 },
    movementPattern: 'medium'
  },
  {
    id: 'SENSOR-004',
    name: 'Lion Pride Tracker Delta',
    baseLocation: { lat: -1.3121, lng: 36.8019 },
    movementPattern: 'medium'
  },
  {
    id: 'SENSOR-005',
    name: 'Gorilla Tracker Epsilon',
    baseLocation: { lat: -1.2721, lng: 36.8419 },
    movementPattern: 'slow'
  }
];

// Track current positions
const sensorStates = sensors.map(sensor => ({
  ...sensor,
  currentLat: sensor.baseLocation.lat,
  currentLng: sensor.baseLocation.lng,
  batteryLevel: 100
}));

function getMovementSpeed(pattern) {
  switch (pattern) {
    case 'fast':
      return 0.005; // Cheetahs cover more ground
    case 'medium':
      return 0.002;
    case 'slow':
      return 0.001;
    default:
      return 0.002;
  }
}

function generateSensorData(sensorState) {
  const speed = getMovementSpeed(sensorState.movementPattern);
  
  // Random movement
  const latChange = (Math.random() - 0.5) * speed;
  const lngChange = (Math.random() - 0.5) * speed;
  
  // Update position
  sensorState.currentLat += latChange;
  sensorState.currentLng += lngChange;
  
  // Keep within reasonable bounds (return to base if too far)
  const distance = Math.sqrt(
    Math.pow(sensorState.currentLat - sensorState.baseLocation.lat, 2) +
    Math.pow(sensorState.currentLng - sensorState.baseLocation.lng, 2)
  );
  
  if (distance > 0.1) {
    sensorState.currentLat = sensorState.baseLocation.lat + (Math.random() - 0.5) * 0.05;
    sensorState.currentLng = sensorState.baseLocation.lng + (Math.random() - 0.5) * 0.05;
  }
  
  // Simulate battery drain (very slow)
  sensorState.batteryLevel = Math.max(50, sensorState.batteryLevel - Math.random() * 0.1);
  
  return {
    sensorId: sensorState.id,
    latitude: parseFloat(sensorState.currentLat.toFixed(6)),
    longitude: parseFloat(sensorState.currentLng.toFixed(6)),
    temperature: parseFloat((20 + Math.random() * 15).toFixed(2)), // 20-35°C
    motion: Math.random() > 0.3, // 70% chance of motion
    batteryLevel: Math.round(sensorState.batteryLevel),
    timestamp: new Date().toISOString()
  };
}

async function sendSensorData(data) {
  try {
    await axios.post(API_URL, data);
    console.log(`✅ [${data.sensorId}] Data sent - Lat: ${data.latitude}, Lng: ${data.longitude}, Temp: ${data.temperature}°C, Motion: ${data.motion}, Battery: ${data.batteryLevel}%`);
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log('⚠️  Backend not available. Make sure the server is running on http://localhost:5000');
    } else {
      console.error(`❌ [${data.sensorId}] Error sending data:`, error.message);
    }
  }
}

function startSimulation() {
  console.log('🌍 Wildlife IoT Sensor Simulator Started');
  console.log('📡 Simulating', sensors.length, 'wildlife tracking sensors');
  console.log('🔄 Sending data every 5 seconds...\n');
  
  // Send data from all sensors every 5 seconds
  setInterval(() => {
    sensorStates.forEach(sensorState => {
      const data = generateSensorData(sensorState);
      sendSensorData(data);
    });
    console.log('---');
  }, 5000);
  
  // Initial data send
  sensorStates.forEach(sensorState => {
    const data = generateSensorData(sensorState);
    sendSensorData(data);
  });
}

// Start the simulator
startSimulation();