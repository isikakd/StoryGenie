import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { useLang } from '../context/LangContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './Dashboard.css';

const COLORS_LANG = ['#7c3aed', '#06b6d4'];
const COLORS_DUR  = ['#ec4899', '#f97316', '#06b6d4'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="dash-tooltip">
        {label && <p className="dash-tooltip-label">{label}</p>}
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.fill || p.color }}>
            {p.name}: <strong>{p.value}</strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

function StatCard({ label, sublabel, value, color, index }) {
  return (
    <div className="stat-card animate-fadeIn" style={{ '--accent': color, animationDelay: `${index * 0.1}s` }}>
      <div className="stat-card-bar" style={{ background: color }} />
      <div className="stat-card-body">
        <div className="stat-value" style={{ color }}>{value}</div>
        <div className="stat-label">{label}</div>
        {sublabel && <div className="stat-sublabel">{sublabel}</div>}
      </div>
    </div>
  );
}

// En çok kullanılan karakter/mekan kartı
function TopItem({ imagePath, name, count, index, storyCount }) {
  const file = imagePath?.split('/').pop() || '';
  const isChar = imagePath?.includes('characters');
  const isLoc  = imagePath?.includes('locations');
  return (
    <div className="top-item" style={{ animationDelay: `${index * 0.08}s` }}>
      <div className="top-item-img">
        {file ? (
          <img
            src={isChar ? `/assets/characters/${file}` : isLoc ? `/assets/locations/${file}` : `/assets/characters/${file}`}
            alt={name}
            onError={e => { e.target.style.display = 'none'; }}
          />
        ) : <span className="top-item-placeholder">?</span>}
      </div>
      <div className="top-item-info">
        <span className="top-item-name">{name}</span>
        <span className="top-item-count">{count} {storyCount}</span>
      </div>
      <div className="top-item-bar-wrap">
        <div className="top-item-bar" style={{ width: `${Math.min(count * 20, 100)}%` }} />
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { t } = useLang();
  const { user } = useAuth();
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    api.get('/stories/dashboard')
      .then(res => setData(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="dashboard-page">
      <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}>
        <div className="spinner" />
      </div>
    </div>
  );

  if (error) return (
    <div className="dashboard-page">
      <div className="container">
        <div style={{ color: 'var(--clr-rose)', textAlign: 'center', padding: '60px', fontWeight: 600 }}>{error}</div>
      </div>
    </div>
  );

  const { summary, charts } = data || {};

  const langData = (charts?.languageDistribution || []).map(d => ({
    name: d._id === 'tr' ? t.lang.tr : t.lang.en,
    value: d.count,
  }));

  const durationData = (charts?.durationDistribution || []).map(d => ({
    name: d._id === 'short' ? t.dashboard.durShort : d._id === 'medium' ? t.dashboard.durMedium : t.dashboard.durLong,
    value: d.count,
  }));

  const barData = charts?.storiesPerDay || [];

  const topHumans  = charts?.topHumans  || [];
  const topAnimals = charts?.topAnimals || [];
  const topLocations = charts?.topLocations || [];

  return (
    <div className="dashboard-page">
      <div className="container">

        {/* Header */}
        <div className="dash-header animate-fadeIn">
          <h1 className="dash-title">{t.dashboard?.title}</h1>
          <p className="dash-subtitle">{t.dashboard?.greeting} {user?.username}! {t.dashboard?.subtitle}</p>
        </div>

        {/* Stat kartları — sadece 2 */}
        <div className="stat-cards">
          <StatCard index={0}
            label={t.dashboard.statTotalLabel}
            sublabel={t.dashboard.statTotalSub}
            value={summary?.totalStories ?? 0}
            color="#7c3aed"
          />
          <StatCard index={1}
            label={t.dashboard.statSharedLabel}
            sublabel={t.dashboard.statSharedSub}
            value={summary?.publicStories ?? 0}
            color="#06b6d4"
          />
        </div>

        {/* Grafikler grid */}
        <div className="charts-grid">

          {/* Son 7 Gün Bar */}
          <div className="chart-card animate-fadeIn" style={{ gridColumn: 'span 2' }}>
            <div className="chart-card-header">
              <h3 className="chart-title">{t.dashboard.chart7DaysTitle}</h3>
              <p className="chart-desc">{t.dashboard.chart7DaysDesc}</p>
            </div>
            {barData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={barData} margin={{ top: 16, right: 8, bottom: 8, left: -10 }}>
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--clr-ink-muted)' }} />
                  <YAxis tick={{ fontSize: 11, fill: 'var(--clr-ink-muted)' }} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" name={t.dashboard.barName} radius={[6,6,0,0]} fill="#7c3aed" maxBarSize={36} />
                </BarChart>
              </ResponsiveContainer>
            ) : <div className="chart-empty">{t.dashboard.noData}</div>}
          </div>

          {/* Dil Dağılımı */}
          <div className="chart-card animate-fadeIn">
            <div className="chart-card-header">
              <h3 className="chart-title">{t.dashboard.langChartTitle}</h3>
              <p className="chart-desc">{t.dashboard.langChartDesc}</p>
            </div>
            {langData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={langData} cx="50%" cy="50%"
                    outerRadius={80} dataKey="value" label={false} labelLine={false}>
                    {langData.map((_, i) => (
                      <Cell key={i} fill={COLORS_LANG[i % COLORS_LANG.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend formatter={v => <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{v}</span>} />
                </PieChart>
              </ResponsiveContainer>
            ) : <div className="chart-empty">{t.dashboard.noData}</div>}
          </div>

          {/* Süre Dağılımı */}
          <div className="chart-card animate-fadeIn">
            <div className="chart-card-header">
              <h3 className="chart-title">{t.dashboard.durChartTitle}</h3>
              <p className="chart-desc">{t.dashboard.durChartDesc}</p>
            </div>
            {durationData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={durationData} cx="50%" cy="50%"
                    outerRadius={80} innerRadius={40} dataKey="value" label={false} labelLine={false}>
                    {durationData.map((_, i) => (
                      <Cell key={i} fill={COLORS_DUR[i % COLORS_DUR.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend formatter={v => <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{v}</span>} />
                </PieChart>
              </ResponsiveContainer>
            ) : <div className="chart-empty">{t.dashboard.noData}</div>}
          </div>

          {/* En Çok Seçilen Karakterler */}
          <div className="chart-card animate-fadeIn">
            <div className="chart-card-header">
              <h3 className="chart-title">{t.dashboard.humansTitle}</h3>
              <p className="chart-desc">{t.dashboard.humansDesc}</p>
            </div>
            {topHumans.length > 0 ? (
              <div className="top-list">
                {topHumans.map((item, i) => (
                  <TopItem key={i} index={i}
                    imagePath={item._id.imagePath}
                    name={item._id.name}
                    count={item.count}
                    storyCount={t.dashboard.storyCount}
                  />
                ))}
              </div>
            ) : <div className="chart-empty">{t.dashboard.noData}</div>}
          </div>

          {/* En Çok Seçilen Hayvanlar */}
          <div className="chart-card animate-fadeIn">
            <div className="chart-card-header">
              <h3 className="chart-title">{t.dashboard.animalsTitle}</h3>
              <p className="chart-desc">{t.dashboard.animalsDesc}</p>
            </div>
            {topAnimals.length > 0 ? (
              <div className="top-list">
                {topAnimals.map((item, i) => (
                  <TopItem key={i} index={i}
                    imagePath={item._id.imagePath}
                    name={item._id.name}
                    count={item.count}
                    storyCount={t.dashboard.storyCount}
                  />
                ))}
              </div>
            ) : <div className="chart-empty">{t.dashboard.noData}</div>}
          </div>

          {/* En Çok Seçilen Mekanlar */}
          <div className="chart-card animate-fadeIn" style={{ gridColumn: 'span 2' }}>
            <div className="chart-card-header">
              <h3 className="chart-title">{t.dashboard.locTitle}</h3>
              <p className="chart-desc">{t.dashboard.locDesc}</p>
            </div>
            {topLocations.length > 0 ? (
              <div className="top-locations-grid">
                {topLocations.map((item, i) => {
                  const file = item._id.imagePath?.split('/').pop() || '';
                  return (
                    <div key={i} className="top-loc-card" style={{ animationDelay: `${i * 0.08}s` }}>
                      {file && (
                        <div className="top-loc-img"
                          style={{ backgroundImage: `url('/assets/locations/${file}')` }} />
                      )}
                      <div className="top-loc-overlay">
                        <span className="top-loc-name">{item._id.name}</span>
                        <span className="top-loc-count">{item.count} {t.dashboard.storyCount}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : <div className="chart-empty">{t.dashboard.noData}</div>}
          </div>

        </div>
      </div>
    </div>
  );
}