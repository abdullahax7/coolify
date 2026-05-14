"use client";

import { useState } from 'react';
import styles from '../admin.module.css';

interface RejectModalProps {
  propertyName?: string;
  onConfirm: (reason: string) => void;
  onCancel: () => void;
}

export default function RejectModal({ propertyName, onConfirm, onCancel }: RejectModalProps) {
  const [reason, setReason] = useState('');
  const trimmed = reason.trim();

  return (
    <div className={styles.modalBackdrop} onClick={onCancel}>
      <div className={styles.modal} style={{ maxWidth: 480 }} onClick={e => e.stopPropagation()}>
        <div className={styles.warnModalBody}>
          <div className={styles.warnIcon}>⚠️</div>
          <h2 className={styles.warnTitle}>Reject this property?</h2>
          <p className={styles.warnBody}>
            {propertyName ? <>You are rejecting <strong>{propertyName}</strong>.</> : 'You are rejecting this listing.'}{' '}
            Tell the owner why so they can fix it.
          </p>

          <textarea
            value={reason}
            onChange={e => setReason(e.target.value)}
            placeholder="e.g. Photos are blurry. Please re-upload with better lighting."
            rows={4}
            style={{
              width: '100%',
              marginTop: 12,
              marginBottom: 12,
              padding: '12px 14px',
              borderRadius: 8,
              border: '2px solid #e2e8f0',
              fontSize: 14,
              fontFamily: 'inherit',
              resize: 'vertical',
              minHeight: 90,
              outline: 'none',
            }}
            onFocus={e => (e.target.style.borderColor = '#e11d48')}
            onBlur={e => (e.target.style.borderColor = '#e2e8f0')}
            autoFocus
          />

          <div className={styles.warnActions}>
            <button className={styles.warnCancel} onClick={onCancel}>Cancel</button>
            <button
              className={styles.warnConfirm}
              onClick={() => onConfirm(trimmed)}
              disabled={trimmed.length < 4}
              style={trimmed.length < 4 ? { opacity: 0.5, cursor: 'not-allowed' } : undefined}
            >
              Reject Property
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
