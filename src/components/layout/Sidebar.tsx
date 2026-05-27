import React from 'react';
import { NavLink } from 'react-router-dom';
import { useMockStore } from '../../hooks/useMockStore';
import styles from './layout.module.scss';
import {
  LayoutDashboard,
  Building2,
  Users2,
  FileText,
  CreditCard,
  Wrench,
  FolderOpen,
  BarChart3,
  Bell,
  ChevronLeft
} from 'lucide-react';

interface SidebarProps {
  isMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobile = false, onCloseMobile }) => {
  const { sidebarCollapsed, toggleSidebarCollapsed } = useMockStore();

  const menuItems = [
    { label: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { label: 'Properties', path: '/properties', icon: <Building2 size={20} /> },
    { label: 'Tenants', path: '/tenants', icon: <Users2 size={20} /> },
    { label: 'Lease Agreements', path: '/leases', icon: <FileText size={20} /> },
    { label: 'Payments & Invoices', path: '/payments', icon: <CreditCard size={20} /> },
    { label: 'Maintenance Tickets', path: '/maintenance', icon: <Wrench size={20} /> },
    { label: 'Documents', path: '/documents', icon: <FolderOpen size={20} /> },
    { label: 'Reports & Analytics', path: '/reports', icon: <BarChart3 size={20} /> },
    { label: 'Notifications', path: '/notifications', icon: <Bell size={20} /> }
  ];

  const handleLinkClick = () => {
    if (isMobile && onCloseMobile) {
      onCloseMobile();
    }
  };

  const sidebarClasses = isMobile
    ? styles.mobileSidebar
    : `${styles.sidebar} ${sidebarCollapsed ? styles.collapsed : ''}`;

  return (
    <aside className={sidebarClasses}>
      <div className={styles.logoArea}>
        <div className={styles.logoIcon}>L</div>
        <span className={styles.logoText}>LeaseFlow</span>
      </div>

      <nav className={styles.navigationList}>
        {menuItems.map((item) => (
        <NavLink
            key={item.path}
            to={item.path}
            onClick={handleLinkClick}
            title={item.label}
            data-tooltip={item.label}
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.active : ''}`
            }
          >
            {item.icon}
            <span className={styles.navLabel}>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className={styles.sidebarFooter}>
        {!isMobile && (
          <div className={styles.collapseToggleRow}>
            <button className={styles.collapseBtn} onClick={toggleSidebarCollapsed} aria-label="Toggle Sidebar">
              <ChevronLeft size={16} />
            </button>
          </div>
        )}
        <div className={styles.sidebarUser}>
          <img
            className={styles.userAvatar}
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
            alt="User Profile"
          />
          <div className={styles.userData}>
            <span className={styles.userName}>Priyanshu</span>
            <span className={styles.userCompany}>Global Properties</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
export default Sidebar;
