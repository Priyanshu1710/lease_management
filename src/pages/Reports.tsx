import React, { useState } from 'react';
import { useMockStore } from '../hooks/useMockStore';
import { BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { TrendingUp, DollarSign, Percent, Wrench } from 'lucide-react';
import styles from './pages.module.scss';
import Badge from '../components/common/Badge';

export const Reports: React.FC = () => {
  const { analyticsData, theme } = useMockStore();
  const [timeRange, setTimeRange] = useState<'MTD' | 'YTD' | 'ALL'>('YTD');

  // Chart configuration constants based on theme
  const isDark = theme === 'dark';
  const gridStroke = isDark ? '#1e293b' : '#e2e8f0';
  const textFill = isDark ? '#94a3b8' : '#64748b';

  // Pie chart coloring
  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#0ea5e9', '#64748b'];

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header">
        <div className="title-area">
          <h1>Reports & Business Intelligence</h1>
          <p>Analytical insights on occupancy rates, rent collections, and maintenance speed.</p>
        </div>
        <div className="actions-area">
          <div style={{ display: 'flex', border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden', backgroundColor: 'var(--bg-card)' }}>
            {['MTD', 'YTD', 'ALL'].map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r as any)}
                style={{
                  padding: '8px 14px',
                  backgroundColor: timeRange === r ? 'var(--primary-light)' : 'transparent',
                  color: timeRange === r ? 'var(--primary)' : 'var(--text-secondary)',
                  fontWeight: timeRange === r ? 600 : 500,
                  fontSize: '0.8rem'
                }}
              >
                {r === 'MTD' ? 'Month-to-Date' : r === 'YTD' ? 'Year-to-Date' : 'All Time'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of charts */}
      <div className={styles.chartGrid} style={{ gridTemplateColumns: '1fr 1fr' }}>
        
        {/* Revenue Analytics */}
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <DollarSign size={18} className="text-success" />
              <h3>Cash Collection Efficiency</h3>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>May 2026 rent roll ledger</span>
          </div>
          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analyticsData.monthlyRevenue} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                <XAxis dataKey="name" stroke={textFill} fontSize={11} />
                <YAxis stroke={textFill} fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
                <Legend verticalAlign="top" height={36} fontSize={11} />
                <Area type="monotone" name="Invoiced Amount" dataKey="actual" stroke="var(--primary)" fill="rgba(99, 102, 241, 0.1)" strokeWidth={2} />
                <Area type="monotone" name="Collections Collected" dataKey="collections" stroke="var(--success)" fill="rgba(16, 185, 129, 0.1)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Occupancy trends */}
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Percent size={18} className="text-info" />
              <h3>Portfolio Occupancy History</h3>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Rate change timeline</span>
          </div>
          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analyticsData.occupancyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                <XAxis dataKey="name" stroke={textFill} fontSize={11} />
                <YAxis domain={[60, 100]} stroke={textFill} fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
                <Line type="monotone" name="Average Occupancy" dataKey="rate" stroke="var(--primary)" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Yield comparisons */}
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={18} className="text-secondary" />
              <h3>Asset Performance Rankings</h3>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Revenue yield compared</span>
          </div>
          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData.propertyPerformance} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                <XAxis dataKey="name" stroke={textFill} fontSize={10} />
                <YAxis stroke={textFill} fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
                <Bar name="Yield ($)" dataKey="revenue" fill="var(--primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Maintenance requests pie */}
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Wrench size={18} className="text-warning" />
              <h3>Maintenance Category Distribution</h3>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Request share by trade</span>
          </div>
          <div style={{ width: '100%', height: 280, display: 'flex', justifyContent: 'center' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analyticsData.maintenanceCategoryDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
                >
                  {analyticsData.maintenanceCategoryDistribution.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Aggregated reports table summaries */}
      <div className={styles.chartCard} style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '16px' }}>Aggregate Portfolio Financial Performance Ledger</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead style={{ backgroundColor: 'var(--bg-app)', borderBottom: '1px solid var(--border)' }}>
            <tr>
              <th style={{ padding: '12px 18px', color: 'var(--text-secondary)' }}>Asset Name</th>
              <th style={{ padding: '12px 18px', color: 'var(--text-secondary)' }}>Occupancy Rate</th>
              <th style={{ padding: '12px 18px', color: 'var(--text-secondary)' }}>Projected Potential yield</th>
              <th style={{ padding: '12px 18px', color: 'var(--text-secondary)' }}>Actual cash collections</th>
              <th style={{ padding: '12px 18px', color: 'var(--text-secondary)' }}>Pending outstanding dues</th>
            </tr>
          </thead>
          <tbody>
            {analyticsData.propertyPerformance.map((prop, idx) => {
              const overdueAmount = idx === 0 ? 16400 : 0; // Acme overdue simulation
              return (
                <tr key={idx} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '14px 18px', fontWeight: 600 }}>{prop.name}</td>
                  <td style={{ padding: '14px 18px' }}>
                    <Badge variant={prop.occupancy >= 80 ? 'success' : 'warning'}>{prop.occupancy}%</Badge>
                  </td>
                  <td style={{ padding: '14px 18px' }}>${(prop.revenue + overdueAmount).toLocaleString()}</td>
                  <td style={{ padding: '14px 18px', color: 'var(--success)', fontWeight: 600 }}>${prop.revenue.toLocaleString()}</td>
                  <td style={{ padding: '14px 18px', color: overdueAmount > 0 ? 'var(--danger)' : 'inherit', fontWeight: overdueAmount > 0 ? 600 : 'normal' }}>
                    ${overdueAmount.toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default Reports;
