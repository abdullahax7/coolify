"use client";

import styles from '../admin.module.css';

interface ConfirmModalProps {
  title: string;
  body: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({ title, body, confirmLabel = 'Delete', onConfirm, onCancel }: ConfirmModalProps) {
  return (
    <div className={styles.modalBackdrop} onClick={onCancel}>
      <div className={styles.modal} style={{ maxWidth: 440 }} onClick={e => e.stopPropagation()}>
        <div className={styles.warnModalBody}>
          <div className={styles.warnIcon}>⚠️</div>
          <h2 className={styles.warnTitle}>{title}</h2>
          <p className={styles.warnBody}>{body}</p>
          <div className={styles.warnActions}>
            <button className={styles.warnCancel} onClick={onCancel}>Cancel</button>
            <button className={styles.warnConfirm} onClick={onConfirm}>{confirmLabel}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
