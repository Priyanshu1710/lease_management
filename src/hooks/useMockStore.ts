import { create } from 'zustand';
import type { Property, Tenant, Lease, Invoice, MaintenanceTicket, Document, Notification, GlobalSearchItem } from '../types';
import {
  mockProperties,
  mockTenants,
  mockLeases,
  mockInvoices,
  mockMaintenanceTickets,
  mockDocuments,
  mockNotifications,
  mockAnalyticsData
} from '../data/mockData';

interface AppState {
  // Database States
  properties: Property[];
  tenants: Tenant[];
  leases: Lease[];
  invoices: Invoice[];
  maintenanceTickets: MaintenanceTicket[];
  documents: Document[];
  notifications: Notification[];
  analyticsData: typeof mockAnalyticsData;
  
  // UI States
  sidebarCollapsed: boolean;
  theme: 'light' | 'dark';
  globalSearchOpen: boolean;

  // Actions - Properties
  addProperty: (property: Omit<Property, 'id' | 'units' | 'occupancyRate'> & { units: Omit<Property['units'][0], 'id'>[] }) => void;
  
  // Actions - Tenants
  addTenant: (tenant: Omit<Tenant, 'id' | 'leaseStatus' | 'paymentStatus'>) => void;
  
  // Actions - Leases
  addLease: (lease: Omit<Lease, 'id' | 'timeline'> & { id?: string }) => void;
  terminateLease: (leaseId: string) => void;
  renewLease: (leaseId: string, newEndDate: string, monthlyRent: number) => void;

  // Actions - Invoices
  payInvoice: (invoiceId: string, paymentMethod: Invoice['paymentMethod']) => void;
  addInvoice: (invoice: Omit<Invoice, 'id'>) => void;

  // Actions - Maintenance Tickets
  addMaintenanceTicket: (ticket: Omit<MaintenanceTicket, 'id' | 'createdAt' | 'timeline' | 'notes'>) => void;
  updateTicketStatus: (ticketId: string, status: MaintenanceTicket['status'], updaterName?: string) => void;
  addTicketNote: (ticketId: string, noteText: string, author: string, avatar: string) => void;
  
  // Actions - Documents
  addDocument: (document: Omit<Document, 'id' | 'uploadDate'>) => void;
  
  // Actions - Notifications
  addNotification: (notification: Omit<Notification, 'id' | 'date' | 'read'>) => void;
  markNotificationRead: (notificationId: string) => void;
  markAllNotificationsRead: () => void;
  
  // Actions - UI Settings
  toggleSidebarCollapsed: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setGlobalSearchOpen: (open: boolean) => void;
  
  // Helper Queries
  getGlobalSearchItems: () => GlobalSearchItem[];
}

