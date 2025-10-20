import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await login(formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-card rounded-3xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">🌍 Wildlife Monitoring</h1>
          <p className="text-white/70">Biodiversity Conservation System</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-white p-4 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-white font-semibold mb-2">Email</label>
            <input
              type="email"
              className="glass-input w-full px-4 py-3 rounded-lg"
              placeholder="admin@wildlife.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-white font-semibold mb-2">Password</label>
            <input
              type="password"
              className="glass-input w-full px-4 py-3 rounded-lg"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="glass-button w-full py-3 rounded-lg font-bold text-white text-lg disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-8 p-4 bg-white/10 rounded-lg">
          <p className="text-white/70 text-sm font-semibold mb-2">Demo Credentials:</p>
          <div className="space-y-1 text-xs text-white/60">
            <p>Admin: admin@wildlife.com / admin123</p>
            <p>Ranger: ranger@wildlife.com / ranger123</p>
            <p>Researcher: researcher@wildlife.com / researcher123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;