"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { PROPERTIES, type Property } from '@/data/properties';
import styles from './admin.module.css';

/* ═══════════════════════════════ TYPES ═══════════════════════════════ */
interface AdminSession { loggedIn: boolean; at: string; }
interface Order {
  id: string; type: 'listing' | 'service'; name: string;
  price: string; detail: string; date: string; status: string;
  customerName: string; customerEmail: string; customerPhone: string;
}
interface Submission {
  id: string; address: string; postcode: string; type: string;
  beds: string; baths: string; sqft: string; price: string;
  description: string; features: string; submittedAt: string; status: string;
  contactName: string; contactEmail: string; contactPhone: string;
}
interface Message {
  id: string; name: string; email: string; phone: string;
  subject: string; message: string; receivedAt: string; read: boolean;
}
interface PropOverride { hidden?: boolean; featured?: boolean; notes?: string; }
interface CustomProp {
  id: string; title: string; location: string; price: string;
  beds: string; baths: string; sqft: string; type: string;
  sector: string; status: string; createdAt: string; notes: string;
  image: string; gallery: string; mapEmbedUrl: string;
  description: string; features: string;
  interior: string; exterior: string;
}
interface PropertyDocument {
  id: string;
  propertyId: string;
  propertyName: string;
  documentType: string;
  expiryDate: string;
  dateUploaded: string;
  status: 'Current' | 'Expiring' | 'Expired';
  fileBase64?: string;
  fileName?: string;
}
interface Tenancy {
  id: string;
  propertyId: string;
  propertyName: string;
  startDate: string;
  endDate: string;
  rentAmount: string;
  rentFrequency: 'Monthly' | 'Weekly' | 'Quarterly';
  rentDay: string;
  depositAmount: string;
  tenantName: string;
  tenantEmail: string;
  tenantPhone: string;
  agreementFile?: { name: string; base64: string };
  status: 'Active' | 'Pending' | 'Ended';
  createdAt: string;
}

const ADMIN_EMAIL = 'admin@propertytrader1.co.uk';
const ADMIN_PASS  = 'PTAdmin2024';
const SESSION_KEY = 'pt_adm_sess';

type Tab = 'overview' | 'properties' | 'submissions' | 'listing-plans' | 'services' | 'messages' | 'documents' | 'tenants';

