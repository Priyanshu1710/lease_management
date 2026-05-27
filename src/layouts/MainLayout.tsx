import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { Navbar } from '../components/layout/Navbar';
import { GlobalSearchModal } from '../components/layout/GlobalSearchModal';
import { useMockStore } from '../hooks/useMockStore';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '../components/layout/layout.module.scss';

export const MainLayout: React.FC = () => {
  const { sidebarCollapsed, theme } = useMockStore();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();

  // On mount, align theme attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Close mobile sidebar on navigation
  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className={styles.layoutWrapper}>
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Sidebar overlay and menu */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={styles.mobileOverlay}
              onClick={() => setMobileSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{ position: 'fixed', top: 0, bottom: 0, left: 0, zIndex: 150 }}
            >
              <Sidebar isMobile onCloseMobile={() => setMobileSidebarOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Viewport Container */}
      <div className={`${styles.mainContent} ${sidebarCollapsed ? styles.collapsed : ''}`}>
        <Navbar onOpenMobileSidebar={() => setMobileSidebarOpen(true)} />

        <main className={styles.contentBody}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="page-wrapper"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Fuzzy Global Search Overlay */}
      <GlobalSearchModal />
    </div>
  );
};
export default MainLayout;
