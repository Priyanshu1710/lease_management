import React, { useState } from 'react';
import { useMockStore } from '../hooks/useMockStore';
import { CreditCard, CheckCircle, Clock, AlertTriangle, Search, X, CheckSquare, ShieldCheck, Printer } from 'lucide-react';
import styles from './pages.module.scss';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Select from '../components/common/Select';
import Table from '../components/common/Table';
import type { Invoice } from '../types';

export const Payments: React.FC = () => {
  const { invoices, payInvoice } = useMockStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'pending' | 'overdue'>('all');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<Invoice['paymentMethod']>('bank_transfer');

  // Summary aggregates
  const paidInvoices = invoices.filter((i) => i.status === 'paid');
  const pendingInvoices = invoices.filter((i) => i.status === 'pending');
  const overdueInvoices = invoices.filter((i) => i.status === 'overdue');

  const totalPaid = paidInvoices.reduce((sum, i) => sum + i.amount, 0);
  const totalPending = pendingInvoices.reduce((sum, i) => sum + i.amount, 0);
  const totalOverdue = overdueInvoices.reduce((sum, i) => sum + i.amount, 0);

  // Filter invoices list
  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.tenantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.propertyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenDetail = (inv: Invoice) => {
    setSelectedInvoice(inv);
  };

  const handleCloseDetail = () => {
    setSelectedInvoice(null);
  };

  const handleOpenPay = () => {
    setIsPayModalOpen(true);
  };

  const handleClosePay = () => {
    setIsPayModalOpen(false);
  };

  const handleExecutePayment = () => {
    if (!selectedInvoice) return;
    payInvoice(selectedInvoice.id, paymentMethod);
    setIsPayModalOpen(false);
    
    // Refresh details modal with updated paid state
    const updatedInv = useMockStore.getState().invoices.find(i => i.id === selectedInvoice.id);
    if (updatedInv) setSelectedInvoice(updatedInv);
  };

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header">
        <div className="title-area">
          <h1>Financial Transactions</h1>
          <p>Monitor cash flows, generate receipts, and reconcile rent billings.</p>
        </div>
      </div>

      {/* Aggregate Cards Grid */}
      <div className={styles.dashboardGrid}>
        {/* Paid Invoices */}
        <div className={styles.metricCard}>
          <div className={styles.metricIcon} style={{ backgroundColor: 'var(--success-light)', color: 'var(--success)' }}>
            <CheckCircle size={22} />
          </div>
          <div className={styles.metricData}>
            <span className={styles.metricValue}>${totalPaid.toLocaleString()}</span>
            <span className={styles.metricLabel}>Total Collections Received</span>
          </div>
        </div>

        {/* Pending Invoices */}
        <div className={styles.metricCard}>
          <div className={styles.metricIcon} style={{ backgroundColor: 'var(--warning-light)', color: 'var(--warning)' }}>
            <Clock size={22} />
          </div>
          <div className={styles.metricData}>
            <span className={styles.metricValue}>${totalPending.toLocaleString()}</span>
            <span className={styles.metricLabel}>Outstanding Bills (Pending)</span>
          </div>
        </div>

        {/* Overdue Invoices */}
        <div className={styles.metricCard}>
          <div className={styles.metricIcon} style={{ backgroundColor: 'var(--danger-light)', color: 'var(--danger)' }}>
            <AlertTriangle size={22} />
          </div>
          <div className={styles.metricData}>
            <span className={styles.metricValue}>${totalOverdue.toLocaleString()}</span>
            <span className={styles.metricLabel}>Delinquent Accounts (Overdue)</span>
          </div>
        </div>

        {/* Billing Metrics Ratio */}
        <div className={styles.metricCard}>
          <div className={styles.metricIcon}>
            <CreditCard size={22} />
          </div>
          <div className={styles.metricData}>
            <span className={styles.metricValue}>
              {invoices.length > 0 ? ((paidInvoices.length / invoices.length) * 100).toFixed(0) : 0}%
            </span>
            <span className={styles.metricLabel}>Payment Collection Efficiency</span>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className={styles.filterRow}>
        <div className={styles.searchContainer}>
          <Search size={18} />
          <input
            type="text"
            className="input"
            placeholder="Search invoice number, tenant, property..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className={styles.controlsRight}>
          <Select
            options={[
              { value: 'all', label: 'All Invoices' },
              { value: 'paid', label: 'Paid Statements' },
              { value: 'pending', label: 'Pending Collections' },
              { value: 'overdue', label: 'Overdue Collections' }
            ]}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            style={{ width: '180px' }}
          />
        </div>
      </div>

      {/* Invoices List Table */}
      {filteredInvoices.length > 0 ? (
        <Table headers={['Invoice ID', 'Tenant Account', 'Property Unit', 'Billing Period', 'Billed Amount', 'Due Date', 'Status', 'Actions']}>
          {filteredInvoices.map((inv) => (
            <tr key={inv.id}>
              <td style={{ fontWeight: 600 }}>{inv.id}</td>
              <td style={{ fontWeight: 500 }}>{inv.tenantName}</td>
              <td>{inv.propertyName} {inv.unitNumber}</td>
              <td>{inv.billingPeriod}</td>
              <td style={{ fontWeight: 600 }}>${inv.amount.toLocaleString()}</td>
              <td>{inv.dueDate}</td>
              <td>
                <Badge variant={inv.status === 'paid' ? 'success' : inv.status === 'overdue' ? 'danger' : 'warning'}>
                  {inv.status}
                </Badge>
              </td>
              <td>
                <Button variant="ghost" size="sm" onClick={() => handleOpenDetail(inv)}>
                  Details & Pay
                </Button>
              </td>
            </tr>
          ))}
        </Table>
      ) : (
        <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
          No billing records match the selection filter.
        </div>
      )}

      {/* Invoice Details & Simulated Payment Modal */}
      {selectedInvoice && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.modalContent} ${styles.large}`}>
            <div className={styles.modalHeader}>
              <h3>Billing Statement details</h3>
              <button className={styles.closeBtn} onClick={handleCloseDetail}>
                <X size={20} />
              </button>
            </div>
            
            <div className={styles.modalBody}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                {/* Meta details banner */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: 'var(--bg-app)', border: '1px solid var(--border)', borderRadius: '12px' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Invoice ID</span>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{selectedInvoice.id}</h2>
                  </div>
                  <Badge variant={selectedInvoice.status === 'paid' ? 'success' : selectedInvoice.status === 'overdue' ? 'danger' : 'warning'} style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                    {selectedInvoice.status.toUpperCase()}
                  </Badge>
                </div>

                {/* Details grid layout */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  <div>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '8px' }}>Billing From:</h4>
                    <p style={{ fontWeight: 600 }}>LeaseFlow Properties Ltd</p>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '2px' }}>
                      452 Geary St, San Francisco, CA 94102<br />
                      billing@leaseflow.com
                    </p>
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '8px' }}>Billed To (Tenant):</h4>
                    <p style={{ fontWeight: 600 }}>{selectedInvoice.tenantName}</p>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '2px' }}>
                      Occupying: {selectedInvoice.propertyName} Unit {selectedInvoice.unitNumber}<br />
                      Billing Period: {selectedInvoice.billingPeriod}
                    </p>
                  </div>
                </div>

                {/* Invoice Line Item Breakdown Table */}
                <div style={{ border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                    <thead style={{ backgroundColor: 'var(--bg-app)', borderBottom: '1px solid var(--border)' }}>
                      <tr>
                        <th style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>Item Description</th>
                        <th style={{ padding: '12px 16px', color: 'var(--text-secondary)', textAlign: 'right' }}>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '16px' }}>
                          <strong>Monthly Rental Fee</strong><br />
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Usage fee for rent period: {selectedInvoice.billingPeriod}</span>
                        </td>
                        <td style={{ padding: '16px', textAlign: 'right', fontWeight: 600 }}>
                          ${selectedInvoice.amount.toLocaleString()}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ padding: '16px', textAlign: 'right', fontWeight: 700 }}>Total Billed Due:</td>
                        <td style={{ padding: '16px', textAlign: 'right', fontWeight: 800, color: 'var(--primary)', fontSize: '1.05rem' }}>
                          ${selectedInvoice.amount.toLocaleString()}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Due dates block */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ padding: '12px', border: '1px solid var(--border)', borderRadius: '10px' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Payment Due By</span>
                    <strong style={{ fontSize: '0.9rem' }}>{selectedInvoice.dueDate}</strong>
                  </div>
                  <div style={{ padding: '12px', border: '1px solid var(--border)', borderRadius: '10px' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Reconciliation Details</span>
                    <strong style={{ fontSize: '0.9rem' }}>
                      {selectedInvoice.status === 'paid' ? `Settled on ${selectedInvoice.paidDate} via ${selectedInvoice.paymentMethod?.replace('_', ' ')}` : 'Awaiting Payment'}
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.modalFooter} style={{ justifyContent: 'space-between' }}>
              <Button variant="outline" leftIcon={<Printer size={16} />} onClick={() => window.print()}>
                Print Invoice
              </Button>
              <div style={{ display: 'flex', gap: '12px' }}>
                <Button variant="secondary" onClick={handleCloseDetail}>
                  Close
                </Button>
                {selectedInvoice.status !== 'paid' && (
                  <Button onClick={handleOpenPay} leftIcon={<CreditCard size={16} />}>
                    Collect Rent Payment
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Collect Rent simulated payment option Modal */}
      {isPayModalOpen && selectedInvoice && (
        <div className={styles.modalOverlay} style={{ zIndex: 1100 }}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Simulate Payment Processing</h3>
              <button className={styles.closeBtn} onClick={handleClosePay}>
                <X size={20} />
              </button>
            </div>
            <div className={styles.modalBody}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Choose the payment gateway method to reconcile invoice <strong>{selectedInvoice.id}</strong>. This updates monthly analytics, timelines, and generates a payment receipt document.
                </p>

                <Select
                  label="Select Payment Method"
                  options={[
                    { value: 'bank_transfer', label: 'Bank Wire Transfer' },
                    { value: 'credit_card', label: 'Credit Card Payment Gateway' },
                    { value: 'check', label: 'Physical Bank Check' },
                    { value: 'cash', label: 'Cash Receipt' }
                  ]}
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                />

                <div style={{ padding: '12px', border: '1px solid var(--border)', borderRadius: '10px', backgroundColor: 'var(--bg-app)', display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <ShieldCheck size={20} style={{ color: 'var(--success)' }} />
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Secure transaction logging. Receipt document will be created.</span>
                </div>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <Button variant="secondary" onClick={handleClosePay}>
                Cancel
              </Button>
              <Button onClick={handleExecutePayment} leftIcon={<CheckSquare size={16} />}>
                Record Payment
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Payments;
