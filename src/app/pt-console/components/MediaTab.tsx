"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from '../admin.module.css';

interface MediaSlot {
  id: string;
  name: string;
  page: string;
  key: string;
  defaultUrl: string;
  description: string;
}

const MEDIA_SLOTS: MediaSlot[] = [
  { 
    id: 'logo', 
    name: 'Company Logo', 
    page: 'global', 
    key: 'logo_url', 
    defaultUrl: '/images/logo.jpg', 
    description: 'Main logo used across header, footer and admin login.'
  },
  { 
    id: 'home_hero', 
    name: 'Homepage Hero', 
    page: 'homepage', 
    key: 'hero_image_url', 
    defaultUrl: '/uk_properties_hero_v2.png', 
    description: 'Full-width background illustration on the landing page.'
  },
  { 
    id: 'pricing_hero', 
    name: 'Pricing Page Hero', 
    page: 'pricing', 
    key: 'hero_image_url', 
    defaultUrl: '/listpropetybg.png', 
    description: 'Banner background for the pricing and packages page.'
  },
  { 
    id: 'cash_buy_hero', 
    name: 'Cash Buy Banner', 
    page: 'we-buy-any-house', 
    key: 'hero_image_url', 
    defaultUrl: '/sell banner.png', 
    description: 'Main illustration for the We Buy Any House section.'
  },
  { 
    id: 'ceo_photo', 
    name: 'CEO Portrait', 
    page: 'global', 
    key: 'staff_mohammed_image', 
    defaultUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800', 
    description: 'Profile photo of the CEO used in the visionary feature.'
  },
  { 
    id: 'staff_zarqa', 
    name: 'Sales Manager (Zarqa)', 
    page: 'global', 
    key: 'staff_zarqa_image', 
    defaultUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800', 
    description: 'Team profile photo.'
  },
  { 
    id: 'staff_jangir', 
    name: 'Legal specialist (Jangir)', 
    page: 'global', 
    key: 'staff_jangir_image', 
    defaultUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=800', 
    description: 'Team profile photo.'
  },
  { 
    id: 'staff_khalid', 
    name: 'Sales Team (Khalid)', 
    page: 'global', 
    key: 'staff_khalid_image', 
    defaultUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800', 
    description: 'Team profile photo.'
  },
  { 
    id: 'properties_hero', 
    name: 'Properties Page Hero', 
    page: 'properties', 
    key: 'hero_image_url', 
    defaultUrl: '/propertybg.png', 
    description: 'Main background image for the properties portfolio page.'
  },
  { 
    id: 'services_hero', 
    name: 'Services Page Hero', 
    page: 'services', 
    key: 'hero_image_url', 
    defaultUrl: '/servicesbg.png', 
    description: 'Full-width banner for the professional services catalog.'
  },
  { 
    id: 'contact_hero', 
    name: 'Contact Page Illustration', 
    page: 'contact', 
    key: 'hero_image_url', 
    defaultUrl: '/contact.jpeg', 
    description: 'Support team illustration shown on the contact page.'
  },
];

export default function MediaTab() {
  const [content, setContent] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  useEffect(() => {
    loadMedia();
  }, []);

  const loadMedia = async () => {
    try {
      const res = await fetch('/api/content');
      const data = await res.json();
      if (data.content) {
        const mapped: Record<string, string> = {};
        data.content.forEach((item: { page_identifier: string; section_key: string; content_value: string }) => {
          mapped[`${item.page_identifier}_${item.section_key}`] = item.content_value;
        });
        setContent(mapped);
      }
    } catch (err) {
      console.error('Failed to load media content:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (slot: MediaSlot, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingId(slot.id);
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
        // Save to site_content
        const saveRes = await fetch('/api/content', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            updates: [{
              page_identifier: slot.page,
              section_key: slot.key,
              content_value: data.url
            }]
          })
        });

        if (saveRes.ok) {
          setContent(prev => ({
            ...prev,
            [`${slot.page}_${slot.key}`]: data.url
          }));
          loadMedia();
        } else {
          alert('Failed to save image reference to database.');
        }
      } else {
        alert('Upload failed: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      console.error('Error uploading media:', err);
      alert('Error uploading media.');
    } finally {
      setUploadingId(null);
    }
  };

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>Loading Media Manager...</div>;

  return (
    <div>
      <div className={styles.toolbar}>
        <h2 style={{ margin: 0, color: '#1e293b', fontSize: '1.25rem' }}>Media Manager</h2>
        <p style={{ margin: '0 0 0 20px', color: '#64748b', fontSize: '0.9rem' }}>
          Change main website images, logos and staff photos.
        </p>
      </div>

      <div className={styles.mediaGrid} style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
        gap: '24px', 
        marginTop: '24px' 
      }}>
        {MEDIA_SLOTS.map(slot => {
          const currentUrl = content[`${slot.page}_${slot.key}`] || slot.defaultUrl;
          const isUploading = uploadingId === slot.id;

          return (
            <div key={slot.id} style={{ 
              background: '#fff', 
              borderRadius: '12px', 
              border: '1px solid #e2e8f0', 
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}>
              <div style={{ 
                height: '180px', 
                background: '#f8fafc', 
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                borderBottom: '1px solid #f1f5f9'
              }}>
                <Image 
                  src={currentUrl} 
                  alt={slot.name} 
                  fill
                  style={{ 
                    objectFit: slot.id === 'logo' ? 'contain' : 'cover' ,
                  }}
                  unoptimized
                />
                {isUploading && (
                  <div style={{ 
                    position: 'absolute', 
                    inset: 0, 
                    background: 'rgba(255,255,255,0.8)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    flexDirection: 'column',
                    gap: '12px'
                  }}>
                    <div className={styles.spinner} />
                    <span style={{ fontWeight: 600, color: '#4f46e5' }}>Uploading...</span>
                  </div>
                )}
              </div>

              <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ marginBottom: '16px' }}>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '1.05rem', color: '#0f172a' }}>{slot.name}</h3>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5 }}>
                    {slot.description}
                  </p>
                </div>

                <div style={{ marginTop: 'auto', display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <label style={{ 
                    flex: 1,
                    padding: '10px',
                    background: '#f1f5f9',
                    color: '#475569',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    textAlign: 'center',
                    cursor: isUploading ? 'not-allowed' : 'pointer',
                    border: '1px solid #e2e8f0',
                    transition: 'all 0.2s'
                  }}>
                    {isUploading ? 'Please wait...' : 'Replace Image'}
                    <input 
                      type="file" 
                      hidden 
                      accept="image/*" 
                      onChange={(e) => handleUpload(slot, e)}
                      disabled={isUploading}
                    />
                  </label>
                  
                  <button 
                    onClick={() => {
                      if (window.confirm('Revert to default image?')) {
                        // Just remove from DB
                        fetch('/api/content', {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            updates: [{
                              page_identifier: slot.page,
                              section_key: slot.key,
                              content_value: slot.defaultUrl // Or even better, delete the row. But upserting default is safe.
                            }]
                          })
                        }).then(res => {
                          if (res.ok) loadMedia();
                        });
                      }
                    }}
                    style={{
                      padding: '10px',
                      background: '#fff',
                      color: '#94a3b8',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      cursor: 'pointer'
                    }}
                    title="Reset to default"
                  >
                    🔄
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
