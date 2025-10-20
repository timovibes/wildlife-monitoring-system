import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { getIncidents, createIncident, updateIncident, deleteIncident } from '../services/api';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Custom icon for incidents
const incidentIcon = L.divIcon({
  className: 'custom-icon',
  html: '<div style="background-color: #EF4444; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>',
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

const Incidents = () => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingIncident, setEditingIncident] = useState(null);
  const [formData, setFormData] = useState({
    type: 'Poaching',
    severity: 'Medium',
    latitude: -1.2921,
    longitude: 36.8219,
    description: '',
    status: 'Reported',
    incidentDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchIncidents();
  }, []);

  const fetchIncidents = async () => {
    try {
      const response = await getIncidents();
      setIncidents(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching incidents:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingIncident) {
        await updateIncident(editingIncident.id, formData);
      } else {
        await createIncident(formData);
      }
      fetchIncidents();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving incident:', error);
      alert('Error saving incident');
    }
  };

  const handleEdit = (incident) => {
    setEditingIncident(incident);
    setFormData({
      type: incident.type,
      severity: incident.severity,
      latitude: incident.latitude,
      longitude: incident.longitude,
      description: incident.description,
      status: incident.status,
      incidentDate: new Date(incident.incidentDate).toISOString().split('T')[0]
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this incident?')) return;
    try {
      await deleteIncident(id);
      fetchIncidents();
    } catch (error) {
      console.error('Error deleting incident:', error);
      alert('Error deleting incident');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingIncident(null);
    setFormData({
      type: 'Poaching',
      severity: 'Medium',
      latitude: -1.2921,
      longitude: 36.8219,
      description: '',
      status: 'Reported',
      incidentDate: new Date().toISOString().split('T')[0]
    });
  };

  const getSeverityColor = (severity) => {
    const colors = {
      Low: 'bg-yellow-400',
      Medium: 'bg-orange-400',
      High: 'bg-red-500',
      Critical: 'bg-red-700'
    };
    return colors[severity] || 'bg-gray-500';
  };

  const getStatusColor = (status) => {
    const colors = {
      Reported: 'bg-blue-500',
      Investigating: 'bg-yellow-500',
      Resolved: 'bg-green-500',
      Closed: 'bg-gray-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  if (loading) {
    return (
      <Layout>
        <div className="glass-card rounded-2xl p-8 text-center text-white">
          Loading incidents data...
        </div>
      </Layout>
    );
  }

  const center = [-1.2921, 36.8219];

  return (
    <Layout>
      <div className="space-y-6">
        <div className="glass-card rounded-2xl p-6 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-white">⚠️ Incident Management</h2>
            <p className="text-white/70 mt-1">Track and respond to wildlife incidents</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="glass-button px-6 py-3 rounded-lg font-semibold text-white"
          >
            + Report Incident
          </button>
        </div>

        {/* Map */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">📍 Incident Locations</h3>
          <div className="h-96 rounded-2xl overflow-hidden">
            <MapContainer center={center} zoom={11} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {incidents.map((incident) => (
                <Marker key={incident.id} position={[incident.latitude, incident.longitude]} icon={incidentIcon}>
                  <Popup>
                    <div className="font-semibold text-red-600">{incident.type}</div>
                    <div className="text-sm">
                      <p>Severity: {incident.severity}</p>
                      <p>Status: {incident.status}</p>
                      <p>Date: {new Date(incident.incidentDate).toLocaleDateString()}</p>
                      <p className="text-xs">By: {incident.reporter?.name}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>

        {/* Incidents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {incidents.map((incident) => (
            <div key={incident.id} className="glass-card rounded-2xl p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">{incident.type}</h3>
                  <p className="text-white/60 text-sm">
                    {new Date(incident.incidentDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <span className={`${getSeverityColor(incident.severity)} text-white text-xs font-bold px-3 py-1 rounded-full`}>
                    {incident.severity}
                  </span>
                  <span className={`${getStatusColor(incident.status)} text-white text-xs font-bold px-3 py-1 rounded-full`}>
                    {incident.status}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-white/80 text-sm mb-4">
                <p><span className="font-semibold">Location:</span> {incident.latitude.toFixed(4)}, {incident.longitude.toFixed(4)}</p>
                <p><span className="font-semibold">Reported by:</span> {incident.reporter?.name}</p>
                <p className="text-white/70">{incident.description}</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(incident)}
                  className="glass-button flex-1 py-2 rounded-lg text-white font-semibold text-sm"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDelete(incident.id)}
                  className="glass-button flex-1 py-2 rounded-lg text-white font-semibold text-sm bg-red-500/20"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="glass-card rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h3 className="text-2xl font-bold text-white mb-6">
                {editingIncident ? 'Update Incident' : 'Report New Incident'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-semibold mb-2">Type</label>
                    <select
                      className="glass-input w-full px-4 py-2 rounded-lg"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      required
                    >
                      <option value="Poaching">Poaching</option>
                      <option value="Human-Wildlife Conflict">Human-Wildlife Conflict</option>
                      <option value="Habitat Destruction">Habitat Destruction</option>
                      <option value="Illegal Logging">Illegal Logging</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-white font-semibold mb-2">Severity</label>
                    <select
                      className="glass-input w-full px-4 py-2 rounded-lg"
                      value={formData.severity}
                      onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                      required
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-semibold mb-2">Latitude</label>
                    <input
                      type="number"
                      step="0.000001"
                      className="glass-input w-full px-4 py-2 rounded-lg"
                      value={formData.latitude}
                      onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white font-semibold mb-2">Longitude</label>
                    <input
                      type="number"
                      step="0.000001"
                      className="glass-input w-full px-4 py-2 rounded-lg"
                      value={formData.longitude}
                      onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-semibold mb-2">Status</label>
                    <select
                      className="glass-input w-full px-4 py-2 rounded-lg"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      required
                    >
                      <option value="Reported">Reported</option>
                      <option value="Investigating">Investigating</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-white font-semibold mb-2">Date</label>
                    <input
                      type="date"
                      className="glass-input w-full px-4 py-2 rounded-lg"
                      value={formData.incidentDate}
                      onChange={(e) => setFormData({ ...formData, incidentDate: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">Description</label>
                  <textarea
                    className="glass-input w-full px-4 py-2 rounded-lg"
                    rows="4"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Detailed description of the incident..."
                    required
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="glass-button flex-1 py-3 rounded-lg font-semibold text-white"
                  >
                    {editingIncident ? 'Update' : 'Report'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="glass-button flex-1 py-3 rounded-lg font-semibold text-white bg-red-500/20"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Incidents;