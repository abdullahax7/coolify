"use client";

import React, { useState, useEffect, useMemo } from 'react';
import styles from '../admin.module.css';

interface SiteContentItem {
  page_identifier: string;
  section_key: string;
  content_value: string;
}

export default function SiteContentTab() {
  const [content, setContent] = useState<SiteContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editValues, setEditValues] = useState<Record<string, string>>({});
  const [selectedPage, setSelectedPage] = useState<string>('all');
  const [expandedPages, setExpandedPages] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newBlock, setNewBlock] = useState({ page: '', key: '', value: '' });
  const [themeValues, setThemeValues] = useState<Record<string, string>>({
    primary: '#e11d48',
    secondary: '#1e3a8a',
    foreground: '#0f172a',
    background: '#ffffff',
    navy: '#0f172a'
  });
  const [showThemeSettings, setShowThemeSettings] = useState(false);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/content');
      const data = await res.json();
      if (data.content) {
        // Filter out global data structures (like the JSON catalog)
        // Keep 'theme' if we want to handle it in the main list, or handle it separately
        const displayData = data.content.filter((item: SiteContentItem) => 
          item.page_identifier !== 'global_data' && item.page_identifier !== 'theme'
        );
        setContent(displayData);

        // Load theme separately
        const themeItems = data.content.filter((item: SiteContentItem) => item.page_identifier === 'theme');
        const initialTheme: Record<string, string> = {};
        themeItems.forEach((item: SiteContentItem) => {
          initialTheme[item.section_key] = item.content_value;
        });
        setThemeValues(prev => ({ ...prev, ...initialTheme }));
        
        const initialValues: Record<string, string> = {};
        displayData.forEach((item: SiteContentItem) => {
          initialValues[`${item.page_identifier}:${item.section_key}`] = item.content_value;
        });
        setEditValues(initialValues);

        // Keep pages collapsed by default
        setExpandedPages({});
      }
    } catch (err) {
      console.error('Failed to load site content:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updates = Object.entries(editValues).map(([fullKey, value]) => {
        const [page, ...keyParts] = fullKey.split(':');
        const key = keyParts.join(':');
        return { page_identifier: page, section_key: key, content_value: value };
      });

      const res = await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates })
      });

      if (res.ok) {
        alert('Site content updated successfully!');
        loadContent();
      } else {
        alert('Failed to update content.');
      }
    } catch (err) {
      console.error('Error saving content:', err);
      alert('Error saving content.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveTheme = async () => {
    setSaving(true);
    try {
      const updates = Object.entries(themeValues).map(([key, value]) => ({
        page_identifier: 'theme',
        section_key: key,
        content_value: value
      }));

      const res = await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates })
      });

      if (res.ok) {
        alert('Theme colors updated! Refresh the site to see changes.');
        loadContent();
      } else {
        alert('Failed to update theme.');
      }
    } catch (err) {
      console.error('Error saving theme:', err);
      alert('Error saving theme.');
    } finally {
      setSaving(false);
    }
  };

  const togglePage = (pageName: string) => {
    setExpandedPages(prev => ({ ...prev, [pageName]: !prev[pageName] }));
  };

  const getBasePage = (pageId: string) => {
    if (!pageId) return 'other';
    // Normalize: remove trailing underscores and get the first part
    const cleanId = pageId.replace(/_+$/, '');
    const parts = cleanId.split('_');
    if (parts.length > 1) {
      // Capitalize the first part for better display, or just return as is
      return parts[0].toLowerCase();
    }
    return pageId.toLowerCase();
  };

  const groupedContent = useMemo(() => {
    const groups: Record<string, SiteContentItem[]> = {};
    
    // Define all keys we want to ensure exist for the pricing page
    const wcuKeys = [
      { key: 'wcu_title', def: 'Why <span>Choose Us?</span>' },
      { key: 'wcu_subtitle', def: 'For a smooth process, we are with you every step of the way.' },
      { key: 'wcu_reason1_title', def: 'Profile & Listing' },
      { key: 'wcu_reason1_desc', def: 'Stand-out listings created across all the best channels ( including OnTheMarket ) and with a personal touch.' },
      { key: 'wcu_reason2_title', def: 'Professional Photography' },
      { key: 'wcu_reason2_desc', def: 'We also offer professional photography for your property to get noticed.' },
      { key: 'wcu_reason3_title', def: 'Sell your property quickly' },
      { key: 'wcu_reason3_desc', def: 'We market properties smartly. We aim to find a buyer within three to six weeks.' },
      { key: 'wcu_reason4_title', def: 'Fixed Price' },
      { key: 'wcu_reason4_desc', def: 'Simple packages with everything you need. Cheap, cheerful and no commission on the sale!' },
      { key: 'wcu_reason5_title', def: 'Millions of buyers' },
      { key: 'wcu_reason5_desc', def: 'Over 90% of buyers visit Rightmove, Zoopla and OnTheMarket. We will advertise your property on all the portals for the maximum exposure.' },
      { key: 'wcu_reason6_title', def: 'Account Management' },
      { key: 'wcu_reason6_desc', def: 'One point of contact for all of your queries with our dedicated account manager to ensure reliability and knowledge base' },
      { key: 'wcu_licence', def: 'AML Licence XFML00000191364' }
    ];

    const finalContent = [...content];
    
    if (selectedPage === 'all' || selectedPage === 'pricing') {
      wcuKeys.forEach(d => {
        const exists = content.some(c => c.page_identifier === 'pricing' && c.section_key === d.key);
        if (!exists) {
          finalContent.push({ 
            page_identifier: 'pricing', 
            section_key: d.key, 
            content_value: d.def 
          });
        }
      });
    }

    finalContent.forEach(item => {
      const basePage = getBasePage(item.page_identifier);
      
      if (selectedPage !== 'all' && basePage !== selectedPage) return;
      
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matches = 
          (item.page_identifier?.toLowerCase() || '').includes(query) ||
          (item.section_key?.toLowerCase() || '').includes(query) ||
          (item.content_value?.toLowerCase() || '').includes(query);
        if (!matches) return;
      }

      if (!groups[basePage]) groups[basePage] = [];
      groups[basePage].push(item);
    });
    return groups;
  }, [content, selectedPage, searchQuery]);

  const uniquePages = useMemo(() => {
    const pages = new Set<string>();
    content.forEach(c => pages.add(getBasePage(c.page_identifier)));
    return Array.from(pages).sort();
  }, [content]);

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>Loading CMS content...</div>;

  return (
    <div>
      <div className={styles.toolbar}>
        <h2 style={{ margin: 0, color: '#1e293b', fontSize: '1.25rem', marginRight: 20 }}>Page Content Editor</h2>
        <select 
          className={styles.filterSelect} 
          value={selectedPage} 
          onChange={(e) => setSelectedPage(e.target.value)}
        >
          <option value="all">View All Pages</option>
          {uniquePages.map(p => <option key={p} value={p}>{p.toUpperCase()}</option>)}
        </select>
        <div style={{ marginLeft: 15, flex: 1, position: 'relative' }}>
          <input 
            type="text"
            className={styles.searchInput}
            placeholder="Search content, keys, or pages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '10px 15px' }}
          />
        </div>
        <button 
          className={styles.btnGreen} 
          style={{ marginLeft: 15 }} 
          onClick={() => setShowThemeSettings(!showThemeSettings)}
        >
          {showThemeSettings ? 'Hide Theme' : '🎨 Theme Settings'}
        </button>
        <button 
          className={styles.btnGreen} 
          style={{ marginLeft: 15 }} 
          onClick={() => setIsAddModalOpen(true)}
        >
          + Add Content Block
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

      {showThemeSettings && (
        <div style={{ background: '#fff', padding: 25, borderRadius: 12, border: '1px solid #e2e8f0', marginBottom: 25, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ margin: 0, color: '#1e293b' }}>Global Brand & Theme Colors</h3>
            <button 
              className={styles.btnPurple} 
              disabled={saving}
              onClick={handleSaveTheme}
            >
              {saving ? 'Saving Theme...' : 'Apply Theme Colors'}
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 20 }}>
            <div className={styles.editField}>
              <label>Primary Color (Red)</label>
              <div style={{ display: 'flex', gap: 10 }}>
                <input type="color" value={themeValues.primary || '#e11d48'} onChange={e => setThemeValues(p => ({...p, primary: e.target.value}))} style={{ width: 50, height: 40, padding: 2 }} />
                <input type="text" value={themeValues.primary || ''} onChange={e => setThemeValues(p => ({...p, primary: e.target.value}))} style={{ flex: 1 }} />
              </div>
            </div>
            <div className={styles.editField}>
              <label>Secondary Color (Blue)</label>
              <div style={{ display: 'flex', gap: 10 }}>
                <input type="color" value={themeValues.secondary || '#1e3a8a'} onChange={e => setThemeValues(p => ({...p, secondary: e.target.value}))} style={{ width: 50, height: 40, padding: 2 }} />
                <input type="text" value={themeValues.secondary || ''} onChange={e => setThemeValues(p => ({...p, secondary: e.target.value}))} style={{ flex: 1 }} />
              </div>
            </div>
            <div className={styles.editField}>
              <label>Text Color (Foreground)</label>
              <div style={{ display: 'flex', gap: 10 }}>
                <input type="color" value={themeValues.foreground || '#0f172a'} onChange={e => setThemeValues(p => ({...p, foreground: e.target.value}))} style={{ width: 50, height: 40, padding: 2 }} />
                <input type="text" value={themeValues.foreground || ''} onChange={e => setThemeValues(p => ({...p, foreground: e.target.value}))} style={{ flex: 1 }} />
              </div>
            </div>
            <div className={styles.editField}>
              <label>Site Background</label>
              <div style={{ display: 'flex', gap: 10 }}>
                <input type="color" value={themeValues.background || '#ffffff'} onChange={e => setThemeValues(p => ({...p, background: e.target.value}))} style={{ width: 50, height: 40, padding: 2 }} />
                <input type="text" value={themeValues.background || ''} onChange={e => setThemeValues(p => ({...p, background: e.target.value}))} style={{ flex: 1 }} />
              </div>
            </div>
            <div className={styles.editField}>
              <label>Navy (Dark Text/BG)</label>
              <div style={{ display: 'flex', gap: 10 }}>
                <input type="color" value={themeValues.navy || '#0f172a'} onChange={e => setThemeValues(p => ({...p, navy: e.target.value}))} style={{ width: 50, height: 40, padding: 2 }} />
                <input type="text" value={themeValues.navy || ''} onChange={e => setThemeValues(p => ({...p, navy: e.target.value}))} style={{ flex: 1 }} />
              </div>
            </div>
          </div>
          <p style={{ marginTop: 15, fontSize: '0.85rem', color: '#64748b' }}>
            Note: Primary and Secondary light/dark variants are automatically derived for consistency, but you can add them manually in the "Theme" page identifier if needed.
          </p>
        </div>
      )}

      {isAddModalOpen && (
        <div className={styles.modalBackdrop} onClick={() => setIsAddModalOpen(false)}>
          <div className={styles.modal} style={{ maxWidth: 500 }} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Add New Content Block</h3>
              <button className={styles.modalClose} onClick={() => setIsAddModalOpen(false)}>✕</button>
            </div>
            <div className={styles.modalBody} style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
              <div className={styles.editField}>
                <label>Page Identifier (e.g. "pricing", "contact")</label>
                <input 
                  value={newBlock.page} 
                  onChange={e => setNewBlock(prev => ({ ...prev, page: e.target.value }))}
                  placeholder="pricing"
                />
              </div>
              <div className={styles.editField}>
                <label>Section Key (e.g. "wcu_title")</label>
                <input 
                  value={newBlock.key} 
                  onChange={e => setNewBlock(prev => ({ ...prev, key: e.target.value }))}
                  placeholder="wcu_title"
                />
              </div>
              <div className={styles.editField}>
                <label>Initial Content</label>
                <textarea 
                  value={newBlock.value} 
                  onChange={e => setNewBlock(prev => ({ ...prev, value: e.target.value }))}
                  rows={4}
                />
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.modalCancel} onClick={() => setIsAddModalOpen(false)}>Cancel</button>
              <button 
                className={styles.modalSave} 
                onClick={() => {
                  if (!newBlock.page || !newBlock.key) return alert('Page and Key are required');
                  setContent(prev => [...prev, { 
                    page_identifier: newBlock.page, 
                    section_key: newBlock.key, 
                    content_value: newBlock.value 
                  }]);
                  setEditValues(prev => ({ ...prev, [`${newBlock.page}:${newBlock.key}`]: newBlock.value }));
                  setIsAddModalOpen(false);
                  setNewBlock({ page: '', key: '', value: '' });
                  setSelectedPage(newBlock.page);
                }}
              >
                Add Block
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ marginTop: 20 }}>
        {Object.keys(groupedContent).length === 0 && (
          <div style={{ padding: 40, textAlign: 'center', background: '#fff', borderRadius: 8, border: '1px dashed #cbd5e1', color: '#64748b' }}>
            No content blocks found for the selected view.
          </div>
        )}

        {Object.entries(groupedContent).map(([pageId, items]) => (
          <div key={pageId} style={{ marginBottom: 20, background: '#fff', borderRadius: 8, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <div 
              style={{ padding: '16px 20px', background: '#f8fafc', display: 'flex', alignItems: 'center', cursor: 'pointer', borderBottom: expandedPages[pageId] ? '1px solid #e2e8f0' : 'none' }}
              onClick={() => togglePage(pageId)}
            >
              <span style={{ marginRight: 15, color: '#64748b', fontSize: '0.9rem' }}>
                {expandedPages[pageId] ? '▼' : '▶'}
              </span>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700', color: '#0f172a', textTransform: 'capitalize' }}>
                {pageId} Page
              </h3>
              <span style={{ marginLeft: 'auto', background: '#e2e8f0', color: '#475569', padding: '4px 10px', borderRadius: 20, fontSize: '0.85rem', fontWeight: 600 }}>
                {items.length} Text Blocks
              </span>
            </div>

            {expandedPages[pageId] && (
              <div style={{ padding: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: '20px' }}>
                  {items.map(item => {
                    const key = `${item.page_identifier}:${item.section_key}`;
                    return (
                      <div key={key} style={{ padding: '15px', background: '#fafafa', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                          <div>
                            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                              {item.page_identifier !== pageId ? `${item.page_identifier.replace(/_/g, ' ')} / ` : ''} 
                              {item.section_key.replace(/_/g, ' ')}
                            </span>
                          </div>
                          <span style={{ background: '#f1f5f9', color: '#64748b', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontFamily: 'monospace', border: '1px solid #e2e8f0' }}>
                            {item.page_identifier}:{item.section_key}
                          </span>
                        </div>
                        <textarea 
                          style={{ 
                            width: '100%', 
                            minHeight: 100, 
                            resize: 'vertical', 
                            padding: '12px 14px',
                            fontSize: '0.95rem',
                            lineHeight: '1.6',
                            fontFamily: 'inherit',
                            color: '#334155',
                            border: '1px solid #cbd5e1',
                            borderRadius: '6px',
                            background: '#fff',
                            outline: 'none',
                            boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.02)',
                            boxSizing: 'border-box',
                            transition: 'border-color 0.15s ease'
                          }}
                          value={editValues[key] !== undefined ? editValues[key] : (item.content_value || '')}
                          onChange={(e) => setEditValues(prev => ({ ...prev, [key]: e.target.value }))}
                          onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                          onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
