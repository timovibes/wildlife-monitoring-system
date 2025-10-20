import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import { getLatestIoTData } from '../services/api';

// Fix Leaflet default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Create custom icons for different sensors
const createSensorIcon = (color) => {
  return L.divIcon({
    className: 'custom-icon',
    html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
};

const sensorColors = {
  'SENSOR-001': '#FF6B6B',
  'SENSOR-002': '#4ECDC4',
  'SENSOR-003': '#FFE66D',
  'SENSOR-004': '#95E1D3',
  'SENSOR-005': '#F38181'
};

const LiveMap = () => {
  const [iotData, setIoTData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIoTData();
    const interval = setInterval(fetchIoTData, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchIoTData = async () => {
    try {
      const response = await getLatestIoTData(50);
      setIoTData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching IoT data:', error);
      setLoading(false);
    }
  };

  // Group data by sensor ID and get latest position
  const latestSensorData = {};
  iotData.forEach(data => {
    if (!latestSensorData[data.sensorId] || 
        new Date(data.timestamp) > new Date(latestSensorData[data.sensorId].timestamp)) {
      latestSensorData[data.sensorId] = data;
    }
  });

  if (loading) {
    return (
      <div className="glass-card rounded-2xl p-8 text-center text-white">
        Loading map data...
      </div>
    );
  }

  const center = [-1.2921, 36.8219]; // Nairobi area

  return (
    <div className="h-96 rounded-2xl overflow-hidden shadow-2xl">
      <MapContainer center={center} zoom={11} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {Object.values(latestSensorData).map((data) => (
          <React.Fragment key={data.id}>
            <Marker 
              position={[data.latitude, data.longitude]}
              icon={createSensorIcon(sensorColors[data.sensorId] || '#999')}
            >
              <Popup>
                <div className="font-semibold">{data.sensorId}</div>
                <div className="text-sm">
                  <p>📍 {data.latitude.toFixed(4)}, {data.longitude.toFixed(4)}</p>
                  <p>🌡️ {data.temperature}°C</p>
                  <p>📡 Motion: {data.motion ? 'Yes' : 'No'}</p>
                  <p>🔋 Battery: {data.batteryLevel}%</p>
                  <p className="text-xs text-gray-500">
                    {new Date(data.timestamp).toLocaleString()}
                  </p>
                </div>
              </Popup>
            </Marker>
            {data.motion && (
              <Circle
                center={[data.latitude, data.longitude]}
                radius={200}
                pathOptions={{
                  color: sensorColors[data.sensorId] || '#999',
                  fillColor: sensorColors[data.sensorId] || '#999',
                  fillOpacity: 0.2
                }}
              />
            )}
          </React.Fragment>
        ))}
      </MapContainer>
    </div>
  );
};

export default LiveMap;