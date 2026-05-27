import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Dashboard from '../pages/Dashboard';
import Properties from '../pages/Properties';
import PropertyDetails from '../pages/PropertyDetails';
import Tenants from '../pages/Tenants';
import TenantDetails from '../pages/TenantDetails';
import Leases from '../pages/Leases';
import LeaseDetails from '../pages/LeaseDetails';
import Payments from '../pages/Payments';
import Maintenance from '../pages/Maintenance';
import Documents from '../pages/Documents';
import Reports from '../pages/Reports';
import Notifications from '../pages/Notifications';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {/* Core Dashboard */}
        <Route index element={<Dashboard />} />
        
        {/* Properties Module */}
        <Route path="properties" element={<Properties />} />
        <Route path="properties/:id" element={<PropertyDetails />} />
        
        {/* Tenants Module */}
        <Route path="tenants" element={<Tenants />} />
        <Route path="tenants/:id" element={<TenantDetails />} />
        
        {/* Lease Management Module */}
        <Route path="leases" element={<Leases />} />
        <Route path="leases/:id" element={<LeaseDetails />} />
        
        {/* Payments & Bookkeeping */}
        <Route path="payments" element={<Payments />} />
        
        {/* Maintenance Tickets desk */}
        <Route path="maintenance" element={<Maintenance />} />
        
        {/* Document locker */}
        <Route path="documents" element={<Documents />} />
        
        {/* Analytics Reports */}
        <Route path="reports" element={<Reports />} />
        
        {/* Notifications center */}
        <Route path="notifications" element={<Notifications />} />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};
export default AppRoutes;
