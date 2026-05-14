"use client";

import { useEffect, useState, useMemo } from 'react';
import ConfirmModal from './ConfirmModal';
import styles from '../admin.module.css';

interface TrashItem {
  table: string;
  tableLabel: string;
  id: string;
  name: string;
  deleted_at: string;
  daysUntilPurge: number;
}

type PendingAction = { item: TrashItem; action: 'restore' | 'purge' } | null;

export default function TrashTab() {
  const [items, setItems] = useState<TrashItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState<PendingAction>(null);
  const [filter, setFilter] = useState<string>('all');
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/trash', { cache: 'no-store' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load trash');
      setItems(data.items ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const tableOptions = useMemo(() => {
    const set = new Map<string, string>();
    items.forEach(i => set.set(i.table, i.tableLabel));
    return Array.from(set.entries());
  }, [items]);

  const filtered = useMemo(() => {
    return filter === 'all' ? items : items.filter(i => i.table === filter);
  }, [items, filter]);

  const performAction = async (item: TrashItem, action: 'restore' | 'purge') => {
    setBusyId(`${item.table}:${item.id}`);
    try {
      const res = await fetch('/api/admin/trash', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ table: item.table, id: item.id, action }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `Failed to ${action}`);
      // Optimistic: drop from list (whether restored or purged, it leaves trash).
      setItems(prev => prev.filter(i => !(i.table === item.table && i.id === item.id)));
      load();
    } catch (e) {
      alert((e instanceof Error ? e.message : 'Unknown error'));
    } finally {
      setBusyId(null);
      setPending(null);
    }
  };

  const formatDeletedAt = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div>
      <div className={styles.toolbar}>
        <div className={styles.toolbarCount}>
          {loading ? 'Loading…' : `${filtered.length} item${filtered.length === 1 ? '' : 's'} in trash`}
        </div>
        <select
          value={filter}
          onChange={e => setFilter(e.target.value)}
          style={{
            padding: '8px 12px',
            borderRadius: 6,
            border: '1px solid #d1d5db',
            background: '#fff',
            fontSize: 14,
          }}
        >
          <option value="all">All ({items.length})</option>
          {tableOptions.map(([table, label]) => (
            <option key={table} value={table}>
              {label} ({items.filter(i => i.table === table).length})
            </option>
          ))}
        </select>
        <button className={`${styles.btn} ${styles.btnInfo}`} onClick={load} disabled={loading}>
          ↻ Refresh
        </button>
      </div>

      <div style={{
        background: '#fef3c7',
        border: '1px solid #fbbf24',
        borderRadius: 8,
        padding: '12px 16px',
        margin: '0 0 16px',
        fontSize: 14,
        color: '#78350f',
      }}>
        ℹ️ Items in trash are <strong>auto-purged after 30 days</strong>. Restore returns them to where they were. Permanent Delete removes them immediately.
      </div>

      {error && (
        <div style={{
          background: '#fee2e2',
          border: '1px solid #fca5a5',
          borderRadius: 8,
          padding: '12px 16px',
          margin: '0 0 16px',
          color: '#7f1d1d',
        }}>
          Error: {error}
        </div>
      )}

      {!loading && filtered.length === 0 && !error && (
        <div className={styles.emptyState}>
          <span>🗑️</span>
          <p>{filter === 'all' ? 'Trash is empty.' : 'Nothing of that type in trash.'}</p>
        </div>
      )}

      {filtered.length > 0 && (
        <div className={styles.submissionCards}>
          {filtered.map(item => {
            const rowKey = `${item.table}:${item.id}`;
            const busy = busyId === rowKey;
            return (
              <div key={rowKey} className={styles.submissionCard}>
                <div className={styles.submissionCardTop}>
                  <div>
                    <div className={styles.submissionAddr}>
                      <span style={{
                        display: 'inline-block',
                        fontSize: 11,
                        padding: '2px 8px',
                        borderRadius: 4,
                        background: '#e0e7ff',
                        color: '#3730a3',
                        marginRight: 8,
                        fontWeight: 600,
                      }}>{item.tableLabel}</span>
                      {item.name}
                    </div>
                    <div className={styles.submissionMeta}>
                      Deleted {formatDeletedAt(item.deleted_at)} ·{' '}
                      <span style={{ color: item.daysUntilPurge <= 7 ? '#b91c1c' : '#6b7280' }}>
                        {item.daysUntilPurge === 0 ? 'Purges anytime now' : `${item.daysUntilPurge} day${item.daysUntilPurge === 1 ? '' : 's'} until purge`}
                      </span>
                    </div>
                    <div className={styles.submissionDate} style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>
                      ID: {item.id}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    <button
                      className={`${styles.btn} ${styles.btnInfo}`}
                      onClick={() => setPending({ item, action: 'restore' })}
                      disabled={busy}
                    >
                      ↩ Restore
                    </button>
                    <button
                      className={`${styles.btn} ${styles.btnDanger}`}
                      onClick={() => setPending({ item, action: 'purge' })}
                      disabled={busy}
                    >
                      🗑 Delete Forever
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {pending && pending.action === 'restore' && (
        <ConfirmModal
          title="Restore item?"
          body={`Restore "${pending.item.name}" (${pending.item.tableLabel})? It will reappear in the relevant section as if it was never deleted.`}
          confirmLabel="Yes, Restore"
          onConfirm={() => performAction(pending.item, 'restore')}
          onCancel={() => setPending(null)}
        />
      )}
      {pending && pending.action === 'purge' && (
        <ConfirmModal
          title="Permanently delete?"
          body={`This will PERMANENTLY delete "${pending.item.name}" (${pending.item.tableLabel}). This cannot be undone.`}
          confirmLabel="Delete Forever"
          onConfirm={() => performAction(pending.item, 'purge')}
          onCancel={() => setPending(null)}
        />
      )}
    </div>
  );
}
