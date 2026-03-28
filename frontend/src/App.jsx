import React, { useState, useEffect } from 'react';
import { Settings, Map as MapIcon, BarChart3, CloudSnow, BrainCircuit, ShieldAlert } from 'lucide-react';
import './index.css';
import MapView from './components/MapView';
import { SnowCoverChart, TemperatureChart, EconomicImpactChart, LakeExpansionChart } from './components/TimeSeriesChart';
import DataAnalysisTab from './components/DataAnalysisTab';
import MisinfoTab from './components/MisinfoTab';
import StabilityTab from './components/StabilityTab';
import { Mountain } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => (
  <aside className="sidebar glass-header">
    <div className="logo">
      <CloudSnow className="logo-icon" size={28} />
      <h2>Alpine.AI</h2>
    </div>
    <div className="divider"></div>
    <nav className="nav-menu">
      <button onClick={() => setActiveTab('dashboard')} className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', outline: 'none' }}><BarChart3 size={20} /> Dashboard</button>
      <button onClick={() => setActiveTab('analysis')} className={`nav-item ${activeTab === 'analysis' ? 'active' : ''}`} style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', outline: 'none' }}><BrainCircuit size={20} /> Data Analysis</button>
      <button onClick={() => setActiveTab('stability')} className={`nav-item ${activeTab === 'stability' ? 'active' : ''}`} style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', outline: 'none' }}><Mountain size={20} /> Stability Monitor</button>
      <button onClick={() => setActiveTab('misinfo')} className={`nav-item ${activeTab === 'misinfo' ? 'active' : ''}`} style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', outline: 'none' }}><ShieldAlert size={20} /> Misinfo Analytics</button>
      <button className="nav-item" style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', outline: 'none' }}><MapIcon size={20} /> Spatial Map</button>
    </nav>
  </aside>
);

const Header = () => (
  <header className="header glass-header">
    <div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Alps Region Overview</h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>Landsat 1980s+ Tracking & Transformer Climate Forecasting</p>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <div style={{ padding: '8px 16px', borderRadius: '20px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success-color)', fontSize: '0.85rem', fontWeight: 500 }}>
        ● Live API Sync
      </div>
    </div>
  </header>
);

const StatCards = ({ data }) => {
  const current = data.find(d => d.year === "2024") || data[data.length - 1] || {};
  
  return (
    <div className="stat-cards-container">
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500, marginBottom: '8px' }}>Current Snow Cover</h3>
        <div style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '8px' }}>
          {current.snow_cover ? `${current.snow_cover}%` : '--'}
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--danger-color)' }}>Declining trend</p>
      </div>
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500, marginBottom: '8px' }}>Avg Winter Temp</h3>
        <div style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '8px' }}>
          {current.temp != null ? `${current.temp} °C` : '--'}
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--danger-color)' }}>Increasing</p>
      </div>
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500, marginBottom: '8px' }}>Forecast Horizon</h3>
        <div style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '8px' }}>Decadal</div>
        <p style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>1984 – 2024</p>
      </div>
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500, marginBottom: '8px' }}>Adaptation Spending</h3>
        <div style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '8px' }}>
          {current.adaptation_spending ? `€${current.adaptation_spending}M` : '--'}
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--danger-color)' }}>Rising Costs</p>
      </div>
    </div>
  );
};

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [data, setData] = useState([]);
  const [rationale, setRationale] = useState('');

  useEffect(() => {
    fetch('http://localhost:8000/api/climate-data')
      .then(res => res.json())
      .then(result => {
        setData(result.full_series);
        setRationale(result.rationale);
      })
      .catch(err => console.error("Error fetching ML prediction:", err));
  }, []);

  const currentYearData = data.find(d => d.year === "2024") || {};

  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="content">
        <header className="top-header glass-header">
          <h1>European Alps Climate Insights</h1>
          <div className="date-badge">Live Satellite Analysis (ERA5)</div>
        </header>

        {activeTab === 'dashboard' ? (
          <div className="dashboard-grid">
            <StatCards data={data} />

            <div style={{ gridColumn: 'span 8', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <MapView />

              {/* AI Insights Panel */}
              <div className="glass-panel" style={{ padding: '24px', borderLeft: '4px solid #8b5cf6' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <BrainCircuit color="#8b5cf6" size={24} />
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#f3f4f6' }}>AI Model Rationale (PyTorch Time-Series Transformer)</h3>
                </div>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.95rem' }}>
                  {rationale || 'Generating AI insights...'}
                </p>
              </div>
            </div>

            <div className="chart-container">
              <SnowCoverChart data={data} />
              <LakeExpansionChart data={data} />
              <TemperatureChart data={data} />
              <EconomicImpactChart data={data} />
            </div>
          </div>
        ) : activeTab === 'analysis' ? (
          <div style={{ padding: '24px 0' }}>
            <DataAnalysisTab />
          </div>
        ) : activeTab === 'stability' ? (
          <div style={{ padding: '24px 0' }}>
            <StabilityTab data={data} rationale={rationale} />
          </div>
        ) : (
          <div style={{ padding: '24px 0' }}>
            <MisinfoTab />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
