import React, { useState } from 'react';
import { useMockStore } from '../hooks/useMockStore';
import { useForm } from 'react-hook-form';
import { Wrench, Plus, Search, X, MessageSquare, CheckSquare } from 'lucide-react';
import styles from './pages.module.scss';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Input, { Textarea } from '../components/common/Input';
import Select from '../components/common/Select';
import type { MaintenanceTicket } from '../types';

interface NewTicketFormData {
  propertyId: string;
  unitId: string;
  category: MaintenanceTicket['category'];
  priority: MaintenanceTicket['priority'];
  title: string;
  description: string;
}

export const Maintenance: React.FC = () => {
  const { properties, maintenanceTickets, addMaintenanceTicket, updateTicketStatus, addTicketNote } = useMockStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [selectedTicket, setSelectedTicket] = useState<MaintenanceTicket | null>(null);
  
  // Modals / Dialogs
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [noteText, setNoteText] = useState('');

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<NewTicketFormData>({
    defaultValues: {
      category: 'plumbing',
      priority: 'medium'
    }
  });

  const watchPropertyId = watch('propertyId');
  const selectedProperty = properties.find((p) => p.id === watchPropertyId);
  const occupiedUnits = selectedProperty
    ? selectedProperty.units.filter((u) => u.occupancyStatus === 'occupied')
    : [];

  // Filter tickets
  const filteredTickets = maintenanceTickets.filter((tkt) => {
    const matchesSearch =
      tkt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tkt.propertyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tkt.tenantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tkt.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesPriority = priorityFilter === 'all' || tkt.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  // Kanban boards buckets
  const columns: { status: MaintenanceTicket['status']; label: string }[] = [
    { status: 'new', label: 'New Issues' },
    { status: 'assigned', label: 'Assigned Work' },
    { status: 'in_progress', label: 'In Progress' },
    { status: 'resolved', label: 'Resolved Tickets' }
  ];

  const handleTicketClick = (ticket: MaintenanceTicket) => {
    setSelectedTicket(ticket);
  };

  const handleCloseDetail = () => {
    setSelectedTicket(null);
  };

  // Progression Action Helpers
  const handleAssignStaff = () => {
    if (!selectedTicket) return;
    updateTicketStatus(selectedTicket.id, 'assigned');
    refreshSelectedTicket(selectedTicket.id);
  };

  const handleStartWork = () => {
    if (!selectedTicket) return;
    updateTicketStatus(selectedTicket.id, 'in_progress');
    refreshSelectedTicket(selectedTicket.id);
  };

  const handleResolveTicket = () => {
    if (!selectedTicket) return;
    updateTicketStatus(selectedTicket.id, 'resolved');
    refreshSelectedTicket(selectedTicket.id);
  };

  const refreshSelectedTicket = (id: string) => {
    const updated = useMockStore.getState().maintenanceTickets.find((t) => t.id === id);
    if (updated) setSelectedTicket(updated);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !noteText.trim()) return;

    addTicketNote(
      selectedTicket.id,
      noteText,
      'Admin Manager',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'
    );

    setNoteText('');
    refreshSelectedTicket(selectedTicket.id);
  };

  const onSubmitAddTicket = (data: NewTicketFormData) => {
    const prop = properties.find((p) => p.id === data.propertyId);
    const unit = prop?.units.find((u) => u.id === data.unitId);

    if (!prop || !unit || !unit.tenantId || !unit.tenantName) {
      alert('Must select a valid property and occupied unit.');
      return;
    }

    addMaintenanceTicket({
      propertyId: data.propertyId,
      propertyName: prop.name,
      unitId: data.unitId,
      unitNumber: unit.unitNumber,
      tenantId: unit.tenantId,
      tenantName: unit.tenantName,
      tenantAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
      category: data.category,
      priority: data.priority,
      title: data.title,
      description: data.description,
      status: 'new',
      images: []
    });

    setIsAddModalOpen(false);
    reset();
  };

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header">
        <div className="title-area">
          <h1>Maintenance Desk</h1>
          <p>Organize tenant complaints, dispatch engineers, and track resolutions.</p>
        </div>
        <div className="actions-area">
          <Button leftIcon={<Plus size={16} />} onClick={() => setIsAddModalOpen(true)}>
            File Maintenance Request
          </Button>
        </div>
      </div>

      {/* Filter Options */}
      <div className={styles.filterRow}>
        <div className={styles.searchContainer}>
          <Search size={18} />
          <input
            type="text"
            className="input"
            placeholder="Search tickets by property, ID, title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className={styles.controlsRight}>
          <Select
            options={[
              { value: 'all', label: 'All Priorities' },
              { value: 'high', label: 'High Priority' },
              { value: 'medium', label: 'Medium Priority' },
              { value: 'low', label: 'Low Priority' }
            ]}
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as any)}
            style={{ width: '180px' }}
          />
        </div>
      </div>

      {/* Kanban Board Grid */}
      <div className={styles.board}>
        {columns.map((col) => {
          const colTickets = filteredTickets.filter((tkt) => tkt.status === col.status);
          return (
            <div key={col.status} className={styles.boardColumn}>
              <div className={styles.columnHeader}>
                <h3>{col.label}</h3>
                <span className={styles.columnCount}>{colTickets.length}</span>
              </div>

              {colTickets.map((tkt) => (
                <div key={tkt.id} className={styles.ticketCard} onClick={() => handleTicketClick(tkt)}>
                  <div className={styles.ticketMeta}>
                    <span className={styles.ticketProp}>{tkt.propertyName} {tkt.unitNumber}</span>
                    <Badge variant={tkt.priority === 'high' ? 'danger' : tkt.priority === 'medium' ? 'warning' : 'muted'}>
                      {tkt.priority}
                    </Badge>
                  </div>
                  <h4 className={styles.ticketTitle}>{tkt.title}</h4>
                  
                  <div className={styles.ticketFooter}>
                    <span>{tkt.id}</span>
                    <span>{tkt.createdAt}</span>
                  </div>
                </div>
              ))}

              {colTickets.length === 0 && (
                <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)', fontSize: '0.825rem', border: '1px dashed var(--border)', borderRadius: '10px' }}>
                  No tickets
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Ticket Details Side Panel Dialog Modal */}
      {selectedTicket && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.modalContent} ${styles.large}`}>
            <div className={styles.modalHeader}>
              <h3>Ticket details: {selectedTicket.id}</h3>
              <button className={styles.closeBtn} onClick={handleCloseDetail}>
                <X size={20} />
              </button>
            </div>
            
            <div className={styles.modalBody}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '24px' }}>
                {/* Left side details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{selectedTicket.title}</h2>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                      <Badge variant="info">{selectedTicket.category}</Badge>
                      <Badge variant={selectedTicket.priority === 'high' ? 'danger' : selectedTicket.priority === 'medium' ? 'warning' : 'muted'}>
                        {selectedTicket.priority} Priority
                      </Badge>
                      <Badge variant={selectedTicket.status === 'resolved' ? 'success' : 'warning'}>
                        {selectedTicket.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <h4 style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '6px' }}>Issue Description</h4>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: 1.5, fontSize: '0.9rem' }}>
                      {selectedTicket.description}
                    </p>
                  </div>

                  {/* Attachment Images */}
                  {selectedTicket.images.length > 0 && (
                    <div>
                      <h4 style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '8px' }}>Photos Attached</h4>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        {selectedTicket.images.map((img, i) => (
                          <img key={i} src={img} alt="Attachment" style={{ width: '120px', height: '90px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border)' }} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Notes / Comment Box */}
                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
                    <h4 style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MessageSquare size={16} /> Comments Feed ({selectedTicket.notes.length})
                    </h4>
                    
                    {/* Add comment Form */}
                    <form onSubmit={handleAddComment} style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                      <input
                        type="text"
                        className="input"
                        placeholder="Type updates or notes..."
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        style={{ flex: 1 }}
                      />
                      <Button type="submit">Post</Button>
                    </form>

                    {/* Feed list */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {selectedTicket.notes.map((note) => (
                        <div key={note.id} style={{ display: 'flex', gap: '10px', padding: '12px', border: '1px solid var(--border)', borderRadius: '10px', backgroundColor: 'var(--bg-app)' }}>
                          {note.avatar ? (
                            <img src={note.avatar} alt="Author" style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }} />
                          ) : (
                            <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--border)', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem' }}>S</div>
                          )}
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <strong style={{ fontSize: '0.8rem' }}>{note.author}</strong>
                              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{note.date}</span>
                            </div>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{note.note}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right side controls panel */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', borderLeft: '1px solid var(--border)', paddingLeft: '20px' }}>
                  {/* Status update timeline */}
                  <div>
                    <h4 style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '12px' }}>Operational Flow</h4>
                    
                    {selectedTicket.status === 'new' && (
                      <Button style={{ width: '100%' }} onClick={handleAssignStaff}>
                        Assign Contractor
                      </Button>
                    )}
                    {selectedTicket.status === 'assigned' && (
                      <Button style={{ width: '100%' }} onClick={handleStartWork}>
                        Initiate Repair
                      </Button>
                    )}
                    {selectedTicket.status === 'in_progress' && (
                      <Button style={{ width: '100%' }} variant="success" onClick={handleResolveTicket}>
                        Resolve & Close
                      </Button>
                    )}
                    {selectedTicket.status === 'resolved' && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--success)', fontWeight: 600, justifyContent: 'center', padding: '10px', backgroundColor: 'var(--success-light)', borderRadius: '8px' }}>
                        <CheckSquare size={16} /> Resolved & Filed
                      </div>
                    )}
                  </div>

                  {/* Info table */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.825rem' }}>
                    <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Tenant:</span>
                      <p style={{ fontWeight: 600, marginTop: '2px' }}>{selectedTicket.tenantName}</p>
                    </div>
                    <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Asset Unit:</span>
                      <p style={{ fontWeight: 600, marginTop: '2px' }}>{selectedTicket.propertyName} Unit {selectedTicket.unitNumber}</p>
                    </div>
                    {selectedTicket.assignedStaff && (
                      <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Assigned Staff:</span>
                        <p style={{ fontWeight: 600, marginTop: '2px' }}>{selectedTicket.assignedStaff}</p>
                      </div>
                    )}
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>Date Filed:</span>
                      <p style={{ fontWeight: 600, marginTop: '2px' }}>{selectedTicket.createdAt}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Maintenance Request Form Modal */}
      {isAddModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>File Maintenance Ticket</h3>
              <button className={styles.closeBtn} onClick={() => setIsAddModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit(onSubmitAddTicket)}>
              <div className={styles.modalBody}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  
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

                  {/* Select Unit (occupants only) */}
                  <Select
                    label="Leased Unit Number *"
                    options={[
                      { value: '', label: '-- Select Unit --' },
                      ...occupiedUnits.map(u => ({ value: u.id, label: `Unit ${u.unitNumber} - ${u.tenantName}` }))
                    ]}
                    disabled={!watchPropertyId}
                    error={errors.unitId?.message}
                    {...register('unitId', { required: 'Occupied unit selection is required' })}
                  />

                  {/* Category and Priority */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <Select
                      label="Category *"
                      options={[
                        { value: 'plumbing', label: 'Plumbing / Pipes' },
                        { value: 'electrical', label: 'Electrical Wiring' },
                        { value: 'hvac', label: 'HVAC / Cooling' },
                        { value: 'structural', label: 'Structural / Doors' },
                        { value: 'appliance', label: 'Appliance Repair' },
                        { value: 'other', label: 'Other General Repair' }
                      ]}
                      {...register('category')}
                    />
                    <Select
                      label="Priority *"
                      options={[
                        { value: 'low', label: 'Low (General)' },
                        { value: 'medium', label: 'Medium (Standard)' },
                        { value: 'high', label: 'High (Immediate Action)' }
                      ]}
                      {...register('priority')}
                    />
                  </div>

                  <Input
                    label="Issue Title *"
                    placeholder="e.g. AC compressor failure, pipe leak under sink"
                    error={errors.title?.message}
                    {...register('title', { required: 'Ticket title is required' })}
                  />

                  <Textarea
                    label="Detailed Explanation *"
                    placeholder="Provide troubleshooting details, exact location, or symptoms..."
                    error={errors.description?.message}
                    {...register('description', { required: 'Description is required' })}
                  />
                </div>
              </div>
              <div className={styles.modalFooter}>
                <Button type="button" variant="secondary" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" leftIcon={<Wrench size={16} />}>
                  File Ticket
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default Maintenance;
