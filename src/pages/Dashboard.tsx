import React from 'react';
import { Link } from 'react-router-dom';
import { useMockStore } from '../hooks/useMockStore';
import {
  Building2,
  Users,
  FileText,
  DollarSign,
  Wrench,
  Percent,
  Clock,
  ArrowUpRight
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend
} from 'recharts';
import styles from './pages.module.scss';
import Badge from '../components/common/Badge';
import Table from '../components/common/Table';

export const Dashboard: React.FC = () => {
  const {
    properties,
    tenants,
    leases,
    invoices,
    maintenanceTickets,
    analyticsData,
    theme
  } = useMockStore();

  // 1. Metric Calculations
  const totalProperties = properties.length;
  const totalUnits = properties.reduce((sum, prop) => sum + prop.totalUnits, 0);
  
  // Occupancy rate calculation
  const occupiedUnits = properties.reduce(
    (sum, prop) => sum + prop.units.filter((u) => u.occupancyStatus === 'occupied').length,
    0
  );
  const totalOccupancyRate = totalUnits > 0 ? ((occupiedUnits / totalUnits) * 100).toFixed(1) : '0';

  const activeTenants = tenants.filter((t) => t.leaseStatus === 'active').length;
  
  // Pending payments (sum of 'pending' and 'overdue' invoices)
  const pendingInvoices = invoices.filter((i) => i.status !== 'paid');
  const pendingPaymentsAmount = pendingInvoices.reduce((sum, inv) => sum + inv.amount, 0);

  // Expiring leases in next 90 days or currently ending
  const expiringLeasesCount = leases.filter(
    (l) => l.status === 'active' && l.renewalStatus === 'under-review'
  ).length;

  // Monthly Revenue actual collector (May 2026)
  const currentMonthInvoices = invoices.filter(
    (i) => i.billingPeriod === 'May 2026'
  );
  const monthlyRevenueCollected = currentMonthInvoices
    .filter((i) => i.status === 'paid')
    .reduce((sum, inv) => sum + inv.amount, 0);

  const activeMaintenanceRequests = maintenanceTickets.filter(
    (t) => t.status !== 'resolved'
  ).length;

  // Summary Metrics Array
  const metrics = [
    { label: 'Total Properties', value: totalProperties, icon: <Building2 size={22} />, link: '/properties' },
    { label: 'Total Units', value: `${occupiedUnits}/${totalUnits}`, sub: `${totalOccupancyRate}% Occupied`, icon: <Percent size={22} />, link: '/properties' },
    { label: 'Active Tenants', value: activeTenants, icon: <Users size={22} />, link: '/tenants' },
    { label: 'Expiring Leases', value: expiringLeasesCount, sub: 'Needs Review', icon: <FileText size={22} />, link: '/leases' },
    { label: 'Monthly Revenue', value: `$${monthlyRevenueCollected.toLocaleString()}`, sub: 'May Collected', icon: <DollarSign size={22} />, link: '/payments' },
    { label: 'Pending Payments', value: `$${pendingPaymentsAmount.toLocaleString()}`, sub: `${pendingInvoices.length} Unpaid`, icon: <Clock size={22} />, link: '/payments' },
    { label: 'Open Tickets', value: activeMaintenanceRequests, sub: 'Maintenance Desk', icon: <Wrench size={22} />, link: '/maintenance' }
  ];

  // Helper variables for Recharts theme styling
  const isDark = theme === 'dark';
  const gridStroke = isDark ? '#1e293b' : '#e2e8f0';
  const textFill = isDark ? '#94a3b8' : '#64748b';

  return (
    <div className="page-container">
      {/* Title Header */}
      <div className="page-header">
        <div className="title-area">
          <h1>Dashboard Overview</h1>
          <p>Key indicators, performance charts, and operations updates.</p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className={styles.dashboardGrid}>
        {metrics.map((metric, i) => (
          <Link to={metric.link} key={i} className={styles.metricCard}>
            <div className={styles.metricIcon}>{metric.icon}</div>
            <div className={styles.metricData}>
              <span className={styles.metricValue}>{metric.value}</span>
              <span className={styles.metricLabel}>
                {metric.label}
                {metric.sub && <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{metric.sub}</span>}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Charts Grid */}
      <div className={styles.chartGrid}>
        {/* Revenue Analytics */}
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <h3>Monthly Revenue Collections</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Actual vs Target vs Collections</span>
          </div>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analyticsData.monthlyRevenue} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCollections" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--success)" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="var(--success)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                <XAxis dataKey="name" stroke={textFill} fontSize={12} />
                <YAxis stroke={textFill} fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-card)',
                    borderColor: 'var(--border)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)'
                  }}
                />
                <Legend verticalAlign="top" height={36} />
                <Area type="monotone" name="Projected Revenue" dataKey="target" stroke="var(--secondary)" fill="none" strokeWidth={2} />
                <Area type="monotone" name="Invoiced Amount" dataKey="actual" stroke="var(--primary)" fillOpacity={1} fill="url(#colorActual)" strokeWidth={2.5} />
                <Area type="monotone" name="Collected Cash" dataKey="collections" stroke="var(--success)" fillOpacity={1} fill="url(#colorCollections)" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Occupancy Trends */}
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <h3>Occupancy Performance</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Average rate %</span>
          </div>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analyticsData.occupancyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                <XAxis dataKey="name" stroke={textFill} fontSize={12} />
                <YAxis domain={[50, 100]} stroke={textFill} fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-card)',
                    borderColor: 'var(--border)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)'
                  }}
                />
                <Line type="monotone" name="Occupancy %" dataKey="rate" stroke="var(--primary)" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Main Operations Split */}
      <div className={styles.dashboardSectionGrid}>
        {/* Recent Transaction Activity */}
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <h3>Recent Invoices & Cash Flows</h3>
            <Link to="/payments" className={styles.viewAllLink}>
              View Ledger <ArrowUpRight size={14} style={{ display: 'inline', marginLeft: 2 }} />
            </Link>
          </div>

          <Table headers={['Invoice ID', 'Tenant', 'Property', 'Rent Period', 'Amount', 'Status']}>
            {invoices.slice(0, 5).map((inv) => (
              <tr key={inv.id}>
                <td style={{ fontWeight: 600 }}>{inv.id}</td>
                <td>{inv.tenantName}</td>
                <td>{inv.propertyName} {inv.unitNumber}</td>
                <td>{inv.billingPeriod}</td>
                <td style={{ fontWeight: 600 }}>${inv.amount.toLocaleString()}</td>
                <td>
                  <Badge variant={inv.status === 'paid' ? 'success' : inv.status === 'overdue' ? 'danger' : 'warning'}>
                    {inv.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </Table>
        </div>

        {/* Sidebar Lists: Upcoming Renewals and Maintenance */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Upcoming Renewals */}
          <div className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <h3>Upcoming Renewals</h3>
              <Link to="/leases" className={styles.viewAllLink}>
                All Agreements
              </Link>
            </div>
            
            <div className={styles.sidebarList}>
              {leases
                .filter((l) => l.status === 'active' && l.renewalStatus === 'under-review')
                .slice(0, 3)
                .map((lease) => (
                  <div key={lease.id} className={styles.renewalItem}>
                    <div className={styles.renewalInfo}>
                      <span className={styles.renewalName}>{lease.tenantName}</span>
                      <span className={styles.renewalSub}>
                        {lease.propertyName} ({lease.unitNumber}) • Ends {lease.endDate}
                      </span>
                    </div>
                    <Link to={`/leases/${lease.id}`}>
                      <Badge variant="warning" style={{ cursor: 'pointer' }}>Review</Badge>
                    </Link>
                  </div>
                ))}
              {leases.filter((l) => l.status === 'active' && l.renewalStatus === 'under-review').length === 0 && (
                <div style={{ textAlign: 'center', padding: '16px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  No pending renewals
                </div>
              )}
            </div>
          </div>

          {/* Maintenance Summary */}
          <div className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <h3>Open Maintenance</h3>
              <Link to="/maintenance" className={styles.viewAllLink}>
                Board
              </Link>
            </div>
            
            <div className={styles.sidebarList}>
              {maintenanceTickets
                .filter((t) => t.status !== 'resolved')
                .slice(0, 3)
                .map((ticket) => (
                  <div key={ticket.id} className={styles.activityItem}>
                    <div className={styles.activityIcon}>
                      <Wrench size={14} />
                    </div>
                    <div className={styles.activityInfo}>
                      <span className={styles.activityTitle}>{ticket.title}</span>
                      <div className={styles.activityTime}>
                        {ticket.propertyName} Unit {ticket.unitNumber} • Priority:{' '}
                        <span style={{ fontWeight: 600, color: ticket.priority === 'high' ? 'var(--danger)' : 'inherit' }}>
                          {ticket.priority}
                        </span>
                      </div>
                    </div>
                    <Badge variant={ticket.status === 'new' ? 'danger' : ticket.status === 'assigned' ? 'info' : 'warning'}>
                      {ticket.status.replace('_', ' ')}
                    </Badge>
                  </div>
                ))}
              {maintenanceTickets.filter((t) => t.status !== 'resolved').length === 0 && (
                <div style={{ textAlign: 'center', padding: '16px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  No open issues
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Property Performance Cards */}
      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <h3>Property Financial Contribution & Occupancy Portfolio</h3>
          <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>Core assets analysis</span>
        </div>
        <div className="grid-cols-3">
          {analyticsData.propertyPerformance.map((prop, idx) => (
            <div key={idx} style={{ padding: '16px', border: '1px solid var(--border)', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{prop.name}</span>
                <Badge variant={prop.occupancy >= 80 ? 'success' : prop.occupancy >= 60 ? 'warning' : 'danger'}>
                  {prop.occupancy}% Occupancy
                </Badge>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                <span>May Collections:</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>${prop.revenue.toLocaleString()}</span>
              </div>
              <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--border)', borderRadius: '9999px', overflow: 'hidden' }}>
                <div style={{ height: '100%', backgroundColor: 'var(--primary)', width: `${prop.occupancy}%` }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                <span>Active repair tickets: {prop.maintenance}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
