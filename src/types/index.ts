export interface Property {
  id: string;
  name: string;
  address: string;
  type: 'commercial' | 'residential';
  totalFloors: number;
  totalUnits: number;
  occupancyRate: number; // percentage
  parkingAvailable: boolean;
  amenities: string[];
  images: string[];
  description: string;
  units: Unit[];
}

export interface Unit {
  id: string;
  propertyId: string;
  propertyName?: string;
  unitNumber: string;
  floorNumber: number;
  area: number; // sqft
  rentAmount: number;
  occupancyStatus: 'vacant' | 'occupied';
  tenantId?: string;
  tenantName?: string;
}

export interface Tenant {
  id: string;
  name: string;
  email: string;
  phone: string;
  companyName?: string;
  avatarUrl: string;
  leaseStatus: 'active' | 'pending' | 'ended';
  paymentStatus: 'paid' | 'pending' | 'overdue';
  personalDetails: {
    dob?: string;
    kycStatus: 'verified' | 'pending' | 'unverified';
    emergencyContactName?: string;
    emergencyContactPhone?: string;
  };
}

export interface LeaseTimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  type: 'created' | 'signed' | 'payment' | 'maintenance' | 'renewal_alert' | 'ended';
}

export interface Lease {
  id: string;
  tenantId: string;
  tenantName: string;
  tenantAvatar?: string;
  propertyId: string;
  propertyName: string;
  unitId: string;
  unitNumber: string;
  startDate: string;
  endDate: string;
  depositAmount: number;
  monthlyRent: number;
  status: 'active' | 'pending' | 'expired' | 'terminated';
  renewalStatus: 'auto-renew' | 'manual-renew' | 'not-renewing' | 'under-review';
  terms: string;
  timeline: LeaseTimelineEvent[];
  documentIds: string[];
}

export interface Invoice {
  id: string;
  leaseId: string;
  tenantId: string;
  tenantName: string;
  propertyName: string;
  unitNumber: string;
  amount: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
  paidDate?: string;
  paymentMethod?: 'bank_transfer' | 'credit_card' | 'check' | 'cash';
  billingPeriod: string; // e.g. "May 2026"
}

export interface TicketTimelineEvent {
  id: string;
  date: string;
  status: 'new' | 'assigned' | 'in_progress' | 'resolved';
  description: string;
}

export interface TicketNote {
  id: string;
  author: string;
  avatar: string;
  note: string;
  date: string;
}

export interface MaintenanceTicket {
  id: string;
  propertyId: string;
  propertyName: string;
  unitId: string;
  unitNumber: string;
  tenantId: string;
  tenantName: string;
  tenantAvatar?: string;
  category: 'plumbing' | 'electrical' | 'hvac' | 'structural' | 'appliance' | 'other';
  title: string;
  description: string;
  status: 'new' | 'assigned' | 'in_progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  assignedStaff?: string;
  images: string[];
  timeline: TicketTimelineEvent[];
  notes: TicketNote[];
  createdAt: string;
}

export interface Document {
  id: string;
  name: string;
  category: 'lease_agreement' | 'kyc_document' | 'property_document' | 'payment_receipt';
  fileType: 'pdf' | 'docx' | 'xlsx' | 'jpg' | 'png';
  fileSize: string; // e.g., "1.4 MB"
  uploadDate: string;
  fileUrl: string;
  tenantId?: string;
  tenantName?: string;
  propertyId?: string;
  propertyName?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'lease_expiry' | 'payment_overdue' | 'maintenance_update' | 'new_tenant' | 'document_expiry';
  severity: 'info' | 'warning' | 'error' | 'success';
  link?: string;
}

export interface GlobalSearchItem {
  id: string;
  type: 'property' | 'tenant' | 'lease' | 'invoice' | 'document' | 'ticket';
  title: string;
  subtitle: string;
  link: string;
}
