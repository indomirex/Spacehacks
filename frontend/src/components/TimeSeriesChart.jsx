import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, LineChart, ComposedChart, Bar } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ backgroundColor: '#1e293b', padding: '12px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}>
        <p style={{ margin: '0 0 8px 0', fontWeight: 'bold' }}>Year: {label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ margin: '4px 0', color: entry.color || '#3b82f6', fontSize: '0.9rem' }}>
            {entry.name}: {typeof entry.value === 'number' ? entry.value.toFixed(2) : entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Thin trend-line overlay to make the negative trend visually obvious
const TrendLine = ({ data, dataKey, color }) => {
  if (!data || data.length < 2) return null;
  const vals = data.map(d => d[dataKey]).filter(v => v != null);
  if (vals.length < 2) return null;
  const n = vals.length;
  const xs = vals.map((_, i) => i);
  const meanX = xs.reduce((a, b) => a + b, 0) / n;
  const meanY = vals.reduce((a, b) => a + b, 0) / n;
  const slope = xs.reduce((s, x, i) => s + (x - meanX) * (vals[i] - meanY), 0) /
                xs.reduce((s, x) => s + (x - meanX) ** 2, 0);
  const intercept = meanY - slope * meanX;
  return data.map((d, i) => ({ ...d, _trend: parseFloat((slope * i + intercept).toFixed(2)) }));
};

export const SnowCoverChart = ({ data }) => {
  if (!data || data.length === 0) return <div style={{ color: 'var(--text-secondary)', padding: '24px' }}>Loading live data...</div>;

  const trendData = TrendLine({ data, dataKey: 'snow_cover', color: '#3b82f6' }) || data;

  return (
    <div className="glass-panel chart-wrapper" style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', marginBottom: '24px' }}>
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '4px' }}>Snow Cover Area (%)</h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>Source: ERA5-Land · European Alps · Nov–Feb composite</p>
      </div>
      <div style={{ flex: 1, minHeight: '300px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCover" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
            <XAxis dataKey="year" stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)', fontSize: '0.75rem' }} interval={4} />
            <YAxis stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)' }} domain={['dataMin - 5', 'dataMax + 5']} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="snow_cover" name="Snow Cover (%)" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorCover)" />
            <Line type="monotone" dataKey="_trend" name="Linear Trend" stroke="#ef4444" strokeWidth={2} strokeDasharray="6 3" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export const TemperatureChart = ({ data }) => {
  if (!data || data.length === 0) return <div style={{ color: 'var(--text-secondary)', padding: '24px' }}>Loading live data...</div>;

  const trendData = TrendLine({ data, dataKey: 'temp', color: '#ef4444' }) || data;

  return (
    <div className="glass-panel chart-wrapper" style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', marginBottom: '24px' }}>
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '4px' }}>Avg Winter Temperature (°C)</h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>Source: ERA5-Land · European Alps · Nov–Feb composite</p>
      </div>
      <div style={{ flex: 1, minHeight: '300px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
            <XAxis dataKey="year" stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)', fontSize: '0.75rem' }} interval={4} />
            <YAxis stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)' }} domain={['dataMin - 0.5', 'dataMax + 0.5']} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="temp" name="Temperature (°C)" stroke="#ef4444" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
            <Line type="monotone" dataKey="_trend" name="Warming Trend" stroke="#f97316" strokeWidth={2} strokeDasharray="6 3" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export const LakeExpansionChart = ({ data }) => {
  if (!data || data.length === 0) return null;

  const trendData = TrendLine({ data, dataKey: 'glacial_lake_area', color: '#38bdf8' }) || data;

  return (
    <div className="glass-panel chart-wrapper" style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', marginBottom: '24px' }}>
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#38bdf8', marginBottom: '4px' }}>Glacial Lake Expansion (km²)</h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>Source: JRC Global Surface Water · Shugar et al. (2021)</p>
      </div>
      <div style={{ flex: 1, minHeight: '300px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="colorLake" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
            <XAxis dataKey="year" stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)', fontSize: '0.75rem' }} interval={4} />
            <YAxis stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)' }} domain={['dataMin - 10', 'dataMax + 20']} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="glacial_lake_area" name="Lake Area (km²)" stroke="#38bdf8" strokeWidth={2} fillOpacity={1} fill="url(#colorLake)" />
            <Line type="monotone" dataKey="_trend" name="Expansion Trend" stroke="#ef4444" strokeWidth={2} strokeDasharray="6 3" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export const EconomicImpactChart = ({ data }) => {
  if (!data || data.length === 0) return <div style={{ color: 'var(--text-secondary)', padding: '24px' }}>Loading live data...</div>;

  return (
    <div className="glass-panel chart-wrapper" style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '4px' }}>Adaptation Economics: Water Demand & Spending</h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>Source: Rixen et al. (2021) · Scott et al. (2020) · EU Adaptation Fund reports</p>
      </div>
      <div style={{ flex: 1, minHeight: '300px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: -10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
            <XAxis dataKey="year" stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)', fontSize: '0.75rem' }} interval={4} />
            <YAxis yAxisId="left" stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)' }} label={{ value: 'Spending (M €)', angle: -90, position: 'insideLeft', style: { fill: 'var(--text-secondary)', fontSize: '0.75rem' } }} />
            <YAxis yAxisId="right" orientation="right" stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)' }} label={{ value: 'Water (M m³)', angle: 90, position: 'insideRight', style: { fill: 'var(--text-secondary)', fontSize: '0.75rem' } }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar yAxisId="left" dataKey="adaptation_spending" name="Adaptation Spending (M €)" fill="rgba(16, 185, 129, 0.75)" radius={[3, 3, 0, 0]} />
            <Line yAxisId="right" type="monotone" dataKey="water_usage" name="Artificial Snow Water (M m³)" stroke="#8b5cf6" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export const PermafrostStabilityChart = ({ data }) => {
  if (!data || data.length === 0) return null;

  return (
    <div className="glass-panel chart-wrapper" style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#ec4899', marginBottom: '4px' }}>Permafrost Stability & NDVI Index</h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>Derived from ERA5-Land · Haeberli & Gruber (2008) calibration</p>
      </div>
      <div style={{ flex: 1, minHeight: '300px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
            <XAxis dataKey="year" stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)', fontSize: '0.75rem' }} interval={4} />
            <YAxis yAxisId="left" stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)' }} domain={[0, 100]} label={{ value: 'Stability %', angle: -90, position: 'insideLeft', offset: 10, style: { fill: '#ec4899', fontSize: '0.75rem' } }} />
            <YAxis yAxisId="right" orientation="right" stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)' }} domain={[0, 0.8]} label={{ value: 'NDVI', angle: 90, position: 'insideRight', offset: 10, style: { fill: '#10b981', fontSize: '0.75rem' } }} />
            <Tooltip content={<CustomTooltip />} />
            <Line yAxisId="left" type="monotone" dataKey="stability" name="Permafrost Stability (%)" stroke="#ec4899" strokeWidth={2.5} dot={false} />
            <Line yAxisId="right" type="monotone" dataKey="ndvi" name="NDVI Vegetation Health" stroke="#10b981" strokeWidth={2.5} dot={false} strokeDasharray="5 5" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
