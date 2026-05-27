import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useMockStore } from '../../hooks/useMockStore';
import {
  Menu,
  Search,
  Bell,
  Sun,
  Moon,
  CreditCard,
  Building,
  User,
  Settings,
  LogOut,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react';
import styles from './layout.module.scss';

interface NavbarProps {
  onOpenMobileSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenMobileSidebar }) => {
  const {
    sidebarCollapsed,
    theme,
    toggleTheme,
    setGlobalSearchOpen,
    notifications,
    markNotificationRead,
    markAllNotificationsRead
  } = useMockStore();

  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Close dropdowns on route changes
  useEffect(() => {
    setNotifDropdownOpen(false);
    setProfileDropdownOpen(false);
  }, [location.pathname]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifDropdownOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut for search (Cmd+K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setGlobalSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setGlobalSearchOpen]);

  // Helper to determine page title
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard Overview';
    if (path.startsWith('/properties')) return 'Portfolio Properties';
    if (path.startsWith('/tenants')) return 'Tenant Profiles';
    if (path.startsWith('/leases')) return 'Lease Agreements';
    if (path.startsWith('/payments')) return 'Financial Transactions';
    if (path.startsWith('/maintenance')) return 'Maintenance Desk';
    if (path.startsWith('/documents')) return 'Document Vault';
    if (path.startsWith('/reports')) return 'Performance Analytics';
    if (path.startsWith('/notifications')) return 'Alerts Center';
    return 'LeaseFlow Admin';
  };

  const unreadNotifications = notifications.filter((n) => !n.read);
  const recentNotifications = notifications.slice(0, 5);

  const handleNotificationClick = (id: string, link?: string) => {
    markNotificationRead(id);
    setNotifDropdownOpen(false);
    if (link) {
      navigate(link);
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

    const bgClass =
      severity === 'error'
        ? 'bg-danger-light'
        : severity === 'warning'
        ? 'bg-warning-light'
        : severity === 'success'
        ? 'bg-success-light'
        : 'bg-info-light';

    switch (type) {
      case 'payment_overdue':
        return (
          <div className={`${styles.statusIcon} ${bgClass}`}>
            <CreditCard size={14} className={colorClass} />
          </div>
        );
      case 'lease_expiry':
        return (
          <div className={`${styles.statusIcon} ${bgClass}`}>
            <AlertTriangle size={14} className={colorClass} />
          </div>
        );
      case 'maintenance_update':
        return (
          <div className={`${styles.statusIcon} ${bgClass}`}>
            <CheckCircle size={14} className={colorClass} />
          </div>
        );
      case 'new_tenant':
        return (
          <div className={`${styles.statusIcon} ${bgClass}`}>
            <Building size={14} className={colorClass} />
          </div>
        );
      default:
        return (
          <div className={`${styles.statusIcon} ${bgClass}`}>
            <Info size={14} className={colorClass} />
          </div>
        );
    }
  };

  return (
    <header className={`${styles.navbar} ${sidebarCollapsed ? styles.collapsed : ''}`}>
      <div className={styles.navbarLeft}>
        <button
          className={styles.mobileMenuBtn}
          onClick={onOpenMobileSidebar}
          aria-label="Open Navigation"
        >
          <Menu size={24} />
        </button>
        <span className={styles.pageTitle}>{getPageTitle()}</span>
      </div>

      <div className={styles.navbarRight}>
        {/* Global Search Trigger */}
        <button className={styles.searchTrigger} onClick={() => setGlobalSearchOpen(true)}>
          <Search size={16} />
          <span>Fuzzy search...</span>
          <span className={styles.searchShortcut}>⌘K</span>
        </button>

        {/* Theme Toggle */}
        <button
          className={styles.iconButton}
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        {/* Notification Bell Dropdown */}
        <div ref={notifRef} style={{ position: 'relative' }}>
          <button
            className={styles.iconButton}
            onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
            aria-label="Notifications"
          >
            <Bell size={18} />
            {unreadNotifications.length > 0 && <span className={styles.badgeDot} />}
          </button>

          {notifDropdownOpen && (
            <div className={styles.notificationDropdown}>
              <div className={styles.dropdownHeader}>
                <h4>Notifications</h4>
                {unreadNotifications.length > 0 && (
                  <button className={styles.markReadBtn} onClick={markAllNotificationsRead}>
                    Mark all read
                  </button>
                )}
              </div>
              <div className={styles.dropdownList}>
                {recentNotifications.length > 0 ? (
                  recentNotifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`${styles.notificationItem} ${!notif.read ? styles.unread : ''}`}
                      onClick={() => handleNotificationClick(notif.id, notif.link)}
                    >
                      {getNotifIcon(notif.type, notif.severity)}
                      <div className={styles.itemDetails}>
                        <div className={styles.itemTitle}>{notif.title}</div>
                        <div className={styles.itemMessage}>{notif.message}</div>
                        <div className={styles.itemTime}>{notif.date}</div>
                      </div>
                      {!notif.read && <div className={styles.unreadDot} />}
                    </div>
                  ))
                ) : (
                  <div className={styles.emptyText}>No notifications</div>
                )}
              </div>
              <div className={styles.dropdownFooter}>
                <Link to="/notifications" onClick={() => setNotifDropdownOpen(false)}>
                  View all alerts
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div ref={profileRef} className={styles.profileContainer}>
          <div className={styles.profileTrigger} onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}>
            <img
              className={styles.profileAvatar}
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
              alt="User"
            />
          </div>

          {profileDropdownOpen && (
            <div className={styles.profileDropdown}>
              <div className={styles.profileInfo}>
                <span className={styles.profileName}>Priyanshu</span>
                <span className={styles.profileEmail}>priyanshu@propflow.com</span>
              </div>
              <div className={styles.dropdownMenuItem} onClick={() => { setProfileDropdownOpen(false); navigate('/notifications'); }}>
                <User size={15} />
                <span>My Profile</span>
              </div>
              <div className={styles.dropdownMenuItem} onClick={() => setProfileDropdownOpen(false)}>
                <Settings size={15} />
                <span>Preferences</span>
              </div>
              <div className={`${styles.dropdownMenuItem} ${styles.divider}`} onClick={() => setProfileDropdownOpen(false)}>
                <LogOut size={15} />
                <span>Sign Out</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
export default Navbar;