/* ═══════════════════════════════ LS HELPERS ═══════════════════════════════ */
function ls<T>(key: string, fb: T): T {
  if (typeof window === 'undefined') return fb;
  try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : fb; } catch { return fb; }
}
function lsSet(key: string, v: unknown) {
  try { localStorage.setItem(key, JSON.stringify(v)); } catch { /* ignore */ }
}
function uid() { return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`; }
function today() { return new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }); }

/* ═══════════════════════════════ ROOT ═══════════════════════════════ */
export default function AdminPanel() {
  const [authed, setAuthed]       = useState(false);
  const [ready, setReady]         = useState(false);
  const [tab, setTab]             = useState<Tab>('overview');

  useEffect(() => {
    const s = ls<AdminSession | null>(SESSION_KEY, null);
    if (s?.loggedIn) setAuthed(true);
    setReady(true);
  }, []);

  if (!ready) return null;
  if (!authed) return (
    <AdminLogin
      onLogin={() => { lsSet(SESSION_KEY, { loggedIn: true, at: new Date().toISOString() }); setAuthed(true); }}
    />
  );
  return <Shell tab={tab} setTab={setTab} onLogout={() => { localStorage.removeItem(SESSION_KEY); setAuthed(false); }} />;
}

/* ═══════════════════════════════ LOGIN ═══════════════════════════════ */
function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('');
  const [pass, setPass]   = useState('');
  const [err, setErr]     = useState('');
  const [busy, setBusy]   = useState(false);
  const [show, setShow]   = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault(); setErr('');
    if (email === ADMIN_EMAIL && pass === ADMIN_PASS) { setBusy(true); setTimeout(onLogin, 700); }
    else setErr('Invalid credentials. Please try again.');
  };
  return (
    <div className={styles.loginPage}>
      <div className={styles.loginCard}>
        <div className={styles.loginBrand}>
          <span className={styles.loginLock}>🔐</span>
          <div className={styles.loginBrandName}>PROPERTY <span>TRADER</span></div>
          <p>Staff Access Only</p>
        </div>
        <form onSubmit={submit} className={styles.loginForm} noValidate>
          <div className={styles.loginField}>
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="admin@…" disabled={busy} autoComplete="username" />
          </div>
          <div className={styles.loginField}>
            <label>Password</label>
            <div className={styles.passWrap}>
              <input type={show ? 'text' : 'password'} value={pass} onChange={e => setPass(e.target.value)}
                placeholder="••••••••" disabled={busy} autoComplete="current-password" />
              <button type="button" className={styles.showPass} onClick={() => setShow(s => !s)} tabIndex={-1}>
                {show ? '🙈' : '👁️'}
              </button>
            </div>
          </div>
          {err && <div className={styles.loginErr}>⚠️ {err}</div>}
          <button type="submit" className={styles.loginBtn} disabled={busy}>
            {busy ? <span className={styles.spinner} /> : 'Sign In →'}
          </button>
        </form>
        <Link href="/" className={styles.loginBack}>← Back to site</Link>
      </div>
    </div>
  );
}

/* ═══════════════════════════════ SHELL ═══════════════════════════════ */
function Shell({ tab, setTab, onLogout }: { tab: Tab; setTab: (t: Tab) => void; onLogout: () => void; }) {
  const [orders,      setOrders]      = useState<Order[]>([]);
  const [submissions, setSubs]        = useState<Submission[]>([]);
  const [messages,    setMessages]    = useState<Message[]>([]);
  const [overrides,   setOverrides]   = useState<Record<string, PropOverride>>({});
  const [customProps, setCustomProps] = useState<CustomProp[]>([]);
  const [documents,   setDocuments]   = useState<PropertyDocument[]>([]);
  const [tenancies,   setTenancies]   = useState<Tenancy[]>([]);
  const [initTenancy, setInitTenancy] = useState<string | null>(null);
  const [initDocPropId, setInitDocPropId] = useState<string | null>(null);
  const [viewingPropId, setViewingPropId] = useState<string | null>(null);

  useEffect(() => {
    setOrders(ls('pt_orders', []));
    setSubs(ls('pt_submissions', []));
    setMessages(ls('pt_messages', []));
    setOverrides(ls('pt_prop_overrides', {}));
    setCustomProps(ls('pt_custom_props', []));
    setDocuments(ls('pt_documents', []));
    setTenancies(ls('pt_tenancies', []));
  }, []);

  /* Orders CRUD */
  const saveOrders = (next: Order[]) => { lsSet('pt_orders', next); setOrders(next); };
  const createOrder = (o: Omit<Order, 'id' | 'date'>) => saveOrders([{ ...o, id: `ORD-${uid()}`, date: today() }, ...orders]);
  const updateOrder = (upd: Order) => saveOrders(orders.map(o => o.id === upd.id ? upd : o));
  const deleteOrder = (id: string) => saveOrders(orders.filter(o => o.id !== id));

  /* Submissions CRUD */
  const saveSubs = (next: Submission[]) => { lsSet('pt_submissions', next); setSubs(next); };
  const createSub = (s: Omit<Submission, 'id' | 'submittedAt' | 'status'>) =>
    saveSubs([{ ...s, id: uid(), submittedAt: today(), status: 'pending' }, ...submissions]);
  const updateSub = (upd: Submission) => saveSubs(submissions.map(s => s.id === upd.id ? upd : s));
  const deleteSub = (id: string) => saveSubs(submissions.filter(s => s.id !== id));

  /* Messages CRUD */
  const saveMsgs = (next: Message[]) => { lsSet('pt_messages', next); setMessages(next); };
  const markRead = (id: string) => saveMsgs(messages.map(m => m.id === id ? { ...m, read: true } : m));
  const markAllRead = () => saveMsgs(messages.map(m => ({ ...m, read: true })));
  const deleteMsg = (id: string) => saveMsgs(messages.filter(m => m.id !== id));

  /* Property overrides */
  const saveOverride = (id: string, patch: Partial<PropOverride>) => {
    const next = { ...overrides, [id]: { ...(overrides[id] ?? {}), ...patch } };
    lsSet('pt_prop_overrides', next); setOverrides(next);
  };

  /* Custom properties CRUD */
  const saveCustom = (next: CustomProp[]) => { lsSet('pt_custom_props', next); setCustomProps(next); };
  const createCustom = (c: Omit<CustomProp, 'id' | 'createdAt'>) =>
    saveCustom([{ ...c, id: `CUSTOM-${uid()}`, createdAt: today() }, ...customProps]);
  const updateCustom = (upd: CustomProp) => saveCustom(customProps.map(c => c.id === upd.id ? upd : c));
  const deleteCustom = (id: string) => saveCustom(customProps.filter(c => c.id !== id));

  /* Documents CRUD */
  const saveDocs = (next: PropertyDocument[]) => { lsSet('pt_documents', next); setDocuments(next); };
  const createDoc = (d: Omit<PropertyDocument, 'id' | 'dateUploaded'>) =>
    saveDocs([{ ...d, id: `DOC-${uid()}`, dateUploaded: today() }, ...documents]);
  const updateDoc = (upd: PropertyDocument) => saveDocs(documents.map(d => d.id === upd.id ? upd : d));
  const deleteDoc = (id: string) => saveDocs(documents.filter(d => d.id !== id));

  /* Tenancies CRUD */
  const saveTenancies = (next: Tenancy[]) => { lsSet('pt_tenancies', next); setTenancies(next); };
  const createTenancy = (t: Omit<Tenancy, 'id' | 'createdAt'>) =>
    saveTenancies([{ ...t, id: `TEN-${uid()}`, createdAt: today() }, ...tenancies]);
  const updateTenancy = (upd: Tenancy) => saveTenancies(tenancies.map(t => t.id === upd.id ? upd : t));
  const deleteTenancy = (id: string) => saveTenancies(tenancies.filter(t => t.id !== id));

  const unread       = messages.filter(m => !m.read).length;
  const listingOrders = orders.filter(o => o.type === 'listing');
  const serviceOrders = orders.filter(o => o.type === 'service');
  const pendingSubs   = submissions.filter(s => s.status === 'pending').length;

  const nav: { id: Tab; label: string; icon: string; badge?: number }[] = [
    { id: 'overview',       label: 'Overview',       icon: '📊' },
    { id: 'properties',     label: 'Properties',     icon: '🏠', badge: PROPERTIES.length + customProps.length },
    { id: 'submissions',    label: 'Submissions',    icon: '📝', badge: pendingSubs || undefined },
    { id: 'listing-plans',  label: 'Listing Plans',  icon: '📋', badge: listingOrders.length || undefined },
    { id: 'services',       label: 'Services',       icon: '🛠️', badge: serviceOrders.length || undefined },
    { id: 'documents',      label: 'Documents',      icon: '📂', badge: documents.filter(d => d.status === 'Expiring' || d.status === 'Expired').length || undefined },
    { id: 'tenants',        label: 'Tenants',        icon: '👥', badge: tenancies.filter(t => t.status === 'Active').length || undefined },
    { id: 'messages',       label: 'Messages',       icon: '✉️', badge: unread || undefined },
  ];

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarTop}>
          <div className={styles.brand}>
            <div className={styles.brandName}>PROPERTY <span>TRADER</span></div>
            <div className={styles.brandBadge}>Admin Console</div>
          </div>
          <nav className={styles.nav}>
            {nav.map(n => (
              <button key={n.id} onClick={() => { setTab(n.id); setViewingPropId(null); }}
                className={`${styles.navItem} ${tab === n.id ? styles.navActive : ''}`}>
                <span className={styles.navIcon}>{n.icon}</span>
                <span className={styles.navLabel}>{n.label}</span>
                {n.badge ? <span className={styles.navBadge}>{n.badge}</span> : null}
              </button>
            ))}
          </nav>
        </div>
        <div className={styles.sidebarBottom}>
          <Link href="/" target="_blank" className={styles.viewSite}>↗ View Site</Link>
          <button onClick={onLogout} className={styles.logoutBtn}>Sign Out</button>
        </div>
      </aside>

      <div className={styles.main}>
        <header className={styles.topBar}>
          <h1 className={styles.pageTitle}>{nav.find(n => n.id === tab)?.icon} {nav.find(n => n.id === tab)?.label}</h1>
          <div className={styles.topRight}>
            <span className={styles.adminBadge}>Admin</span>
            <span className={styles.adminEmail}>{ADMIN_EMAIL}</span>
          </div>
        </header>

        <div className={styles.content}>
          {viewingPropId ? (
            <PropertyDetailView 
              id={viewingPropId} 
              onBack={() => setViewingPropId(null)} 
              customProps={customProps} 
              documents={documents} 
              tenancies={tenancies} 
              overrides={overrides}
              onUpdateNotes={(id, notes) => saveOverride(id, { notes })}
              onAddTenancy={(id) => { setInitTenancy(id); setViewingPropId(null); setTab('tenants'); }}
              onAddDoc={(id) => setInitDocPropId(id)}
            />
          ) : (
            <>
              {tab === 'overview'      && <Overview orders={orders} submissions={submissions} messages={messages} listingOrders={listingOrders} serviceOrders={serviceOrders} setTab={setTab} documents={documents} tenancies={tenancies} />}
              {tab === 'properties'    && <PropertiesTab overrides={overrides} onOverride={saveOverride} customProps={customProps} onCreate={createCustom} onUpdate={updateCustom} onDelete={deleteCustom} onAddTenancy={(id) => { setInitTenancy(id); setTab('tenants'); }} onAddDoc={setInitDocPropId} onViewCompliance={(id) => setInitDocPropId(id)} onViewDetails={(id) => setViewingPropId(id)} />}
              {tab === 'submissions'   && <SubmissionsTab submissions={submissions} onCreate={createSub} onUpdate={updateSub} onDelete={deleteSub} />}
              {tab === 'listing-plans' && <OrdersTab type="listing" orders={listingOrders} onCreate={createOrder} onUpdate={updateOrder} onDelete={deleteOrder} />}
              {tab === 'services'      && <OrdersTab type="service" orders={serviceOrders} onCreate={createOrder} onUpdate={updateOrder} onDelete={deleteOrder} />}
              {tab === 'messages'      && <MessagesTab messages={messages} onMarkRead={markRead} onMarkAllRead={markAllRead} onDelete={deleteMsg} />}
              {tab === 'documents'     && <DocumentsTab documents={documents} onCreate={createDoc} onUpdate={updateDoc} onDelete={deleteDoc} customProps={customProps} />}
              {tab === 'tenants'       && <TenantsTab tenancies={tenancies} onCreate={createTenancy} onUpdate={updateTenancy} onDelete={deleteTenancy} customProps={customProps} initialPropertyId={initTenancy} onModalClose={() => setInitTenancy(null)} />}
            </>
          )}
        </div>
      </div>

      {initDocPropId && (
        <DocModal
          properties={[...PROPERTIES, ...customProps]}
          initialPropertyId={initDocPropId}
          onClose={() => setInitDocPropId(null)}
          onSave={(d) => {
            createDoc(d);
            setInitDocPropId(null);
          }}
        />
      )}
    </div>
  );
}

/* ═══════════════════════════════ SHARED: CONFIRM MODAL ═══════════════════════════════ */
function ConfirmModal({ title, body, confirmLabel = 'Delete', onConfirm, onCancel }: {
  title: string; body: string; confirmLabel?: string;
  onConfirm: () => void; onCancel: () => void;
}) {
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

function Overview({ orders, submissions, messages, listingOrders, serviceOrders, setTab, documents, tenancies }: {
  orders: Order[]; submissions: Submission[]; messages: Message[];
  listingOrders: Order[]; serviceOrders: Order[]; setTab: (t: Tab) => void;
  documents: PropertyDocument[]; tenancies: Tenancy[];
}) {
  const revenue = orders.reduce((s, o) => { const n = parseFloat(o.price.replace(/[^0-9.]/g, '')); return s + (isNaN(n) ? 0 : n); }, 0);
  
  const expiringDocs = documents.filter(d => d.status === 'Expiring' || d.status === 'Expired');
  const expiringTenancies = tenancies.filter(t => {
    if (!t.endDate) return false;
    const diff = new Date(t.endDate).getTime() - new Date().getTime();
    return diff > 0 && diff < 30 * 24 * 60 * 60 * 1000;
  });

  const stats = [
    { icon: '🏠', label: 'Total Listings',     value: PROPERTIES.length,  color: '#e11d48' },
    { icon: '📝', label: 'Submissions',         value: submissions.length, color: '#f59e0b' },
    { icon: '💼', label: 'Total Orders',        value: orders.length,      color: '#8b5cf6' },
    { icon: '💷', label: 'Revenue',             value: `£${revenue.toLocaleString('en-GB', { minimumFractionDigits: 2 })}`, color: '#10b981' },
    { icon: '📂', label: 'Comp. Alerts',        value: expiringDocs.length, color: '#ef4444' },
    { icon: '👥', label: 'Active Tenants',      value: tenancies.filter(t => t.status === 'Active').length, color: '#3b82f6' },
  ];
  return (
    <div>
      <div className={styles.statsGrid}>
        {stats.map((s, i) => (
          <div key={i} className={styles.statCard} style={{ borderTopColor: s.color }}>
            <div className={styles.statIcon} style={{ color: s.color, background: s.color + '10' }}>{s.icon}</div>
            <div className={styles.statValue}>{s.value}</div>
            <div className={styles.statLabel}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className={styles.overviewSection}>
        <h3>🚨 Compliance & Lease Alerts</h3>
        <div className={styles.overviewGrid}>
          <div className={styles.overviewPanel}>
            <div className={styles.panelHeader}><h3>Expiring Documents</h3><button className={styles.panelLink} onClick={() => setTab('documents')}>Fix all →</button></div>
            {expiringDocs.length === 0 ? <p className={styles.emptyText}>All certifications are up to date.</p> : (
              <div className={styles.miniList}>
                {expiringDocs.slice(0, 5).map(d => (
                  <div key={d.id} className={styles.alertCard}>
                    <div className={`${styles.alertIcon} ${styles.alertDoc}`}>📂</div>
                    <div className={styles.alertContent}>
                      <div className={styles.alertTitle}>{d.documentType}</div>
                      <div className={styles.alertDesc}>{d.propertyName} · Exp: {d.expiryDate}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className={styles.overviewPanel}>
            <div className={styles.panelHeader}><h3>Upcoming Move-outs</h3><button className={styles.panelLink} onClick={() => setTab('tenants')}>View leases →</button></div>
            {expiringTenancies.length === 0 ? <p className={styles.emptyText}>No leases ending in the next 30 days.</p> : (
              <div className={styles.miniList}>
                {expiringTenancies.slice(0, 5).map(t => (
                  <div key={t.id} className={styles.alertCard}>
                    <div className={`${styles.alertIcon} ${styles.alertLease}`}>👥</div>
                    <div className={styles.alertContent}>
                      <div className={styles.alertTitle}>{t.tenantName}</div>
                      <div className={styles.alertDesc}>{t.propertyName} · Ends: {t.endDate}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={styles.overviewSection} style={{ marginTop: 40 }}>
        <h3>📊 Activity Summary</h3>        {[
          { title: 'Recent Submissions', tab: 'submissions'   as Tab, items: submissions.slice(0, 5).map(s => ({ key: s.id, title: s.address, sub: `${s.type} · ${s.beds} beds · ${s.price}`, right: <StatusPill status={s.status} /> })) },
          { title: 'Recent Orders',      tab: 'listing-plans' as Tab, items: orders.slice(0, 5).map(o => ({ key: o.id, title: o.name, sub: `${o.type === 'listing' ? 'Listing Plan' : 'Service'} · ${o.date}`, right: <span className={styles.miniPrice}>{o.price}</span> })) },
          { title: 'Unread Messages',    tab: 'messages'      as Tab, items: messages.filter(m => !m.read).slice(0, 5).map(m => ({ key: m.id, title: m.name, sub: m.subject || '(no subject)', right: null })) },
        ].map(panel => (
          <div key={panel.title} className={styles.overviewPanel}>
            <div className={styles.panelHeader}>
              <h3>{panel.title}</h3>
              <button className={styles.panelLink} onClick={() => setTab(panel.tab)}>View all →</button>
            </div>
            {panel.items.length === 0 ? <p className={styles.emptyText}>Nothing to show.</p> : (
              <div className={styles.miniList}>
                {panel.items.map(item => (
                  <div key={item.key} className={styles.miniRow}>
                    <div>
                      <div className={styles.miniTitle}>{item.title}</div>
                      <div className={styles.miniSub}>{item.sub}</div>
                    </div>
                    {item.right}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════ PROPERTIES ═══════════════════════════════ */
function PropertyListItem({ id, title, location, image, sector, isCustom, onEdit, onDelete, onAddTenancy, onAddDoc, onViewCompliance, onToggleVisibility, isHidden, onViewDetails }: {
  id: string; title: string; location: string; image?: string; sector: string; isCustom: boolean;
  onEdit: () => void; onDelete: () => void; onAddTenancy: () => void; onAddDoc: () => void;
  onViewCompliance: () => void; onViewDetails: () => void; onToggleVisibility?: () => void; isHidden?: boolean;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className={styles.propCard}>
      <div className={styles.propCardImgWrap}>
        {image ? <img src={image} alt={title} className={styles.propCardImg} /> : <div className={styles.customThumb}>🏠</div>}
      </div>
      <div className={styles.propCardInfo}>
        <div className={styles.propCardTitle}>{title}</div>
        <div className={styles.propCardSub}>{sector} household</div>
        <div className={styles.propCardMeta}>Last updated 4 hours ago</div>
        {isHidden && <span className={`${styles.pill} ${styles.pillRed}`} style={{ marginTop: 8, alignSelf: 'flex-start' }}>Occupied / Hidden</span>}
      </div>
      <div className={styles.propCardActions}>
        <button className={styles.btnPurple} onClick={onAddTenancy}>Add Tenancy</button>
        <button className={styles.btnPurple} onClick={onViewDetails}>View Details</button>
        <button className={styles.btnPurple} onClick={onViewCompliance}>Manage compliance</button>
      </div>

      <button className={styles.cardDots} onClick={() => setMenuOpen(!menuOpen)}>⋮</button>

      {menuOpen && (
        <div className={styles.cardMenu}>
          <button className={styles.menuItem} onClick={() => { setMenuOpen(false); onEdit(); }}>✏️ Edit details</button>
          <button className={styles.menuItem} onClick={() => { setMenuOpen(false); onAddDoc(); }}>📄 Add Document</button>
          {onToggleVisibility && (
            <button className={styles.menuItem} onClick={() => { setMenuOpen(false); onToggleVisibility(); }}>
              {isHidden ? '👁️ Show listing' : '👻 Hide listing'}
            </button>
          )}
          {isCustom && <button className={`${styles.menuItem} ${styles.menuItemDanger}`} onClick={() => { setMenuOpen(false); onDelete(); }}>🗑️ Delete</button>}
        </div>
      )}
    </div>
  );
}

const EMPTY_CUSTOM: Omit<CustomProp, 'id' | 'createdAt'> = {
  title: '', location: '', price: '', beds: '', baths: '', sqft: '',
  type: 'Sale', sector: 'Residential', status: 'Live', notes: '',
  image: '', gallery: '', mapEmbedUrl: '',
  description: '', features: '', interior: '', exterior: '',
};

function PropertiesTab({ overrides, onOverride, customProps, onCreate, onUpdate, onDelete, onAddTenancy, onAddDoc, onViewCompliance, onViewDetails }: {
  overrides: Record<string, PropOverride>; onOverride: (id: string, p: Partial<PropOverride>) => void;
  customProps: CustomProp[]; onCreate: (c: Omit<CustomProp, 'id' | 'createdAt'>) => void;
  onUpdate: (c: CustomProp) => void; onDelete: (id: string) => void;
  onAddTenancy: (id: string) => void; onAddDoc: (id: string) => void;
  onViewCompliance: (id: string) => void; onViewDetails: (id: string) => void;
}) {
  const [search, setSearch]       = useState('');
  const [ft, setFt]               = useState('All');
  const [fs, setFs]               = useState('All');
  const [showHidden, setShowHidden] = useState(false);
  const [editStatic, setEditStatic] = useState<Property | null>(null);
  const [editCustom, setEditCustom] = useState<CustomProp | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [draft, setDraft]           = useState<Omit<CustomProp, 'id' | 'createdAt'>>(EMPTY_CUSTOM);
  const [warn, setWarn]             = useState<{ id: string; title: string } | null>(null);
  const [staticNotes, setStaticNotes] = useState('');

  const staticFiltered = useMemo(() => PROPERTIES.filter(p => {
    const q = search.toLowerCase();
    return (!q || p.title.toLowerCase().includes(q) || p.location.toLowerCase().includes(q))
      && (ft === 'All' || p.listingType === ft)
      && (fs === 'All' || p.sector === fs)
      && (showHidden ? true : !overrides[p.id]?.hidden);
  }), [search, ft, fs, overrides, showHidden]);

  const customFiltered = useMemo(() => customProps.filter(p => {
    const q = search.toLowerCase();
    return !q || p.title.toLowerCase().includes(q) || p.location.toLowerCase().includes(q);
  }), [search, customProps]);

  const draftSet = (f: string, v: string) => setDraft(d => ({ ...d, [f]: v }));
  const customSet = (f: string, v: string) => setEditCustom(d => d ? { ...d, [f]: v } : d);

  return (
    <div>
      {/* Revised Toolbar */}
      <div className={styles.toolbar} style={{ paddingBottom: '10px' }}>
        <input className={styles.searchInput} placeholder="Search properties…" value={search} onChange={e => setSearch(e.target.value)} />
        <select className={styles.filterSelect} value={ft} onChange={e => setFt(e.target.value)}>
          <option>All Properties</option><option>Sale</option><option>Rent</option>
        </select>
        <select className={styles.filterSelect} value={fs} onChange={e => setFs(e.target.value)}>
          <option>All Portfolios</option><option>Residential</option><option>Commercial</option>
        </select>
        <button className={styles.createBtn} style={{ marginLeft: 'auto' }} onClick={() => { setDraft(EMPTY_CUSTOM); setCreateOpen(true); }}>Add Property</button>
      </div>

      <div className={styles.propCardList}>
        {staticFiltered.map(p => (
          <PropertyListItem
            key={p.id}
            id={p.id}
            title={p.title}
            location={p.location}
            image={p.image}
            sector={p.sector}
            isCustom={false}
            onEdit={() => { setEditStatic(p); setStaticNotes(overrides[p.id]?.notes ?? ''); }}
            onDelete={() => {}}
            onAddTenancy={() => onAddTenancy(p.id)}
            onAddDoc={() => onAddDoc(p.id)}
            onViewCompliance={() => onViewCompliance(p.id)}
            onViewDetails={() => onViewDetails(p.id)}
            onToggleVisibility={() => onOverride(p.id, { hidden: !overrides[p.id]?.hidden })}
            isHidden={overrides[p.id]?.hidden}
          />
        ))}
        {customFiltered.map(p => (
          <PropertyListItem
            key={p.id}
            id={p.id}
            title={p.title}
            location={p.location}
            image={p.image}
            sector={p.sector}
            isCustom={true}
            onEdit={() => setEditCustom(p)}
            onDelete={() => setWarn({ id: p.id, title: p.title || 'this property' })}
            onAddTenancy={() => onAddTenancy(p.id)}
            onAddDoc={() => onAddDoc(p.id)}
            onViewCompliance={() => onViewCompliance(p.id)}
            onViewDetails={() => onViewDetails(p.id)}
          />
        ))}
      </div>

      {/* Create modal */}
      {createOpen && (
        <div className={styles.modalBackdrop} onClick={() => setCreateOpen(false)}>
          <div className={styles.modal} style={{ maxWidth: 720 }} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Add Property</h2>
              <button className={styles.modalClose} onClick={() => setCreateOpen(false)}>✕</button>
            </div>
            <div className={styles.modalBody}>
              <PropForm draft={draft} onChange={draftSet} />
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.modalCancel} onClick={() => setCreateOpen(false)}>Cancel</button>
              <button className={styles.modalSave} onClick={() => { if (draft.title) { onCreate(draft); setCreateOpen(false); } }}>Create Property</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit static modal */}
      {editStatic && (
        <div className={styles.modalBackdrop} onClick={() => setEditStatic(null)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Edit: {editStatic.title}</h2>
              <button className={styles.modalClose} onClick={() => setEditStatic(null)}>✕</button>
            </div>
            <div className={styles.modalBody}>
              <p className={styles.modalNote}>ℹ️ Static properties can only have admin notes, featured flag, or visibility changed. Edit the source file to change property data.</p>
              <div className={styles.modalInfoGrid}>
                {[['Location', editStatic.location],['Price', editStatic.price],['Beds', String(editStatic.beds)],['Baths', String(editStatic.baths)],['Sqft', editStatic.sqft.toLocaleString()],['Type', editStatic.listingType]].map(([l,v]) => (
                  <DetailRow key={l} label={l} value={v} />
                ))}
              </div>
              <div className={styles.editField} style={{ marginTop: 16 }}>
                <label>Admin Notes</label>
                <textarea rows={3} value={staticNotes} onChange={e => setStaticNotes(e.target.value)} placeholder="Internal notes…" />
              </div>
              <div className={styles.modalCheckRow} style={{ marginTop: 16 }}>
                <label><input type="checkbox" checked={!!overrides[editStatic.id]?.hidden} onChange={e => onOverride(editStatic.id, { hidden: e.target.checked })} /> Mark as Occupied</label>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.modalCancel} onClick={() => setEditStatic(null)}>Cancel</button>
              <button className={styles.modalSave} onClick={() => { onOverride(editStatic.id, { notes: staticNotes }); setEditStatic(null); }}>Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit custom modal */}
      {editCustom && (
        <div className={styles.modalBackdrop} onClick={() => setEditCustom(null)}>
          <div className={styles.modal} style={{ maxWidth: 720 }} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Edit Property</h2>
              <button className={styles.modalClose} onClick={() => setEditCustom(null)}>✕</button>
            </div>
            <div className={styles.modalBody}>
              <PropForm draft={editCustom} onChange={customSet} />
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.modalCancel} onClick={() => setEditCustom(null)}>Cancel</button>
              <button className={styles.modalSave} onClick={() => { onUpdate(editCustom); setEditCustom(null); }}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete warning */}
      {warn && (
        <ConfirmModal
          title="Delete Property?"
          body={`Are you sure you want to permanently delete "${warn.title}"? This action cannot be undone.`}
          confirmLabel="Yes, Delete"
          onConfirm={() => { onDelete(warn.id); setWarn(null); }}
          onCancel={() => setWarn(null)}
        />
      )}
    </div>
  );
}

/* ─── Reusable property form (create + edit custom props) ─── */
function PropForm({ draft, onChange }: {
  draft: Omit<CustomProp, 'id' | 'createdAt'>;
  onChange: (field: string, value: string) => void;
}) {
  const ta = (field: string, label: string, rows = 3, ph?: string) => (
    <div key={field} className={`${styles.editField} ${styles.editSpan2}`}>
      <label>{label}</label>
      <textarea rows={rows} value={(draft as unknown as Record<string,string>)[field] ?? ''} onChange={e => onChange(field, e.target.value)} placeholder={ph} />
    </div>
  );
  const inp = (field: string, label: string, ph?: string) => (
    <div key={field} className={styles.editField}>
      <label>{label}</label>
      <input value={(draft as unknown as Record<string,string>)[field] ?? ''} onChange={e => onChange(field, e.target.value)} placeholder={ph} />
    </div>
  );

  const readFiles = (files: FileList | null, multi: boolean) => {
    if (!files || files.length === 0) return;
    const readers: Promise<string>[] = Array.from(files).map(file => new Promise(res => {
      const r = new FileReader();
      r.onload = () => res(r.result as string);
      r.readAsDataURL(file);
    }));
    Promise.all(readers).then(results => {
      if (multi) {
        const existing = (draft.gallery || '').split(',').map(s => s.trim()).filter(Boolean);
        onChange('gallery', [...existing, ...results].join(','));
      } else {
        onChange('image', results[0]);
      }
    });
  };

  const galleryList = (draft.gallery || '').split(',').map(s => s.trim()).filter(Boolean);

  return (
    <div>
      {/* Basic info */}
      <div className={styles.propFormSection}><h4>Basic Info</h4></div>
      <div className={styles.editGrid}>
        {inp('title','Title')}
        {inp('location','Location')}
        {inp('price','Price','£250,000')}
        {inp('beds','Beds')}
        {inp('baths','Baths')}
        {inp('sqft','Sqft')}
        <div className={styles.editField}><label>Listing Type</label>
          <select value={draft.type} onChange={e => onChange('type', e.target.value)}><option>Sale</option><option>Rent</option></select>
        </div>
        <div className={styles.editField}><label>Sector</label>
          <select value={draft.sector} onChange={e => onChange('sector', e.target.value)}><option>Residential</option><option>Commercial</option></select>
        </div>
      </div>

      {/* Photos */}
      <div className={styles.propFormSection}><h4>Photos</h4></div>
      <div className={styles.photoSection}>
        {/* Main image */}
        <div className={styles.photoBlock}>
          <div className={styles.photoBlockLabel}>Main Photo</div>
          {draft.image && <img src={draft.image} alt="main" className={styles.photoPreviewMain} />}
          <label className={styles.uploadBtn}>
            📷 {draft.image ? 'Replace Main Photo' : 'Upload Main Photo'}
            <input type="file" accept="image/*" style={{ display: 'none' }}
              onChange={e => readFiles(e.target.files, false)} />
          </label>
          {draft.image && (
            <button type="button" className={`${styles.btn} ${styles.btnDanger}`} style={{ marginTop: 6 }}
              onClick={() => onChange('image', '')}>Remove</button>
          )}
        </div>
        {/* Gallery */}
        <div className={styles.photoBlock}>
          <div className={styles.photoBlockLabel}>Gallery ({galleryList.length} photos)</div>
          {galleryList.length > 0 && (
            <div className={styles.galleryThumbs}>
              {galleryList.map((src, i) => (
                <div key={i} className={styles.galleryThumbWrap}>
                  <img src={src} alt={`gallery-${i}`} className={styles.galleryThumb} />
                  <button type="button" className={styles.galleryRemoveBtn}
                    onClick={() => onChange('gallery', galleryList.filter((_, j) => j !== i).join(','))}>✕</button>
                </div>
              ))}
            </div>
          )}
          <label className={styles.uploadBtn}>
            🖼️ Add Gallery Photos
            <input type="file" accept="image/*" multiple style={{ display: 'none' }}
              onChange={e => readFiles(e.target.files, true)} />
          </label>
          {galleryList.length > 0 && (
            <button type="button" className={`${styles.btn} ${styles.btnDanger}`} style={{ marginTop: 6 }}
              onClick={() => onChange('gallery', '')}>Clear Gallery</button>
          )}
        </div>
      </div>

      {/* Map */}
      <div className={styles.propFormSection}><h4>Google Map</h4></div>
      <div className={styles.editGrid}>
        <div className={`${styles.editField} ${styles.editSpan2}`}>
          <label>Google Maps Embed URL</label>
          <input value={draft.mapEmbedUrl ?? ''} onChange={e => onChange('mapEmbedUrl', e.target.value)}
            placeholder="Google Maps → Share → Embed a map → copy the src=&quot;…&quot; URL" />
        </div>
      </div>
      {draft.mapEmbedUrl && (
        <div className={styles.mapPreviewWrap}>
          <iframe src={draft.mapEmbedUrl} className={styles.mapPreview} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
        </div>
      )}

      {/* Description & features */}
      <div className={styles.propFormSection}><h4>Description &amp; Features</h4></div>
      <div className={styles.editGrid}>
        {ta('description','Description',4)}
        {ta('features','Key Features (one per line)',3,'Smart Home\nPrivate Terrace\n…')}
      </div>

      {/* Detailed info */}
      <div className={styles.propFormSection}><h4>Detailed Info</h4></div>
      <div className={styles.editGrid}>
        {ta('interior','Interior Description',3)}
        {ta('exterior','Exterior Description',3)}
      </div>

      {/* Admin notes */}
      <div className={styles.propFormSection}><h4>Admin Notes</h4></div>
      <div className={styles.editGrid}>
        {ta('notes','Internal Notes',2,'Private notes…')}
      </div>
    </div>
  );
}

/* ═══════════════════════════════ SUBMISSIONS ═══════════════════════════════ */
const EMPTY_SUB: Omit<Submission, 'id' | 'submittedAt' | 'status'> = {
  address: '', postcode: '', type: 'For Sale — Detached House', beds: '', baths: '', sqft: '',
  price: '', description: '', features: '', contactName: '', contactEmail: '', contactPhone: '',
};

function SubmissionsTab({ submissions, onCreate, onUpdate, onDelete }: {
  submissions: Submission[];
  onCreate: (s: Omit<Submission, 'id' | 'submittedAt' | 'status'>) => void;
  onUpdate: (s: Submission) => void;
  onDelete: (id: string) => void;
}) {
  const [selected, setSelected] = useState<Submission | null>(null);
  const [editing, setEditing]   = useState(false);
  const [draft, setDraft]       = useState<Submission | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [newDraft, setNewDraft] = useState<Omit<Submission, 'id' | 'submittedAt' | 'status'>>(EMPTY_SUB);
  const [search, setSearch]     = useState('');
  const [filter, setFilter]     = useState('All');
  const [warn, setWarn]         = useState<Submission | null>(null);

  const filtered = submissions.filter(s => {
    const q = search.toLowerCase();
    return (!q || s.address.toLowerCase().includes(q) || s.postcode.toLowerCase().includes(q) || (s.contactEmail || '').toLowerCase().includes(q) || (s.contactName || '').toLowerCase().includes(q))
      && (filter === 'All' || s.status === filter);
  });

  const ndSet = (f: string, v: string) => setNewDraft(d => ({ ...d, [f]: v }));
  const dSet  = (f: keyof Submission, v: string) => setDraft(d => d ? { ...d, [f]: v } : d);

  const saveEdit = () => { if (draft) { onUpdate(draft); setSelected(draft); setEditing(false); setDraft(null); } };

  const SUB_FIELDS: [keyof Submission, string][] = [
    ['address','Address'],['postcode','Postcode'],['type','Type'],['beds','Beds'],
    ['baths','Baths'],['sqft','Sqft'],['price','Price'],
    ['contactName','Contact Name'],['contactEmail','Contact Email'],['contactPhone','Contact Phone'],
  ];

  return (
    <div>
      <div className={styles.toolbar}>
        <input className={styles.searchInput} placeholder="Search address, name, email…" value={search} onChange={e => setSearch(e.target.value)} />
        <select className={styles.filterSelect} value={filter} onChange={e => setFilter(e.target.value)}>
          <option>All</option>
          <option value="pending">Pending</option>
          <option value="under-review">Under Review</option>
          <option value="published">Published</option>
        </select>
        <div className={styles.toolbarCount}>{filtered.length} submissions</div>
        <button className={styles.createBtn} onClick={() => { setNewDraft(EMPTY_SUB); setCreateOpen(true); }}>+ Add Submission</button>
      </div>

      <div className={styles.splitView}>
        <div className={styles.splitLeft}>
          {filtered.length === 0 ? (
            <div className={styles.emptyState}><span>📝</span><p>No submissions found.</p></div>
          ) : (
            <div className={styles.submissionCards}>
              {filtered.map(s => (
                <div key={s.id}
                  className={`${styles.submissionCard} ${selected?.id === s.id ? styles.submissionCardActive : ''}`}
                  onClick={() => { setSelected(s); setEditing(false); setDraft(null); }}>
                  <div className={styles.submissionCardTop}>
                    <div>
                      <div className={styles.submissionAddr}>{s.address}{s.postcode ? `, ${s.postcode}` : ''}</div>
                      <div className={styles.submissionMeta}>{s.type} · {s.beds} beds · {s.price}</div>
                    </div>
                    <StatusPill status={s.status} />
                  </div>
                  <div className={styles.submissionDate}>{s.contactName || s.contactEmail || 'No contact'} · {s.submittedAt}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.splitRight}>
          {!selected ? (
            <div className={styles.emptyState}><span>👈</span><p>Select a submission to view details.</p></div>
          ) : editing && draft ? (
            <div className={styles.detailPanel}>
              <div className={styles.detailHeader}>
                <h2>Editing Submission</h2>
                <button className={styles.btnSecondary} onClick={() => { setEditing(false); setDraft(null); }}>Cancel</button>
              </div>
              <div className={styles.editGrid}>
                {SUB_FIELDS.map(([f, l]) => (
                  <div key={f} className={styles.editField}>
                    <label>{l}</label>
                    <input value={draft[f] as string} onChange={e => dSet(f, e.target.value)} />
                  </div>
                ))}
                <div className={`${styles.editField} ${styles.editSpan2}`}>
                  <label>Description</label>
                  <textarea rows={4} value={draft.description} onChange={e => dSet('description', e.target.value)} />
                </div>
                <div className={`${styles.editField} ${styles.editSpan2}`}>
                  <label>Features (one per line)</label>
                  <textarea rows={4} value={draft.features} onChange={e => dSet('features', e.target.value)} />
                </div>
              </div>
              <div className={styles.crudBar}>
                <button className={`${styles.btn} ${styles.btnSuccess}`} onClick={saveEdit}>Save Changes</button>
                <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => { setEditing(false); setDraft(null); }}>Cancel</button>
              </div>
            </div>
          ) : (
            <div className={styles.detailPanel}>
              <div className={styles.detailHeader}>
                <h2>{selected.address}{selected.postcode ? `, ${selected.postcode}` : ''}</h2>
                <StatusPill status={selected.status} />
              </div>

              <div className={styles.contactBlock}>
                <h4>Contact Details</h4>
                <div className={styles.contactGrid}>
                  <ContactItem icon="👤" label="Name"  value={selected.contactName}  />
                  <ContactItem icon="✉️" label="Email" value={selected.contactEmail} href={`mailto:${selected.contactEmail}`} />
                  <ContactItem icon="📞" label="Phone" value={selected.contactPhone} href={`tel:${selected.contactPhone}`} />
                </div>
              </div>

              <div className={styles.detailGrid}>
                <DetailRow label="Type"       value={selected.type} />
                <DetailRow label="Beds"       value={selected.beds} />
                <DetailRow label="Baths"      value={selected.baths} />
                <DetailRow label="Floor Area" value={selected.sqft !== '—' ? `${selected.sqft} sq ft` : '—'} />
                <DetailRow label="Price"      value={selected.price} />
                <DetailRow label="Submitted"  value={selected.submittedAt} />
              </div>

              {selected.description && (
                <div className={styles.detailSection}>
                  <h4>Description</h4><p>{selected.description}</p>
                </div>
              )}
              {selected.features && (
                <div className={styles.detailSection}>
                  <h4>Key Features</h4>
                  <ul>{selected.features.split('\n').filter(Boolean).map((f, i) => <li key={i}>{f}</li>)}</ul>
                </div>
              )}

              <div className={styles.detailActions}>
                <h4>Update Status</h4>
                <div className={styles.statusBtns}>
                  {['pending', 'under-review', 'published'].map(st => (
                    <button key={st} className={`${styles.statusBtn} ${selected.status === st ? styles.statusBtnActive : ''}`}
                      onClick={() => { const upd = { ...selected, status: st }; onUpdate(upd); setSelected(upd); }}>
                      {st.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.crudBar}>
                <button className={`${styles.btn} ${styles.btnEdit}`} onClick={() => { setDraft({ ...selected }); setEditing(true); }}>✏️ Edit</button>
                {selected.contactEmail && <a href={`mailto:${selected.contactEmail}`} className={`${styles.btn} ${styles.btnInfo}`}>✉️ Email</a>}
                {selected.contactPhone && <a href={`tel:${selected.contactPhone}`} className={`${styles.btn} ${styles.btnInfo}`}>📞 Call</a>}
                <button className={`${styles.btn} ${styles.btnDanger}`} onClick={() => setWarn(selected)}>🗑️ Delete</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create modal */}
      {createOpen && (
        <div className={styles.modalBackdrop} onClick={() => setCreateOpen(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}><h2>Add Submission</h2><button className={styles.modalClose} onClick={() => setCreateOpen(false)}>✕</button></div>
            <div className={styles.modalBody}>
              <div className={styles.editGrid}>
                {SUB_FIELDS.map(([f, l]) => (
                  <div key={f} className={styles.editField}>
                    <label>{l}</label>
                    <input value={(newDraft as unknown as Record<string, string>)[f]} onChange={e => ndSet(f, e.target.value)} />
                  </div>
                ))}
                <div className={`${styles.editField} ${styles.editSpan2}`}>
                  <label>Description</label>
                  <textarea rows={3} value={newDraft.description} onChange={e => ndSet('description', e.target.value)} />
                </div>
                <div className={`${styles.editField} ${styles.editSpan2}`}>
                  <label>Features</label>
                  <textarea rows={3} value={newDraft.features} onChange={e => ndSet('features', e.target.value)} />
                </div>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.modalCancel} onClick={() => setCreateOpen(false)}>Cancel</button>
              <button className={styles.modalSave} onClick={() => { if (newDraft.address) { onCreate(newDraft); setCreateOpen(false); } }}>Create</button>
            </div>
          </div>
        </div>
      )}

      {warn && (
        <ConfirmModal
          title="Delete Submission?"
          body={`Delete submission for "${warn.address}"? Contact: ${warn.contactName || warn.contactEmail || 'Unknown'}. This cannot be undone.`}
          confirmLabel="Yes, Delete"
          onConfirm={() => { onDelete(warn.id); setSelected(null); setWarn(null); }}
          onCancel={() => setWarn(null)}
        />
      )}
    </div>
  );
}

/* ═══════════════════════════════ ORDERS ═══════════════════════════════ */
const EMPTY_ORDER: Omit<Order, 'id' | 'date'> = {
  type: 'listing', name: '', price: '', detail: '', status: 'active',
  customerName: '', customerEmail: '', customerPhone: '',
};

function OrdersTab({ type, orders, onCreate, onUpdate, onDelete }: {
  type: 'listing' | 'service'; orders: Order[];
  onCreate: (o: Omit<Order, 'id' | 'date'>) => void;
  onUpdate: (o: Order) => void;
  onDelete: (id: string) => void;
}) {
  const [selected,    setSelected]   = useState<Order | null>(null);
  const [editOrder,   setEditOrder]  = useState<Order | null>(null);
  const [createOpen,  setCreateOpen] = useState(false);
  const [newDraft,    setNewDraft]   = useState<Omit<Order, 'id' | 'date'>>({ ...EMPTY_ORDER, type });
  const [warn,        setWarn]       = useState<Order | null>(null);
  const [search,      setSearch]     = useState('');

  const filtered = orders.filter(o => {
    const q = search.toLowerCase();
    return !q || o.name.toLowerCase().includes(q) || o.customerName.toLowerCase().includes(q) || o.customerEmail.toLowerCase().includes(q);
  });

  const ndSet = (f: string, v: string) => setNewDraft(d => ({ ...d, [f]: v }));
  const edSet = (f: string, v: string) => setEditOrder(d => d ? { ...d, [f]: v } : d);

  const label = type === 'listing' ? 'Listing Plan' : 'Service';

  const ORDER_FIELDS: [string, string][] = [
    ['name', label + ' Name'], ['price', 'Price'], ['detail', 'Detail'],
    ['customerName', 'Customer Name'], ['customerEmail', 'Customer Email'], ['customerPhone', 'Customer Phone'],
  ];

  return (
    <div>
      <div className={styles.toolbar}>
        <input className={styles.searchInput} placeholder={`Search ${type === 'listing' ? 'listing plans' : 'services'}…`} value={search} onChange={e => setSearch(e.target.value)} />
        <div className={styles.toolbarCount}>{filtered.length} {type === 'listing' ? 'listing plans' : 'services'}</div>
        <button className={styles.createBtn} onClick={() => { setNewDraft({ ...EMPTY_ORDER, type }); setCreateOpen(true); }}>+ Add {label}</button>
      </div>

      <div className={styles.splitView}>
        <div className={styles.splitLeft}>
          {filtered.length === 0 ? (
            <div className={styles.emptyState}><span>{type === 'listing' ? '📋' : '🛠️'}</span><p>No {type === 'listing' ? 'listing plan' : 'service'} orders yet.</p></div>
          ) : (
            <div className={styles.submissionCards}>
              {filtered.map(o => (
                <div key={o.id}
                  className={`${styles.submissionCard} ${selected?.id === o.id ? styles.submissionCardActive : ''}`}
                  onClick={() => setSelected(o)}>
                  <div className={styles.submissionCardTop}>
                    <div>
                      <div className={styles.submissionAddr}>{o.name}</div>
                      <div className={styles.submissionMeta}>{o.detail || '—'} · {o.price}</div>
                    </div>
                    <StatusPill status={o.status} />
                  </div>
                  <div className={styles.submissionDate}>{o.customerName || 'No customer'} · {o.date}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.splitRight}>
          {!selected ? (
            <div className={styles.emptyState}><span>👈</span><p>Select an order to view details.</p></div>
          ) : (
            <div className={styles.detailPanel}>
              <div className={styles.detailHeader}>
                <h2>{selected.name}</h2>
                <StatusPill status={selected.status} />
              </div>

              <div className={styles.contactBlock}>
                <h4>Customer Details</h4>
                <div className={styles.contactGrid}>
                  <ContactItem icon="👤" label="Name"  value={selected.customerName}  />
                  <ContactItem icon="✉️" label="Email" value={selected.customerEmail} href={selected.customerEmail ? `mailto:${selected.customerEmail}` : undefined} />
                  <ContactItem icon="📞" label="Phone" value={selected.customerPhone} href={selected.customerPhone ? `tel:${selected.customerPhone}` : undefined} />
                </div>
              </div>

              <div className={styles.detailGrid}>
                <DetailRow label="Order ID" value={selected.id} />
                <DetailRow label="Plan / Service" value={selected.name} />
                <DetailRow label="Detail"    value={selected.detail || '—'} />
                <DetailRow label="Price"     value={selected.price} />
                <DetailRow label="Date"      value={selected.date} />
                <DetailRow label="Type"      value={type === 'listing' ? 'Listing Plan' : 'Service'} />
              </div>

              <div className={styles.detailActions}>
                <h4>Update Status</h4>
                <div className={styles.statusBtns}>
                  {['active', 'pending', 'completed'].map(st => (
                    <button key={st} className={`${styles.statusBtn} ${selected.status === st ? styles.statusBtnActive : ''}`}
                      onClick={() => { const upd = { ...selected, status: st }; onUpdate(upd); setSelected(upd); }}>
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.crudBar}>
                <button className={`${styles.btn} ${styles.btnEdit}`} onClick={() => setEditOrder({ ...selected })}>✏️ Edit</button>
                {selected.customerEmail && <a href={`mailto:${selected.customerEmail}`} className={`${styles.btn} ${styles.btnInfo}`}>✉️ Email</a>}
                {selected.customerPhone && <a href={`tel:${selected.customerPhone}`} className={`${styles.btn} ${styles.btnInfo}`}>📞 Call</a>}
                <button className={`${styles.btn} ${styles.btnDanger}`} onClick={() => setWarn(selected)}>🗑️ Delete</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create modal */}
      {createOpen && (
        <div className={styles.modalBackdrop} onClick={() => setCreateOpen(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}><h2>Add {label}</h2><button className={styles.modalClose} onClick={() => setCreateOpen(false)}>✕</button></div>
            <div className={styles.modalBody}>
              <div className={styles.editGrid}>
                {ORDER_FIELDS.map(([f, l]) => (
                  <div key={f} className={styles.editField}>
                    <label>{l}</label>
                    <input value={(newDraft as unknown as Record<string, string>)[f] ?? ''} onChange={e => ndSet(f, e.target.value)} />
                  </div>
                ))}
                <div className={styles.editField}>
                  <label>Status</label>
                  <select value={newDraft.status} onChange={e => ndSet('status', e.target.value)}>
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.modalCancel} onClick={() => setCreateOpen(false)}>Cancel</button>
              <button className={styles.modalSave} onClick={() => { if (newDraft.name) { onCreate(newDraft); setCreateOpen(false); } }}>Create {label}</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit modal */}
      {editOrder && (
        <div className={styles.modalBackdrop} onClick={() => setEditOrder(null)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}><h2>Edit Order</h2><button className={styles.modalClose} onClick={() => setEditOrder(null)}>✕</button></div>
            <div className={styles.modalBody}>
              <div className={styles.editGrid}>
                {ORDER_FIELDS.map(([f, l]) => (
                  <div key={f} className={styles.editField}>
                    <label>{l}</label>
                    <input value={(editOrder as unknown as Record<string, string>)[f] ?? ''} onChange={e => edSet(f, e.target.value)} />
                  </div>
                ))}
                <div className={styles.editField}>
                  <label>Status</label>
                  <select value={editOrder.status} onChange={e => edSet('status', e.target.value)}>
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.modalCancel} onClick={() => setEditOrder(null)}>Cancel</button>
              <button className={styles.modalSave} onClick={() => { onUpdate(editOrder); setSelected(editOrder); setEditOrder(null); }}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {warn && (
        <ConfirmModal
          title={`Delete ${label}?`}
          body={`Delete "${warn.name}" (${warn.id})? This action cannot be undone.`}
          confirmLabel="Yes, Delete"
          onConfirm={() => { onDelete(warn.id); setSelected(null); setWarn(null); }}
          onCancel={() => setWarn(null)}
        />
      )}
    </div>
  );
}

/* ═══════════════════════════════ MESSAGES ═══════════════════════════════ */
function MessagesTab({ messages, onMarkRead, onMarkAllRead, onDelete }: {
  messages: Message[]; onMarkRead: (id: string) => void;
  onMarkAllRead: () => void; onDelete: (id: string) => void;
}) {
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
                  <ContactItem icon="👤" label="Name"  value={selected.name} />
                  <ContactItem icon="✉️" label="Email" value={selected.email} href={`mailto:${selected.email}`} />
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

/* ─── Micro-components ─── */
function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = { active: styles.pillGreen, published: styles.pillGreen, pending: styles.pillAmber, 'under-review': styles.pillBlue, completed: styles.pillGray };
  return <span className={`${styles.pill} ${map[status] ?? styles.pillGray}`}>{status.replace('-', ' ')}</span>;
}
function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.detailRow}>
      <span className={styles.detailLabel}>{label}</span>
      <span className={styles.detailValue}>{value}</span>
    </div>
  );
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

/* ═══════════════════════════════ DOCUMENTS ═══════════════════════════════ */
const DOC_TYPES = [
  'EPC',
  'Gas safety certificate',
  'EICR',
  'ICO Registration',
  'Rent Smart Wales Registration',
  'Rent Smart Wales Licence',
  'Smoke Alarms',
  'CO detector',
  'Fit for Human Habitation',
  'Legionella risk assessment',
  'Portable Appliance Tests',
  'Fire Risk Assessment',
  'Insurance',
  'Tenancy Agreement',
  'Other'
];

function DocumentsTab({ documents, onCreate, onUpdate, onDelete, customProps }: {
  documents: PropertyDocument[];
  onCreate: (d: Omit<PropertyDocument, 'id' | 'dateUploaded'>) => void;
  onUpdate: (d: PropertyDocument) => void;
  onDelete: (id: string) => void;
  customProps: CustomProp[];
}) {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [createOpen, setCreateOpen] = useState(false);
  const [editDoc, setEditDoc] = useState<PropertyDocument | null>(null);
  const [warn, setWarn] = useState<PropertyDocument | null>(null);

  const allProperties = useMemo(() => {
    return [
      ...PROPERTIES.map(p => ({ id: p.id, title: p.title })),
      ...customProps.map(p => ({ id: p.id, title: p.title }))
    ];
  }, [customProps]);

  const filtered = documents.filter(d => {
    const q = search.toLowerCase();
    const matchesSearch = !q || d.propertyName.toLowerCase().includes(q) || d.documentType.toLowerCase().includes(q);
    const matchesType = filterType === 'All' || d.documentType === filterType;
    return matchesSearch && matchesType;
  });

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Current': return styles.pillGreen;
      case 'Expiring': return styles.pillOrange;
      case 'Expired': return styles.pillRed;
      default: return styles.pillGray;
    }
  };

  return (
    <div>
      <div className={styles.toolbar}>
        <input className={styles.searchInput} placeholder="Search documents or properties…" value={search} onChange={e => setSearch(e.target.value)} />
        <select className={styles.filterSelect} value={filterType} onChange={e => setFilterType(e.target.value)}>
          <option>All Types</option>
          {DOC_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <div className={styles.toolbarCount}>{filtered.length} documents</div>
        <button className={styles.createBtn} onClick={() => setCreateOpen(true)}>+ Add Document</button>
      </div>

      <div className={`${styles.tableWrap} ${styles.docTableWrap}`}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Document Type</th>
              <th>Property</th>
              <th>Expiry date</th>
              <th>Date uploaded</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>No documents found.</td></tr>
            ) : (
              filtered.map(doc => (
                <tr key={doc.id}>
                  <td style={{ fontWeight: 600 }}>{doc.documentType}</td>
                  <td className={styles.muted}>{doc.propertyName}</td>
                  <td style={{ fontWeight: 600, color: doc.status === 'Expiring' ? '#ea580c' : 'inherit' }}>
                    {doc.expiryDate || '—'}
                  </td>
                  <td className={styles.muted}>{doc.dateUploaded}</td>
                  <td><span className={`${styles.pill} ${getStatusClass(doc.status)}`}>{doc.status}</span></td>
                  <td style={{ textAlign: 'right' }}>
                    <div className={styles.actionGroup} style={{ justifyContent: 'flex-end' }}>
                      {doc.status === 'Expiring' && (
                        <button className={styles.renewBtn} onClick={() => alert('Renewal requested for ' + doc.propertyName)}>
                          🔄 Renew now
                        </button>
                      )}
                      <button className={styles.docActionIcon} title="View" onClick={() => doc.fileBase64 && window.open(doc.fileBase64)}>👁️</button>
                      <button className={styles.docActionIcon} title="Edit" onClick={() => setEditDoc(doc)}>✏️</button>
                      <button className={styles.docActionIcon} title="Delete" onClick={() => setWarn(doc)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {createOpen && (
        <DocModal
          properties={allProperties}
          onClose={() => setCreateOpen(false)}
          onSave={(d) => { onCreate(d); setCreateOpen(false); }}
        />
      )}

      {editDoc && (
        <DocModal
          properties={allProperties}
          existingDoc={editDoc}
          onClose={() => setEditDoc(null)}
          onSave={(d) => { onUpdate({ ...editDoc, ...d } as PropertyDocument); setEditDoc(null); }}
        />
      )}

      {warn && (
        <ConfirmModal
          title="Delete Document?"
          body={`Are you sure you want to delete the ${warn.documentType} for "${warn.propertyName}"?`}
          onConfirm={() => { onDelete(warn.id); setWarn(null); }}
          onCancel={() => setWarn(null)}
        />
      )}
    </div>
  );
}

function DocModal({ properties, initialPropertyId, existingDoc, onClose, onSave }: {
  properties: { id: string; title: string }[];
  initialPropertyId?: string;
  existingDoc?: PropertyDocument;
  onClose: () => void;
  onSave: (d: Omit<PropertyDocument, 'id' | 'dateUploaded'>) => void;
}) {
  const [propertyId, setPropertyId] = useState(existingDoc?.propertyId || initialPropertyId || properties[0]?.id || '');
  const [type, setType] = useState(existingDoc?.documentType || DOC_TYPES[0]);
  const [expiry, setExpiry] = useState(''); // We'll handle date conversion
  const [file, setFile] = useState<{ name: string; base64: string } | null>(
    existingDoc?.fileBase64 ? { name: existingDoc.fileName || 'Existing Document', base64: existingDoc.fileBase64 } : null
  );

  useEffect(() => {
    if (existingDoc?.expiryDate) {
      // Convert "DD MMM YYYY" back to YYYY-MM-DD for the input
      try {
        const parts = existingDoc.expiryDate.split(' ');
        if (parts.length === 3) {
          const months: Record<string, string> = { Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06', Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12' };
          const d = parts[0].padStart(2, '0');
          const m = months[parts[1]];
          const y = parts[2];
          setExpiry(`${y}-${m}-${d}`);
        }
      } catch (e) { console.error("Date conversion failed", e); }
    }
  }, [existingDoc]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setFile({ name: f.name, base64: reader.result as string });
    reader.readAsDataURL(f);
  };

  const save = () => {
    const propName = properties.find(p => p.id === propertyId)?.title || 'Unknown';
    
    let status: 'Current' | 'Expiring' | 'Expired' = 'Current';
    if (expiry) {
      const expDate = new Date(expiry);
      const now = new Date();
      const diff = expDate.getTime() - now.getTime();
      const days = diff / (1000 * 60 * 60 * 24);
      if (days < 0) status = 'Expired';
      else if (days < 30) status = 'Expiring';
    }

    onSave({
      propertyId,
      propertyName: propName,
      documentType: type,
      expiryDate: expiry ? new Date(expiry).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '',
      status,
      fileBase64: file?.base64,
      fileName: file?.name
    });
  };

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modal} style={{ maxWidth: 540 }} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>{existingDoc ? 'Edit Document' : 'Add New Document'}</h2>
          <button className={styles.modalClose} onClick={onClose}>✕</button>
        </div>
        <div className={styles.modalBody}>
          <div className={styles.editField} style={{ marginBottom: 24 }}>
            <label>Document Source</label>
            {!file ? (
              <label className={styles.fileDropZone}>
                <input type="file" style={{ display: 'none' }} onChange={handleFile} />
                <i>📄</i>
                <p>Upload document file</p>
                <span>Select a PDF, JPG or PNG to associate with this property.</span>
              </label>
            ) : (
              <div className={styles.filePreview}>
                <span className={styles.fileIcon}>📄</span>
                <div className={styles.fileInfo}>
                  <div className={styles.fileName}>{file.name}</div>
                  <div className={styles.fileSize}>Ready for management</div>
                </div>
                <button className={styles.removeFile} onClick={() => setFile(null)} title="Remove file">✕</button>
              </div>
            )}
          </div>

          <div className={styles.editField} style={{ marginBottom: 20 }}>
            <label>Associated Property</label>
            <select className={styles.filterSelect} style={{ width: '100%' }} value={propertyId} onChange={e => setPropertyId(e.target.value)}>
              {properties.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
            </select>
          </div>

          <div className={styles.editGrid}>
            <div className={styles.editField}>
              <label>Service / Document Type</label>
              <select className={styles.filterSelect} value={type} onChange={e => setType(e.target.value)}>
                {DOC_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className={styles.editField}>
              <label>Expiry Date</label>
              <input type="date" value={expiry} onChange={e => setExpiry(e.target.value)} />
            </div>
          </div>
        </div>
        <div className={styles.modalFooter}>
          <button className={styles.modalCancel} onClick={onClose}>Cancel</button>
          <button className={styles.modalSave} disabled={!file} onClick={save}>
            {existingDoc ? 'Update Document' : 'Save Document'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════ TENANTS ═══════════════════════════════ */
function TenantsTab({ tenancies, onCreate, onUpdate, onDelete, customProps, initialPropertyId, onModalClose }: {
  tenancies: Tenancy[];
  onCreate: (t: Omit<Tenancy, 'id' | 'createdAt'>) => void;
  onUpdate: (t: Tenancy) => void;
  onDelete: (id: string) => void;
  customProps: CustomProp[];
  initialPropertyId?: string | null;
  onModalClose?: () => void;
}) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [createOpen, setCreateOpen] = useState(false);
  const [editTen, setEditTen] = useState<Tenancy | null>(null);
  const [warn, setWarn] = useState<Tenancy | null>(null);

  useEffect(() => {
    if (initialPropertyId) {
      setCreateOpen(true);
    }
  }, [initialPropertyId]);

  const allProperties = useMemo(() => {
    return [
      ...PROPERTIES.map(p => ({ id: p.id, title: p.title })),
      ...customProps.map(p => ({ id: p.id, title: p.title }))
    ];
  }, [customProps]);

  const filtered = tenancies.filter(t => {
    const q = search.toLowerCase();
    const matchesSearch = !q || t.tenantName.toLowerCase().includes(q) || t.propertyName.toLowerCase().includes(q);
    const matchesFilter = filter === 'All' || t.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div>
      <div className={styles.toolbar}>
        <input className={styles.searchInput} placeholder="Search tenants or properties…" value={search} onChange={e => setSearch(e.target.value)} />
        <select className={styles.filterSelect} value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="All">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Pending">Pending</option>
          <option value="Ended">Ended</option>
        </select>
        <div className={styles.toolbarCount}>{filtered.length} tenancies</div>
        <button className={styles.createBtn} onClick={() => setCreateOpen(true)}>+ Add Tenancy</button>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Tenant</th>
              <th>Property</th>
              <th>Rent</th>
              <th>Term Dates</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>No tenancies found.</td></tr>
            ) : (
              filtered.map(ten => (
                <tr key={ten.id}>
                  <td>
                    <div style={{ fontWeight: 700 }}>{ten.tenantName}</div>
                    <div className={styles.muted} style={{ fontSize: '0.75rem' }}>{ten.tenantEmail}</div>
                  </td>
                  <td className={styles.muted}>{ten.propertyName}</td>
                  <td>
                    <div style={{ fontWeight: 700 }}>£{ten.rentAmount}</div>
                    <div className={styles.muted} style={{ fontSize: '0.75rem' }}>{ten.rentFrequency}</div>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.8125rem' }}>{ten.startDate}</div>
                    <div className={styles.muted} style={{ fontSize: '0.75rem' }}>Exp: {ten.endDate}</div>
                  </td>
                  <td>
                    <span className={`${styles.pill} ${ten.status === 'Active' ? styles.pillGreen : ten.status === 'Pending' ? styles.pillAmber : styles.pillGray}`}>
                      {ten.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div className={styles.actionGroup} style={{ justifyContent: 'flex-end' }}>
                      <button className={styles.docActionIcon} title="Edit" onClick={() => setEditTen(ten)}>✏️</button>
                      <button className={styles.docActionIcon} title="Delete" onClick={() => setWarn(ten)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {(createOpen || editTen) && (
        <TenancyModal
          properties={allProperties}
          existing={editTen || undefined}
          initialPropertyId={editTen ? undefined : (initialPropertyId || undefined)}
          onClose={() => { setCreateOpen(false); setEditTen(null); onModalClose?.(); }}
          onSave={(t) => {
            if (editTen) onUpdate({ ...editTen, ...t } as Tenancy);
            else onCreate(t);
            setCreateOpen(false); setEditTen(null); onModalClose?.();
          }}
        />
      )}

      {warn && (
        <ConfirmModal
          title="Delete Tenancy?"
          body={`Are you sure you want to delete the tenancy for ${warn.tenantName} at ${warn.propertyName}?`}
          onConfirm={() => { onDelete(warn.id); setWarn(null); }}
          onCancel={() => setWarn(null)}
        />
      )}
    </div>
  );
}

function TenancyModal({ properties, existing, initialPropertyId, onClose, onSave }: {
  properties: { id: string; title: string }[];
  existing?: Tenancy;
  initialPropertyId?: string;
  onClose: () => void;
  onSave: (t: Omit<Tenancy, 'id' | 'createdAt'>) => void;
}) {
  const [propertyId, setPropertyId] = useState(existing?.propertyId || initialPropertyId || properties[0]?.id || '');
  const [startDate, setStartDate] = useState(existing?.startDate || '');
  const [endDate, setEndDate] = useState(existing?.endDate || '');
  const [rentAmount, setRentAmount] = useState(existing?.rentAmount || '');
  const [rentFrequency, setRentFrequency] = useState(existing?.rentFrequency || 'Monthly');
  const [rentDay, setRentDay] = useState(existing?.rentDay || '1');
  const [depositAmount, setDepositAmount] = useState(existing?.depositAmount || '');
  const [tenantName, setTenantName] = useState(existing?.tenantName || '');
  const [tenantEmail, setTenantEmail] = useState(existing?.tenantEmail || '');
  const [tenantPhone, setTenantPhone] = useState(existing?.tenantPhone || '');
  const [agreement, setAgreement] = useState<{ name: string; base64: string } | null>(existing?.agreementFile || null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setAgreement({ name: f.name, base64: reader.result as string });
    reader.readAsDataURL(f);
  };

  const save = () => {
    const propName = properties.find(p => p.id === propertyId)?.title || 'Unknown';
    onSave({
      propertyId,
      propertyName: propName,
      startDate,
      endDate,
      rentAmount,
      rentFrequency: rentFrequency as any,
      rentDay,
      depositAmount,
      tenantName,
      tenantEmail,
      tenantPhone,
      agreementFile: agreement || undefined,
      status: 'Active'
    });
  };

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modal} style={{ maxWidth: 640 }} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>{existing ? 'Edit Tenancy' : 'Add an existing tenancy'}</h2>
          <button className={styles.modalClose} onClick={onClose}>✕</button>
        </div>
        <div className={styles.modalBody}>
          {!existing && (
            <div className={styles.modalNote} style={{ marginBottom: 24 }}>
              If you wish to create a new tenancy agreement and send for e-signing, <a href="#" style={{ color: '#e11d48', fontWeight: 700, textDecoration: 'underline' }}>follow the link below</a>
            </div>
          )}

          <div className={styles.propFormSection} style={{ marginTop: 0 }}><h4>Property Association</h4></div>
          <div className={styles.editField}>
            <label>Search for a listed property</label>
            <select className={styles.filterSelect} style={{ width: '100%' }} value={propertyId} onChange={e => setPropertyId(e.target.value)}>
              {properties.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
            </select>
          </div>

          <div className={styles.propFormSection}><h4>Tenancy Dates</h4></div>
          <div className={styles.editGrid}>
            <div className={styles.editField}>
              <label>Tenancy start date</label>
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
            </div>
            <div className={styles.editField}>
              <label>Tenancy fixed-term end date</label>
              <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
            </div>
          </div>

          <div className={styles.propFormSection}><h4>Rent Collection (Optional)</h4></div>
          <div className={styles.editGrid}>
            <div className={styles.editField}>
              <label>Rent amount (£)</label>
              <input type="number" placeholder="0.00" value={rentAmount} onChange={e => setRentAmount(e.target.value)} />
            </div>
            <div className={styles.editField}>
              <label>Collection frequency</label>
              <select className={styles.filterSelect} value={rentFrequency} onChange={e => setRentFrequency(e.target.value as any)}>
                <option>Monthly</option>
                <option>Weekly</option>
                <option>Quarterly</option>
              </select>
            </div>
            <div className={styles.editField}>
              <label>Collection day</label>
              <input type="number" min="1" max="31" value={rentDay} onChange={e => setRentDay(e.target.value)} />
            </div>
            <div className={styles.editField}>
              <label>Deposit amount (£)</label>
              <input type="number" placeholder="0.00" value={depositAmount} onChange={e => setDepositAmount(e.target.value)} />
            </div>
          </div>

          <div className={styles.propFormSection}><h4>Tenant 1 Details</h4></div>
          <div className={styles.editGrid}>
            <div className={styles.editField}>
              <label>Full Name</label>
              <input value={tenantName} onChange={e => setTenantName(e.target.value)} />
            </div>
            <div className={styles.editField}>
              <label>Email Address</label>
              <input type="email" value={tenantEmail} onChange={e => setTenantEmail(e.target.value)} />
            </div>
            <div className={`${styles.editField} ${styles.editSpan2}`}>
              <label>Phone Number</label>
              <input value={tenantPhone} onChange={e => setTenantPhone(e.target.value)} />
            </div>
          </div>

          <div className={styles.propFormSection}><h4>Existing Tenancy Agreement (Optional)</h4></div>
          <div className={styles.editField}>
            {!agreement ? (
              <label className={styles.fileDropZone}>
                <input type="file" style={{ display: 'none' }} onChange={handleFile} />
                <i>📄</i>
                <p>Drop file here or click to upload</p>
                <span>Upload signed PDF or photos of the agreement.</span>
              </label>
            ) : (
              <div className={styles.filePreview}>
                <span className={styles.fileIcon}>📄</span>
                <div className={styles.fileInfo}>
                  <div className={styles.fileName}>{agreement.name}</div>
                  <div className={styles.fileSize}>Attached Agreement</div>
                </div>
                <button className={styles.removeFile} onClick={() => setAgreement(null)}>✕</button>
              </div>
            )}
          </div>
        </div>
        <div className={styles.modalFooter}>
          <button className={styles.modalCancel} onClick={onClose}>Cancel</button>
          <button className={styles.modalSave} onClick={save}>
            {existing ? 'Update Tenancy' : 'Save Tenancy'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════ PROPERTY DETAIL VIEW ═══════════════════════════════ */
function PropertyDetailView({ id, onBack, customProps, documents, tenancies, overrides, onUpdateNotes, onAddTenancy, onAddDoc }: {
  id: string; onBack: () => void; customProps: CustomProp[];
  documents: PropertyDocument[]; tenancies: Tenancy[];
  overrides: Record<string, PropOverride>;
  onUpdateNotes: (id: string, notes: string) => void;
  onAddTenancy: (id: string) => void;
  onAddDoc: (id: string) => void;
}) {
  const prop = PROPERTIES.find(p => p.id === id) || customProps.find(p => p.id === id);
  const propDocs = documents.filter(d => d.propertyId === id);
  const propTens = tenancies.filter(t => t.propertyId === id);
  const notes = overrides[id]?.notes || '';

  if (!prop) return <div className={styles.emptyState}><span>❓</span><p>Property not found.</p><button onClick={onBack} className={styles.btnSecondary}>Back to list</button></div>;

  const getDoc = (type: string) => propDocs.find(d => d.documentType === type);

  const complianceCategories = [
    {
      title: 'Property',
      items: [
        { type: 'EPC', label: 'EPC' },
        { type: 'Gas safety certificate', label: 'Gas safety certificate' },
        { type: 'EICR', label: 'EICR' },
        { type: 'ICO Registration', label: 'ICO Registration' },
        { type: 'Rent Smart Wales Registration', label: 'Rent Smart Wales Registration' },
        { type: 'Rent Smart Wales Licence', label: 'Rent Smart Wales Licence' },
        { type: 'Smoke Alarms', label: 'Smoke Alarms (evidence of presence on each living space floor)' },
        { type: 'CO detector', label: 'CO detector (in every room with fuel burning appliances)' },
        { type: 'Fit for Human Habitation', label: 'Declaration property is Fit for Human Habitation' },
      ]
    },
    {
      title: 'Tenancy',
      isTenancy: true
    },
    {
      title: 'Optional',
      isOptional: true,
      items: [
        { type: 'Legionella risk assessment', label: 'Legionella risk assessment' },
        { type: 'Portable Appliance Tests', label: 'Portable Appliance Tests' },
        { type: 'Fire Risk Assessment', label: 'Fire Risk Assessment' },
      ]
    }
  ];

  const totalChecks = complianceCategories.reduce((acc, cat) => acc + (cat.items?.length || 0), 0);
  const completedChecks = propDocs.filter(d => d.status === 'Current').length;

  return (
    <div className={styles.detailDeepDive}>
      <div className={styles.detailLeft}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <button onClick={onBack} className={styles.btnOutline} style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            ← Back
          </button>
          <div className={styles.breadcrumb} style={{ marginBottom: 0 }}>
            <button onClick={onBack}>Properties</button> / {prop.title}
          </div>
        </div>

        <div className={styles.detailCard}>
          <div className={styles.detailCardBody} style={{ display: 'flex', gap: '24px' }}>
            {prop.image ? (
              <img src={prop.image} alt={prop.title} style={{ width: 280, height: 180, borderRadius: 12, objectFit: 'cover' }} />
            ) : (
              <div style={{ width: 280, height: 180, borderRadius: 12, background: '#f8fafc', display: 'flex', alignItems: 'center', justifyCenter: 'center', fontSize: '3rem' }}>🏠</div>
            )}
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: 8, color: '#0f172a' }}>{prop.title}</h2>
                  <p style={{ color: '#64748b', fontSize: '0.9375rem', marginBottom: 20 }}>{prop.location}</p>
                </div>
                <div className={styles.checklistStatus}>
                  Status <span>Unknown</span> <span style={{ fontSize: '1rem' }}>❓</span>
                </div>
              </div>
              
              <div className={styles.detailGrid3}>
                <div>
                  <div className={styles.detailLabel} style={{ fontSize: '0.7rem', textTransform: 'uppercase', marginBottom: 4 }}>Price / Rent</div>
                  <div className={styles.detailValue} style={{ fontSize: '1.125rem', color: '#e11d48' }}>{prop.price}</div>
                </div>
                <div>
                  <div className={styles.detailLabel} style={{ fontSize: '0.7rem', textTransform: 'uppercase', marginBottom: 4 }}>Type</div>
                  <div className={styles.detailValue} style={{ fontSize: '1.125rem' }}>{prop.sector}</div>
                </div>
                <div>
                  <div className={styles.detailLabel} style={{ fontSize: '0.7rem', textTransform: 'uppercase', marginBottom: 4 }}>Compliance</div>
                  <div className={styles.detailValue}>
                    {propDocs.some(d => d.status === 'Expired') ? '❌ Expired' : propDocs.some(d => d.status === 'Expiring') ? '⚠️ Warning' : completedChecks === totalChecks ? '✅ Fully Compliant' : '🕒 In Progress'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Compliance Checklist Redesign */}
        <div className={styles.complianceCard}>
          <div className={styles.checklistHeader}>
            <h2>🛡️ Compliance Checklist</h2>
            <div className={styles.checklistStatus}>
              {completedChecks} / {totalChecks} Completed
            </div>
          </div>

          {complianceCategories.map((cat, idx) => (
            <div key={idx} className={styles.checklistSection}>
              {cat.isOptional && <span className={styles.optionalLabel}>Optional</span>}
              <h3>{cat.title}</h3>

              {cat.isTenancy ? (
                <div>
                  <p className={styles.tenancyDesc}>Add your tenancy here to see compliance checks</p>
                  <button className={styles.addTenancyBtn} onClick={() => onAddTenancy(id)}>Add Tenancy</button>
                  
                  {propTens.length > 0 && (
                    <div className={styles.tableWrap} style={{ marginTop: 16, border: 'none', borderRadius: 0 }}>
                      <table className={styles.table}>
                        <thead><tr><th>Tenant</th><th>Rent</th><th>Status</th></tr></thead>
                        <tbody>
                          {propTens.map(t => (
                            <tr key={t.id}>
                              <td style={{ fontWeight: 700 }}>{t.tenantName}</td>
                              <td>£{t.rentAmount}</td>
                              <td><span className={`${styles.pill} ${t.status === 'Active' ? styles.pillGreen : styles.pillGray}`}>{t.status}</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ) : (
                <div className={styles.checklistItems}>
                  {cat.items?.map((item, i) => {
                    const doc = getDoc(item.type);
                    return (
                      <div key={i} className={styles.checklistItem}>
                        <div className={`${styles.itemIcon} ${doc ? styles.itemIconChecked : ''}`}>
                          {doc ? '✅' : '❓'}
                        </div>
                        <div className={styles.itemInfo}>
                          <div className={styles.itemTitle}>{item.label}</div>
                          {doc && <div className={styles.itemExpiry}>Expires on {doc.expiryDate || 'N/A'}</div>}
                        </div>
                        <button 
                          className={styles.itemAction} 
                          onClick={() => doc ? onAddDoc(id)/* This should ideally be an edit, but using onAddDoc for now since we don't have direct edit prop here */ : onAddDoc(id)}
                        >
                          {doc ? 'Update' : 'Add'} 
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.detailRight}>
        <div className={styles.detailCard}>
          <div className={styles.detailCardHeader}><h3>📌 Admin Private Notes</h3></div>
          <div className={styles.detailCardBody}>
            <textarea 
              className={styles.notesArea} 
              placeholder="Add internal notes about this property, landlord, or issues…"
              value={notes}
              onChange={(e) => onUpdateNotes(id, e.target.value)}
            />
            <p style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: 12 }}>
              Notes are private to administrators and automatically saved.
            </p>
          </div>
        </div>

        <div className={styles.detailCard}>
          <div className={styles.detailCardHeader}><h3>🏢 Property Summary</h3></div>
          <div className={styles.detailCardBody}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
                <span style={{ color: '#64748b' }}>Beds / Baths</span>
                <span style={{ fontWeight: 700 }}>{prop.beds} / {prop.baths}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
                <span style={{ color: '#64748b' }}>Area</span>
                <span style={{ fontWeight: 700 }}>{prop.sqft} sq ft</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
                <span style={{ color: '#64748b' }}>Listing Type</span>
                <span style={{ fontWeight: 700 }}>{prop.type || 'Custom'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
