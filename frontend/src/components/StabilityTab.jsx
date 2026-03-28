import React, { useState } from 'react';
import { PermafrostStabilityChart } from './TimeSeriesChart';
import { Mountain, ShieldAlert, Thermometer, TrendingDown, Scan, Loader2, AlertTriangle } from 'lucide-react';

const StabilityTab = ({ data, rationale }) => {
    const currentYearData = data.find(d => d.year === "2024") || {};

    const [loading, setLoading] = useState(false);
    const [imgData, setImgData] = useState(null);
    const [error, setError] = useState(null);

    const runPermafrostAnalysis = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('http://localhost:8000/api/permafrost-analysis');
            const result = await res.json();
            if (result.status === 'success') {
                setImgData(result.data);
            } else {
                setError(result.message || 'API error occurred');
            }
        } catch (err) {
            setError(err.message);
        }
        setLoading(false);
    };

    return (
        <div style={{ padding: '20px', animation: 'fadeIn 0.5s ease-out' }}>
            {/* Header */}
            <div style={{ marginBottom: '30px' }}>
                <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '10px', background: 'linear-gradient(135deg, #fff 0%, #cbd5e1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Permafrost Stability Monitor
                </h1>
                <p style={{ color: 'var(--text-secondary)', maxWidth: '800px' }}>
                    Analyzing ground thermal regimes (ERA5-Land) and vegetative health proxies (Copernicus NDVI) to predict structural risk and rockfall hazards in the high Alps.
                </p>
            </div>

            {/* Stat Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '28px' }}>
                <div className="glass-panel" style={{ padding: '24px', borderLeft: '4px solid #ec4899' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <Thermometer color="#ec4899" size={22} />
                        <h3 style={{ margin: 0, fontSize: '1rem' }}>Active Layer Stability</h3>
                    </div>
                    <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#ec4899', marginBottom: '6px' }}>
                        {currentYearData.stability != null ? `${currentYearData.stability}%` : 'Loading...'}
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>Regional Stability Index</p>
                </div>

                <div className="glass-panel" style={{ padding: '24px', borderLeft: '4px solid #10b981' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <TrendingDown color="#10b981" size={22} />
                        <h3 style={{ margin: 0, fontSize: '1rem' }}>NDVI Vegetation Proxy</h3>
                    </div>
                    <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#10b981', marginBottom: '6px' }}>
                        {currentYearData.ndvi != null ? currentYearData.ndvi : 'Loading...'}
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>Biometric Health Marker</p>
                </div>

                <div className="glass-panel" style={{ padding: '24px', borderLeft: '4px solid #f59e0b' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <ShieldAlert color="#f59e0b" size={22} />
                        <h3 style={{ margin: 0, fontSize: '1rem' }}>Infrastructure Risk</h3>
                    </div>
                    <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#f59e0b', marginBottom: '6px' }}>
                        CRITICAL
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>Rockfall & Foundation Alert</p>
                </div>
            </div>

            {/* Trend Chart + Insights */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '28px' }}>
                <PermafrostStabilityChart data={data} />

                <div className="glass-panel" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                        <Mountain color="#fff" size={22} />
                        <h3 style={{ margin: 0 }}>Stability Insights</h3>
                    </div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.7' }}>
                        <p style={{ marginBottom: '12px' }}>Our vision pipeline detects significant NDVI degradation at altitudes above 2,500m — a reliable proxy for permafrost active-layer thaw.</p>
                        <p style={{ marginBottom: '12px' }}>This correlates with the <strong>thawing of permafrost "glue"</strong> within rock crevices, increasing rockfall probability and structural failure risk.</p>
                        <div style={{ padding: '14px', borderRadius: '8px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', color: '#f59e0b', fontSize: '0.85rem' }}>
                            <strong>Warning:</strong> Structural foundations for lift systems and high-altitude huts in the {currentYearData.year || '2024'} timeframe require urgent monitoring.
                        </div>
                    </div>
                </div>
            </div>

            {/* NDVI Vision Attention Section */}
            <div className="glass-panel" style={{ padding: '28px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', gap: '20px' }}>
                    <div>
                        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Scan size={24} style={{ color: '#f97316' }} />
                            NDVI Spatial Attention — Permafrost Thaw Risk Mapping
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '700px', lineHeight: '1.5' }}>
                            Applies <strong>inverted softmax attention</strong> (<code>1 - softmax(Q·Kᵀ / √d)</code>) to NDVI false-color composites — lowest-NDVI patches receive the highest attention, directly identifying zones of active permafrost thaw, soil erosion, and vegetation die-off.
                        </p>
                    </div>
                    <button
                        onClick={runPermafrostAnalysis}
                        disabled={loading}
                        style={{
                            background: 'linear-gradient(135deg, #f97316, #ef4444)',
                            color: 'white', border: 'none', padding: '12px 22px',
                            borderRadius: '8px', cursor: loading ? 'not-allowed' : 'pointer',
                            fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px',
                            whiteSpace: 'nowrap', opacity: loading ? 0.7 : 1, transition: 'opacity 0.2s'
                        }}
                    >
                        {loading ? <Loader2 size={18} className="spin" /> : <Scan size={18} />}
                        {loading ? 'Processing...' : 'Run Permafrost Analysis'}
                    </button>
                </div>

                {error && (
                    <div style={{ padding: '14px', background: 'rgba(239,68,68,0.1)', borderLeft: '4px solid #ef4444', borderRadius: '4px', marginBottom: '20px', fontSize: '0.9rem' }}>
                        <strong>Error: </strong>{error}
                    </div>
                )}

                {!imgData && !loading && !error && (
                    <div style={{ minHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', textAlign: 'center', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '12px', padding: '40px' }}>
                        <div>
                            <Scan size={48} style={{ opacity: 0.2, margin: '0 auto 16px', display: 'block' }} />
                            <p>Click <strong>Run Permafrost Analysis</strong> to process the 6-step NDVI temporal sequence.<br />
                            Attention weights will highlight the most degraded vegetation zones across each decade.</p>
                        </div>
                    </div>
                )}

                {imgData && Array.isArray(imgData) && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                        {imgData.map((item, index) => {
                            const isFuture = index === imgData.length - 1;
                            return (
                                <div key={index} className="glass-panel" style={{
                                    padding: '16px',
                                    background: isFuture ? 'rgba(239,68,68,0.05)' : 'rgba(15,23,42,0.6)',
                                    border: isFuture ? '2px solid #ef4444' : '1px solid rgba(255,255,255,0.07)'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                        <h3 style={{ fontWeight: 700, fontSize: '1.2rem', color: isFuture ? '#ef4444' : '#f97316', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                                            {isFuture && <AlertTriangle size={18} />}
                                            {item.year}
                                        </h3>
                                        {isFuture && <span style={{ fontSize: '0.75rem', background: 'rgba(239,68,68,0.2)', color: '#ef4444', padding: '3px 8px', borderRadius: '4px', fontWeight: 600 }}>PROJECTED</span>}
                                    </div>
                                    <img
                                        src={`data:image/jpeg;base64,${item.image_b64}`}
                                        alt={`NDVI ${item.year}`}
                                        style={{ width: '100%', height: 'auto', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}
                                    />
                                    <p style={{ marginTop: '12px', fontSize: '0.82rem', color: isFuture ? '#fca5a5' : 'var(--text-secondary)', lineHeight: '1.4' }}>
                                        {item.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StabilityTab;
