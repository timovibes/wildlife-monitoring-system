import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import LiveMap from '../components/LiveMap';
import { getBiodiversityReport, getLatestIoTData } from '../services/api';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [iotData, setIoTData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchIoTData, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, iotRes] = await Promise.all([
        getBiodiversityReport(),
        getLatestIoTData(20)
      ]);
      setStats(statsRes.data);
      setIoTData(iotRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const fetchIoTData = async () => {
    try {
      const response = await getLatestIoTData(20);
      setIoTData(response.data);
    } catch (error) {
      console.error('Error fetching IoT data:', error);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="glass-card rounded-2xl p-8 text-center text-white">
          <p className="text-xl">Loading dashboard...</p>
        </div>
      </Layout>
    );
  }

  // Prepare IoT chart data
  const iotChartData = {
    labels: iotData.slice(0, 10).reverse().map((d, i) => `T-${9 - i}`),
    datasets: [
      {
        label: 'Temperature (°C)',
        data: iotData.slice(0, 10).reverse().map(d => d.temperature),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: 'white'
        }
      }
    },
    scales: {
      x: {
        ticks: { color: 'white' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' }
      },
      y: {
        ticks: { color: 'white' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' }
      }
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm font-semibold">Total Species</p>
                <p className="text-4xl font-bold text-white mt-2">{stats?.totalSpecies || 0}</p>
              </div>
              <div className="text-5xl">🦁</div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm font-semibold">Endangered</p>
                <p className="text-4xl font-bold text-white mt-2">{stats?.endangeredSpecies || 0}</p>
              </div>
              <div className="text-5xl">⚠️</div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm font-semibold">Total Sightings</p>
                <p className="text-4xl font-bold text-white mt-2">{stats?.totalSightings || 0}</p>
              </div>
              <div className="text-5xl">👁️</div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm font-semibold">Total Incidents</p>
                <p className="text-4xl font-bold text-white mt-2">{stats?.totalIncidents || 0}</p>
              </div>
              <div className="text-5xl">🚨</div>
            </div>
          </div>
        </div>

        {/* Live Map */}
        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4">📡 Live Wildlife Tracking (IoT Sensors)</h2>
          <LiveMap />
          <div className="mt-4 flex gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-red-400"></div>
              <span className="text-white text-sm">Elephant Tracker</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-teal-400"></div>
              <span className="text-white text-sm">Cheetah Tracker</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-yellow-400"></div>
              <span className="text-white text-sm">Rhino Tracker</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-green-300"></div>
              <span className="text-white text-sm">Lion Tracker</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-pink-400"></div>
              <span className="text-white text-sm">Gorilla Tracker</span>
            </div>
          </div>
        </div>

        {/* IoT Temperature Chart */}
        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4">🌡️ Real-Time Temperature Data</h2>
          <div className="h-64">
            <Line data={iotChartData} options={chartOptions} />
          </div>
        </div>

        {/* Recent IoT Data Table */}
        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4">📊 Latest Sensor Readings</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-white">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left py-3 px-4">Sensor ID</th>
                  <th className="text-left py-3 px-4">Location</th>
                  <th className="text-left py-3 px-4">Temp</th>
                  <th className="text-left py-3 px-4">Motion</th>
                  <th className="text-left py-3 px-4">Battery</th>
                  <th className="text-left py-3 px-4">Time</th>
                </tr>
              </thead>
              <tbody>
                {iotData.slice(0, 5).map((data) => (
                  <tr key={data.id} className="border-b border-white/10 hover:bg-white/5">
                    <td className="py-3 px-4 font-semibold">{data.sensorId}</td>
                    <td className="py-3 px-4 text-sm">
                      {data.latitude.toFixed(4)}, {data.longitude.toFixed(4)}
                    </td>
                    <td className="py-3 px-4">{data.temperature}°C</td>
                    <td className="py-3 px-4">{data.motion ? '✅' : '❌'}</td>
                    <td className="py-3 px-4">{data.batteryLevel}%</td>
                    <td className="py-3 px-4 text-sm">
                      {new Date(data.timestamp).toLocaleTimeString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;