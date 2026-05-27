import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMockStore } from '../hooks/useMockStore';
import { useForm } from 'react-hook-form';
import { Search, Grid, List, Plus, MapPin, Building, Home, X } from 'lucide-react';
import styles from './pages.module.scss';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Table from '../components/common/Table';

interface AddPropertyFormData {
  name: string;
  address: string;
  type: 'commercial' | 'residential';
  totalFloors: number;
  description: string;
  amenities: string;
  unitsCount: number;
  baseRent: number;
  baseArea: number;
}

export const Properties: React.FC = () => {
  const { properties, addProperty } = useMockStore();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'commercial' | 'residential'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<AddPropertyFormData>();

  // Filter properties
  const filteredProperties = properties.filter((prop) => {
    const matchesSearch =
      prop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prop.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || prop.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const onSubmitAddProperty = (data: AddPropertyFormData) => {
    const amenityList = data.amenities
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s !== '');

    // Autogenerate unit blueprints based on count
    const unitsBlueprint = Array.from({ length: Number(data.unitsCount) }).map((_, idx) => {
      const floor = Math.floor(idx / Math.ceil(Number(data.unitsCount) / Number(data.totalFloors))) + 1;
      const roomNum = (idx % Math.ceil(Number(data.unitsCount) / Number(data.totalFloors))) + 1;
      const unitNumber = `${floor}${roomNum < 10 ? '0' : ''}${roomNum}`;
      return {
        propertyId: '',
        unitNumber,
        floorNumber: floor,
        area: Number(data.baseArea),
        rentAmount: Number(data.baseRent),
        occupancyStatus: 'vacant' as const
      };
    });

    addProperty({
      name: data.name,
      address: data.address,
      type: data.type,
      totalFloors: Number(data.totalFloors),
      totalUnits: unitsBlueprint.length,
      parkingAvailable: true,
      amenities: amenityList.length > 0 ? amenityList : ['24/7 Security', 'High-speed Internet'],
      images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80'],
      description: data.description || 'Modern luxury asset added to portfolio.',
      units: unitsBlueprint
    });

    setIsAddModalOpen(false);
    reset();
  };

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header">
        <div className="title-area">
          <h1>Portfolio Properties</h1>
          <p>Manage office plazas, warehouses, and residential complexes.</p>
        </div>
        <div className="actions-area">
          <Button leftIcon={<Plus size={16} />} onClick={() => setIsAddModalOpen(true)}>
            Add Property
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
            placeholder="Search properties by name, address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className={styles.controlsRight}>
          <Select
            options={[
              { value: 'all', label: 'All Property Types' },
              { value: 'commercial', label: 'Commercial Only' },
              { value: 'residential', label: 'Residential Only' }
            ]}
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            style={{ width: '180px' }}
          />

          <div style={{ display: 'flex', border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden' }}>
            <button
              onClick={() => setViewMode('grid')}
              style={{
                padding: '8px 12px',
                backgroundColor: viewMode === 'grid' ? 'var(--primary-light)' : 'var(--bg-card)',
                color: viewMode === 'grid' ? 'var(--primary)' : 'var(--text-secondary)'
              }}
              aria-label="Grid View"
            >
              <Grid size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              style={{
                padding: '8px 12px',
                backgroundColor: viewMode === 'list' ? 'var(--primary-light)' : 'var(--bg-card)',
                color: viewMode === 'list' ? 'var(--primary)' : 'var(--text-secondary)'
              }}
              aria-label="List View"
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Properties Display */}
      {filteredProperties.length > 0 ? (
        viewMode === 'grid' ? (
          <div className={styles.propertyGrid}>
            {filteredProperties.map((prop) => {
              const occupiedCount = prop.units.filter((u) => u.occupancyStatus === 'occupied').length;
              const vacantCount = prop.totalUnits - occupiedCount;

              return (
                <div key={prop.id} className={styles.propertyCard}>
                  <img src={prop.images[0]} alt={prop.name} className={styles.cardImage} />
                  <div className={styles.cardContent}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className={styles.propType}>
                        {prop.type === 'commercial' ? <Building size={12} style={{ display: 'inline', marginRight: 4 }} /> : <Home size={12} style={{ display: 'inline', marginRight: 4 }} />}
                        {prop.type}
                      </span>
                      <Badge variant={prop.occupancyRate >= 80 ? 'success' : prop.occupancyRate >= 60 ? 'warning' : 'danger'}>
                        {prop.occupancyRate}% Occupied
                      </Badge>
                    </div>
                    <h3 className={styles.propName}>{prop.name}</h3>
                    <p className={styles.propAddress}>
                      <MapPin size={12} style={{ display: 'inline', marginRight: 4, verticalAlign: 'text-bottom' }} />
                      {prop.address}
                    </p>

                    <div className={styles.cardStats}>
                      <div className={styles.statItem}>
                        <span className={styles.statVal}>{prop.totalUnits}</span>
                        <span className={styles.statLbl}>Total Units</span>
                      </div>
                      <div className={styles.statItem}>
                        <span className={styles.statVal} style={{ color: vacantCount > 0 ? 'var(--success)' : 'inherit' }}>
                          {vacantCount}
                        </span>
                        <span className={styles.statLbl}>Available</span>
                      </div>
                    </div>

                    <div className={styles.cardProgress}>
                      <div className={styles.progressInfo}>
                        <span>Occupied Units ({occupiedCount})</span>
                        <span>{prop.totalUnits} Max</span>
                      </div>
                      <div className={styles.progressBar}>
                        <div className={styles.progressFill} style={{ width: `${prop.occupancyRate}%` }} />
                      </div>
                    </div>

                    <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
                      <Link to={`/properties/${prop.id}`}>
                        <Button variant="secondary" style={{ width: '100%' }}>
                          Manage Property Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <Table headers={['Property Name', 'Type', 'Address', 'Total Units', 'Occupancy Rate', 'Available Units', 'Actions']}>
            {filteredProperties.map((prop) => {
              const occupiedCount = prop.units.filter((u) => u.occupancyStatus === 'occupied').length;
              const vacantCount = prop.totalUnits - occupiedCount;
              return (
                <tr key={prop.id}>
                  <td style={{ fontWeight: 600 }}>{prop.name}</td>
                  <td style={{ textTransform: 'capitalize' }}>{prop.type}</td>
                  <td>{prop.address}</td>
                  <td>{prop.totalUnits}</td>
                  <td>
                    <Badge variant={prop.occupancyRate >= 80 ? 'success' : prop.occupancyRate >= 60 ? 'warning' : 'danger'}>
                      {prop.occupancyRate}%
                    </Badge>
                  </td>
                  <td>{vacantCount} vacant</td>
                  <td>
                    <Link to={`/properties/${prop.id}`}>
                      <Button variant="ghost" size="sm">
                        View Details
                      </Button>
                    </Link>
                  </td>
                </tr>
              );
            })}
          </Table>
        )
      ) : (
        <div style={{ padding: '60px 0' }}>
          <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
            No properties found matching your search guidelines.
          </div>
        </div>
      )}

      {/* Add Property Modal Wrapper */}
      {isAddModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Add New Property</h3>
              <button className={styles.closeBtn} onClick={() => setIsAddModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit(onSubmitAddProperty)}>
              <div className={styles.modalBody}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <Input
                    label="Property Name *"
                    placeholder="e.g. Greenwood Apartments"
                    error={errors.name?.message}
                    {...register('name', { required: 'Property name is required' })}
                  />

                  <Input
                    label="Property Address *"
                    placeholder="e.g. 102 Main St, Boston, MA"
                    error={errors.address?.message}
                    {...register('address', { required: 'Address is required' })}
                  />

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <Select
                      label="Property Type *"
                      options={[
                        { value: 'commercial', label: 'Commercial' },
                        { value: 'residential', label: 'Residential' }
                      ]}
                      error={errors.type?.message}
                      {...register('type', { required: 'Property type is required' })}
                    />
                    <Input
                      label="Total Floors *"
                      type="number"
                      placeholder="e.g. 5"
                      error={errors.totalFloors?.message}
                      {...register('totalFloors', { required: 'Floors count is required', min: { value: 1, message: 'Min 1' } })}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <Input
                      label="Number of Units *"
                      type="number"
                      placeholder="e.g. 20"
                      error={errors.unitsCount?.message}
                      {...register('unitsCount', { required: 'Units count is required', min: { value: 1, message: 'Min 1' } })}
                    />
                    <Input
                      label="Base Area per Unit (sqft) *"
                      type="number"
                      placeholder="e.g. 950"
                      error={errors.baseArea?.message}
                      {...register('baseArea', { required: 'Base area is required' })}
                    />
                  </div>

                  <Input
                    label="Base Monthly Rent per Unit ($) *"
                    type="number"
                    placeholder="e.g. 2500"
                    error={errors.baseRent?.message}
                    {...register('baseRent', { required: 'Base rent is required' })}
                  />

                  <Input
                    label="Amenities (Comma Separated)"
                    placeholder="e.g. Security, Gym, High-speed Wifi"
                    {...register('amenities')}
                  />

                  <Input
                    label="Brief Description"
                    placeholder="Describe this property..."
                    {...register('description')}
                  />
                </div>
              </div>
              <div className={styles.modalFooter}>
                <Button type="button" variant="secondary" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Create Property Listing
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default Properties;
