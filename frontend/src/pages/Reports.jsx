import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { getBiodiversityReport, getSightingsOverTime, getIncidentsSummary } from '../services/api';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Reports = () => {
  const [biodiversity, setBiodiversity] = useState(null);
  const [sightingsTimeline, setSightingsTimeline] = useState([]);
  const [incidentsSummary, setIncidentsSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const [bioRes, sightingsRes, incidentsRes] = await Promise.all([
        getBiodiversityReport(),
        getSightingsOverTime(),
        getIncidentsSummary()
      ]);
      setBiodiversity(bioRes.data);
      setSightingsTimeline(sightingsRes.data);
      setIncidentsSummary(incidentsRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching reports:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="glass-card rounded-2xl p-8 text-center text-white">
          Loading reports...
        </div>
      </Layout>
    );
  }

  // Conservation Status Chart
  const statusLabels = {
    LC: 'Least Concern',
    NT: 'Near Threatened',
    VU: 'Vulnerable',
    EN: 'Endangered',
    CR: 'Critically Endangered',
    EW: 'Extinct in Wild',
    EX: 'Extinct'
  };

  const conservationData = {
    labels: biodiversity.speciesByStatus.map(s => statusLabels[s.conservationStatus]),
    datasets: [{
      label: 'Species Count',
      data: biodiversity.speciesByStatus.map(s => parseInt(s.count)),
      backgroundColor: [
        'rgba(34, 197, 94, 0.8)',
        'rgba(250, 204, 21, 0.8)',
        'rgba(249, 115, 22, 0.8)',
        'rgba(239, 68, 68, 0.8)',
        'rgba(185, 28, 28, 0.8)',
        'rgba(147, 51, 234, 0.8)',
        'rgba(107, 114, 128, 0.8)'
      ],
      borderColor: 'rgba(255, 255, 255, 0.8)',
      borderWidth: 2
    }]
  };

  // Species Category Chart
  const categoryData = {
    labels: biodiversity.speciesByCategory.map(c => c.category),
    datasets: [{
      label: 'Species Count',
      data: biodiversity.speciesByCategory.map(c => parseInt(c.count)),
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(139, 92, 246, 0.8)',
        'rgba(236, 72, 153, 0.8)',
        'rgba(20, 184, 166, 0.8)',
        'rgba(251, 146, 60, 0.8)'
      ],
      borderColor: 'rgba(255, 255, 255, 0.8)',
      borderWidth: 2
    }]
  };

  // Sightings Timeline Chart
  const timelineData = {
    labels: sightingsTimeline.map(s => new Date(s.date).toLocaleDateString()),
    datasets: [{
      label: 'Daily Sightings',
      data: sightingsTimeline.map(s => parseInt(s.count)),
      borderColor: 'rgb(34, 197, 94)',
      backgroundColor: 'rgba(34, 197, 94, 0.5)',
      tension: 0.4
    }]
  };

  // Incident Type Chart
  const incidentTypeData = {
    labels: incidentsSummary.byType.map(i => i.type),
    datasets: [{
      label: 'Incident Count',
      data: incidentsSummary.byType.map(i => parseInt(i.count)),
      backgroundColor: [
        'rgba(239, 68, 68, 0.8)',
        'rgba(249, 115, 22, 0.8)',
        'rgba(234, 179, 8, 0.8)',
        'rgba(168, 85, 247, 0.8)',
        'rgba(107, 114, 128, 0.8)'
      ],
      borderColor: 'rgba(255, 255, 255, 0.8)',
      borderWidth: 2
    }]
  };

  // Incident Severity Chart
  const incidentSeverityData = {
    labels: incidentsSummary.bySeverity.map(i => i.severity),
    datasets: [{
      label: 'Incident Count',
      data: incidentsSummary.bySeverity.map(i => parseInt(i.count)),
      backgroundColor: [
        'rgba(250, 204, 21, 0.8)',
        'rgba(249, 115, 22, 0.8)',
        'rgba(239, 68, 68, 0.8)',
        'rgba(185, 28, 28, 0.8)'
      ],
      borderColor: 'rgba(255, 255, 255, 0.8)',
      borderWidth: 2
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: 'white',
          font: { size: 12 }
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

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: 'white',
          font: { size: 12 }
        }
      }
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-3xl font-bold text-white">📈 Biodiversity Health Reports</h2>
          <p className="text-white/70 mt-1">Comprehensive wildlife and conservation analytics</p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-white/70 text-sm font-semibold mb-2">Total Species</h3>
            <p className="text-4xl font-bold text-white">{biodiversity.totalSpecies}</p>
          </div>
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-white/70 text-sm font-semibold mb-2">Endangered Species</h3>
            <p className="text-4xl font-bold text-red-400">{biodiversity.endangeredSpecies}</p>
          </div>
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-white/70 text-sm font-semibold mb-2">Total Sightings</h3>
            <p className="text-4xl font-bold text-green-400">{biodiversity.totalSightings}</p>
          </div>
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-white/70 text-sm font-semibold mb-2">Total Incidents</h3>
            <p className="text-4xl font-bold text-orange-400">{biodiversity.totalIncidents}</p>
          </div>
        </div>

        {/* Conservation Status & Category */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Species by Conservation Status</h3>
            <div className="h-80">
              <Bar data={conservationData} options={chartOptions} />
            </div>
          </div>
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Species by Category</h3>
            <div className="h-80">
              <Doughnut data={categoryData} options={doughnutOptions} />
            </div>
          </div>
        </div>

        {/* Sightings Timeline */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Sightings Over Time (Last 30 Days)</h3>
          <div className="h-80">
            <Line data={timelineData} options={chartOptions} />
          </div>
        </div>

        {/* Incident Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Incidents by Type</h3>
            <div className="h-80">
              <Doughnut data={incidentTypeData} options={doughnutOptions} />
            </div>
          </div>
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Incidents by Severity</h3>
            <div className="h-80">
              <Bar data={incidentSeverityData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Key Insights */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">📊 Key Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/10 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">🦁 Biodiversity Health</h4>
              <p className="text-white/80 text-sm">
                {biodiversity.endangeredSpecies} out of {biodiversity.totalSpecies} species are endangered or critically endangered. 
                This represents {((biodiversity.endangeredSpecies / biodiversity.totalSpecies) * 100).toFixed(1)}% of tracked species.
              </p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">👁️ Monitoring Activity</h4>
              <p className="text-white/80 text-sm">
                {biodiversity.totalSightings} wildlife sightings recorded. Active monitoring helps track 
                population movements and behavior patterns.
              </p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">⚠️ Incident Response</h4>
              <p className="text-white/80 text-sm">
                {biodiversity.totalIncidents} incidents reported. Most common threats include 
                {incidentsSummary.byType.length > 0 ? ` ${incidentsSummary.byType[0].type.toLowerCase()}` : ' various threats'}.
              </p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">📈 Trend Analysis</h4>
              <p className="text-white/80 text-sm">
                {sightingsTimeline.length > 0 
                  ? `Average of ${Math.round(sightingsTimeline.reduce((sum, s) => sum + parseInt(s.count), 0) / sightingsTimeline.length)} sightings per day.`
                  : 'Monitoring activity ongoing.'} 
                Consistent data collection supports conservation efforts.
              </p>
            </div>
          </div>
        </div>

        {/* Export Options */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">📥 Export Reports</h3>
          <div className="flex gap-4 flex-wrap">
            <button className="glass-button px-6 py-3 rounded-lg font-semibold text-white">
              Export as PDF
            </button>
            <button className="glass-button px-6 py-3 rounded-lg font-semibold text-white">
              Export as CSV
            </button>
            <button className="glass-button px-6 py-3 rounded-lg font-semibold text-white">
              Generate Full Report
            </button>
          </div>
          <p className="text-white/60 text-sm mt-4">
            Generate comprehensive reports for stakeholders and conservation partners
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Reports;