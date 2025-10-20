import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { getSpecies, createSpecies, updateSpecies, deleteSpecies } from '../services/api';

const Species = () => {
  const [species, setSpecies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSpecies, setEditingSpecies] = useState(null);
  const [formData, setFormData] = useState({
    commonName: '',
    scientificName: '',
    category: '',
    conservationStatus: 'LC',
    habitat: '',
    population: 0,
    description: ''
  });

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'Admin';

  useEffect(() => {
    fetchSpecies();
  }, []);

  const fetchSpecies = async () => {
    try {
      const response = await getSpecies();
      setSpecies(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching species:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSpecies) {
        await updateSpecies(editingSpecies.id, formData);
      } else {
        await createSpecies(formData);
      }
      fetchSpecies();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving species:', error);
      alert('Error saving species');
    }
  };

  const handleEdit = (sp) => {
    setEditingSpecies(sp);
    setFormData(sp);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this species?')) return;
    try {
      await deleteSpecies(id);
      fetchSpecies();
    } catch (error) {
      console.error('Error deleting species:', error);
      alert('Error deleting species');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingSpecies(null);
    setFormData({
      commonName: '',
      scientificName: '',
      category: '',
      conservationStatus: 'LC',
      habitat: '',
      population: 0,
      description: ''
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      LC: 'bg-green-500',
      NT: 'bg-yellow-400',
      VU: 'bg-orange-400',
      EN: 'bg-red-500',
      CR: 'bg-red-700',
      EW: 'bg-purple-500',
      EX: 'bg-gray-700'
    };
    return colors[status] || 'bg-gray-500';
  };

  if (loading) {
    return (
      <Layout>
        <div className="glass-card rounded-2xl p-8 text-center text-white">
          Loading species data...
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="glass-card rounded-2xl p-6 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-white">🦁 Species Management</h2>
            <p className="text-white/70 mt-1">Track and manage wildlife species</p>
          </div>
          {isAdmin && (
            <button
              onClick={() => setShowModal(true)}
              className="glass-button px-6 py-3 rounded-lg font-semibold text-white"
            >
              + Add Species
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {species.map((sp) => (
            <div key={sp.id} className="glass-card rounded-2xl p-6 hover:scale-105 transition-transform">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">{sp.commonName}</h3>
                  <p className="text-white/60 text-sm italic">{sp.scientificName}</p>
                </div>
                <span className={`${getStatusColor(sp.conservationStatus)} text-white text-xs font-bold px-3 py-1 rounded-full`}>
                  {sp.conservationStatus}
                </span>
              </div>

              <div className="space-y-2 text-white/80 text-sm">
                <p><span className="font-semibold">Category:</span> {sp.category}</p>
                <p><span className="font-semibold">Habitat:</span> {sp.habitat}</p>
                <p><span className="font-semibold">Population:</span> {sp.population.toLocaleString()}</p>
                <p className="text-xs">{sp.description}</p>
              </div>

              {isAdmin && (
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleEdit(sp)}
                    className="glass-button flex-1 py-2 rounded-lg text-white font-semibold text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(sp.id)}
                    className="glass-button flex-1 py-2 rounded-lg text-white font-semibold text-sm bg-red-500/20"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="glass-card rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h3 className="text-2xl font-bold text-white mb-6">
                {editingSpecies ? 'Edit Species' : 'Add New Species'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-semibold mb-2">Common Name</label>
                    <input
                      type="text"
                      className="glass-input w-full px-4 py-2 rounded-lg"
                      value={formData.commonName}
                      onChange={(e) => setFormData({ ...formData, commonName: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white font-semibold mb-2">Scientific Name</label>
                    <input
                      type="text"
                      className="glass-input w-full px-4 py-2 rounded-lg"
                      value={formData.scientificName}
                      onChange={(e) => setFormData({ ...formData, scientificName: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-semibold mb-2">Category</label>
                    <input
                      type="text"
                      className="glass-input w-full px-4 py-2 rounded-lg"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder="Mammal, Bird, Reptile..."
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white font-semibold mb-2">Conservation Status</label>
                    <select
                      className="glass-input w-full px-4 py-2 rounded-lg"
                      value={formData.conservationStatus}
                      onChange={(e) => setFormData({ ...formData, conservationStatus: e.target.value })}
                    >
                      <option value="LC">Least Concern</option>
                      <option value="NT">Near Threatened</option>
                      <option value="VU">Vulnerable</option>
                      <option value="EN">Endangered</option>
                      <option value="CR">Critically Endangered</option>
                      <option value="EW">Extinct in Wild</option>
                      <option value="EX">Extinct</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-semibold mb-2">Habitat</label>
                    <input
                      type="text"
                      className="glass-input w-full px-4 py-2 rounded-lg"
                      value={formData.habitat}
                      onChange={(e) => setFormData({ ...formData, habitat: e.target.value })}
                      placeholder="Forest, Savanna..."
                    />
                  </div>
                  <div>
                    <label className="block text-white font-semibold mb-2">Population</label>
                    <input
                      type="number"
                      className="glass-input w-full px-4 py-2 rounded-lg"
                      value={formData.population}
                      onChange={(e) => setFormData({ ...formData, population: parseInt(e.target.value) })}
                      min="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">Description</label>
                  <textarea
                    className="glass-input w-full px-4 py-2 rounded-lg"
                    rows="3"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="glass-button flex-1 py-3 rounded-lg font-semibold text-white"
                  >
                    {editingSpecies ? 'Update' : 'Create'}
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

export default Species;