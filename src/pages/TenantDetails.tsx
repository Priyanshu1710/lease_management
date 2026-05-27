import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useMockStore } from '../hooks/useMockStore';
import { ChevronLeft, Mail, Phone, Calendar, User, FolderOpen } from 'lucide-react';
import styles from './pages.module.scss';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Table from '../components/common/Table';

export const TenantDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { tenants, leases, invoices, maintenanceTickets, documents } = useMockStore();

  const tenant = tenants.find((t) => t.id === id);
  const [activeTab, setActiveTab] = useState<'lease' | 'payments' | 'maintenance' | 'documents'>('lease');

  if (!tenant) {
    return (
      <div className="page-container">
        <div style={{ textAlign: 'center', padding: '48px 0' }}>
          <h2>Tenant not found</h2>
          <p>The tenant profile ID you are trying to view does not exist.</p>
          <Link to="/tenants" style={{ marginTop: '16px', display: 'inline-block' }}>
            <Button>Back to Tenants</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Interconnected lookups
  const tenantLeases = leases.filter((l) => l.tenantId === id);
  const tenantInvoices = invoices.filter((i) => i.tenantId === id);
  const tenantTickets = maintenanceTickets.filter((t) => t.tenantId === id);
  const tenantDocs = documents.filter((d) => d.tenantId === id);

  const activeLease = tenantLeases.find((l) => l.status === 'active');

  return (
    <div className="page-container">
      {/* Breadcrumb Back */}
      <div>
        <Link to="/tenants" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          <ChevronLeft size={16} /> Back to Directory
        </Link>
      </div>

      {/* Header Info */}
      <div className="page-header" style={{ marginTop: '-8px' }}>
        <div className="title-area">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <img src={tenant.avatarUrl} alt={tenant.name} style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover' }} />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h1>{tenant.name}</h1>
                <Badge variant={tenant.personalDetails.kycStatus === 'verified' ? 'success' : 'warning'}>
                  KYC {tenant.personalDetails.kycStatus}
                </Badge>
              </div>
              <p style={{ marginTop: '2px' }}>
                {tenant.companyName ? `${tenant.companyName}` : 'Residential Occupant'}
              </p>
            </div>
          </div>
        </div>
        <div className="actions-area" style={{ display: 'flex', gap: '10px' }}>
          <Badge variant={tenant.leaseStatus === 'active' ? 'success' : tenant.leaseStatus === 'pending' ? 'warning' : 'muted'} style={{ padding: '8px 14px' }}>
            Lease: {tenant.leaseStatus}
          </Badge>
          <Badge variant={tenant.paymentStatus === 'paid' ? 'success' : tenant.paymentStatus === 'overdue' ? 'danger' : 'warning'} style={{ padding: '8px 14px' }}>
            Finance: {tenant.paymentStatus}
          </Badge>
        </div>
      </div>

      {/* Split Details view */}
      <div className={styles.detailGrid}>
        {/* Left Column: Linked Records and Tabs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Tab Navigation */}
          <div className={styles.tabsContainer}>
            <div
              className={`${styles.tabItem} ${activeTab === 'lease' ? styles.active : ''}`}
              onClick={() => setActiveTab('lease')}
            >
              Lease Agreements ({tenantLeases.length})
            </div>
            <div
              className={`${styles.tabItem} ${activeTab === 'payments' ? styles.active : ''}`}
              onClick={() => setActiveTab('payments')}
            >
              Payment History ({tenantInvoices.length})
            </div>
            <div
              className={`${styles.tabItem} ${activeTab === 'maintenance' ? styles.active : ''}`}
              onClick={() => setActiveTab('maintenance')}
            >
              Service Tickets ({tenantTickets.length})
            </div>
            <div
              className={`${styles.tabItem} ${activeTab === 'documents' ? styles.active : ''}`}
              onClick={() => setActiveTab('documents')}
            >
              KYC & Files ({tenantDocs.length})
            </div>
          </div>

          {/* Lease Agreements Tab */}
          {activeTab === 'lease' && (
            <div style={{ padding: '24px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '16px' }}>Lease Records</h3>
              {tenantLeases.length > 0 ? (
                <Table headers={['Lease ID', 'Property / Unit', 'Monthly Rent', 'Duration', 'Renewal Status', 'Status', 'Actions']}>
                  {tenantLeases.map((l) => (
                    <tr key={l.id}>
                      <td style={{ fontWeight: 600 }}>{l.id}</td>
                      <td>{l.propertyName} Unit {l.unitNumber}</td>
                      <td style={{ fontWeight: 600 }}>${l.monthlyRent.toLocaleString()}/mo</td>
                      <td>{l.startDate} to {l.endDate}</td>
                      <td style={{ textTransform: 'capitalize' }}>{l.renewalStatus.replace('-', ' ')}</td>
                      <td>
                        <Badge variant={l.status === 'active' ? 'success' : l.status === 'pending' ? 'warning' : 'muted'}>
                          {l.status}
                        </Badge>
                      </td>
                      <td>
                        <Link to={`/leases/${l.id}`}>
                          <Button variant="ghost" size="sm">Review Details</Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </Table>
              ) : (
                <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-muted)' }}>
                  No lease agreement active for this tenant profile.
                </div>
              )}
            </div>
          )}

          {/* Payment History Tab */}
          {activeTab === 'payments' && (
            <div style={{ padding: '24px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '16px' }}>Billed Invoices Ledger</h3>
              {tenantInvoices.length > 0 ? (
                <Table headers={['Invoice ID', 'Billing Month', 'Due Date', 'Billed Amount', 'Status', 'Paid On']}>
                  {tenantInvoices.map((inv) => (
                    <tr key={inv.id}>
                      <td style={{ fontWeight: 600 }}>{inv.id}</td>
                      <td>{inv.billingPeriod}</td>
                      <td>{inv.dueDate}</td>
                      <td style={{ fontWeight: 600 }}>${inv.amount.toLocaleString()}</td>
                      <td>
                        <Badge variant={inv.status === 'paid' ? 'success' : inv.status === 'overdue' ? 'danger' : 'warning'}>
                          {inv.status}
                        </Badge>
                      </td>
                      <td>{inv.paidDate || <span style={{ color: 'var(--text-muted)' }}>—</span>}</td>
                    </tr>
                  ))}
                </Table>
              ) : (
                <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-muted)' }}>
                  No invoice statements available for this account.
                </div>
              )}
            </div>
          )}

          {/* Service Tickets Tab */}
          {activeTab === 'maintenance' && (
            <div style={{ padding: '24px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '16px' }}>Tenant Service Requests</h3>
              {tenantTickets.length > 0 ? (
                <Table headers={['Ticket ID', 'Description Summary', 'Category', 'Priority', 'Assigned Staff', 'Status']}>
                  {tenantTickets.map((t) => (
                    <tr key={t.id}>
                      <td style={{ fontWeight: 600 }}>{t.id}</td>
                      <td style={{ fontWeight: 500 }}>{t.title}</td>
                      <td style={{ textTransform: 'capitalize' }}>{t.category}</td>
                      <td>
                        <Badge variant={t.priority === 'high' ? 'danger' : t.priority === 'medium' ? 'warning' : 'muted'}>
                          {t.priority}
                        </Badge>
                      </td>
                      <td>{t.assignedStaff || <span style={{ color: 'var(--text-muted)' }}>Unassigned</span>}</td>
                      <td>
                        <Badge variant={t.status === 'resolved' ? 'success' : t.status === 'in_progress' ? 'warning' : 'info'}>
                          {t.status.replace('_', ' ')}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </Table>
              ) : (
                <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-muted)' }}>
                  No maintenance requests have been filed by this tenant.
                </div>
              )}
            </div>
          )}

          {/* KYC Documents Tab */}
          {activeTab === 'documents' && (
            <div style={{ padding: '24px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '16px' }}>Uploaded Verification Documents</h3>
              {tenantDocs.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  {tenantDocs.map((doc) => (
                    <div key={doc.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', border: '1px solid var(--border)', borderRadius: '10px' }}>
                      <div style={{ width: '40px', height: '40px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px' }}>
                        <FolderOpen size={20} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-primary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                          {doc.name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                          {doc.fileSize} • Uploaded {doc.uploadDate}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-muted)' }}>
                  No identity verification documents uploaded yet.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Profile details sidebar details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Contact Details Card */}
          <div style={{ padding: '24px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600, borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>Contact Details</h3>
            
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <Mail size={16} className="text-secondary" />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Email address</span>
                <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>{tenant.email}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <Phone size={16} className="text-secondary" />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Phone number</span>
                <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>{tenant.phone}</span>
              </div>
            </div>

            {tenant.personalDetails.dob && (
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <Calendar size={16} className="text-secondary" />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Date of birth</span>
                  <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>{tenant.personalDetails.dob}</span>
                </div>
              </div>
            )}
          </div>

          {/* Emergency Contact Card */}
          {tenant.personalDetails.emergencyContactName && (
            <div style={{ padding: '24px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 600, borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>Emergency Contact</h3>
              
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <User size={16} className="text-secondary" />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Contact name</span>
                  <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>{tenant.personalDetails.emergencyContactName}</span>
                </div>
              </div>

              {tenant.personalDetails.emergencyContactPhone && (
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <Phone size={16} className="text-secondary" />
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Contact phone</span>
                    <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>{tenant.personalDetails.emergencyContactPhone}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Active Lease Unit Card summary */}
          {activeLease && (
            <div style={{ padding: '24px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 600, borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>Current Tenancy</h3>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Property:</span>
                <span style={{ fontWeight: 600 }}>{activeLease.propertyName}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Unit number:</span>
                <span style={{ fontWeight: 600 }}>Unit {activeLease.unitNumber}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Monthly Rent:</span>
                <span style={{ fontWeight: 600, color: 'var(--primary)' }}>${activeLease.monthlyRent.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Deposit paid:</span>
                <span style={{ fontWeight: 600 }}>${activeLease.depositAmount.toLocaleString()}</span>
              </div>

              <div style={{ marginTop: '8px', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
                <Link to={`/leases/${activeLease.id}`} style={{ width: '100%' }}>
                  <Button variant="outline" size="sm" style={{ width: '100%' }}>
                    Manage Lease Agreement
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default TenantDetails;
