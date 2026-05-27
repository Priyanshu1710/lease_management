import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMockStore } from '../hooks/useMockStore';
import { Check, CreditCard, Building, Info, AlertTriangle, Eye } from 'lucide-react';
import styles from './pages.module.scss';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';

export const Notifications: React.FC = () => {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useMockStore();
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  const filteredNotifications = notifications.filter((notif) => {
    if (filter === 'unread') return !notif.read;
    if (filter === 'read') return notif.read;
    return true;
  });

  const getSeverityBadgeColor = (severity: string) => {
    switch (severity) {
      case 'error': return 'danger';
      case 'warning': return 'warning';
      case 'success': return 'success';
      case 'info': return 'info';
      default: return 'muted';
    }
  };

  const getNotifIcon = (type: string, severity: string) => {
    const colorClass =
      severity === 'error'
        ? styles.textDanger
        : severity === 'warning'
        ? styles.textWarning
        : severity === 'success'
        ? styles.textSuccess
        : styles.textInfo;

    switch (type) {
      case 'payment_overdue': return <CreditCard size={18} className={colorClass} />;
      case 'lease_expiry': return <AlertTriangle size={18} className={colorClass} />;
      case 'maintenance_update': return <Check size={18} className={colorClass} />;
      case 'new_tenant': return <Building size={18} className={colorClass} />;
      default: return <Info size={18} className={colorClass} />;
    }
  };

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header">
        <div className="title-area">
          <h1>System Alerts Center</h1>
          <p>Review audit notifications, payment reminders, repair updates, and lease lifecycles.</p>
        </div>
        <div className="actions-area">
          {notifications.some(n => !n.read) && (
            <Button variant="outline" leftIcon={<Check size={16} />} onClick={markAllNotificationsRead}>
              Mark All as Read
            </Button>
          )}
        </div>
      </div>

      {/* Tabs Filter Header */}
      <div className={styles.filterRow}>
        <div style={{ display: 'flex', border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden' }}>
          {[
            { id: 'all', label: 'All Alerts' },
            { id: 'unread', label: 'Unread Only' },
            { id: 'read', label: 'Archived / Read' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              style={{
                padding: '8px 14px',
                backgroundColor: filter === tab.id ? 'var(--primary-light)' : 'var(--bg-card)',
                color: filter === tab.id ? 'var(--primary)' : 'var(--text-secondary)',
                fontWeight: filter === tab.id ? 600 : 500,
                fontSize: '0.85rem'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Alert Feed Logs */}
      {filteredNotifications.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '16px 20px',
                backgroundColor: notif.read ? 'var(--bg-card)' : 'rgba(var(--primary-rgb), 0.02)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                boxShadow: 'var(--shadow-sm)',
                transition: 'border-color 0.2s ease'
              }}
            >
              {/* Status Circle */}
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: notif.read ? 'var(--bg-app)' : 'var(--primary-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                {getNotifIcon(notif.type, notif.severity)}
              </div>

              {/* Text Area */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <strong style={{ fontSize: '0.925rem' }}>{notif.title}</strong>
                  <Badge variant={getSeverityBadgeColor(notif.severity)}>
                    {notif.severity}
                  </Badge>
                  {!notif.read && (
                    <span style={{ width: '6px', height: '6px', backgroundColor: 'var(--primary)', borderRadius: '50%' }} />
                  )}
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '4px', lineHeight: 1.4 }}>
                  {notif.message}
                </p>
                <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>
                  Logged Date: {notif.date}
                </span>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '8px' }}>
                {!notif.read && (
                  <Button variant="ghost" size="sm" onClick={() => markNotificationRead(notif.id)} iconOnly title="Mark as Read">
                    <Check size={16} />
                  </Button>
                )}
                {notif.link && (
                  <Link to={notif.link}>
                    <Button variant="secondary" size="sm" leftIcon={<Eye size={14} />}>
                      Investigate
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
          No alerts to display.
        </div>
      )}
    </div>
  );
};
export default Notifications;
