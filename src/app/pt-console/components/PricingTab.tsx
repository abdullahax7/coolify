"use client";

import React, { useState, useEffect } from 'react';
import styles from '../admin.module.css';


interface Overrides {
  [key: string]: string;
}

const PLANS = [
  { type: 'sell', name: 'Basic' },
  { type: 'sell', name: 'Silver' },
  { type: 'sell', name: 'Gold' },
  { type: 'sell', name: 'Ultimate' },
  { type: 'let', name: 'Basic' },
  { type: 'let', name: 'Essential' },
  { type: 'let', name: 'Premium' },
];

export default function PricingTab() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [overrides, setOverrides] = useState<Overrides>({});

  useEffect(() => {
    loadPricing();
  }, []);

  const loadPricing = async () => {
    try {
      const res = await fetch('/api/content?page=pricing');
      const data = await res.json();
      if (data.content) {
        const mapped: Overrides = {};
        data.content.forEach((item: { section_key: string, content_value: string }) => {
          mapped[item.section_key] = item.content_value;
        });
        setOverrides(mapped);
      }
    } catch (err) {
      console.error('Failed to load pricing:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updates = Object.entries(overrides).map(([key, val]) => ({
        page_identifier: 'pricing',
        section_key: key,
        content_value: val
      }));

      const res = await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates })
      });

      if (res.ok) {
        alert('Pricing updated successfully!');
        loadPricing();
      } else {
        alert('Failed to update pricing.');
      }
    } catch (err) {
      console.error('Error saving pricing:', err);
      alert('Error saving pricing.');
    } finally {
      setSaving(false);
    }
  };

  const update = (key: string, val: string) => {
    setOverrides(prev => ({ ...prev, [key]: val }));
  };

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>Loading pricing data...</div>;

  return (
    <div>
      <div className={styles.toolbar}>
        <h2 style={{ margin: 0, color: '#1e293b', fontSize: '1.5rem', fontWeight: 900 }}>Listing Pricing Manager</h2>
      </div>

      <button 
        className={styles.btnPurple} 
        style={{ 
          width: '100%', 
          marginBottom: '32px', 
          height: '48px', 
          borderRadius: '8px',
          textTransform: 'uppercase', 
          letterSpacing: '0.05em',
          fontSize: '0.9rem'
        }} 
        disabled={saving}
        onClick={handleSave}
      >
        {saving ? 'Saving...' : 'Save Pricing Changes'}
      </button>

      <div style={{ 
        marginTop: 0, 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', 
        gap: '24px',
        paddingBottom: '40px'
      }}>
        {PLANS.map(plan => {
          const baseKey = `${plan.type}_${plan.name.toLowerCase()}`;
          return (
            <div key={baseKey} style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', gap: '12px' }}>
                <span style={{ 
                  background: plan.type === 'sell' ? '#fdf2f2' : '#f0f9ff', 
                  color: plan.type === 'sell' ? '#991b1b' : '#075985',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase'
                }}>
                  {plan.type}
                </span>
                <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#1e293b' }}>{plan.name} Plan</h3>
              </div>

              <div style={{ display: 'grid', gap: '16px' }}>
                <div className={styles.field}>
                  <label style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Display Price</label>
                  <input 
                    type="text" 
                    className={styles.input}
                    style={{ width: '100%', boxSizing: 'border-box' }}
                    placeholder="e.g. £299"
                    value={overrides[`${baseKey}_price`] || ''}
                    onChange={(e) => update(`${baseKey}_price`, e.target.value)}
                  />
                </div>

                <div className={styles.field}>
                  <label style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Subtitle / Duration</label>
                  <input 
                    type="text" 
                    className={styles.input}
                    style={{ width: '100%', boxSizing: 'border-box' }}
                    placeholder="e.g. 6 Months Advertising"
                    value={overrides[`${baseKey}_subtitle`] || ''}
                    onChange={(e) => update(`${baseKey}_subtitle`, e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', gap: '16px' }}>
                  <div className={styles.field} style={{ flex: 1 }}>
                    <label style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Popular Badge</label>
                    <select 
                      className={styles.input}
                      style={{ width: '100%', boxSizing: 'border-box', height: '40px' }}
                      value={overrides[`${baseKey}_popular`] || 'false'}
                      onChange={(e) => update(`${baseKey}_popular`, e.target.value)}
                    >
                      <option value="false">Standard</option>
                      <option value="true">Popular (Show Badge)</option>
                    </select>
                  </div>
                  <div className={styles.field} style={{ flex: 1 }}>
                    <label style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Badge Text</label>
                    <input 
                      type="text" 
                      className={styles.input}
                      style={{ width: '100%', boxSizing: 'border-box' }}
                      placeholder="e.g. Best Value"
                      value={overrides[`${baseKey}_highlight`] || ''}
                      onChange={(e) => update(`${baseKey}_highlight`, e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              <div style={{ marginTop: '20px', paddingTop: '15px', borderTop: '1px dashed #e2e8f0', fontSize: '0.8rem', color: '#94a3b8' }}>
                Database Key: <code style={{ color: '#6366f1' }}>{baseKey}_price</code>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
