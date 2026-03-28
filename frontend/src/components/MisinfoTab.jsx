import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';
import { Search, Users, Globe, ExternalLink, ShieldAlert } from 'lucide-react';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const MisinfoTab = () => {
    const [stats, setStats] = useState(null);
    const [searchQuery, setSearchQuery] = useState('global warming is a myth');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searching, setSearching] = useState(false);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const resp = await fetch('http://localhost:8000/api/misinfo-stats');
            const result = await resp.json();
            if (result.status === 'success') {
                setStats(result.data);
            }
        } catch (err) {
            console.error("Error fetching misinfo stats:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        if (!searchQuery) return;
        setSearching(true);
        try {
            const resp = await fetch(`http://localhost:8000/api/search-misinfo?query=${encodeURIComponent(searchQuery)}`);
            const result = await resp.json();
            if (result.status === 'success') {
                setSearchResults(result.results);
            }
        } catch (err) {
            console.error("Error searching misinfo:", err);
        } finally {
            setSearching(false);
        }
    };

    if (loading) return <div className="loading-state">Initializing Neural Misinfo Analytics...</div>;

    const topicData = stats ? Object.entries(stats.topic_breakdown).map(([name, value]) => ({ name, value })) : [];
    const sourceData = stats ? Object.entries(stats.source_breakdown).map(([name, value]) => ({ name, value })) : [];
    const ageData = stats ? Object.entries(stats.age_breakdown).map(([name, value]) => ({ name, value })) : [];

    return (
        <div className="misinfo-tab-container" style={{ padding: '20px', animation: 'fadeIn 0.5s ease-out' }}>
            <div className="header-box" style={{ marginBottom: '30px' }}>
                <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '10px', background: 'linear-gradient(135deg, #fff 0%, #cbd5e1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Climate Misinformation Analytics
                </h1>
                <p style={{ color: 'var(--text-secondary)', maxWidth: '800px' }}>
                    Leveraging the <strong>Climate-Fever dataset</strong> and <strong>K-Nearest Neighbors (KNN)</strong> to analyze the spread, sources, and demographics of climate misinformation clusters.
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                {/* Topic Breakdown Chart */}
                <div className="glass-panel" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                        <Globe size={20} color="#3b82f6" />
                        <h3 style={{ margin: 0 }}>Misinformation Topics (Frequency)</h3>
                    </div>
                    <div style={{ height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={topicData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={true} vertical={false} />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={150} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                                <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Source Analysis */}
                <div className="glass-panel" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                        <ExternalLink size={20} color="#10b981" />
                        <h3 style={{ margin: 0 }}>Top Distribution Sources</h3>
                    </div>
                    <div style={{ height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={sourceData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" label={({name}) => name}>
                                    {sourceData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px', marginBottom: '24px' }}>
                {/* Demographics */}
                <div className="glass-panel" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                        <Users size={20} color="#f59e0b" />
                        <h3 style={{ margin: 0 }}>Spreader Demographics (Age)</h3>
                    </div>
                    <div style={{ height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={ageData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="name" tick={{ fill: 'var(--text-secondary)' }} />
                                <YAxis hide />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                                <Bar dataKey="value" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '10px', fontStyle: 'italic' }}>
                        *Derived via Topic-Cluster probabilistic assignment.
                    </p>
                </div>

                {/* KNN Claim Search */}
                <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                        <Search size={20} color="#8b5cf6" />
                        <h3 style={{ margin: 0 }}>KNN Cluster: Similarity Search</h3>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                        <input 
                            type="text" 
                            className="glass-panel" 
                            style={{ flex: 1, padding: '12px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                            placeholder="Enter a climate claim to find similar misinformation..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button 
                            className="premium-button" 
                            style={{ padding: '0 24px' }}
                            onClick={handleSearch}
                            disabled={searching}
                        >
                            {searching ? 'Processing...' : 'Search Engine'}
                        </button>
                    </div>

                    <div style={{ flex: 1, overflowY: 'auto', maxHeight: '250px' }}>
                        {searchResults.length > 0 ? (
                            searchResults.map((res, i) => (
                                <div key={i} style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ margin: '0 0 8px 0', fontSize: '1rem', fontWeight: 500 }}>"{res.claim}"</p>
                                        <div style={{ display: 'flex', gap: '12px' }}>
                                            <span style={{ fontSize: '0.75rem', color: '#8b5cf6', background: 'rgba(139, 92, 246, 0.1)', padding: '2px 8px', borderRadius: '4px' }}>{res.topic}</span>
                                            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Source: {res.source}</span>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right', minWidth: '100px' }}>
                                        <p style={{ margin: 0, fontSize: '0.85rem', color: res.label === 'Refuted Misinfo' ? '#ef4444' : '#10b981', fontWeight: 700 }}>{res.label}</p>
                                        <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>{(res.similarity * 100).toFixed(1)}% Similarity</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                                <ShieldAlert size={48} style={{ marginBottom: '10px', opacity: 0.3 }} />
                                <p>Enter a claim above to run neural similarity clustering.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MisinfoTab;
