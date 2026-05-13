"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './dashboard.module.css';

interface PropDoc {
  id: string;
  document_type: string;
  status: string;
  expiry_date?: string;
  file_url?: string;
  file_name?: string;
}

interface PropertyViewerModalProps {
  property: {
    id: string;
    title: string;
    location: string;
    price: string;
    beds: string | number;
    baths: string | number;
    sqft: string | number;
    sector: string;
    image_url?: string;
    description?: string;
  };
  onClose: () => void;
}

export default function PropertyViewerModal({ property, onClose }: PropertyViewerModalProps) {
  const [docs, setDocs] = useState<PropDoc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/documents?propertyId=${property.id}`);
        if (res.ok) {
          const data = await res.json();
          setDocs(data.documents || []);
        }
      } catch (err) {
        console.error("Failed to fetch docs", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [property.id]);

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modal} style={{ maxWidth: '900px', width: '95%' }} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Property Details (Read Only)</h2>
          <button className={styles.modalClose} onClick={onClose}>✕</button>
        </div>

        <div className={styles.modalBody}>
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            {property.image_url ? (
              <div style={{ flex: '1', minWidth: '300px', position: 'relative', height: '240px' }}>
                <Image src={property.image_url} alt={property.title} fill style={{ borderRadius: '12px', objectFit: 'cover' }} unoptimized />
              </div>
            ) : (
              <div style={{ flex: '1', minWidth: '300px', height: '240px', background: '#f1f5f9', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>🏠</div>
            )}

            <div style={{ flex: '1.5', minWidth: '300px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--secondary)' }}>{property.title}</h1>
                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>{property.price}</span>
              </div>
              <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>{property.location}</p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', background: '#f8fafc', padding: '20px', borderRadius: '12px' }}>
                <div>
                  <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 700 }}>Bedrooms</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{property.beds}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 700 }}>Bathrooms</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{property.baths}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 700 }}>Area</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{property.sqft} sq ft</div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '30px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '12px' }}>Description</h3>
            <p style={{ color: '#475569', lineHeight: 1.6, fontSize: '0.95rem', whiteSpace: 'pre-wrap' }}>
              {property.description || 'No description provided for this property.'}
            </p>
          </div>

          <div style={{ marginTop: '30px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              📂 Legal Documents & Certifications
            </h3>
            
            {loading ? (
              <div style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>Loading documents...</div>
            ) : docs.length === 0 ? (
              <div style={{ padding: '24px', background: '#f8fafc', borderRadius: '12px', textAlign: 'center', border: '1px dashed #e2e8f0' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>📄</div>
                <div style={{ color: '#64748b', fontSize: '0.9rem' }}>No documents uploaded for this property yet.</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {docs.map(doc => (
                  <div key={doc.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ fontSize: '1.25rem' }}>📄</div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{doc.document_type}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                          Uploaded: {doc.expiry_date ? `Expires ${doc.expiry_date}` : 'N/A'}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ 
                        fontSize: '0.7rem', 
                        fontWeight: 800, 
                        padding: '3px 8px', 
                        borderRadius: '99px', 
                        background: doc.status === 'Current' ? '#dcfce7' : '#fee2e2',
                        color: doc.status === 'Current' ? '#16a34a' : '#b91c1c'
                      }}>
                        {doc.status.toUpperCase()}
                      </span>
                      {doc.file_url && (
                        <a 
                          href={doc.file_url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          style={{ background: 'var(--primary)', color: 'white', padding: '6px 12px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700, textDecoration: 'none' }}
                        >
                          Download
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.modalCancel} onClick={onClose}>Close Viewer</button>
        </div>
      </div>
    </div>
  );
}
