import React, { useState, useEffect } from 'react';
import { Settings, Map as MapIcon, BarChart3, CloudSnow, BrainCircuit } from 'lucide-react';
import './index.css';
import MapView from './components/MapView';
import { SnowCoverChart, TemperatureChart, EconomicImpactChart, LakeExpansionChart } from './components/TimeSeriesChart';
import DataAnalysisTab from './components/DataAnalysisTab';

const Sidebar = ({ activeTab, setActiveTab }) => (
  <aside className="sidebar glass-header">
    <div className="logo">
      <CloudSnow className="logo-icon" size={28} />
      <h2>Alpine.AI</h2>
    </div>
    <div className="divider"></div>
    <nav className="nav-menu">
      <button onClick={() => setActiveTab('dashboard')} className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', outline: 'none' }}><BarChart3 size={20}/> Dashboard</button>
      <button onClick={() => setActiveTab('analysis')} className={`nav-item ${activeTab === 'analysis' ? 'active' : ''}`} style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', outline: 'none' }}><BrainCircuit size={20}/> Data Analysis</button>
      <button className="nav-item" style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', outline: 'none' }}><MapIcon size={20}/> Spatial Map</button>
      <button className="nav-item" style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', outline: 'none' }}><Settings size={20}/> Settings</button>
    </nav>
  </aside>
);

const Header = () => (
  <header className="header glass-header">
    <div>
      <h2 style={{fontSize: '1.5rem', fontWeight: 600}}>Alps Region Overview</h2>
      <p style={{color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px'}}>Landsat 1980s+ Tracking & Transformer Climate Forecasting</p>
    </div>
    <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
      <div style={{padding: '8px 16px', borderRadius: '20px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success-color)', fontSize: '0.85rem', fontWeight: 500}}>
        ● Live API Sync
      </div>
    </div>
  </header>
);

const StatCards = ({ currentSnow, currentTemp }) => (
  <div className="stat-cards-container">
    <div className="glass-panel" style={{padding: '24px'}}>
      <h3 style={{color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500, marginBottom: '8px'}}>Current Snow Cover</h3>
      <div style={{fontSize: '2rem', fontWeight: 700, marginBottom: '8px'}}>{currentSnow ? currentSnow + 'k km²' : 'Loading...'}</div>
      <p style={{fontSize: '0.8rem', color: 'var(--danger-color)'}}>Declining trend</p>
    </div>
    <div className="glass-panel" style={{padding: '24px'}}>
      <h3 style={{color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500, marginBottom: '8px'}}>Avg Winter Temp</h3>
      <div style={{fontSize: '2rem', fontWeight: 700, marginBottom: '8px'}}>{currentTemp ? currentTemp + ' °C' : 'Loading...'}</div>
      <p style={{fontSize: '0.8rem', color: 'var(--danger-color)'}}>Increasing</p>
    </div>
    <div className="glass-panel" style={{padding: '24px'}}>
      <h3 style={{color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500, marginBottom: '8px'}}>Forecast Horizon</h3>
      <div style={{fontSize: '2rem', fontWeight: 700, marginBottom: '8px'}}>10 Years</div>
      <p style={{fontSize: '0.8rem', color: 'var(--accent-color)'}}>PyTorch Transformer </p>
    </div>
    <div className="glass-panel" style={{padding: '24px'}}>
      <h3 style={{color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500, marginBottom: '8px'}}>Adaptation Exps</h3>
      <div style={{fontSize: '2rem', fontWeight: 700, marginBottom: '8px'}}>^ 340%</div>
      <p style={{fontSize: '0.8rem', color: 'var(--danger-color)'}}>Deficit Alert</p>
    </div>
  </div>
);

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
          <StatCards currentSnow={currentYearData?.snow_cover} currentTemp={currentYearData?.temp} />
          
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
        ) : (
          <div style={{ padding: '24px 0' }}>
             <DataAnalysisTab />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
