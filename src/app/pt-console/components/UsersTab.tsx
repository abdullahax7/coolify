"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import styles from '../admin.module.css';

function Row({ label, value, href, mono }: { label: string; value: string; href?: string; mono?: boolean }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: 12, fontSize: 14 }}>
      <div style={{ color: '#64748b', fontWeight: 600 }}>{label}</div>
      <div style={{ color: '#0f172a', fontWeight: 500, fontFamily: mono ? 'monospace' : undefined, fontSize: mono ? 12 : undefined, wordBreak: 'break-word' }}>
        {href ? <a href={href} style={{ color: '#e11d48', textDecoration: 'none' }}>{value}</a> : value}
      </div>
    </div>
  );
}

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
}: {
  users: UserProfile[],
  loading: boolean,
  properties?: { id: string; title: string; location: string; image: string; assigned_to_email?: string | null }[],
  onAssign?: (propId: string, email: string) => Promise<void>,
  onUnassign?: (propId: string) => Promise<void>,
  onDelete?: (id: string) => Promise<void>,
}) {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [assigningUser, setAssigningUser] = useState<UserProfile | null>(null);
  const [viewingUser, setViewingUser] = useState<UserProfile | null>(null);

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
                      <button className={styles.docActionIcon} title="View Details" onClick={() => setViewingUser(user)}>👤</button>
                      <a href={`mailto:${user.email}`} className={styles.docActionIcon} title="Email User">✉️</a>
                      <button
                        className={`${styles.docActionIcon} ${styles.btnDanger}`}
                        style={{ border: 'none', background: 'transparent', cursor: (user.is_admin || user.role === 'admin') ? 'not-allowed' : 'pointer', opacity: (user.is_admin || user.role === 'admin') ? 0.4 : 1 }}
                        title={(user.is_admin || user.role === 'admin') ? 'User is admin, cannot be deleted' : 'Delete User Account'}
                        onClick={() => {
                          if (user.is_admin || user.role === 'admin') {
                            alert('User is admin, cannot be deleted');
                            return;
                          }
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

      {/* User Details Modal */}
      {viewingUser && (
        <div className={styles.modalBackdrop} onClick={() => setViewingUser(null)}>
          <div className={styles.modal} style={{ maxWidth: 480 }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: 24 }}>
              <h2 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 800 }}>{viewingUser.name}</h2>
              <p style={{ margin: '0 0 20px', color: '#64748b', fontSize: 14 }}>{viewingUser.role}{viewingUser.is_admin ? ' · admin' : ''}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <Row label="Email" value={viewingUser.email} href={`mailto:${viewingUser.email}`} />
                <Row label="Phone" value={viewingUser.phone || '—'} href={viewingUser.phone ? `tel:${viewingUser.phone}` : undefined} />
                <Row label="Role" value={viewingUser.role} />
                <Row label="Admin" value={viewingUser.is_admin ? 'Yes' : 'No'} />
                <Row label="Created" value={new Date(viewingUser.created_at).toLocaleString('en-GB')} />
                <Row label="User ID" value={viewingUser.id} mono />
                <Row
                  label="Assigned Properties"
                  value={
                    properties.filter(p => p.assigned_to_email === viewingUser.email).length === 0
                      ? '—'
                      : properties.filter(p => p.assigned_to_email === viewingUser.email).map(p => p.title).join(', ')
                  }
                />
              </div>
              <div style={{ marginTop: 24, textAlign: 'right' }}>
                <button onClick={() => setViewingUser(null)} className={`${styles.btn} ${styles.btnInfo}`}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

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
