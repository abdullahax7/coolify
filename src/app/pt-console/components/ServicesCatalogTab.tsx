"use client";

import React, { useState, useEffect } from 'react';
import styles from '../admin.module.css';
import { SERVICE_CATALOG, CatalogCategory } from '@/data/pricing_data';

interface CatalogItem {
  name: string;
  price: string;
  desc: string;
  image_url?: string;
}



export default function ServicesCatalogTab() {
  const [catalog, setCatalog] = useState<CatalogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expandedCats, setExpandedCats] = useState<Record<string, boolean>>({});
  const [uploadingItem, setUploadingItem] = useState<{ catIdx: number; itemIdx: number } | null>(null);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/content');
      const data = await res.json();
      if (data.content) {
        const catalogEntry = data.content.find(
          (c: { page_identifier: string, section_key: string, content_value?: string }) => c.page_identifier === 'global_data' && c.section_key === 'service_catalog'
        );
        if (catalogEntry && catalogEntry.content_value) {
          try {
            const dbCatalog = JSON.parse(catalogEntry.content_value);
            const dbCatMap = new Map(dbCatalog.map((c: any) => [c.category, c]));
            
            // Merge static defaults with DB content
            const merged: CatalogCategory[] = SERVICE_CATALOG.map(staticCat => {
              return (dbCatMap.get(staticCat.category) as CatalogCategory) || staticCat;
            });

            // Add any extra categories from DB
            const staticCatNames = new Set(SERVICE_CATALOG.map(c => c.category));
            dbCatalog.forEach((dbCat: any) => {
              if (!staticCatNames.has(dbCat.category)) {
                merged.push(dbCat);
              }
            });

            setCatalog(merged);
          } catch (e) {
            console.error("Failed to parse catalog:", e);
            setCatalog(SERVICE_CATALOG);
          }
        } else {
          // Fallback to initial data if not found in DB
          setCatalog(SERVICE_CATALOG);
        }
      }
    } catch (err) {
      console.error('Failed to load sub-catalog:', err);
      setCatalog(SERVICE_CATALOG); // Fallback
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updates = [{
        page_identifier: 'global_data',
        section_key: 'service_catalog',
        content_value: JSON.stringify(catalog)
      }];

      const res = await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates })
      });

      if (res.ok) {
        alert('Services Catalog updated successfully!');
        loadContent();
      } else {
        alert('Failed to update catalog.');
      }
    } catch (err) {
      console.error('Error saving content:', err);
      alert('Error saving catalog.');
    } finally {
      setSaving(false);
    }
  };

  const toggleCat = (catName: string) => {
    setExpandedCats(prev => ({ ...prev, [catName]: !prev[catName] }));
  };

  const handleCatNameChange = (catIdx: number, newName: string) => {
    const newCatalog = [...catalog];
    newCatalog[catIdx].category = newName;
    setCatalog(newCatalog);
  };

  const handleItemChange = (catIdx: number, itemIdx: number, field: keyof CatalogItem, value: string) => {
    const newCatalog = [...catalog];
    newCatalog[catIdx].items[itemIdx][field] = value;
    setCatalog(newCatalog);
  };

  const addItemToCat = (catIdx: number) => {
    const newCatalog = [...catalog];
    newCatalog[catIdx].items.push({ name: 'New Service', price: '£0.00', desc: 'Description of the service.' });
    setCatalog(newCatalog);
  };

  const deleteItemFromCat = async (catIdx: number, itemIdx: number) => {
    const item = catalog[catIdx].items[itemIdx];
    if (item.image_url) {
      await deleteStorageFile(item.image_url);
    }
    const newCatalog = [...catalog];
    newCatalog[catIdx].items.splice(itemIdx, 1);
    setCatalog(newCatalog);
  };

  const addCategory = () => {
    setCatalog([...catalog, { category: 'New Category', items: [] }]);
  };

  const deleteStorageFile = async (url: string) => {
    if (!url || !url.includes('supabase')) return;
    try {
      await fetch('/api/storage/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, bucket: 'site-assets' })
      });
    } catch (err) {
      console.error('Failed to delete storage file:', err);
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset the catalog to defaults? This will overwrite all your current categories and items with the original set (including all Wales forms).')) {
      setCatalog(SERVICE_CATALOG);
    }
  };

  const handleImageUpload = async (catIdx: number, itemIdx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Delete old image if it exists
    const existingUrl = catalog[catIdx].items[itemIdx].image_url;
    if (existingUrl) {
      await deleteStorageFile(existingUrl);
    }

    setUploadingItem({ catIdx, itemIdx });
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
        const newCatalog = [...catalog];
        newCatalog[catIdx].items[itemIdx].image_url = data.url;
        setCatalog(newCatalog);
      } else {
        alert('Upload failed: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      console.error('Error uploading image:', err);
      alert('Error uploading image.');
    } finally {
      setUploadingItem(null);
    }
  };

  if (loading) return <div>Loading Services Catalog...</div>;

  return (
    <div>
      <div className={styles.toolbar}>
        <h2 style={{ margin: 0, color: '#1e293b', fontSize: '1.25rem' }}>Services Catalog Editor</h2>
        <button 
          className={styles.btnGreen} 
          style={{ marginLeft: '1rem' }} 
          onClick={addCategory}
        >
          + Add Category
        </button>
        <button 
          className={styles.btnOutline} 
          style={{ marginLeft: '1rem', color: '#64748b', borderColor: '#e2e8f0' }} 
          onClick={handleReset}
        >
          ↺ Reset to Defaults
        </button>
        <button 
          className={styles.btnPurple} 
          style={{ marginLeft: 'auto' }} 
          disabled={saving}
          onClick={handleSave}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div style={{ marginTop: 20 }}>
        {catalog.map((cat, catIdx) => (
          <div key={catIdx} style={{ marginBottom: 20, background: '#fff', borderRadius: 8, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <div 
              style={{ padding: '15px 20px', background: '#f8fafc', display: 'flex', alignItems: 'center', cursor: 'pointer', borderBottom: expandedCats[cat.category] ? '1px solid #e2e8f0' : 'none' }}
              onClick={(e) => {
                // don't toggle if clicking input
                if ((e.target as HTMLElement).tagName.toLowerCase() !== 'input') {
                  toggleCat(cat.category);
                }
              }}
            >
              <span style={{ marginRight: 10 }}>{expandedCats[cat.category] ? '▼' : '▶'}</span>
              <input
                style={{
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  color: '#0f172a',
                  border: '1px solid transparent',
                  background: 'transparent',
                  width: '300px',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  outline: 'none'
                }}
                value={cat.category}
                onChange={(e) => handleCatNameChange(catIdx, e.target.value)}
                onFocus={(e) => { e.target.style.background = '#fff'; e.target.style.borderColor = '#cbd5e1'; }}
                onBlur={(e) => { e.target.style.background = 'transparent'; e.target.style.borderColor = 'transparent'; }}
              />
              <span style={{ marginLeft: 'auto', background: '#e2e8f0', padding: '4px 10px', borderRadius: 20, fontSize: '0.85rem', fontWeight: 600 }}>
                {cat.items.length} items
              </span>
            </div>

            {expandedCats[cat.category] && (
              <div style={{ padding: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px' }}>
                  {cat.items.map((item, itemIdx) => (
                    <div key={itemIdx} style={{ display: 'grid', gridTemplateColumns: '120px minmax(200px, 1fr) 120px 2fr auto', gap: '15px', alignItems: 'start', padding: '15px', border: '1px solid #e2e8f0', borderRadius: '6px', background: '#fff' }}>
                      
                      {/* Image Upload/Preview */}
                      <div style={{ position: 'relative' }}>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: '#64748b', marginBottom: 4, fontWeight: 600 }}>Image</label>
                        <div style={{ 
                          width: '100%', 
                          height: '100px', 
                          border: '1px solid #cbd5e1', 
                          borderRadius: '4px', 
                          overflow: 'hidden', 
                          background: '#f8fafc',
                          position: 'relative',
                          cursor: 'pointer'
                        }}>
                          {item.image_url ? (
                            <img 
                              src={item.image_url} 
                              alt={item.name} 
                              style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                            />
                          ) : (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8', fontSize: '1.5rem' }}>
                              🖼️
                            </div>
                          )}
                          {uploadingItem?.catIdx === catIdx && uploadingItem?.itemIdx === itemIdx && (
                            <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700 }}>
                              Uploading...
                            </div>
                          )}
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={(e) => handleImageUpload(catIdx, itemIdx, e)}
                            style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
                          />
                        </div>
                        {item.image_url && (
                          <button 
                            onClick={async () => {
                              await deleteStorageFile(item.image_url!);
                              handleItemChange(catIdx, itemIdx, 'image_url', '');
                            }}
                            style={{ position: 'absolute', top: 22, right: 2, background: '#ef4444', color: '#fff', border: 'none', borderRadius: '50%', width: 20, height: 20, fontSize: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          >
                            ✕
                          </button>
                        )}
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: '#64748b', marginBottom: 4, fontWeight: 600 }}>Service Name</label>
                        <input
                          style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontFamily: 'inherit' }}
                          value={item.name}
                          onChange={(e) => handleItemChange(catIdx, itemIdx, 'name', e.target.value)}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: '#64748b', marginBottom: 4, fontWeight: 600 }}>Price</label>
                        <input
                          style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontFamily: 'inherit' }}
                          value={item.price}
                          onChange={(e) => handleItemChange(catIdx, itemIdx, 'price', e.target.value)}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: '#64748b', marginBottom: 4, fontWeight: 600 }}>Description</label>
                        <textarea
                          style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontFamily: 'inherit', minHeight: '60px', resize: 'vertical' }}
                          value={item.desc}
                          onChange={(e) => handleItemChange(catIdx, itemIdx, 'desc', e.target.value)}
                        />
                      </div>

                      <div style={{ paddingTop: '22px' }}>
                        <button 
                          style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '9px 14px', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}
                          onClick={() => deleteItemFromCat(catIdx, itemIdx)}
                        >
                          X
                        </button>
                      </div>

                    </div>
                  ))}
                </div>

                <div style={{ marginTop: '15px', textAlign: 'center' }}>
                  <button 
                    style={{ background: '#f1f5f9', color: '#475569', border: '1px dashed #cbd5e1', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, width: '100%' }}
                    onClick={() => addItemToCat(catIdx)}
                  >
                    + Add Item to {cat.category}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
