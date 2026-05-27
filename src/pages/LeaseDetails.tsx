import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useMockStore } from '../hooks/useMockStore';
import { useForm } from 'react-hook-form';
import { ChevronLeft, FileText, RotateCcw, AlertTriangle, X, CheckSquare } from 'lucide-react';
import styles from './pages.module.scss';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Input from '../components/common/Input';
import Table from '../components/common/Table';

interface RenewLeaseFormData {
  newEndDate: string;
  monthlyRent: number;
}

export const LeaseDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { leases, invoices, documents, renewLease, terminateLease } = useMockStore();

  const lease = leases.find((l) => l.id === id);
  const [activeTab, setActiveTab] = useState<'details' | 'schedule' | 'timeline'>('details');
  
  // Interactive Modals
  const [isRenewModalOpen, setIsRenewModalOpen] = useState(false);
  const [isTerminateConfirmOpen, setIsTerminateConfirmOpen] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<RenewLeaseFormData>();

  if (!lease) {
    return (
      <div className="page-container">
        <div style={{ textAlign: 'center', padding: '48px 0' }}>
          <h2>Agreement not found</h2>
          <p>The lease ID you are trying to view does not exist.</p>
          <Link to="/leases">
            <Button style={{ marginTop: '16px' }}>Back to Leases</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Filter linked records
  const leaseInvoices = invoices.filter((i) => i.leaseId === id);
  const leaseDocs = documents.filter((d) => lease.documentIds.includes(d.id) || (d.tenantId === lease.tenantId && d.category === 'lease_agreement'));

  const onSubmitRenew = (data: RenewLeaseFormData) => {
    renewLease(lease.id, data.newEndDate, Number(data.monthlyRent));
    setIsRenewModalOpen(false);
    reset();
  };

  const handleConfirmTerminate = () => {
    terminateLease(lease.id);
    setIsTerminateConfirmOpen(false);
  };

  return (
    <div className="page-container">
      {/* Breadcrumb Back */}
      <div>
        <Link to="/leases" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          <ChevronLeft size={16} /> Back to Agreements
        </Link>
      </div>

      {/* Header Panel */}
      <div className="page-header" style={{ marginTop: '-8px' }}>
        <div className="title-area">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1>Lease Agreement {lease.id}</h1>
            <Badge variant={lease.status === 'active' ? 'success' : lease.status === 'pending' ? 'warning' : 'muted'}>
              {lease.status}
            </Badge>
          </div>
          <p>
            Tenant: <Link to={`/tenants/${lease.tenantId}`} style={{ color: 'var(--primary)', fontWeight: 600 }}>{lease.tenantName}</Link> • Unit {lease.unitNumber} at <Link to={`/properties/${lease.propertyId}`} style={{ color: 'var(--primary)', fontWeight: 600 }}>{lease.propertyName}</Link>
          </p>
        </div>
        
        {/* Actions Button Panel */}
        {lease.status === 'active' && (
          <div className="actions-area">
            <Button variant="outline" leftIcon={<RotateCcw size={16} />} onClick={() => setIsRenewModalOpen(true)}>
              Renew / Extend
            </Button>
            <Button variant="danger" leftIcon={<AlertTriangle size={16} />} onClick={() => setIsTerminateConfirmOpen(true)}>
              Terminate Early
            </Button>
          </div>
        )}
      </div>

      {/* Primary Split Details layout */}
      <div className={styles.detailGrid}>
        
        {/* Left Column: Terms, Schedule, Timeline Tabs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Tabs header */}
          <div className={styles.tabsContainer}>
            <div
              className={`${styles.tabItem} ${activeTab === 'details' ? styles.active : ''}`}
              onClick={() => setActiveTab('details')}
            >
              Agreement Summary & Terms
            </div>
            <div
              className={`${styles.tabItem} ${activeTab === 'schedule' ? styles.active : ''}`}
              onClick={() => setActiveTab('schedule')}
            >
              Billing Ledger ({leaseInvoices.length})
            </div>
            <div
              className={`${styles.tabItem} ${activeTab === 'timeline' ? styles.active : ''}`}
              onClick={() => setActiveTab('timeline')}
            >
              Agreement Lifecycle Timeline
            </div>
          </div>

          {/* Details & Terms Tab */}
          {activeTab === 'details' && (
            <>
              {/* Core Information Block */}
              <div style={{ padding: '24px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '16px' }}>Contract Terms</h3>
                <div className={styles.infoBlockGrid}>
                  <div className={styles.infoBlock}>
                    <span className={styles.blockLabel}>Start Date</span>
                    <span className={styles.blockValue}>{lease.startDate}</span>
                  </div>
                  <div className={styles.infoBlock}>
                    <span className={styles.blockLabel}>End Date</span>
                    <span className={styles.blockValue}>{lease.endDate}</span>
                  </div>
                  <div className={styles.infoBlock}>
                    <span className={styles.blockLabel}>Monthly Rent</span>
                    <span className={styles.blockValue}>${lease.monthlyRent.toLocaleString()}/mo</span>
                  </div>
                  <div className={styles.infoBlock}>
                    <span className={styles.blockLabel}>Security Deposit</span>
                    <span className={styles.blockValue}>${lease.depositAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Terms and Scope text box */}
              <div style={{ padding: '24px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '12px' }}>Standard Legal Terms & Scope</h3>
                <div style={{ padding: '16px', backgroundColor: 'var(--bg-app)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                  {lease.terms}
                </div>
              </div>
            </>
          )}

          {/* Billing Ledger Tab */}
          {activeTab === 'schedule' && (
            <div style={{ padding: '24px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '16px' }}>Monthly Rent Billings</h3>
              <Table headers={['Invoice ID', 'Billing Period', 'Due Date', 'Billed Amount', 'Status', 'Paid Date']}>
                {leaseInvoices.map((inv) => (
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
                    <td>{inv.paidDate || <span style={{ color: 'var(--text-muted)' }}>Unpaid</span>}</td>
                  </tr>
                ))}
              </Table>
            </div>
          )}

          {/* Timeline Tab */}
          {activeTab === 'timeline' && (
            <div style={{ padding: '24px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '24px' }}>Chronological Audit Trail</h3>
              <div className={styles.timeline}>
                {lease.timeline.map((evt) => (
                  <div key={evt.id} className={styles.timelineItem}>
                    <div className={`${styles.timelineDot} ${styles[evt.type] || ''}`} />
                    <div className={styles.timelineContent}>
                      <div className={styles.timelineHeader}>
                        <h4>{evt.title}</h4>
                        <span>{evt.date}</span>
                      </div>
                      <p>{evt.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Sidebar metadata profiles */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Tenant profile card summary */}
          <div style={{ padding: '24px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600, borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>Occupant Profile</h3>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {lease.tenantAvatar && (
                <img src={lease.tenantAvatar} alt={lease.tenantName} style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} />
              )}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: 600 }}>{lease.tenantName}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Registered Occupant</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
              <Link to={`/tenants/${lease.tenantId}`} style={{ width: '100%' }}>
                <Button variant="outline" size="sm" style={{ width: '100%' }}>
                  View Full Profile
                </Button>
              </Link>
            </div>
          </div>

          {/* Renewal Policy Card */}
          <div style={{ padding: '24px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600, borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>Renewal Settings</h3>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Policy:</span>
              <span style={{ fontWeight: 600, textTransform: 'capitalize' }}>
                {lease.renewalStatus.replace('-', ' ')}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Status:</span>
              <Badge variant={lease.status === 'active' ? 'success' : 'muted'}>
                {lease.status}
              </Badge>
            </div>

            {lease.status === 'active' && lease.renewalStatus === 'under-review' && (
              <div style={{ marginTop: '8px', padding: '12px', backgroundColor: 'var(--warning-light)', color: 'var(--warning)', borderRadius: '10px', fontSize: '0.8rem', display: 'flex', gap: '8px', alignItems: 'center' }}>
                <AlertTriangle size={16} style={{ flexShrink: 0 }} />
                <span>Agreement expires soon. Act on renewal settings.</span>
              </div>
            )}
          </div>

          {/* Files Card */}
          <div style={{ padding: '24px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600, borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>Files & Exhibits</h3>
            {leaseDocs.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {leaseDocs.map((doc) => (
                  <div key={doc.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.825rem', padding: '8px', border: '1px solid var(--border)', borderRadius: '8px' }}>
                    <FileText size={16} className="text-secondary" />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                      {doc.name}
                    </span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{doc.fileSize}</span>
                  </div>
                ))}
              </div>
            ) : (
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '12px 0' }}>
                No files uploaded
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Renew Lease Dialog Modal */}
      {isRenewModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Renew / Extend Lease Agreement</h3>
              <button className={styles.closeBtn} onClick={() => setIsRenewModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit(onSubmitRenew)}>
              <div className={styles.modalBody}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Extend the contract for {lease.tenantName} (Unit {lease.unitNumber}). This logs a renewal event and updates the contract end date.
                  </p>

                  <Input
                    label="Adjusted Monthly Rent ($) *"
                    type="number"
                    defaultValue={lease.monthlyRent}
                    error={errors.monthlyRent?.message}
                    {...register('monthlyRent', { required: 'Rent is required', min: { value: 1, message: 'Min 1' } })}
                  />

                  <Input
                    label="New Contract End Date *"
                    type="date"
                    error={errors.newEndDate?.message}
                    {...register('newEndDate', { required: 'New end date is required' })}
                  />
                </div>
              </div>
              <div className={styles.modalFooter}>
                <Button type="button" variant="secondary" onClick={() => setIsRenewModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" leftIcon={<CheckSquare size={16} />}>
                  Approve Extension
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Terminate Lease Confirmation Dialog */}
      {isTerminateConfirmOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3 style={{ color: 'var(--danger)' }}>Terminate Agreement</h3>
              <button className={styles.closeBtn} onClick={() => setIsTerminateConfirmOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <div className={styles.modalBody}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <AlertTriangle size={36} className="text-danger" style={{ flexShrink: 0 }} />
                <div>
                  <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>Are you sure you want to terminate this lease?</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '6px', lineHeight: 1.5 }}>
                    This will immediately flag lease agreement {lease.id} as <strong>terminated</strong>. Unit {lease.unitNumber} at {lease.propertyName} will return to <strong>vacant</strong> status, and tenant {lease.tenantName} will be updated to lease status <strong>ended</strong>. This action is irreversible.
                  </p>
                </div>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <Button variant="secondary" onClick={() => setIsTerminateConfirmOpen(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleConfirmTerminate}>
                Confirm Termination
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default LeaseDetails;
