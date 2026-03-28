import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, LineChart, ReferenceLine, ComposedChart, Bar } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ backgroundColor: '#1e293b', padding: '12px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}>
        <p style={{ margin: '0 0 8px 0', fontWeight: 'bold' }}>Year: {label}</p>

        {payload.map((entry, index) => (
          <p key={index} style={{ margin: '4px 0', color: entry.color || '#3b82f6', fontSize: '0.9rem' }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const SnowCoverChart = ({ data }) => {
  if (!data || data.length === 0) return <div>Loading algorithm data...</div>;
  const predictionStartYear = data.find(d => d.is_prediction)?.year;

  return (
    <div className="glass-panel chart-wrapper" style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', marginBottom: '24px' }}>
      <h3 style={{ marginBottom: '16px', fontSize: '1.1rem', fontWeight: 600 }}>Snow Cover Area (10 Yr Forecast)</h3>
      <div style={{ flex: 1, minHeight: '300px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCover" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
            <XAxis dataKey="year" stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)' }} />
            <YAxis stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)' }} domain={['dataMin - 30', 'dataMax + 20']} />
            <Tooltip content={<CustomTooltip />} />
            {predictionStartYear && (
              <ReferenceLine x={predictionStartYear} stroke="var(--accent-color)" strokeDasharray="3 3" label={{ position: 'insideTopLeft', value: 'Prediction ->', fill: 'var(--accent-color)' }} />
            )}
            <Area type="monotone" dataKey="snow_cover" name="Snow Area (k km²)" stroke="#3b82f6" fillOpacity={1} fill="url(#colorCover)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export const TemperatureChart = ({ data }) => {
  if (!data || data.length === 0) return <div>Loading algorithm data...</div>;
  const predictionStartYear = data.find(d => d.is_prediction)?.year;

  return (
    <div className="glass-panel chart-wrapper" style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', marginBottom: '24px' }}>
      <h3 style={{ marginBottom: '16px', fontSize: '1.1rem', fontWeight: 600 }}>Avg Winter Temp Forecast (°C)</h3>
      <div style={{ flex: 1, minHeight: '300px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
            <XAxis dataKey="year" stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)' }} />
            <YAxis stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)' }} domain={['dataMin - 0.5', 'dataMax + 0.5']} />
            <Tooltip content={<CustomTooltip />} />
            {predictionStartYear && (
              <ReferenceLine x={predictionStartYear} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'insideTopLeft', value: 'Prediction ->', fill: '#ef4444' }} />
            )}
            <Line type="monotone" dataKey="temp" name="Temperature" stroke="#ef4444" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export const EconomicImpactChart = ({ data }) => {
  if (!data || data.length === 0) return <div>Loading economic data...</div>;
  const predictionStartYear = data.find(d => d.is_prediction)?.year;

  return (
    <div className="glass-panel chart-wrapper" style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column' }}>
      <h3 style={{ marginBottom: '16px', fontSize: '1.1rem', fontWeight: 600 }}>Adaptation Economics: Water & Spending</h3>
      <div style={{ flex: 1, minHeight: '300px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: -10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
            <XAxis dataKey="year" stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)' }} />
            <YAxis yAxisId="left" stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)' }} label={{ value: 'Spending (M €)', angle: -90, position: 'insideLeft', style: { fill: 'var(--text-secondary)' } }} />
            <YAxis yAxisId="right" orientation="right" stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)' }} label={{ value: 'Water Usage (M m³)', angle: 90, position: 'insideRight', style: { fill: 'var(--text-secondary)' } }} />
            <Tooltip content={<CustomTooltip />} />
            {predictionStartYear && (
              <ReferenceLine yAxisId="left" x={predictionStartYear} stroke="var(--accent-color)" strokeDasharray="3 3" label={{ position: 'insideTopLeft', value: 'Prediction ->', fill: 'var(--accent-color)' }} />
            )}
            <Bar yAxisId="left" dataKey="adaptation_spending" name="Adaptation Spending (M EUR)" fill="rgba(16, 185, 129, 0.8)" radius={[4, 4, 0, 0]} />
            <Line yAxisId="right" type="monotone" dataKey="water_usage" name="Artificial Water Usage (M m³)" stroke="#8b5cf6" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export const LakeExpansionChart = ({ data }) => {
  if (!data || data.length === 0) return null;
  const predictionStartYear = data.find(d => d.is_prediction)?.year;

  return (
    <div className="glass-panel chart-wrapper" style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', marginBottom: '24px' }}>
      <h3 style={{ marginBottom: '16px', fontSize: '1.1rem', fontWeight: 600, color: '#38bdf8' }}>Glacial Lake Expansion Forecast (km²)</h3>
      <div style={{ flex: 1, minHeight: '300px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="colorLake" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
          <XAxis dataKey="year" stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)' }} />
          <YAxis stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)' }} domain={['dataMin - 10', 'dataMax + 20']} />
          <Tooltip content={<CustomTooltip />} />
          {predictionStartYear && (
            <ReferenceLine x={predictionStartYear} stroke="var(--accent-color)" strokeDasharray="3 3" label={{ position: 'insideTopLeft', value: 'PyTorch Forecast ->', fill: 'var(--accent-color)' }} />
          )}
          <Area type="monotone" dataKey="glacial_lake_area" name="Lake Surface Area (km²)" stroke="#38bdf8" fillOpacity={1} fill="url(#colorLake)" />
        </AreaChart>
      </ResponsiveContainer>
    </div >
    </div >
  );
};