export const useMockStore = create<AppState>((set, get) => ({
  // Seed Database
  properties: mockProperties,
  tenants: mockTenants,
  leases: mockLeases,
  invoices: mockInvoices,
  maintenanceTickets: mockMaintenanceTickets,
  documents: mockDocuments,
  notifications: mockNotifications,
  analyticsData: mockAnalyticsData,
  
  // UI States
  sidebarCollapsed: false,
  theme: 'light',
  globalSearchOpen: false,

  // Property Actions
  addProperty: (newProp) => set((state) => {
    const id = `prop-${state.properties.length + 1}`;
    
    // Add unique IDs to sub-units
    const units = newProp.units.map((unit, index) => ({
      ...unit,
      id: `unit-${id}-${index + 1}`,
      propertyId: id
    }));

    const property: Property = {
      ...newProp,
      id,
      occupancyRate: 0, // initially 0% occupied
      totalUnits: units.length,
      units
    };

    return {
      properties: [...state.properties, property],
      notifications: [
        {
          id: `nt-prop-${Date.now()}`,
          title: 'New Property Added',
          message: `${property.name} has been added to your portfolio with ${property.totalUnits} units.`,
          date: new Date().toISOString().split('T')[0],
          read: false,
          type: 'new_tenant',
          severity: 'success',
          link: `/properties/${id}`
        },
        ...state.notifications
      ]
    };
  }),

  // Tenant Actions
  addTenant: (newTenant) => set((state) => {
    const id = `tenant-${state.tenants.length + 1}`;
    const tenant: Tenant = {
      ...newTenant,
      id,
      leaseStatus: 'pending',
      paymentStatus: 'paid'
    };
    return { tenants: [...state.tenants, tenant] };
  }),

  // Lease Actions
  addLease: (leaseData) => set((state) => {
    const id = leaseData.id || `lease-${state.leases.length + 101}`;
    const newLease: Lease = {
      ...leaseData,
      id,
      timeline: [
        {
          id: `timeline-${Date.now()}-1`,
          date: new Date().toISOString().split('T')[0],
          title: 'Lease Created',
          description: `Agreement drafted for Unit ${leaseData.unitNumber} at ${leaseData.propertyName}.`,
          type: 'created'
        },
        {
          id: `timeline-${Date.now()}-2`,
          date: new Date().toISOString().split('T')[0],
          title: 'Lease Activated',
          description: `Deposit of $${leaseData.depositAmount} registered. Tenancy is active.`,
          type: 'signed'
        }
      ]
    };

    // Update Property Unit's occupancy details
    const updatedProperties = state.properties.map((prop) => {
      if (prop.id !== leaseData.propertyId) return prop;
      
      const updatedUnits = prop.units.map((unit) => {
        if (unit.id !== leaseData.unitId) return unit;
        return {
          ...unit,
          occupancyStatus: 'occupied' as const,
          tenantId: leaseData.tenantId,
          tenantName: leaseData.tenantName
        };
      });

      // Recalculate Occupancy Rate
      const occupiedCount = updatedUnits.filter(u => u.occupancyStatus === 'occupied').length;
      const occupancyRate = prop.totalUnits > 0 ? parseFloat(((occupiedCount / prop.totalUnits) * 100).toFixed(1)) : 0;

      return {
        ...prop,
        units: updatedUnits,
        occupancyRate
      };
    });

    // Update Tenant lease status
    const updatedTenants = state.tenants.map((ten) => {
      if (ten.id !== leaseData.tenantId) return ten;
      return {
        ...ten,
        leaseStatus: 'active' as const
      };
    });

    // Generate first invoice automatically
    const firstInvoice: Invoice = {
      id: `inv-${Date.now().toString().slice(-4)}`,
      leaseId: id,
      tenantId: leaseData.tenantId,
      tenantName: leaseData.tenantName,
      propertyName: leaseData.propertyName,
      unitNumber: leaseData.unitNumber,
      amount: leaseData.monthlyRent,
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 5 days from now
      status: 'pending',
      billingPeriod: new Date().toLocaleString('default', { month: 'long', year: 'numeric' })
    };

    return {
      leases: [...state.leases, newLease],
      properties: updatedProperties,
      tenants: updatedTenants,
      invoices: [...state.invoices, firstInvoice],
      notifications: [
        {
          id: `nt-lease-${Date.now()}`,
          title: 'Lease Activated',
          message: `Lease ${id} for ${leaseData.tenantName} at ${leaseData.propertyName} unit ${leaseData.unitNumber} is now active.`,
          date: new Date().toISOString().split('T')[0],
          read: false,
          type: 'new_tenant',
          severity: 'success',
          link: `/leases/${id}`
        },
        ...state.notifications
      ]
    };
  }),

  terminateLease: (leaseId) => set((state) => {
    const lease = state.leases.find(l => l.id === leaseId);
    if (!lease) return state;

    const updatedLeases = state.leases.map((l) => {
      if (l.id !== leaseId) return l;
      return {
        ...l,
        status: 'terminated' as const,
        timeline: [
          ...l.timeline,
          {
            id: `timeline-${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
            title: 'Lease Terminated',
            description: 'The lease agreement was terminated early or ended by manager action.',
            type: 'ended' as const
          }
        ]
      };
    });

    // Reset Unit occupancy details
    const updatedProperties = state.properties.map((prop) => {
      if (prop.id !== lease.propertyId) return prop;
      const updatedUnits = prop.units.map((unit) => {
        if (unit.id !== lease.unitId) return unit;
        return {
          ...unit,
          occupancyStatus: 'vacant' as const,
          tenantId: undefined,
          tenantName: undefined
        };
      });

      const occupiedCount = updatedUnits.filter(u => u.occupancyStatus === 'occupied').length;
      const occupancyRate = prop.totalUnits > 0 ? parseFloat(((occupiedCount / prop.totalUnits) * 100).toFixed(1)) : 0;

      return {
        ...prop,
        units: updatedUnits,
        occupancyRate
      };
    });

    // Update Tenant Status
    const updatedTenants = state.tenants.map((ten) => {
      if (ten.id !== lease.tenantId) return ten;
      return {
        ...ten,
        leaseStatus: 'ended' as const
      };
    });

    return {
      leases: updatedLeases,
      properties: updatedProperties,
      tenants: updatedTenants,
      notifications: [
        {
          id: `nt-term-${Date.now()}`,
          title: 'Lease Terminated',
          message: `Lease ${leaseId} for ${lease.tenantName} at ${lease.propertyName} has been terminated.`,
          date: new Date().toISOString().split('T')[0],
          read: false,
          type: 'lease_expiry',
          severity: 'info',
          link: `/leases/${leaseId}`
        },
        ...state.notifications
      ]
    };
  }),

  renewLease: (leaseId, newEndDate, monthlyRent) => set((state) => {
    const lease = state.leases.find(l => l.id === leaseId);
    if (!lease) return {};

    const updatedLeases = state.leases.map((l) => {
      if (l.id !== leaseId) return l;
      return {
        ...l,
        endDate: newEndDate,
        monthlyRent,
        renewalStatus: 'auto-renew' as const,
        timeline: [
          ...l.timeline,
          {
            id: `timeline-${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
            title: 'Lease Renewed',
            description: `Lease renewed until ${newEndDate} with adjusted rent $${monthlyRent}/mo.`,
            type: 'renewal_alert' as const
          }
        ]
      };
    });

    return {
      leases: updatedLeases,
      notifications: [
        {
          id: `nt-ren-${Date.now()}`,
          title: 'Lease Renewed Successfully',
          message: `Lease ${leaseId} for ${lease.tenantName} at ${lease.propertyName} has been extended to ${newEndDate}.`,
          date: new Date().toISOString().split('T')[0],
          read: false,
          type: 'new_tenant',
          severity: 'success',
          link: `/leases/${leaseId}`
        },
        ...state.notifications
      ]
    };
  }),

  // Invoice Actions
  payInvoice: (invoiceId, paymentMethod) => set((state) => {
    const invoice = state.invoices.find(inv => inv.id === invoiceId);
    if (!invoice) return state;

    const updatedInvoices = state.invoices.map((inv) => {
      if (inv.id !== invoiceId) return inv;
      return {
        ...inv,
        status: 'paid' as const,
        paidDate: new Date().toISOString().split('T')[0],
        paymentMethod
      };
    });

    // Update Tenant payment status if all invoices paid (otherwise check if overdue exist)
    const tenantInvoices = updatedInvoices.filter(inv => inv.tenantId === invoice.tenantId);
    const hasOverdue = tenantInvoices.some(inv => inv.status === 'overdue');
    const hasPending = tenantInvoices.some(inv => inv.status === 'pending');
    const finalPaymentStatus: 'paid' | 'pending' | 'overdue' = hasOverdue ? 'overdue' : hasPending ? 'pending' : 'paid';

    const updatedTenants = state.tenants.map((ten) => {
      if (ten.id !== invoice.tenantId) return ten;
      return {
        ...ten,
        paymentStatus: finalPaymentStatus
      };
    });

    // Update Lease Timeline with payment received
    const updatedLeases = state.leases.map((l) => {
      if (l.id !== invoice.leaseId) return l;
      return {
        ...l,
        timeline: [
          ...l.timeline,
          {
            id: `timeline-pay-${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
            title: `Rent Payment Received`,
            description: `Payment of $${invoice.amount} for period ${invoice.billingPeriod} received via ${paymentMethod?.replace('_', ' ')}.`,
            type: 'payment' as const
          }
        ]
      };
    });

    // Update Analytics Collections for the month
    const billingMonth = invoice.billingPeriod.slice(0, 3); // "May"
    const updatedRevenue = state.analyticsData.monthlyRevenue.map((rev) => {
      if (rev.name !== billingMonth) return rev;
      return {
        ...rev,
        collections: rev.collections + invoice.amount
      };
    });

    // Document creation for payment receipt
    const receiptDoc: Document = {
      id: `doc-receipt-${Date.now()}`,
      name: `Receipt_${invoiceId}_${invoice.tenantName.replace(/\s+/g, '_')}.pdf`,
      category: 'payment_receipt',
      fileType: 'pdf',
      fileSize: '115 KB',
      uploadDate: new Date().toISOString().split('T')[0],
      fileUrl: '#',
      tenantId: invoice.tenantId,
      tenantName: invoice.tenantName
    };

    return {
      invoices: updatedInvoices,
      tenants: updatedTenants,
      leases: updatedLeases,
      documents: [...state.documents, receiptDoc],
      analyticsData: {
        ...state.analyticsData,
        monthlyRevenue: updatedRevenue
      },
      notifications: [
        {
          id: `nt-pay-${Date.now()}`,
          title: 'Invoice Paid',
          message: `Invoice ${invoiceId} for $${invoice.amount} paid by ${invoice.tenantName}.`,
          date: new Date().toISOString().split('T')[0],
          read: false,
          type: 'maintenance_update',
          severity: 'success',
          link: '/payments'
        },
        ...state.notifications
      ]
    };
  }),

  addInvoice: (inv) => set((state) => {
    const id = `inv-${state.invoices.length + 1001}`;
    const invoice: Invoice = {
      ...inv,
      id
    };
    return { invoices: [...state.invoices, invoice] };
  }),

  // Maintenance Actions
  addMaintenanceTicket: (tktData) => set((state) => {
    const id = `tkt-${state.maintenanceTickets.length + 201}`;
    const ticket: MaintenanceTicket = {
      ...tktData,
      id,
      createdAt: new Date().toISOString().split('T')[0],
      timeline: [
        {
          id: `tk-t-${Date.now()}`,
          date: new Date().toLocaleString(),
          status: 'new',
          description: `Ticket filed under category: ${tktData.category}.`
        }
      ],
      notes: []
    };

    return {
      maintenanceTickets: [ticket, ...state.maintenanceTickets],
      notifications: [
        {
          id: `nt-tkt-${Date.now()}`,
          title: 'New Maintenance Ticket',
          message: `Ticket ${id} filed for Unit ${tktData.unitNumber} (${tktData.propertyName}) by ${tktData.tenantName}.`,
          date: new Date().toISOString().split('T')[0],
          read: false,
          type: 'maintenance_update',
          severity: tktData.priority === 'high' ? 'error' : 'info',
          link: '/maintenance'
        },
        ...state.notifications
      ]
    };
  }),

  updateTicketStatus: (ticketId, status, updaterName = 'Manager') => set((state) => {
    const ticket = state.maintenanceTickets.find(t => t.id === ticketId);
    if (!ticket) return {};

    const updatedTickets = state.maintenanceTickets.map((t) => {
      if (t.id !== ticketId) return t;
      return {
        ...t,
        status,
        assignedStaff: status === 'assigned' && !t.assignedStaff ? 'Staff Electrician/Plumber' : t.assignedStaff,
        timeline: [
          ...t.timeline,
          {
            id: `tk-t-${Date.now()}`,
            date: new Date().toLocaleString(),
            status,
            description: `Status changed to ${status.replace('_', ' ')} by ${updaterName}.`
          }
        ]
      };
    });

    // Write a system note in ticket notes
    const updatedTicketsWithNote = updatedTickets.map((t) => {
      if (t.id !== ticketId) return t;
      return {
        ...t,
        notes: [
          ...t.notes,
          {
            id: `note-${Date.now()}`,
            author: 'System',
            avatar: '',
            note: `Status updated to ${status.toUpperCase()} by ${updaterName}.`,
            date: new Date().toLocaleString()
          }
        ]
      };
    });

    // Update lease timeline if resolved
    let updatedLeases = state.leases;
    if (status === 'resolved') {
      updatedLeases = state.leases.map((l) => {
        if (l.unitId !== ticket.unitId) return l;
        return {
          ...l,
          timeline: [
            ...l.timeline,
            {
              id: `timeline-tkt-${Date.now()}`,
              date: new Date().toISOString().split('T')[0],
              title: `Maintenance Resolved`,
              description: `Issue "${ticket.title}" resolved at unit.`,
              type: 'maintenance' as const
            }
          ]
        };
      });
    }

    return {
      maintenanceTickets: updatedTicketsWithNote,
      leases: updatedLeases,
      notifications: [
        {
          id: `nt-tkt-upd-${Date.now()}`,
          title: `Ticket Status Updated`,
          message: `Ticket ${ticketId} status changed to ${status.replace('_', ' ')}.`,
          date: new Date().toISOString().split('T')[0],
          read: false,
          type: 'maintenance_update',
          severity: status === 'resolved' ? 'success' : 'info',
          link: '/maintenance'
        },
        ...state.notifications
      ]
    };
  }),

  addTicketNote: (ticketId, noteText, author, avatar) => set((state) => {
    const updatedTickets = state.maintenanceTickets.map((t) => {
      if (t.id !== ticketId) return t;
      return {
        ...t,
        notes: [
          ...t.notes,
          {
            id: `note-${Date.now()}`,
            author,
            avatar,
            note: noteText,
            date: new Date().toLocaleString()
          }
        ]
      };
    });

    return { maintenanceTickets: updatedTickets };
  }),

  // Document Actions
  addDocument: (docData) => set((state) => {
    const id = `doc-${state.documents.length + 501}`;
    const document: Document = {
      ...docData,
      id,
      uploadDate: new Date().toISOString().split('T')[0]
    };

    return {
      documents: [...state.documents, document],
      notifications: [
        {
          id: `nt-doc-${Date.now()}`,
          title: 'New Document Uploaded',
          message: `File ${docData.name} has been added under ${docData.category.replace('_', ' ')}.`,
          date: new Date().toISOString().split('T')[0],
          read: false,
          type: 'document_expiry',
          severity: 'info',
          link: '/documents'
        },
        ...state.notifications
      ]
    };
  }),

  // Notification Actions
  addNotification: (nt) => set((state) => {
    const id = `nt-${Date.now()}`;
    const notification: Notification = {
      ...nt,
      id,
      date: new Date().toISOString().split('T')[0],
      read: false
    };
    return { notifications: [notification, ...state.notifications] };
  }),

  markNotificationRead: (id) => set((state) => ({
    notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
  })),

  markAllNotificationsRead: () => set((state) => ({
    notifications: state.notifications.map(n => ({ ...n, read: true }))
  })),

  // UI Actions
  toggleSidebarCollapsed: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  toggleTheme: () => set((state) => {
    const nextTheme = state.theme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', nextTheme);
    return { theme: nextTheme };
  }),
  setTheme: (theme) => set(() => {
    document.documentElement.setAttribute('data-theme', theme);
    return { theme };
  }),
  setGlobalSearchOpen: (open) => set({ globalSearchOpen: open }),

  // Global Search Items Query
  getGlobalSearchItems: () => {
    const state = get();
    const items: GlobalSearchItem[] = [];

    // Properties
    state.properties.forEach(p => {
      items.push({
        id: p.id,
        type: 'property',
        title: p.name,
        subtitle: p.address,
        link: `/properties/${p.id}`
      });
    });

    // Tenants
    state.tenants.forEach(t => {
      items.push({
        id: t.id,
        type: 'tenant',
        title: t.name,
        subtitle: t.companyName || t.email,
        link: `/tenants/${t.id}`
      });
    });

    // Leases
    state.leases.forEach(l => {
      items.push({
        id: l.id,
        type: 'lease',
        title: `Lease ${l.id} - Unit ${l.unitNumber}`,
        subtitle: `${l.tenantName} | ${l.propertyName}`,
        link: `/leases/${l.id}`
      });
    });

    // Invoices
    state.invoices.forEach(i => {
      items.push({
        id: i.id,
        type: 'invoice',
        title: `Invoice ${i.id} - ${i.amount}`,
        subtitle: `${i.tenantName} | Due ${i.dueDate}`,
        link: `/payments`
      });
    });

    // Maintenance
    state.maintenanceTickets.forEach(t => {
      items.push({
        id: t.id,
        type: 'ticket',
        title: `${t.title}`,
        subtitle: `Ticket ${t.id} (${t.status}) | ${t.propertyName} ${t.unitNumber}`,
        link: `/maintenance`
      });
    });

    // Documents
    state.documents.forEach(d => {
      items.push({
        id: d.id,
        type: 'document',
        title: d.name,
        subtitle: `Category: ${d.category.replace('_', ' ')}`,
        link: `/documents`
      });
    });

    return items;
  }
}));
