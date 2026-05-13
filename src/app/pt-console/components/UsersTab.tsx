"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import styles from '../admin.module.css';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'landlord' | 'tenant' | 'admin';
  created_at: string;
  is_admin: boolean;
}

export default function UsersTab({ 
  users, 
  loading, 
  properties = [], 
  onAssign,
  onUnassign,
  onDelete,
  onCreateTenancy
}: { 
  users: UserProfile[], 
  loading: boolean,
  properties?: { id: string; title: string; location: string; image: string; assigned_to_email?: string | null }[],
  onAssign?: (propId: string, email: string) => Promise<void>,
  onUnassign?: (propId: string) => Promise<void>,
  onDelete?: (id: string) => Promise<void>,
  onCreateTenancy?: (t: any) => Promise<void>
}) {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [assigningUser, setAssigningUser] = useState<UserProfile | null>(null);
  const [tenancyUser, setTenancyUser] = useState<UserProfile | null>(null);

  const filteredUsers = users.filter(u => {
    const matchesSearch = 
      u.name?.toLowerCase().includes(search.toLowerCase()) || 
      u.email?.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (loading) return <div className={styles.loading}>Loading users...</div>;

  return (
    <div className={styles.tabContent}>
      <div className={styles.toolbar}>
        <div className={styles.searchWrapper}>
          <input 
            type="text" 
            placeholder="Search users by name or email..." 
            className={styles.searchInput}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select 
          className={styles.filterSelect}
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="all">All Roles</option>
          <option value="landlord">Landlords</option>
          <option value="tenant">Tenants</option>
          <option value="admin">Admins</option>
        </select>
        <div className={styles.toolbarCount}>
          {filteredUsers.length} Users
        </div>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Assigned Properties</th>
              <th>Joined</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => {
              const userProperties = properties.filter(p => p.assigned_to_email === user.email);
              
              return (
                <tr key={user.id}>
                  <td style={{ fontWeight: 700 }}>{user.name || 'No Name'}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`${styles.pill} ${
                      user.role === 'landlord' ? styles.pillGreen : 
                      user.role === 'tenant' ? styles.pillBlue : 
                      styles.pillGray
                    }`}>
                      {user.role || 'user'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {userProperties.map(p => (
                        <div key={p.id} className={styles.propChip}>
                          <span className={styles.propChipLabel}>{p.location?.split(',')[0] || p.title}</span>
                          <button 
                            className={styles.propChipRemove} 
                            title="Unassign Property"
                            onClick={() => onUnassign && onUnassign(p.id)}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      {userProperties.length === 0 && <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>No properties</span>}
                    </div>
                  </td>
                  <td style={{ fontSize: '0.8125rem', color: '#64748b' }}>
                    {new Date(user.created_at).toLocaleDateString('en-GB')}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div className={styles.actionGroup} style={{ justifyContent: 'flex-end' }}>
                      <button 
                        className={styles.docActionIcon} 
                        title="Manage Properties"
                        onClick={() => setAssigningUser(user)}
                      >
                        🏠
                      </button>
                      <button 
                        className={styles.docActionIcon} 
                        title="Create Tenancy / Lease"
                        onClick={() => setTenancyUser(user)}
                      >
                        📄
                      </button>
                      <button className={styles.docActionIcon} title="View Details">👤</button>
                      <a href={`mailto:${user.email}`} className={styles.docActionIcon} title="Email User">✉️</a>
                      <button 
                        className={`${styles.docActionIcon} ${styles.btnDanger}`} 
                        style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
                        title="Delete User Account"
                        onClick={() => {
                          if (confirm(`Are you sure you want to completely delete the account for ${user.email}? This action cannot be undone.`)) {
                            onDelete && onDelete(user.id);
                          }
                        }}
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Property Assignment Modal */}
      {assigningUser && (
        <PropertyPickerModal 
          user={assigningUser}
          properties={properties}
          onClose={() => setAssigningUser(null)}
          onAssign={async (propId) => {
            if (onAssign) await onAssign(propId, assigningUser.email);
          }}
          onUnassign={async (propId) => {
            if (onUnassign) await onUnassign(propId);
          }}
        />
      )}

      {/* Tenancy Creation Modal */}
      {tenancyUser && (
        <CreateTenancyModal 
          user={tenancyUser}
          properties={properties.filter(p => p.assigned_to_email === tenancyUser.email)}
          onClose={() => setTenancyUser(null)}
          onSave={async (t) => {
            if (onCreateTenancy) await onCreateTenancy(t);
            setTenancyUser(null);
          }}
        />
      )}
    </div>
  );
}

function CreateTenancyModal({ user, properties, onClose, onSave }: {
  user: UserProfile;
  properties: { id: string; title: string; location: string }[];
  onClose: () => void;
  onSave: (t: any) => Promise<void>;
}) {
  const [formData, setFormData] = useState({
    propertyId: properties[0]?.id || '',
    propertyName: properties[0]?.location || properties[0]?.title || '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    rentAmount: '',
    rentFrequency: 'Monthly',
    rentDay: '1',
    depositAmount: '',
    status: 'Active'
  });
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.propertyId) return alert('Please select a property');
    setBusy(true);
    try {
      await onSave({
        ...formData,
        tenantName: user.name,
        tenantEmail: user.email,
        tenantPhone: user.phone
      });
    } catch (err) {
      console.error(err);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modal} style={{ maxWidth: 600 }} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Create Tenancy for {user.name}</h2>
          <button className={styles.modalClose} onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit} className={styles.modalBody}>
          <div className={styles.grid2}>
            <div className={styles.field}>
              <label>Select Property</label>
              <select 
                value={formData.propertyId} 
                onChange={e => {
                  const p = properties.find(prop => prop.id === e.target.value);
                  setFormData({ ...formData, propertyId: e.target.value, propertyName: p?.location || p?.title || '' });
                }}
                required
              >
                <option value="">-- Choose Property --</option>
                {properties.map(p => <option key={p.id} value={p.id}>{p.location || p.title}</option>)}
              </select>
              {properties.length === 0 && <p style={{ color: '#ef4444', fontSize: '0.7rem', marginTop: 4 }}>User has no assigned properties. Assign one first.</p>}
            </div>
            <div className={styles.field}>
              <label>Status</label>
              <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value as any })}>
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Ended">Ended</option>
              </select>
            </div>
          </div>

          <div className={styles.grid2} style={{ marginTop: 15 }}>
            <div className={styles.field}>
              <label>Start Date</label>
              <input type="date" value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} required />
            </div>
            <div className={styles.field}>
              <label>End Date (Optional)</label>
              <input type="date" value={formData.endDate} onChange={e => setFormData({ ...formData, endDate: e.target.value })} />
            </div>
          </div>

          <div className={styles.grid3} style={{ marginTop: 15 }}>
            <div className={styles.field}>
              <label>Rent Amount</label>
              <input type="text" placeholder="£1,200" value={formData.rentAmount} onChange={e => setFormData({ ...formData, rentAmount: e.target.value })} required />
            </div>
            <div className={styles.field}>
              <label>Frequency</label>
              <select value={formData.rentFrequency} onChange={e => setFormData({ ...formData, rentFrequency: e.target.value as any })}>
                <option value="Monthly">Monthly</option>
                <option value="Weekly">Weekly</option>
                <option value="Quarterly">Quarterly</option>
              </select>
            </div>
            <div className={styles.field}>
              <label>Rent Day (1-31)</label>
              <input type="number" min="1" max="31" value={formData.rentDay} onChange={e => setFormData({ ...formData, rentDay: e.target.value })} />
            </div>
          </div>

          <div className={styles.field} style={{ marginTop: 15 }}>
            <label>Deposit Amount</label>
            <input type="text" placeholder="£1,500" value={formData.depositAmount} onChange={e => setFormData({ ...formData, depositAmount: e.target.value })} />
          </div>

          <div className={styles.modalFooter} style={{ marginTop: 30 }}>
            <button type="button" className={styles.btnGray} onClick={onClose}>Cancel</button>
            <button type="submit" className={styles.btnGreen} disabled={busy || properties.length === 0}>
              {busy ? 'Creating...' : 'Create Tenancy →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function PropertyPickerModal({ user, properties, onClose, onAssign, onUnassign }: {
  user: UserProfile;
  properties: { id: string; title: string; location: string; image: string; assigned_to_email?: string | null }[];
  onClose: () => void;
  onAssign: (id: string) => Promise<void>;
  onUnassign: (id: string) => Promise<void>;
}) {
  const [search, setSearch] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);

  const filtered = properties.filter(p => 
    p.title?.toLowerCase().includes(search.toLowerCase()) || 
    p.location?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modal} style={{ maxWidth: 800, width: '90vw' }} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Manage Properties for {user.name}</h2>
          <button className={styles.modalClose} onClick={onClose}>✕</button>
        </div>
        <div className={styles.modalBody}>
          <div style={{ marginBottom: 20 }}>
            <input 
              type="text" 
              placeholder="Search properties by address or title..." 
              className={styles.searchInput}
              style={{ width: '100%' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
          </div>

          <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Property</th>
                  <th>Location (First Line)</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                      No matching properties available.
                    </td>
                  </tr>
                ) : (
                  filtered.map(p => {
                    const isForThisUser = p.assigned_to_email === user.email;
                    
                    return (
                      <tr key={p.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ position: 'relative', width: 40, height: 40, borderRadius: 6, overflow: 'hidden' }}>
                            <Image src={p.image} alt="" fill style={{ objectFit: 'cover' }} unoptimized />
                          </div>
                            <span style={{ fontWeight: 600 }}>{p.title}</span>
                          </div>
                        </td>
                        <td style={{ fontSize: '0.8125rem' }}>{p.location?.split(',')[0] || 'N/A'}</td>
                        <td>
                          {p.assigned_to_email ? (
                            <span className={isForThisUser ? styles.pillBlue : styles.pillGray} style={{ fontSize: '0.7rem' }}>
                              {isForThisUser ? 'Linked to this user' : `Assigned: ${p.assigned_to_email}`}
                            </span>
                          ) : (
                            <span className={styles.pillGreen} style={{ fontSize: '0.7rem' }}>Available</span>
                          )}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button 
                            className={isForThisUser ? styles.actionHide : styles.btnInfo}
                            style={{ padding: '6px 12px', fontSize: '0.8rem', minWidth: 100 }}
                            disabled={busyId === p.id}
                            onClick={async () => {
                              setBusyId(p.id);
                              if (isForThisUser) {
                                await onUnassign(p.id);
                              } else {
                                await onAssign(p.id);
                              }
                              setBusyId(null);
                            }}
                          >
                            {busyId === p.id ? 'Updating...' : (isForThisUser ? 'Unlink' : 'Assign')}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
