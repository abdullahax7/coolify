"use client";

import React, { useState, useEffect } from 'react';
import styles from '../admin.module.css';
import { STAFF_DEFAULTS } from '@/data/staff';

interface StaffMember {
  id?: string;
  id_slug?: string;
  name: string;
  role: string;
  description: string;
  image_url: string;
}

export default function StaffTab() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);

  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/staff', { cache: 'no-store' });
      const data = await res.json();
      if (data.staff && data.staff.length > 0) {
        setStaff(data.staff);
      } else {
        // Fallback to defaults so the admin can edit them and save to DB
        setStaff(STAFF_DEFAULTS.map(s => ({
          id_slug: s.id,
          name: s.name,
          role: s.role,
          description: s.description,
          image_url: s.image
        })));
      }
    } catch (err) {
      console.error('Failed to load staff:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/staff', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ staff })
      });

      if (res.ok) {
        alert('Team updated successfully!');
        loadStaff();
      } else {
        const data = await res.json().catch(() => ({}));
        alert('Failed to update team: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      console.error('Error saving team:', err);
      alert('Error saving team.');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (idx: number, field: keyof StaffMember, value: string) => {
    const newStaff = [...staff];
    newStaff[idx] = { ...newStaff[idx], [field]: value };
    setStaff(newStaff);
  };

  const addMember = () => {
    setStaff([...staff, { name: 'New Member', role: 'Role', description: 'Bio...', image_url: '' }]);
  };

  const deleteMember = (idx: number) => {
    if (window.confirm('Delete this team member?')) {
      const newStaff = staff.filter((_, i) => i !== idx);
      setStaff(newStaff);
    }
  };

  const handleImageUpload = async (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingIdx(idx);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('bucket', 'site-assets');

      const res = await fetch('/api/storage/upload', {
        method: 'POST',
        body: fd
      });
      const data = await res.json();

      if (data.url) {
        handleChange(idx, 'image_url', data.url);
      } else {
        alert('Upload failed: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      console.error('Error uploading image:', err);
      alert('Error uploading image.');
    } finally {
      setUploadingIdx(null);
    }
  };

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Loading Team...</div>;

  return (
    <div>
      <div className={styles.toolbar}>
        <h2 style={{ margin: 0, color: '#1e293b', fontSize: '1.25rem' }}>Team Management</h2>
        <button className={styles.btnGreen} style={{ marginLeft: '1rem' }} onClick={addMember}>+ Add Member</button>
        <button 
          className={styles.btnPurple} 
          style={{ marginLeft: 'auto' }} 
          disabled={saving}
          onClick={handleSave}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: 20 }}>
        {staff.map((member, idx) => (
          <div key={idx} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 20, position: 'relative' }}>
            <button 
              onClick={() => deleteMember(idx)}
              style={{ position: 'absolute', top: 10, right: 10, background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '50%', width: 24, height: 24, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              ✕
            </button>
            
            <div style={{ display: 'flex', gap: 20 }}>
              <div style={{ width: 120 }}>
                <div style={{ 
                  width: 120, height: 150, background: '#f1f5f9', borderRadius: 8, overflow: 'hidden', 
                  border: '1px solid #e2e8f0', position: 'relative', cursor: 'pointer' 
                }}>
                  {member.image_url ? (
                    <img src={member.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8' }}>🖼️</div>
                  )}
                  {uploadingIdx === idx && (
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>Uploading...</div>
                  )}
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => handleImageUpload(idx, e)}
                    style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
                  />
                </div>
                <p style={{ fontSize: '0.7rem', color: '#64748b', marginTop: 4, textAlign: 'center' }}>Click to change</p>
              </div>

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: 4 }}>Full Name</label>
                  <input 
                    className={styles.editInput} 
                    style={{ width: '100%' }}
                    value={member.name} 
                    onChange={(e) => handleChange(idx, 'name', e.target.value)} 
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: 4 }}>Role / Title</label>
                  <input 
                    className={styles.editInput} 
                    style={{ width: '100%' }}
                    value={member.role} 
                    onChange={(e) => handleChange(idx, 'role', e.target.value)} 
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: 4 }}>Identifier (Slug) - e.g. "mohammed" for CEO</label>
                  <input 
                    className={styles.editInput} 
                    style={{ width: '100%', fontFamily: 'monospace', fontSize: '0.8rem' }}
                    value={member.id_slug} 
                    onChange={(e) => handleChange(idx, 'id_slug', e.target.value)} 
                  />
                </div>
              </div>
            </div>

            <div style={{ marginTop: 15 }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: 4 }}>Short Biography</label>
              <textarea 
                className={styles.editInput} 
                style={{ width: '100%', minHeight: 80, resize: 'vertical' }}
                value={member.description} 
                onChange={(e) => handleChange(idx, 'description', e.target.value)} 
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
