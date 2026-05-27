import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMockStore } from '../hooks/useMockStore';
import { useForm } from 'react-hook-form';
import { Search, Plus, Mail, Phone, Building2, X, CheckSquare } from 'lucide-react';
import styles from './pages.module.scss';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Input from '../components/common/Input';
import Select from '../components/common/Select';

interface AddTenantFormData {
  name: string;
  email: string;
  phone: string;
  companyName?: string;
  dob?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
}

export const Tenants: React.FC = () => {
  const { tenants, addTenant } = useMockStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [leaseFilter, setLeaseFilter] = useState<'all' | 'active' | 'pending' | 'ended'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<AddTenantFormData>();

  // Filter tenants
  const filteredTenants = tenants.filter((tenant) => {
    const matchesSearch =
      tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tenant.companyName && tenant.companyName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      tenant.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesLease = leaseFilter === 'all' || tenant.leaseStatus === leaseFilter;
    return matchesSearch && matchesLease;
  });

  const onSubmitAddTenant = (data: AddTenantFormData) => {
    addTenant({
      name: data.name,
      email: data.email,
      phone: data.phone,
      companyName: data.companyName || undefined,
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
      personalDetails: {
        dob: data.dob || undefined,
        kycStatus: 'verified',
        emergencyContactName: data.emergencyContactName || undefined,
        emergencyContactPhone: data.emergencyContactPhone || undefined
      }
    });

    setIsAddModalOpen(false);
    reset();
  };

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header">
        <div className="title-area">
          <h1>Tenant Profiles</h1>
          <p>Manage corporate accounts, residential occupants, and communication details.</p>
        </div>
        <div className="actions-area">
          <Button leftIcon={<Plus size={16} />} onClick={() => setIsAddModalOpen(true)}>
            Add Tenant
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className={styles.filterRow}>
        <div className={styles.searchContainer}>
          <Search size={18} />
          <input
            type="text"
            className="input"
            placeholder="Search by name, company, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className={styles.controlsRight}>
          <Select
            options={[
              { value: 'all', label: 'All Lease Statuses' },
              { value: 'active', label: 'Active Leases' },
              { value: 'pending', label: 'Pending Leases' },
              { value: 'ended', label: 'Ended Leases' }
            ]}
            value={leaseFilter}
            onChange={(e) => setLeaseFilter(e.target.value as any)}
            style={{ width: '180px' }}
          />
        </div>
      </div>

      {/* Tenants Cards Grid */}
      {filteredTenants.length > 0 ? (
        <div className={styles.tenantGrid}>
          {filteredTenants.map((tenant) => (
            <div key={tenant.id} className={styles.tenantCard}>
              <img src={tenant.avatarUrl} alt={tenant.name} className={styles.tenantAvatar} />
              <h3 className={styles.tenantName}>{tenant.name}</h3>
              <p className={styles.tenantCompany}>
                {tenant.companyName ? (
                  <>
                    <Building2 size={12} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
                    {tenant.companyName}
                  </>
                ) : (
                  'Residential Tenant'
                )}
              </p>

              <div className={styles.tenantContact}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}>
                  <Mail size={13} className="text-muted" /> {tenant.email}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}>
                  <Phone size={13} className="text-muted" /> {tenant.phone}
                </span>
              </div>

              <div className={styles.tenantFooter}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Lease</span>
                  <Badge variant={tenant.leaseStatus === 'active' ? 'success' : tenant.leaseStatus === 'pending' ? 'warning' : 'muted'}>
                    {tenant.leaseStatus}
                  </Badge>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-end' }}>
                  <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Payments</span>
                  <Badge variant={tenant.paymentStatus === 'paid' ? 'success' : tenant.paymentStatus === 'overdue' ? 'danger' : 'warning'}>
                    {tenant.paymentStatus}
                  </Badge>
                </div>
              </div>

              <div style={{ width: '100%', marginTop: '16px' }}>
                <Link to={`/tenants/${tenant.id}`} style={{ width: '100%' }}>
                  <Button variant="secondary" size="sm" style={{ width: '100%' }}>
                    Manage Profile
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
          No tenants found matching your query.
        </div>
      )}

      {/* Add Tenant Modal Wrapper */}
      {isAddModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Add New Tenant Profile</h3>
              <button className={styles.closeBtn} onClick={() => setIsAddModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit(onSubmitAddTenant)}>
              <div className={styles.modalBody}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <Input
                    label="Full Name *"
                    placeholder="e.g. John Doe"
                    error={errors.name?.message}
                    {...register('name', { required: 'Tenant name is required' })}
                  />

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <Input
                      label="Email Address *"
                      type="email"
                      placeholder="e.g. john@domain.com"
                      error={errors.email?.message}
                      {...register('email', { required: 'Email address is required' })}
                    />
                    <Input
                      label="Phone Number *"
                      placeholder="e.g. +1 (555) 019-2834"
                      error={errors.phone?.message}
                      {...register('phone', { required: 'Phone number is required' })}
                    />
                  </div>

                  <Input
                    label="Company Name (Leave blank for Residential)"
                    placeholder="e.g. Acme Corporation Ltd"
                    {...register('companyName')}
                  />

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <Input
                      label="Date of Birth"
                      type="date"
                      {...register('dob')}
                    />
                    <Input
                      label="Emergency Contact Name"
                      placeholder="e.g. Jane Doe"
                      {...register('emergencyContactName')}
                    />
                  </div>

                  <Input
                    label="Emergency Contact Phone"
                    placeholder="e.g. +1 (555) 991-3829"
                    {...register('emergencyContactPhone')}
                  />
                </div>
              </div>
              <div className={styles.modalFooter}>
                <Button type="button" variant="secondary" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" leftIcon={<CheckSquare size={16} />}>
                  Save Tenant Profile
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default Tenants;
