import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { getSightings, createSighting, updateSighting, deleteSighting, getSpecies } from '../services/api';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

const Sightings = () => {
  const [sightings, setSightings] = useState([]);
  const [species, setSpecies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSighting, setEditingSighting] = useState(null);
  const [formData, setFormData] = useState({
    speciesId: '',
    latitude: -1.2921,
    longitude: 36.8219,
    count: 1,
    behavior: '',
    notes: '',
    sightingDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [sightingsRes, speciesRes] = await Promise.all([
        getSightings(),
        getSpecies()
      ]);
      setSightings(sightingsRes.data);
      setSpecies(speciesRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSighting) {
        await updateSighting(editingSighting.id, formData);
      } else {
        await createSighting(formData);
      }
      fetchData();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving sighting:', error);
      alert('Error saving sighting');
    }
  };

  const handleEdit = (sighting) => {
    setEditingSighting(sighting);
    setFormData({
      speciesId: sighting.speciesId,
      latitude: sighting.latitude,
      longitude: sighting.longitude,
      count: sighting.count,
      behavior: sighting.behavior || '',
      notes: sighting.notes || '',
      sightingDate: new Date(sighting.sightingDate).toISOString().split('T')[0]
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this sighting?')) return;
    try {
      await deleteSighting(id);
      fetchData();
    } catch (error) {
      console.error('Error deleting sighting:', error);
      alert('Error deleting sighting');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingSighting(null);
    setFormData({
      speciesId: '',
      latitude: -1.2921,
      longitude: 36.8219,
      count: 1,
      behavior: '',
      notes: '',
      sightingDate: new Date().toISOString().split('T')[0]
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="glass-card rounded-2xl p-8 text-center text-white">
          Loading sightings data...
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
            <h2 className="text-3xl font-bold text-white">👁️ Wildlife Sightings</h2>
            <p className="text-white/70 mt-1">Record and track wildlife observations</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="glass-button px-6 py-3 rounded-lg font-semibold text-white"
          >
            + Record Sighting
          </button>
        </div>

        {/* Map */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">📍 Sightings Map</h3>
          <div className="h-96 rounded-2xl overflow-hidden">
            <MapContainer center={center} zoom={11} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {sightings.map((sighting) => (
                <Marker key={sighting.id} position={[sighting.latitude, sighting.longitude]}>
                  <Popup>
                    <div className="font-semibold">{sighting.species?.commonName}</div>
                    <div className="text-sm">
                      <p>Count: {sighting.count}</p>
                      <p>Behavior: {sighting.behavior || 'N/A'}</p>
                      <p>Date: {new Date(sighting.sightingDate).toLocaleDateString()}</p>
                      <p className="text-xs">By: {sighting.user?.name}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>

        {/* Sightings Table */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Recent Sightings</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-white">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left py-3 px-4">Date</th>
                  <th className="text-left py-3 px-4">Species</th>
                  <th className="text-left py-3 px-4">Location</th>
                  <th className="text-left py-3 px-4">Count</th>
                  <th className="text-left py-3 px-4">Behavior</th>
                  <th className="text-left py-3 px-4">Reported By</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sightings.map((sighting) => (
                  <tr key={sighting.id} className="border-b border-white/10 hover:bg-white/5">
                    <td className="py-3 px-4">
                      {new Date(sighting.sightingDate).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 font-semibold">
                      {sighting.species?.commonName}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {sighting.latitude.toFixed(4)}, {sighting.longitude.toFixed(4)}
                    </td>
                    <td className="py-3 px-4">{sighting.count}</td>
                    <td className="py-3 px-4">{sighting.behavior || 'N/A'}</td>
                    <td className="py-3 px-4 text-sm">{sighting.user?.name}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(sighting)}
                          className="text-blue-300 hover:text-blue-100 text-sm font-semibold"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(sighting.id)}
                          className="text-red-300 hover:text-red-100 text-sm font-semibold"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="glass-card rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h3 className="text-2xl font-bold text-white mb-6">
                {editingSighting ? 'Edit Sighting' : 'Record New Sighting'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-white font-semibold mb-2">Species</label>
                  <select
                    className="glass-input w-full px-4 py-2 rounded-lg"
                    value={formData.speciesId}
                    onChange={(e) => setFormData({ ...formData, speciesId: e.target.value })}
                    required
                  >
                    <option value="">Select a species...</option>
                    {species.map((sp) => (
                      <option key={sp.id} value={sp.id}>
                        {sp.commonName} ({sp.scientificName})
                      </option>
                    ))}
                  </select>
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
                    <label className="block text-white font-semibold mb-2">Count</label>
                    <input
                      type="number"
                      min="1"
                      className="glass-input w-full px-4 py-2 rounded-lg"
                      value={formData.count}
                      onChange={(e) => setFormData({ ...formData, count: parseInt(e.target.value) })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white font-semibold mb-2">Date</label>
                    <input
                      type="date"
                      className="glass-input w-full px-4 py-2 rounded-lg"
                      value={formData.sightingDate}
                      onChange={(e) => setFormData({ ...formData, sightingDate: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">Behavior</label>
                  <input
                    type="text"
                    className="glass-input w-full px-4 py-2 rounded-lg"
                    value={formData.behavior}
                    onChange={(e) => setFormData({ ...formData, behavior: e.target.value })}
                    placeholder="Feeding, Resting, Moving..."
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">Notes</label>
                  <textarea
                    className="glass-input w-full px-4 py-2 rounded-lg"
                    rows="3"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Additional observations..."
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="glass-button flex-1 py-3 rounded-lg font-semibold text-white"
                  >
                    {editingSighting ? 'Update' : 'Record'}
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

export default Sightings;