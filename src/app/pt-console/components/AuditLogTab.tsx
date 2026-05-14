"use client";

import { useEffect, useState, useMemo } from 'react';
import styles from '../admin.module.css';

interface AuditEntry {
  id: string;
  admin_id: string | null;
  admin_email: string | null;
  action: string;
  target_table: string;
  target_id: string | null;
  target_name: string | null;
  ip: string | null;
  user_agent: string | null;
  created_at: string;
}

const ACTIONS = ['create', 'update', 'delete', 'restore', 'approve', 'reject', 'login'];
const TABLES = [
  'custom_properties', 'orders', 'messages', 'cash_inquiries', 'appointments',
  'tenancies', 'tenancy_forms', 'property_documents', 'wales_forms',
];

export default function AuditLogTab() {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterAction, setFilterAction] = useState('');
  const [filterTable, setFilterTable] = useState('');

  const load = async () => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams({ limit: '200' });
    if (filterAction) params.set('action', filterAction);
    if (filterTable) params.set('table', filterTable);
    try {
      const res = await fetch(`/api/admin/audit-log?${params}`, { cache: 'no-store' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load');
      setEntries(data.entries ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [filterAction, filterTable]);

  const actionColor = (a: string) => {
    if (a === 'delete') return { bg: '#fee2e2', fg: '#991b1b' };
    if (a === 'restore') return { bg: '#dbeafe', fg: '#1e40af' };
    if (a === 'approve') return { bg: '#dcfce7', fg: '#166534' };
    if (a === 'reject') return { bg: '#fef3c7', fg: '#92400e' };
    if (a === 'create') return { bg: '#e0e7ff', fg: '#3730a3' };
    return { bg: '#f3f4f6', fg: '#374151' };
  };

  const formatDate = (iso: string) => new Date(iso).toLocaleString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  return (
    <div>
      <div className={styles.toolbar}>
        <div className={styles.toolbarCount}>
          {loading ? 'Loading…' : `${entries.length} audit ${entries.length === 1 ? 'entry' : 'entries'}`}
        </div>
        <select
          value={filterAction}
          onChange={e => setFilterAction(e.target.value)}
          style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #d1d5db', background: '#fff', fontSize: 14 }}
        >
          <option value="">All actions</option>
          {ACTIONS.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
        <select
          value={filterTable}
          onChange={e => setFilterTable(e.target.value)}
          style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #d1d5db', background: '#fff', fontSize: 14 }}
        >
          <option value="">All tables</option>
          {TABLES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <button className={`${styles.btn} ${styles.btnInfo}`} onClick={load} disabled={loading}>↻ Refresh</button>
      </div>

      {error && (
        <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 8, padding: '12px 16px', margin: '0 0 16px', color: '#7f1d1d' }}>
          Error: {error}
        </div>
      )}

      {!loading && entries.length === 0 && !error && (
        <div className={styles.emptyState}><span>📋</span><p>No audit entries{filterAction || filterTable ? ' match those filters' : ' yet'}.</p></div>
      )}

      {entries.length > 0 && (
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                  <th style={th}>When</th>
                  <th style={th}>Admin</th>
                  <th style={th}>Action</th>
                  <th style={th}>Target</th>
                  <th style={th}>IP</th>
                </tr>
              </thead>
              <tbody>
                {entries.map(e => {
                  const c = actionColor(e.action);
                  return (
                    <tr key={e.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={td}>{formatDate(e.created_at)}</td>
                      <td style={td}>{e.admin_email || <em style={{ color: '#9ca3af' }}>system</em>}</td>
                      <td style={td}>
                        <span style={{ background: c.bg, color: c.fg, padding: '2px 10px', borderRadius: 4, fontSize: 12, fontWeight: 600 }}>
                          {e.action}
                        </span>
                      </td>
                      <td style={td}>
                        <div style={{ fontSize: 12, color: '#6b7280' }}>{e.target_table}</div>
                        <div style={{ fontWeight: 500 }}>{e.target_name || e.target_id || '—'}</div>
                      </td>
                      <td style={{ ...td, fontSize: 12, color: '#9ca3af' }}>{e.ip || '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

const th: React.CSSProperties = { padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: '#475569', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em' };
const td: React.CSSProperties = { padding: '12px 16px', verticalAlign: 'top' };
