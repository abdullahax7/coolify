"use client";

import { useState } from 'react';
import ConfirmModal from './ConfirmModal';
import styles from '../admin.module.css';

export interface Message {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  receivedAt: string;
  read: boolean;
}

function ContactItem({ icon, label, value, href }: { icon: string; label: string; value: string; href?: string }) {
  return (
    <div className={styles.contactItem}>
      <span>{icon}</span>
      <div>
        <div className={styles.contactLabel}>{label}</div>
        <div className={styles.contactValue}>
          {href && value ? <a href={href}>{value}</a> : (value || '—')}
        </div>
      </div>
    </div>
  );
}

interface MessagesTabProps {
  messages: Message[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onDelete: (id: string) => void;
}

export default function MessagesTab({ messages, onMarkRead, onMarkAllRead, onDelete }: MessagesTabProps) {
  const [selected, setSelected] = useState<Message | null>(null);
  const [warn, setWarn]         = useState<Message | null>(null);
  const [warnAll, setWarnAll]   = useState(false);

  const select = (m: Message) => { setSelected(m); if (!m.read) onMarkRead(m.id); };

  return (
    <div>
      <div className={styles.toolbar}>
        <div className={styles.toolbarCount}>{messages.length} messages · {messages.filter(m => !m.read).length} unread</div>
        {messages.some(m => !m.read) && (
          <button className={`${styles.btn} ${styles.btnInfo}`} onClick={onMarkAllRead}>Mark all read</button>
        )}
        {messages.length > 0 && (
          <button className={`${styles.btn} ${styles.btnDanger}`} onClick={() => setWarnAll(true)}>Delete all</button>
        )}
      </div>

      <div className={styles.splitView}>
        <div className={styles.splitLeft}>
          {messages.length === 0 ? (
            <div className={styles.emptyState}><span>✉️</span><p>No messages yet.</p></div>
          ) : (
            <div className={styles.submissionCards}>
              {messages.map(m => (
                <div key={m.id}
                  className={`${styles.submissionCard} ${selected?.id === m.id ? styles.submissionCardActive : ''} ${!m.read ? styles.unreadCard : ''}`}
                  onClick={() => select(m)}>
                  <div className={styles.submissionCardTop}>
                    <div>
                      <div className={styles.submissionAddr}>{!m.read && <span className={styles.unreadDot} />} {m.name}</div>
                      <div className={styles.submissionMeta}>{m.subject || '(no subject)'}</div>
                    </div>
                    <span className={styles.msgDate}>{new Date(m.receivedAt).toLocaleDateString('en-GB')}</span>
                  </div>
                  <div className={styles.submissionDate}>{m.email}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.splitRight}>
          {!selected ? (
            <div className={styles.emptyState}><span>👈</span><p>Select a message.</p></div>
          ) : (
            <div className={styles.detailPanel}>
              <div className={styles.detailHeader}><h2>{selected.subject || '(no subject)'}</h2></div>
              <div className={styles.contactBlock}>
                <h4>Sender</h4>
                <div className={styles.contactGrid}>
                  <ContactItem icon="👤" label="Name"     value={selected.name} />
                  <ContactItem icon="✉️" label="Email"    value={selected.email} href={`mailto:${selected.email}`} />
                  {selected.phone && <ContactItem icon="📞" label="Phone" value={selected.phone} href={`tel:${selected.phone}`} />}
                  <ContactItem icon="📅" label="Received" value={new Date(selected.receivedAt).toLocaleString('en-GB')} />
                </div>
              </div>
              <div className={styles.msgBody}>{selected.message}</div>
              <div className={styles.crudBar}>
                <a href={`mailto:${selected.email}?subject=Re: ${selected.subject}`} className={`${styles.btn} ${styles.btnInfo}`}>✉️ Reply</a>
                {selected.phone && <a href={`tel:${selected.phone}`} className={`${styles.btn} ${styles.btnInfo}`}>📞 Call</a>}
                <button className={`${styles.btn} ${styles.btnDanger}`} onClick={() => setWarn(selected)}>🗑️ Delete</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {warn && (
        <ConfirmModal
          title="Delete Message?"
          body={`Delete message from "${warn.name}" (${warn.email})? This cannot be undone.`}
          confirmLabel="Yes, Delete"
          onConfirm={() => { onDelete(warn.id); setSelected(null); setWarn(null); }}
          onCancel={() => setWarn(null)}
        />
      )}
      {warnAll && (
        <ConfirmModal
          title="Delete ALL Messages?"
          body={`This will permanently delete all ${messages.length} messages. This cannot be undone.`}
          confirmLabel="Delete All"
          onConfirm={() => { messages.forEach(m => onDelete(m.id)); setSelected(null); setWarnAll(false); }}
          onCancel={() => setWarnAll(false)}
        />
      )}
    </div>
  );
}
