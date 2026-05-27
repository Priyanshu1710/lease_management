import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useMockStore } from '../hooks/useMockStore';
import { useForm } from 'react-hook-form';
import { Search, Plus, X } from 'lucide-react';
import styles from './pages.module.scss';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Table from '../components/common/Table';

interface CreateLeaseFormData {
  tenantId: string;
  propertyId: string;
  unitId: string;
  startDate: string;
  endDate: string;
  monthlyRent: number;
  depositAmount: number;
  renewalStatus: 'auto-renew' | 'manual-renew' | 'not-renewing' | 'under-review';
  terms: string;
}

export const Leases: React.FC = () => {
  const { leases, properties, tenants, addLease } = useMockStore();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'pending' | 'expired' | 'terminated'>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Hook-form
  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<CreateLeaseFormData>({
    defaultValues: {
      renewalStatus: 'auto-renew',
      terms: 'Standard tenancy terms. Tenant commits to pay rent by the 1st of each calendar month. Security deposit held in trust escrow.'
    }
  });

  const selectedPropertyId = watch('propertyId');

  // Pre-fill fields if navigating from Property Detail "Draft Lease"
  useEffect(() => {
    const state = location.state as {
      openCreate?: boolean;
      propertyId?: string;
      unitId?: string;
      rent?: number;
    } | null;

    if (state?.openCreate) {
      setIsCreateModalOpen(true);
      if (state.propertyId) setValue('propertyId', state.propertyId);
      if (state.unitId) setValue('unitId', state.unitId);
      if (state.rent) {
        setValue('monthlyRent', state.rent);
        setValue('depositAmount', state.rent * 2); // default 2x deposit
      }
    }
  }, [location.state, setValue]);

  // Handle dynamic units mapping based on selected property
  const selectedProperty = properties.find(p => p.id === selectedPropertyId);
  const vacantUnits = selectedProperty
    ? selectedProperty.units.filter(u => u.occupancyStatus === 'vacant')
    : [];

  // Filter leases
  const filteredLeases = leases.filter((lease) => {
    const matchesSearch =
      lease.tenantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lease.propertyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lease.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || lease.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const onSubmitCreateLease = (data: CreateLeaseFormData) => {
    const tenant = tenants.find((t) => t.id === data.tenantId);
    const prop = properties.find((p) => p.id === data.propertyId);
    const unit = prop?.units.find((u) => u.id === data.unitId);

    if (!tenant || !prop || !unit) {
      alert('Invalid tenant, property, or unit selection.');
      return;
    }

    addLease({
      tenantId: data.tenantId,
      tenantName: tenant.name,
      tenantAvatar: tenant.avatarUrl,
      propertyId: data.propertyId,
      propertyName: prop.name,
      unitId: data.unitId,
      unitNumber: unit.unitNumber,
      startDate: data.startDate,
      endDate: data.endDate,
      monthlyRent: Number(data.monthlyRent),
      depositAmount: Number(data.depositAmount),
      status: 'active',
      renewalStatus: data.renewalStatus,
      terms: data.terms,
      documentIds: []
    });

    setIsCreateModalOpen(false);
    reset();
  };

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header">
        <div className="title-area">
          <h1>Lease Agreements</h1>
          <p>Track agreements, rental terms, and active lease lifecycles.</p>
        </div>
        <div className="actions-area">
          <Button leftIcon={<Plus size={16} />} onClick={() => setIsCreateModalOpen(true)}>
            Draft Agreement
          </Button>
        </div>
      </div>

      {/* Tabs Filter & Search */}
      <div className={styles.filterRow}>
        <div className={styles.searchContainer}>
          <Search size={18} />
          <input
            type="text"
            className="input"
            placeholder="Search by ID, tenant, property..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className={styles.controlsRight}>
          <div style={{ display: 'flex', border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden' }}>
            {['all', 'active', 'pending', 'expired', 'terminated'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status as any)}
                style={{
                  padding: '8px 14px',
                  backgroundColor: statusFilter === status ? 'var(--primary-light)' : 'var(--bg-card)',
                  color: statusFilter === status ? 'var(--primary)' : 'var(--text-secondary)',
                  fontWeight: statusFilter === status ? 600 : 500,
                  fontSize: '0.85rem',
                  textTransform: 'capitalize'
                }}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Leases Table */}
      {filteredLeases.length > 0 ? (
        <Table headers={['Lease ID', 'Tenant Name', 'Property / Unit', 'Monthly Rent', 'Deposit', 'Start Date', 'End Date', 'Renewal', 'Status', 'Actions']}>
          {filteredLeases.map((lease) => (
            <tr key={lease.id}>
              <td style={{ fontWeight: 600 }}>{lease.id}</td>
              <td style={{ fontWeight: 500 }}>{lease.tenantName}</td>
              <td>{lease.propertyName} Unit {lease.unitNumber}</td>
              <td style={{ fontWeight: 600 }}>${lease.monthlyRent.toLocaleString()}</td>
              <td>${lease.depositAmount.toLocaleString()}</td>
              <td>{lease.startDate}</td>
              <td>{lease.endDate}</td>
              <td style={{ textTransform: 'capitalize' }}>{lease.renewalStatus.replace('-', ' ')}</td>
              <td>
                <Badge variant={lease.status === 'active' ? 'success' : lease.status === 'pending' ? 'warning' : lease.status === 'expired' ? 'muted' : 'danger'}>
                  {lease.status}
                </Badge>
              </td>
              <td>
                <Link to={`/leases/${lease.id}`}>
                  <Button variant="ghost" size="sm">
                    Manage Agreement
                  </Button>
                </Link>
              </td>
            </tr>
          ))}
        </Table>
      ) : (
        <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
          No lease agreements found.
        </div>
      )}

      {/* Add Lease Agreement Modal */}
      {isCreateModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Create Lease Agreement</h3>
              <button className={styles.closeBtn} onClick={() => setIsCreateModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit(onSubmitCreateLease)}>
              <div className={styles.modalBody}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  
                  {/* Select Tenant */}
                  <Select
                    label="Assign Tenant *"
                    options={[
                      { value: '', label: '-- Select Tenant --' },
                      ...tenants.map(t => ({ value: t.id, label: `${t.name} ${t.companyName ? `(${t.companyName})` : ''}` }))
                    ]}
                    error={errors.tenantId?.message}
                    {...register('tenantId', { required: 'Tenant assignment is required' })}
                  />

                  {/* Select Property */}
                  <Select
                    label="Property Asset *"
                    options={[
                      { value: '', label: '-- Select Property --' },
                      ...properties.map(p => ({ value: p.id, label: p.name }))
                    ]}
                    error={errors.propertyId?.message}
                    {...register('propertyId', { required: 'Property selection is required' })}
                  />

                  {/* Select Unit (dynamically loaded) */}
                  <Select
                    label="Unit Number *"
                    options={[
                      { value: '', label: '-- Select Unit --' },
                      ...vacantUnits.map(u => ({ value: u.id, label: `Unit ${u.unitNumber} - Floor ${u.floorNumber} ($${u.rentAmount}/mo)` }))
                    ]}
                    disabled={!selectedPropertyId}
                    error={errors.unitId?.message}
                    {...register('unitId', { required: 'Unit selection is required' })}
                  />

                  {/* Rent and Deposit */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <Input
                      label="Monthly Rent Amount ($) *"
                      type="number"
                      placeholder="e.g. 2400"
                      error={errors.monthlyRent?.message}
                      {...register('monthlyRent', { required: 'Rent amount is required', min: { value: 1, message: 'Min 1' } })}
                    />
                    <Input
                      label="Security Deposit ($) *"
                      type="number"
                      placeholder="e.g. 4800"
                      error={errors.depositAmount?.message}
                      {...register('depositAmount', { required: 'Deposit amount is required' })}
                    />
                  </div>

                  {/* Start and End Dates */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <Input
                      label="Lease Start Date *"
                      type="date"
                      error={errors.startDate?.message}
                      {...register('startDate', { required: 'Start date is required' })}
                    />
                    <Input
                      label="Lease End Date *"
                      type="date"
                      error={errors.endDate?.message}
                      {...register('endDate', { required: 'End date is required' })}
                    />
                  </div>

                  {/* Renewal Option */}
                  <Select
                    label="Renewal Policy"
                    options={[
                      { value: 'auto-renew', label: 'Auto-Renew (Month-to-Month)' },
                      { value: 'manual-renew', label: 'Manual Renew (Needs Offer)' },
                      { value: 'under-review', label: 'Under Review' },
                      { value: 'not-renewing', label: 'Not Renewing (Exit Set)' }
                    ]}
                    {...register('renewalStatus')}
                  />

                  {/* Terms Text area */}
                  <Input
                    label="Custom Terms & Scope"
                    placeholder="Provide details about security deposit terms, exit clauses, utilities coverage..."
                    {...register('terms')}
                  />
                </div>
              </div>
              <div className={styles.modalFooter}>
                <Button type="button" variant="secondary" onClick={() => setIsCreateModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" leftIcon={<Plus size={16} />}>
                  Create Lease Agreement
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default Leases;
