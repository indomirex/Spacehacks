import React, { useState } from 'react';
import { BrainCircuit, Loader2, Maximize, AlertTriangle } from 'lucide-react';

const DataAnalysisTab = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const runAnalysis = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:8000/api/spatial-analysis');
      const result = await res.json();
      if (result.status === 'success') {
        setData(result.data);
      } else {
        setError(result.message || 'API error occurred');
      }
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="glass-panel" style={{ padding: '32px', minHeight: '600px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', gap: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <BrainCircuit size={28} style={{ color: 'var(--accent-color)' }} />
            GEE Spectral False-Color Context Analysis
          </h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.5' }}>
            Inquires Google Earth Engine for native <strong>Sentinel-2 False-Color composites (SWIR, NIR, Red)</strong> of the Alps focal zones. 
            Our PyTorch algorithm partitions this multiband tensor to calculate dense <code>(Q * K^T / √d)</code> Softmax attention targets, 
            identifying exactly where ice coverage will structurally fail. Mapped target patches are then individually passed through a <strong>5-layer PyTorch Convolutional Decoder (CNN)</strong> to explicitly synthesize and render the 2029 spatial predictive pixels.
          </p>
        </div>
        <button 
          onClick={runAnalysis} 
          disabled={loading}
          style={{
            background: 'var(--accent-color)',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'background 0.3s ease',
            whiteSpace: 'nowrap'
          }}
        >
          {loading ? <Loader2 size={18} className="spin" /> : <Maximize size={18} />}
          {loading ? 'Processing Array...' : 'Run Sequential Analytics'}
        </button>
      </div>

      {error && (
        <div style={{ padding: '16px', background: 'rgba(239, 68, 68, 0.1)', borderLeft: '4px solid #ef4444', borderRadius: '4px', marginBottom: '24px' }}>
          <strong>Processing Error: </strong> {error}
        </div>
      )}

      {!data && !loading && !error && (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', textAlign: 'center', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '12px' }}>
          <div>
            <Maximize size={48} style={{ opacity: 0.2, margin: '0 auto 16px' }} />
            <p>Awaiting execution trigger.<br/>Click "Run Sequential Analytics" to process the 6-step temporal satellite progression.</p>
          </div>
        </div>
      )}

      {data && Array.isArray(data) && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
          {data.map((item, index) => {
            const isFuture = index === data.length - 1;
            return (
              <div key={index} className="glass-panel" style={{ 
                padding: '16px', 
                background: isFuture ? 'rgba(239, 68, 68, 0.05)' : 'rgba(15, 23, 42, 0.6)', 
                border: isFuture ? '2px solid #ef4444' : '1px solid rgba(255,255,255,0.05)' 
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontWeight: 700, fontSize: '1.2rem', color: isFuture ? '#ef4444' : '#3b82f6', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {isFuture && <AlertTriangle size={20} />}
                    {item.year}
                  </h3>
                </div>
                <img 
                  src={`data:image/jpeg;base64,${item.image_b64}`} 
                  alt={`${item.year} satellite`} 
                  style={{ width: '100%', height: 'auto', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }} 
                />
                <p style={{ marginTop: '16px', fontSize: '0.9rem', color: isFuture ? '#fca5a5' : 'var(--text-secondary)' }}>
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DataAnalysisTab;
