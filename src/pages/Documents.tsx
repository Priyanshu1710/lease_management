import React, { useState } from 'react';
import { useMockStore } from '../hooks/useMockStore';
import { useForm } from 'react-hook-form';
import { Search, FileText, Upload, X, Download, Info } from 'lucide-react';
import styles from './pages.module.scss';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import type { Document } from '../types';

interface UploadDocFormData {
  name: string;
  category: Document['category'];
  fileType: Document['fileType'];
  fileSize: string;
  tenantId?: string;
  propertyId?: string;
}

export const Documents: React.FC = () => {
  const { documents, tenants, properties, addDocument } = useMockStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | Document['category']>('all');
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  
  // Modal toggle
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<UploadDocFormData>({
    defaultValues: {
      category: 'lease_agreement',
      fileType: 'pdf',
      fileSize: '1.2 MB'
    }
  });

  // Filter documents
  const filteredDocs = documents.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || doc.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const onSubmitUpload = (data: UploadDocFormData) => {
    const matchedTenant = tenants.find(t => t.id === data.tenantId);
    const matchedProp = properties.find(p => p.id === data.propertyId);

    // Format extension
    const nameWithExt = data.name.endsWith(`.${data.fileType}`)
      ? data.name
      : `${data.name}.${data.fileType}`;

    addDocument({
      name: nameWithExt,
      category: data.category,
      fileType: data.fileType,
      fileSize: data.fileSize || '850 KB',
      fileUrl: '#',
      tenantId: data.tenantId || undefined,
      tenantName: matchedTenant?.name || undefined,
      propertyId: data.propertyId || undefined,
      propertyName: matchedProp?.name || undefined
    });

    setIsUploadOpen(false);
    reset();
  };

  const getCategoryBadgeColor = (cat: Document['category']) => {
    switch (cat) {
      case 'lease_agreement': return 'info';
      case 'kyc_document': return 'warning';
      case 'property_document': return 'success';
      case 'payment_receipt': return 'muted';
      default: return 'muted';
    }
  };

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header">
        <div className="title-area">
          <h1>Document Vault</h1>
          <p>Store, index, and audit deeds, rent invoices, tenant KYC, and legal files.</p>
        </div>
        <div className="actions-area">
          <Button leftIcon={<Upload size={16} />} onClick={() => setIsUploadOpen(true)}>
            Upload Document
          </Button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className={styles.filterRow}>
        <div className={styles.searchContainer}>
          <Search size={18} />
          <input
            type="text"
            className="input"
            placeholder="Search document directory..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className={styles.controlsRight}>
          <div style={{ display: 'flex', border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden' }}>
            {[
              { id: 'all', label: 'All Files' },
              { id: 'lease_agreement', label: 'Lease Agreements' },
              { id: 'kyc_document', label: 'KYC Files' },
              { id: 'property_document', label: 'Property Deeds' },
              { id: 'payment_receipt', label: 'Receipts' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id as any)}
                style={{
                  padding: '8px 14px',
                  backgroundColor: categoryFilter === cat.id ? 'var(--primary-light)' : 'var(--bg-card)',
                  color: categoryFilter === cat.id ? 'var(--primary)' : 'var(--text-secondary)',
                  fontWeight: categoryFilter === cat.id ? 600 : 500,
                  fontSize: '0.85rem'
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Documents Grid Directory list */}
      {filteredDocs.length > 0 ? (
        <div className={styles.docGrid}>
          {filteredDocs.map((doc) => (
            <div key={doc.id} className={styles.docCard} onClick={() => setSelectedDoc(doc)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div className={styles.docIconWrapper}>
                  <FileText size={22} />
                </div>
                <Badge variant={getCategoryBadgeColor(doc.category)}>
                  {doc.category.replace('_', ' ')}
                </Badge>
              </div>
              <h4 className={styles.docTitle}>{doc.name}</h4>
              
              <div className={styles.docInfo}>
                <span>{doc.fileSize}</span>
                <span>{doc.uploadDate}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
          No documents found in this directory.
        </div>
      )}

      {/* Document Preview Modal */}
      {selectedDoc && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Document audit audit details</h3>
              <button className={styles.closeBtn} onClick={() => setSelectedDoc(null)}>
                <X size={20} />
              </button>
            </div>
            
            <div className={styles.modalBody}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', padding: '16px', border: '1px solid var(--border)', borderRadius: '12px', backgroundColor: 'var(--bg-app)' }}>
                  <div style={{ width: '48px', height: '48px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px' }}>
                    <FileText size={24} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{ fontWeight: 700, wordBreak: 'break-all', fontSize: '0.95rem' }}>{selectedDoc.name}</h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>File Size: {selectedDoc.fileSize} • Uploaded {selectedDoc.uploadDate}</span>
                  </div>
                </div>

                {/* Audit details metadata */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.875rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border)' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Category:</span>
                    <strong style={{ textTransform: 'capitalize' }}>{selectedDoc.category.replace('_', ' ')}</strong>
                  </div>
                  {selectedDoc.tenantName && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border)' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Linked Tenant:</span>
                      <strong>{selectedDoc.tenantName}</strong>
                    </div>
                  )}
                  {selectedDoc.propertyName && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border)' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Linked Property:</span>
                      <strong>{selectedDoc.propertyName}</strong>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>System Storage Node:</span>
                    <strong>S3-West-Region-Bucket</strong>
                  </div>
                </div>

                {/* Simulated Viewer */}
                <div style={{ height: '140px', border: '1px dashed var(--border)', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--text-secondary)', backgroundColor: 'var(--bg-app)' }}>
                  <Info size={24} />
                  <span style={{ fontSize: '0.8rem' }}>Direct PDF viewing disabled in browser simulation node.</span>
                </div>
              </div>
            </div>

            <div className={styles.modalFooter} style={{ justifyContent: 'space-between' }}>
              <Button variant="outline" leftIcon={<Download size={16} />} onClick={() => alert('Simulating file download request.')}>
                Download File
              </Button>
              <Button variant="secondary" onClick={() => setSelectedDoc(null)}>
                Close Preview
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Upload File Modal simulator dialog */}
      {isUploadOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Upload Document</h3>
              <button className={styles.closeBtn} onClick={() => setIsUploadOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit(onSubmitUpload)}>
              <div className={styles.modalBody}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  
                  <Input
                    label="File Display Name *"
                    placeholder="e.g. Deed_Of_Trust_Apex"
                    error={errors.name?.message}
                    {...register('name', { required: 'Document file name is required' })}
                  />

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <Select
                      label="Document Category *"
                      options={[
                        { value: 'lease_agreement', label: 'Lease Agreement' },
                        { value: 'kyc_document', label: 'KYC Identity Check' },
                        { value: 'property_document', label: 'Property Deed/Blueprint' },
                        { value: 'payment_receipt', label: 'Rent Invoice Receipt' }
                      ]}
                      {...register('category')}
                    />
                    <Select
                      label="File Type *"
                      options={[
                        { value: 'pdf', label: 'PDF Document' },
                        { value: 'docx', label: 'Word (DOCX)' },
                        { value: 'xlsx', label: 'Excel (XLSX)' },
                        { value: 'jpg', label: 'JPEG Image' },
                        { value: 'png', label: 'PNG Image' }
                      ]}
                      {...register('fileType')}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <Select
                      label="Link Tenant (Optional)"
                      options={[
                        { value: '', label: '-- None --' },
                        ...tenants.map(t => ({ value: t.id, label: t.name }))
                      ]}
                      {...register('tenantId')}
                    />
                    <Select
                      label="Link Property Asset (Optional)"
                      options={[
                        { value: '', label: '-- None --' },
                        ...properties.map(p => ({ value: p.id, label: p.name }))
                      ]}
                      {...register('propertyId')}
                    />
                  </div>

                  <Input
                    label="Simulated File Size"
                    placeholder="e.g. 1.8 MB"
                    {...register('fileSize')}
                  />
                </div>
              </div>
              <div className={styles.modalFooter}>
                <Button type="button" variant="secondary" onClick={() => setIsUploadOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" leftIcon={<Upload size={16} />}>
                  Simulate Upload
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default Documents;
