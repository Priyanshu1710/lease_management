import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useMockStore } from '../hooks/useMockStore';
import { ChevronLeft, ChevronRight, MapPin, Check, FilePlus, User } from 'lucide-react';
import styles from './pages.module.scss';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Table from '../components/common/Table';

export const PropertyDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { properties } = useMockStore();
  
  const property = properties.find((p) => p.id === id);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [activeTab, setActiveTab] = useState<'overview' | 'units'>('overview');

  if (!property) {
    return (
      <div className="page-container">
        <div style={{ textAlign: 'center', padding: '48px 0' }}>
          <h2>Property not found</h2>
          <p>The property ID you are trying to view does not exist.</p>
          <Link to="/properties" style={{ marginTop: '16px', display: 'inline-block' }}>
            <Button>Back to Properties</Button>
          </Link>
        </div>
      </div>
    );
  }

  const nextImage = () => {
    setActiveImageIdx((prev) => (prev === property.images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setActiveImageIdx((prev) => (prev === 0 ? property.images.length - 1 : prev - 1));
  };

  const occupiedCount = property.units.filter((u) => u.occupancyStatus === 'occupied').length;
  const vacantCount = property.totalUnits - occupiedCount;

  return (
    <div className="page-container">
      {/* Breadcrumb Back */}
      <div>
        <Link to="/properties" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          <ChevronLeft size={16} /> Back to Portfolio
        </Link>
      </div>

      {/* Header Block */}
      <div className="page-header" style={{ marginTop: '-8px' }}>
        <div className="title-area">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1>{property.name}</h1>
            <Badge variant={property.type === 'commercial' ? 'info' : 'success'}>
              {property.type}
            </Badge>
          </div>
          <p>
            <MapPin size={14} style={{ display: 'inline', marginRight: 4, verticalAlign: 'text-bottom' }} />
            {property.address}
          </p>
        </div>
        <div className="actions-area">
          <Badge variant={property.occupancyRate >= 80 ? 'success' : property.occupancyRate >= 60 ? 'warning' : 'danger'} style={{ padding: '8px 14px', fontSize: '0.85rem' }}>
            {property.occupancyRate}% Total Occupied
          </Badge>
        </div>
      </div>

      {/* Details Split Layout */}
      <div className={styles.detailGrid}>
        {/* Left Column: Image Slider & Overview Tab / Unit List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Tab Selection */}
          <div className={styles.tabsContainer}>
            <div
              className={`${styles.tabItem} ${activeTab === 'overview' ? styles.active : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview & Amenities
            </div>
            <div
              className={`${styles.tabItem} ${activeTab === 'units' ? styles.active : ''}`}
              onClick={() => setActiveTab('units')}
            >
              Units ({property.totalUnits})
            </div>
          </div>

          {activeTab === 'overview' ? (
            <>
              {/* Image Slider */}
              <div className={styles.galleryCard}>
                <div className={styles.gallerySlider}>
                  <img src={property.images[activeImageIdx]} alt={`${property.name} gallery ${activeImageIdx}`} />
                  {property.images.length > 1 && (
                    <>
                      <button className={`${styles.sliderBtn} ${styles.prev}`} onClick={prevImage} aria-label="Previous image">
                        <ChevronLeft size={20} />
                      </button>
                      <button className={`${styles.sliderBtn} ${styles.next}`} onClick={nextImage} aria-label="Next image">
                        <ChevronRight size={20} />
                      </button>
                    </>
                  )}
                </div>
                <div className={styles.galleryMeta}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Property Description</h3>
                  <p style={{ marginTop: '8px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{property.description}</p>
                </div>
              </div>

              {/* Stats & Infrastructure Info */}
              <div style={{ padding: '24px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 600 }}>Building Structure Info</h3>
                <div className={styles.infoBlockGrid}>
                  <div className={styles.infoBlock}>
                    <span className={styles.blockLabel}>Total Floors</span>
                    <span className={styles.blockValue}>{property.totalFloors} levels</span>
                  </div>
                  <div className={styles.infoBlock}>
                    <span className={styles.blockLabel}>Parking Available</span>
                    <span className={styles.blockValue}>{property.parkingAvailable ? 'Yes (Underground/Lot)' : 'No Dedicated'}</span>
                  </div>
                  <div className={styles.infoBlock}>
                    <span className={styles.blockLabel}>Occupancy Status</span>
                    <span className={styles.blockValue}>{occupiedCount} Units Leased / {vacantCount} Vacant</span>
                  </div>
                  <div className={styles.infoBlock}>
                    <span className={styles.blockLabel}>Avg Rent Rate</span>
                    <span className={styles.blockValue}>${(property.units.reduce((sum, u) => sum + u.rentAmount, 0) / property.totalUnits).toFixed(0)}/mo</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Units Breakdown Tab */
            <div style={{ padding: '24px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 600 }}>Individual Unit Ledger</h3>
                <div style={{ display: 'flex', gap: '12px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  <span>Occupied: <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{occupiedCount}</span></span>
                  <span>Vacant: <span style={{ fontWeight: 600, color: 'var(--success)' }}>{vacantCount}</span></span>
                </div>
              </div>

              <Table headers={['Unit', 'Floor', 'Size (sqft)', 'Monthly Rent', 'Status', 'Tenant Assigned', 'Actions']}>
                {property.units.map((unit) => (
                  <tr key={unit.id}>
                    <td style={{ fontWeight: 600 }}>Unit {unit.unitNumber}</td>
                    <td>Floor {unit.floorNumber}</td>
                    <td>{unit.area} sqft</td>
                    <td style={{ fontWeight: 600 }}>${unit.rentAmount.toLocaleString()}</td>
                    <td>
                      <Badge variant={unit.occupancyStatus === 'occupied' ? 'info' : 'success'}>
                        {unit.occupancyStatus}
                      </Badge>
                    </td>
                    <td>
                      {unit.occupancyStatus === 'occupied' && unit.tenantId ? (
                        <Link to={`/tenants/${unit.tenantId}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--primary)', fontWeight: 500 }}>
                          <User size={13} /> {unit.tenantName}
                        </Link>
                      ) : (
                        <span style={{ color: 'var(--text-muted)' }}>None (Vacant)</span>
                      )}
                    </td>
                    <td>
                      {unit.occupancyStatus === 'occupied' && unit.tenantId ? (
                        <Link to={`/tenants/${unit.tenantId}`}>
                          <Button variant="ghost" size="sm">Manage Profile</Button>
                        </Link>
                      ) : (
                        <Link to="/leases" state={{ openCreate: true, propertyId: property.id, unitId: unit.id, unitNumber: unit.unitNumber, rent: unit.rentAmount }}>
                          <Button variant="outline" size="sm" leftIcon={<FilePlus size={12} />}>
                            Draft Lease
                          </Button>
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </Table>
            </div>
          )}
        </div>

        {/* Right Column: Sidebar Info Cards (Amenities & Quick Analytics) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Amenities Card */}
          <div style={{ padding: '24px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600, borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>Amenities & Facilities</h3>
            <div className={styles.amenityGrid}>
              {property.amenities.map((amenity, i) => (
                <Badge key={i} variant="muted" icon={<Check size={12} style={{ color: 'var(--success)' }} />}>
                  {amenity}
                </Badge>
              ))}
            </div>
          </div>

          {/* Quick Stats Card */}
          <div style={{ padding: '24px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600, borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>Asset Financial Summary</h3>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Full Asset Rent Potential:</span>
              <span style={{ fontWeight: 600 }}>
                ${property.units.reduce((sum, u) => sum + u.rentAmount, 0).toLocaleString()}/mo
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Current Monthly Yield:</span>
              <span style={{ fontWeight: 600, color: 'var(--success)' }}>
                ${property.units
                  .filter((u) => u.occupancyStatus === 'occupied')
                  .reduce((sum, u) => sum + u.rentAmount, 0)
                  .toLocaleString()}/mo
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Occupancy Rate:</span>
              <span style={{ fontWeight: 600 }}>{property.occupancyRate}%</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <span>Occupancy Yield Ratio</span>
                <span>{occupiedCount} / {property.totalUnits} Units</span>
              </div>
              <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--border)', borderRadius: '9999px', overflow: 'hidden' }}>
                <div style={{ height: '100%', backgroundColor: 'var(--primary)', width: `${property.occupancyRate}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PropertyDetails;
