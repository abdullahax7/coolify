"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { PROPERTIES, type Property } from '@/data/properties';
import styles from './admin.module.css';
import { exportPDF, uint8ToBase64 } from '@/components/PSPDFKitViewer';
import MessagesTab, { type Message } from './components/MessagesTab';
import ConfirmModalShared from './components/ConfirmModal';

const PSPDFKitViewer = dynamic(() => import('@/components/PSPDFKitViewer'), {
  ssr: false,
  loading: () => <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:500, color:'#94a3b8' }}>Loading PDF editor…</div>,
});

/* ═══════════════════════════════ TYPES ═══════════════════════════════ */
interface Order {
  id: string; type: 'listing' | 'service'; name: string;
  price: string; detail: string; date: string; status: string;
  customerName: string; customerEmail: string; customerPhone: string;
  formData?: Record<string, string>;
  formType?: string;
}
interface Submission {
  id: string; address: string; postcode: string; type: string;
  beds: string; baths: string; sqft: string; price: string;
  description: string; features: string; submittedAt: string; status: string;
  contactName: string; contactEmail: string; contactPhone: string;
}
interface PropOverride { hidden?: boolean; featured?: boolean; notes?: string; }
interface CustomProp {
  id: string; title: string; location: string; price: string;
  beds: string; baths: string; sqft: string; type: string;
  sector: string; status: string; createdAt: string; notes: string;
  image: string; gallery: string; mapEmbedUrl: string;
  description: string; features: string;
}
interface PropertyDocument {
  id: string;
  propertyId: string;
  propertyName: string;
  documentType: string;
  expiryDate: string;
  dateUploaded: string;
  status: 'Current' | 'Expiring' | 'Expired';
  fileUrl?: string;   // signed URL from Supabase storage (loaded from DB)
  fileBase64?: string; // data URI (newly uploaded in modal, before save)
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
interface Appointment {
  id: string;
  name: string;
  number: string;
  timing: string;
  day: string;
  description?: string;
  createdAt: string;
}
interface CashInquiry {
  id: string;
  name: string;
  phone: string;
  email: string;
  price: string;
  address: string;
  postcode: string;
  date: string;
  status: 'new' | 'viewed' | 'contacted' | 'rejected' | 'accepted';
}

import { signIn as supabaseSignIn, signOut as supabaseSignOut, getUser } from '@/lib/auth';

type Tab = 'overview' | 'properties' | 'submissions' | 'listing-plans' | 'services' | 'messages' | 'documents' | 'tenants' | 'appointments' | 'forms' | 'cash-buyers' | 'tenancy-form';

interface TenancyFormRecord {
  id: string;
  tenantName: string;
  landlordName: string;
  propertyAddress: string;
  contractStartDate: string;
  contractEndDate: string;
  monthlyRent: string;
  depositAmount: string;
  tenantEmail: string;
  tenantPhone: string;
  landlordEmail: string;
  landlordPhone: string;
  additionalNotes: string;
  uploadedContract?: { name: string; base64: string };
  createdAt: string;
  status: 'draft' | 'active' | 'ended';
}

function today() { return new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }); }

/* ═══════════════════════════════ ROOT ═══════════════════════════════ */
export default function AdminPanel() {
  const [authed, setAuthed] = useState(false);
  const [ready, setReady]   = useState(false);
  const [tab, setTab]       = useState<Tab>('overview');

  useEffect(() => {
    getUser().then(u => {
      if (u?.isAdmin) setAuthed(true);
      setReady(true);
    });
  }, []);

  if (!ready) return null;
  if (!authed) return (
    <AdminLogin onLogin={() => setAuthed(true)} />
  );
  return <Shell tab={tab} setTab={setTab} onLogout={async () => { await supabaseSignOut(); setAuthed(false); }} />;
}

/* ═══════════════════════════════ LOGIN ═══════════════════════════════ */
function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('');
  const [pass, setPass]   = useState('');
  const [err, setErr]     = useState('');
  const [busy, setBusy]   = useState(false);
  const [show, setShow]   = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setErr(''); setBusy(true);
    const { error } = await supabaseSignIn(email, pass);
    if (error) { setErr('Invalid credentials. Please try again.'); setBusy(false); return; }
    const user = await getUser();
    if (!user?.isAdmin) { setErr('You do not have admin access.'); setBusy(false); return; }
    onLogin();
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
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [cashInquiries, setCashInquiries] = useState<CashInquiry[]>([]);
  const [tenancyForms, setTenancyForms] = useState<TenancyFormRecord[]>([]);
  const [menuOpen, setMenuOpen]   = useState(false);

  useEffect(() => {
    (async () => {
      const fetchItem = async (url: string, key: string) => {
        try {
          const res = await fetch(url);
          if (!res.ok) throw new Error(`Failed to fetch ${key}`);
          return await res.json();
        } catch (e) {
          console.error(`Error loading ${key}:`, e);
          return { [key]: [] }; // Return empty set on failure
        }
      };

      const [oD, sD, mD, dD, tD, aD, cD, tfD, cpD, orD] = await Promise.all([
        fetchItem('/api/orders', 'orders'),
        fetchItem('/api/submissions', 'submissions'),
        fetchItem('/api/messages', 'messages'),
        fetchItem('/api/documents', 'documents'),
        fetchItem('/api/tenancies', 'tenancies'),
        fetchItem('/api/appointments', 'appointments'),
        fetchItem('/api/cash-inquiries', 'inquiries'),
        fetchItem('/api/tenancy-forms', 'forms'),
        fetchItem('/api/properties/custom', 'properties'),
        fetchItem('/api/properties/overrides', 'overrides'),
      ]);

      setOrders((oD.orders ?? []).map((o: Record<string,unknown>) => ({
        id: o.id, type: o.type, name: o.name, price: o.price, detail: o.detail ?? '',
        date: o.date ?? '', status: o.status, formType: o.form_type ?? undefined,
        formData: o.form_data ?? undefined, customerName: o.customer_name ?? '',
        customerEmail: o.customer_email ?? '', customerPhone: o.customer_phone ?? '',
      })));
      setSubs((sD.submissions ?? []).map((s: Record<string,unknown>) => ({
        id: s.id, address: s.address, postcode: s.postcode, type: s.type,
        beds: s.beds, baths: s.baths, sqft: s.sqft, price: s.price,
        description: s.description, features: s.features, status: s.status,
        submittedAt: s.submitted_at ? new Date(s.submitted_at as string).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '',
        contactName: s.contact_name, contactEmail: s.contact_email, contactPhone: s.contact_phone,
      })));
      setMessages((mD.messages ?? []).map((m: Record<string,unknown>) => ({
        id: m.id, name: m.name, email: m.email, phone: m.phone ?? '',
        subject: m.subject, message: m.message, read: m.read ?? false,
        receivedAt: m.received_at ? new Date(m.received_at as string).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '',
      })));
      setDocuments((dD.documents ?? []).map((d: Record<string,unknown>) => ({
        id: d.id, propertyId: d.property_id, propertyName: d.property_name,
        documentType: d.document_type, expiryDate: d.expiry_date,
        dateUploaded: d.date_uploaded, status: d.status, fileUrl: d.file_url, fileName: d.file_name,
      })));
      setTenancies((tD.tenancies ?? []).map((t: Record<string,unknown>) => ({
        id: t.id, propertyId: t.property_id, propertyName: t.property_name,
        startDate: t.start_date, endDate: t.end_date, rentAmount: t.rent_amount,
        rentFrequency: t.rent_frequency, rentDay: t.rent_day, depositAmount: t.deposit_amount,
        tenantName: t.tenant_name, tenantEmail: t.tenant_email, tenantPhone: t.tenant_phone,
        agreementFile: t.agreement_file_url ? { name: '', base64: t.agreement_file_url as string } : undefined,
        status: t.status, createdAt: t.created_at ?? '',
      })));
      setAppointments((aD.appointments ?? []).map((a: Record<string,unknown>) => ({
        id: a.id, name: a.name, number: a.number, timing: a.timing, day: a.day,
        description: a.description ?? undefined, createdAt: a.created_at ?? '',
      })));
      setCashInquiries((cD.inquiries ?? []).map((c: Record<string,unknown>) => ({
        id: c.id, name: c.name, phone: c.phone, email: c.email, price: c.price,
        address: c.address, postcode: c.postcode, date: c.date ?? '', status: c.status,
      })));
      setTenancyForms((tfD.forms ?? []).map((f: Record<string,unknown>) => ({
        id: f.id, tenantName: f.tenant_name, landlordName: f.landlord_name,
        propertyAddress: f.property_address, contractStartDate: f.contract_start_date,
        contractEndDate: f.contract_end_date, monthlyRent: f.monthly_rent,
        depositAmount: f.deposit_amount, tenantEmail: f.tenant_email, tenantPhone: f.tenant_phone,
        landlordEmail: f.landlord_email, landlordPhone: f.landlord_phone,
        additionalNotes: f.additional_notes ?? '',
        uploadedContract: f.contract_file_url ? { name: '', base64: f.contract_file_url as string } : undefined,
        createdAt: f.created_at ?? '', status: f.status,
      })));
      setCustomProps((cpD.properties ?? []).map((p: Record<string,unknown>) => ({
        id: p.id, title: p.title, location: p.location, price: p.price,
        beds: p.beds, baths: p.baths, sqft: p.sqft, type: p.type,
        sector: p.sector, status: p.status, createdAt: p.created_at ?? '',
        notes: p.notes ?? '', image: p.image_url ?? '', gallery: p.gallery_urls ?? '',
        mapEmbedUrl: p.map_embed_url ?? '', description: p.description ?? '',
        features: p.features ?? '', interior: p.interior ?? '', exterior: p.exterior ?? '',
      })));
      const overrideMap: Record<string, PropOverride> = {};
      (orD.overrides ?? []).forEach((o: Record<string,unknown>) => {
        overrideMap[o.property_id as string] = { hidden: o.hidden as boolean, featured: o.featured as boolean, notes: o.notes as string };
      });
      setOverrides(overrideMap);
    })();
  }, []);

  const api = {
    post: (url: string, body: unknown) => fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }),
    put:  (url: string, body: unknown) => fetch(url, { method: 'PUT',  headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }),
    del:  (url: string)               => fetch(url, { method: 'DELETE' }),
  };

  /* Orders CRUD */
  const createOrder = async (o: Omit<Order, 'id' | 'date'> | Order) => {
    const res = await api.post('/api/orders', o);
    const data = await res.json();
    setOrders(prev => [{ ...o, id: data.id, date: data.date ?? today() } as Order, ...prev]);
  };
  const updateOrder = async (upd: Order) => {
    await api.put(`/api/orders/${upd.id}`, upd);
    setOrders(prev => prev.map(o => o.id === upd.id ? upd : o));
  };
  const deleteOrder = async (id: string) => {
    await api.del(`/api/orders/${id}`);
    setOrders(prev => prev.filter(o => o.id !== id));
  };

  /* Submissions CRUD */
  const createSub = async (s: Omit<Submission, 'id' | 'submittedAt' | 'status'>) => {
    const res = await api.post('/api/submissions', { ...s, contactName: s.contactName, contactEmail: s.contactEmail, contactPhone: s.contactPhone });
    const data = await res.json();
    setSubs(prev => [{ ...s, id: data.id, submittedAt: today(), status: 'pending' as const }, ...prev]);
  };
  const updateSub = async (upd: Submission) => {
    await api.put(`/api/submissions/${upd.id}`, {
      status: upd.status,
      address: upd.address, postcode: upd.postcode, type: upd.type,
      beds: upd.beds, baths: upd.baths, sqft: upd.sqft, price: upd.price,
      description: upd.description, features: upd.features,
      contact_name: upd.contactName, contact_email: upd.contactEmail, contact_phone: upd.contactPhone,
    });
    setSubs(prev => prev.map(s => s.id === upd.id ? upd : s));
  };
  const deleteSub = async (id: string) => {
    await api.del(`/api/submissions/${id}`);
    setSubs(prev => prev.filter(s => s.id !== id));
  };

  /* Messages CRUD */
  const markRead = async (id: string) => {
    await api.put(`/api/messages/${id}`, { read: true });
    setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m));
  };
  const markAllRead = async () => {
    await Promise.all(messages.filter(m => !m.read).map(m => api.put(`/api/messages/${m.id}`, { read: true })));
    setMessages(prev => prev.map(m => ({ ...m, read: true })));
  };
  const deleteMsg = async (id: string) => {
    await api.del(`/api/messages/${id}`);
    setMessages(prev => prev.filter(m => m.id !== id));
  };

  /* Property overrides */
  const saveOverride = async (id: string, patch: Partial<PropOverride>) => {
    const next = { ...(overrides[id] ?? {}), ...patch };
    await api.post('/api/properties/overrides', { propertyId: id, ...next });
    setOverrides(prev => ({ ...prev, [id]: { ...(prev[id] ?? {}), ...patch } }));
  };

  /* Custom properties CRUD */
  const createCustom = async (c: Omit<CustomProp, 'id' | 'createdAt'>) => {
    const res = await api.post('/api/properties/custom', { 
      title: c.title, location: c.location, price: c.price,
      beds: c.beds, baths: c.baths, sqft: c.sqft,
      type: c.type, sector: c.sector, status: c.status,
      notes: c.notes, image_url: c.image, gallery_urls: c.gallery,
      map_embed_url: c.mapEmbedUrl, description: c.description,
      features: c.features
    });
    const data = await res.json();
    setCustomProps(prev => [{ ...c, id: data.id, createdAt: today() }, ...prev]);
  };
  const updateCustom = async (upd: CustomProp) => {
    await api.put(`/api/properties/custom/${upd.id}`, { 
      title: upd.title, location: upd.location, price: upd.price,
      beds: upd.beds, baths: upd.baths, sqft: upd.sqft,
      type: upd.type, sector: upd.sector, status: upd.status,
      notes: upd.notes, image_url: upd.image, gallery_urls: upd.gallery,
      map_embed_url: upd.mapEmbedUrl, description: upd.description,
      features: upd.features
    });
    setCustomProps(prev => prev.map(c => c.id === upd.id ? upd : c));
  };
  const deleteCustom = async (id: string) => {
    await api.del(`/api/properties/custom/${id}`);
    setCustomProps(prev => prev.filter(c => c.id !== id));
  };

  /* Documents CRUD */
  const createDoc = async (d: Omit<PropertyDocument, 'id' | 'dateUploaded'>) => {
    const fd = new FormData();
    fd.append('meta', JSON.stringify({ propertyId: d.propertyId, propertyName: d.propertyName, documentType: d.documentType, expiryDate: d.expiryDate, status: d.status }));
    if (d.fileBase64 && d.fileName) {
      const blob = await fetch(d.fileBase64).then(r => r.blob());
      fd.append('file', blob, d.fileName);
    }
    const res = await fetch('/api/documents', { method: 'POST', body: fd });
    const data = await res.json();
    setDocuments(prev => [{ ...d, id: data.id, fileUrl: data.file_url ?? undefined, dateUploaded: today() }, ...prev]);
  };
  const updateDoc = async (upd: PropertyDocument) => {
    await api.put(`/api/documents/${upd.id}`, { status: upd.status, expiry_date: upd.expiryDate });
    setDocuments(prev => prev.map(d => d.id === upd.id ? upd : d));
  };
  const deleteDoc = async (id: string) => {
    await api.del(`/api/documents/${id}`);
    setDocuments(prev => prev.filter(d => d.id !== id));
  };

  /* Tenancies CRUD */
  const createTenancy = async (t: Omit<Tenancy, 'id' | 'createdAt'>) => {
    const res = await api.post('/api/tenancies', { propertyId: t.propertyId, propertyName: t.propertyName, startDate: t.startDate, endDate: t.endDate, rentAmount: t.rentAmount, rentFrequency: t.rentFrequency, rentDay: t.rentDay, depositAmount: t.depositAmount, tenantName: t.tenantName, tenantEmail: t.tenantEmail, tenantPhone: t.tenantPhone, status: t.status });
    const data = await res.json();
    setTenancies(prev => [{ ...t, id: data.id, createdAt: today() }, ...prev]);
  };
  const updateTenancy = async (upd: Tenancy) => {
    await api.put(`/api/tenancies/${upd.id}`, { status: upd.status });
    setTenancies(prev => prev.map(t => t.id === upd.id ? upd : t));
  };
  const deleteTenancy = async (id: string) => {
    await api.del(`/api/tenancies/${id}`);
    setTenancies(prev => prev.filter(t => t.id !== id));
  };

  /* Appointments CRUD */
  const createAppointment = async (a: Omit<Appointment, 'id' | 'createdAt'>) => {
    const res = await api.post('/api/appointments', a);
    const data = await res.json();
    setAppointments(prev => [{ ...a, id: data.id, createdAt: today() }, ...prev]);
  };
  const updateAppointment = async (upd: Appointment) => {
    await api.put(`/api/appointments/${upd.id}`, { name: upd.name, number: upd.number, timing: upd.timing, day: upd.day, description: upd.description ?? null });
    setAppointments(prev => prev.map(a => a.id === upd.id ? upd : a));
  };
  const deleteAppointment = async (id: string) => {
    await api.del(`/api/appointments/${id}`);
    setAppointments(prev => prev.filter(a => a.id !== id));
  };

  /* Cash Inquiries CRUD */
  const updateCashInquiry = async (inc: CashInquiry) => {
    await api.put(`/api/cash-inquiries/${inc.id}`, { status: inc.status });
    setCashInquiries(prev => prev.map(i => i.id === inc.id ? inc : i));
  };
  const deleteCashInquiry = async (id: string) => {
    await api.del(`/api/cash-inquiries/${id}`);
    setCashInquiries(prev => prev.filter(i => i.id !== id));
  };

  /* Tenancy Forms CRUD */
  const createTenancyForm = async (f: Omit<TenancyFormRecord, 'id' | 'createdAt'>) => {
    const res = await api.post('/api/tenancy-forms', { tenantName: f.tenantName, landlordName: f.landlordName, propertyAddress: f.propertyAddress, contractStartDate: f.contractStartDate, contractEndDate: f.contractEndDate, monthlyRent: f.monthlyRent, depositAmount: f.depositAmount, tenantEmail: f.tenantEmail, tenantPhone: f.tenantPhone, landlordEmail: f.landlordEmail, landlordPhone: f.landlordPhone, additionalNotes: f.additionalNotes, status: f.status });
    const data = await res.json();
    setTenancyForms(prev => [{ ...f, id: data.id, createdAt: today() }, ...prev]);
  };
  const updateTenancyForm = async (upd: TenancyFormRecord) => {
    await api.put(`/api/tenancy-forms/${upd.id}`, { status: upd.status });
    setTenancyForms(prev => prev.map(f => f.id === upd.id ? upd : f));
  };
  const deleteTenancyForm = async (id: string) => {
    await api.del(`/api/tenancy-forms/${id}`);
    setTenancyForms(prev => prev.filter(f => f.id !== id));
  };

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
    { id: 'appointments',   label: 'Appointments',   icon: '📅' },
    { id: 'cash-buyers',    label: 'Cash Buyers',    icon: '💰' },
    { id: 'forms',          label: 'Wales Forms',     icon: '🏴󠁧󠁢󠁷󠁬󠁳󠁿', badge: orders.filter(o => !!o.formType).length || undefined },
    { id: 'tenancy-form',   label: 'Tenancy Form',    icon: '📄', badge: tenancyForms.filter(f => f.status === 'active').length || undefined },
  ];

  return (
    <div className={`${styles.shell} ${menuOpen ? styles.menuOpen : ''}`}>
      {/* Sidebar Overlay for mobile */}
      {menuOpen && <div className={styles.sidebarOverlay} onClick={() => setMenuOpen(false)} />}
      
      <aside className={`${styles.sidebar} ${menuOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarTop}>
          <div className={styles.brand}>
            <div className={styles.brandName}>PROPERTY <span>TRADER</span></div>
            <div className={styles.brandBadge}>Admin Console</div>
          </div>
          <nav className={styles.nav}>
            {nav.map(n => (
              <button key={n.id} onClick={() => { setTab(n.id); setViewingPropId(null); setMenuOpen(false); }}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button className={styles.mobToggle} onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? '✕' : '☰'}
            </button>
            <h1 className={styles.pageTitle}>{nav.find(n => n.id === tab)?.label}</h1>
          </div>
          <div className={styles.topRight}>
            <span className={styles.adminBadge}>Admin</span>
            <span className={styles.adminEmail}>admin@propertytrader1.co.uk</span>
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
              {tab === 'overview'      && <Overview orders={orders} submissions={submissions} messages={messages} setTab={setTab} documents={documents} tenancies={tenancies} />}
              {tab === 'properties'    && <PropertiesTab overrides={overrides} onOverride={saveOverride} customProps={customProps} onCreate={createCustom} onUpdate={updateCustom} onDelete={deleteCustom} onAddTenancy={(id) => { setInitTenancy(id); setTab('tenants'); }} onAddDoc={setInitDocPropId} onViewCompliance={(id) => setInitDocPropId(id)} onViewDetails={(id) => setViewingPropId(id)} />}
              {tab === 'submissions'   && <SubmissionsTab submissions={submissions} onCreate={createSub} onUpdate={updateSub} onDelete={deleteSub} />}
              {tab === 'listing-plans' && <OrdersTab type="listing" orders={listingOrders} onCreate={createOrder} onUpdate={updateOrder} onDelete={deleteOrder} />}
              {tab === 'services'      && <OrdersTab type="service" orders={serviceOrders} onCreate={createOrder} onUpdate={updateOrder} onDelete={deleteOrder} />}
              {tab === 'messages'      && <MessagesTab messages={messages} onMarkRead={markRead} onMarkAllRead={markAllRead} onDelete={deleteMsg} />}
              {tab === 'documents'     && <DocumentsTab documents={documents} onCreate={createDoc} onUpdate={updateDoc} onDelete={deleteDoc} customProps={customProps} />}
              {tab === 'tenants'       && <TenantsTab tenancies={tenancies} onCreate={createTenancy} onUpdate={updateTenancy} onDelete={deleteTenancy} customProps={customProps} initialPropertyId={initTenancy} onModalClose={() => setInitTenancy(null)} />}
              {tab === 'appointments' && <AppointmentsTab appointments={appointments} onCreate={createAppointment} onUpdate={updateAppointment} onDelete={deleteAppointment} />}
              {tab === 'cash-buyers'  && <CashBuyersTab inquiries={cashInquiries} onUpdate={updateCashInquiry} onDelete={deleteCashInquiry} />}
              {tab === 'forms'         && <FormsTab orders={orders} onUpdateOrder={updateOrder} onCreateOrder={createOrder} onDeleteOrder={deleteOrder} />}
              {tab === 'tenancy-form'  && <TenancyFormTab forms={tenancyForms} onCreate={createTenancyForm} onUpdate={updateTenancyForm} onDelete={deleteTenancyForm} />}
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

/* ConfirmModal — now lives in ./components/ConfirmModal.tsx */
const ConfirmModal = ConfirmModalShared;

function Overview({ orders, submissions, messages, setTab, documents, tenancies }: {
  orders: Order[]; submissions: Submission[]; messages: Message[];
  setTab: (t: Tab) => void;
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
function PropertyListItem({ title, image, sector, isCustom, onEdit, onDelete, onAddTenancy, onAddDoc, onViewCompliance, isHidden, onViewDetails, onToggleVisibility }: {
  id: string; title: string; location: string; image?: string; sector: string; isCustom: boolean;
  onEdit: () => void; onDelete: () => void; onAddTenancy: () => void; onAddDoc: () => void;
  onViewCompliance: () => void; onViewDetails: () => void; onToggleVisibility?: () => void; isHidden?: boolean;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className={styles.propCard}>
      <div className={styles.propCardImgWrap}>
        {image ? <Image src={image} alt={title} className={styles.propCardImg} width={120} height={80} unoptimized /> : <div className={styles.customThumb}>🏠</div>}
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
  description: '', features: '',
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
  const [showHidden]              = useState(false);
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

  const [uploading, setUploading] = useState(false);

  const uploadFiles = async (files: FileList | null, multi: boolean) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    
    try {
      const results: string[] = [];
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append('file', file);
        fd.append('bucket', 'properties');
        
        const res = await fetch('/api/storage/upload', {
          method: 'POST',
          body: fd
        });
        const data = await res.json();
        if (data.url) results.push(data.url);
      }

      if (multi) {
        const existing = (draft.gallery || '').split('|DELIM|').map(s => s.trim()).filter(Boolean);
        onChange('gallery', [...existing, ...results].join('|DELIM|'));
      } else if (results.length > 0) {
        onChange('image', results[0]);
      }
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Failed to upload one or more images.');
    } finally {
      setUploading(false);
    }
  };

  const galleryList = (draft.gallery || '').split('|DELIM|').map(s => s.trim()).filter(Boolean);

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
        <div className={styles.editField}><label>Listing Status</label>
          <select value={draft.status} onChange={e => onChange('status', e.target.value)}><option>Live</option><option>Draft</option><option>Archived</option></select>
        </div>
      </div>

      {/* Photos */}
      <div className={styles.propFormSection}><h4>Photos</h4></div>
      <div className={styles.photoSection}>
        {/* Main image */}
        <div className={styles.photoBlock}>
          <div className={styles.photoBlockLabel}>Main Photo</div>
          {draft.image && <Image src={draft.image} alt="main" className={styles.photoPreviewMain} width={200} height={150} unoptimized />}
          <label className={styles.uploadBtn}>
            📷 {draft.image ? 'Replace Main Photo' : 'Upload Main Photo'}
            <input type="file" accept="image/*" style={{ display: 'none' }}
              onChange={e => uploadFiles(e.target.files, false)} disabled={uploading} />
          </label>
          {uploading && <div className={styles.uploadProgress}>Uploading...</div>}
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
                  <Image src={src} alt={`gallery-${i}`} className={styles.galleryThumb} width={80} height={60} unoptimized />
                  <button type="button" className={styles.galleryRemoveBtn}
                    onClick={() => onChange('gallery', galleryList.filter((_, j) => j !== i).join('|DELIM|'))}>✕</button>
                </div>
              ))}
            </div>
          )}
          <label className={styles.uploadBtn}>
            🖼️ Add Gallery Photos
            <input type="file" accept="image/*" multiple style={{ display: 'none' }}
              onChange={e => uploadFiles(e.target.files, true)} disabled={uploading} />
          </label>
          {uploading && <div className={styles.uploadProgress}>Uploading...</div>}
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

/* MessagesTab — extracted to ./components/MessagesTab.tsx */

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
                      <button className={styles.docActionIcon} title="View" onClick={() => { const url = doc.fileUrl || doc.fileBase64; if (url) window.open(url, '_blank'); }}>👁️</button>
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
          const dateStr = `${y}-${m}-${d}`;
          requestAnimationFrame(() => setExpiry(dateStr));
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
      requestAnimationFrame(() => setCreateOpen(true));
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
      rentFrequency: rentFrequency as 'Monthly' | 'Weekly' | 'Quarterly',
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
              <select className={styles.filterSelect} value={rentFrequency} onChange={(e) => setRentFrequency(e.target.value as 'Monthly' | 'Weekly' | 'Quarterly')}>
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
              <Image src={prop.image} alt={prop.title} width={280} height={180} style={{ borderRadius: 12, objectFit: 'cover' }} />
            ) : (
              <div style={{ width: 280, height: 180, borderRadius: 12, background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>🏠</div>
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

/* ═══════════════════════════════ WALES FORMS ═══════════════════════════════ */
const WALES_FORMS = [
  'Form RHW1', 'Form RHW2', 'Form RHW3', 'Form RHW4', 'Form RHW6', 'Form RHW7', 
  'Form RHW8', 'Form RHW12', 'Form RHW15', 'Form RHW16', 'Form RHW17', 'Form RHW18',
  'Form RHW19', 'Form RHW20', 'Form RHW21', 'Form RHW22', 'Form RHW23', 'Form RHW24',
  'Form RHW25', 'Form RHW26', 'Form RHW27', 'Form RHW28', 'Form RHW29', 'Form RHW30',
  'Form RHW32', 'Form RHW33', 'Form RHW34', 'Form RHW35', 'Form RHW36', 'Form RHW37', 'Form RHW38'
];

function FormsTab({ orders, onUpdateOrder, onCreateOrder, onDeleteOrder }: {
  orders: Order[];
  onUpdateOrder: (o: Order) => void;
  onCreateOrder: (o: Order) => void;
  onDeleteOrder: (id: string) => void;
}) {
  const [selected,    setSelected]    = useState<Order | null>(null);
  const [createOpen,  setCreateOpen]  = useState(false);
  const [editOpen,    setEditOpen]    = useState(false);
  const [pdfEditorOpen, setPdfEditorOpen] = useState(false);
  const [warnDelete,  setWarnDelete]  = useState<Order | null>(null);
  const [search,      setSearch]      = useState('');

  const formOrders = orders.filter(o =>
    !!o.formType &&
    (!search ||
      o.formType.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()))
  );

  const downloadPDF = (order: Order) => {
    const b64  = order.formData?.pdfBase64;
    const name = order.formData?.pdfName || `${order.formType}.pdf`;
    if (!b64) { alert('No PDF uploaded for this record.'); return; }
    const bytes = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
    const blob  = new Blob([bytes], { type: 'application/pdf' });
    const url   = URL.createObjectURL(blob);
    const a     = Object.assign(document.createElement('a'), { href: url, download: name });
    document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(url);
  };

  const handleSaveNew = (data: {
    formType: string; clientName: string; clientEmail: string;
    clientPhone: string; notes: string; pdfBase64: string; pdfName: string;
  }) => {
    const newOrder: Order = {
      id: `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      date: today(),
      type: 'service',
      name: data.formType,
      price: '£0.00 (Admin)',
      detail: data.notes || 'Admin Wales Form',
      status: 'active',
      customerName:  data.clientName  || 'Admin',
      customerEmail: data.clientEmail || 'admin@propertytrader1.co.uk',
      customerPhone: data.clientPhone,
      formType: data.formType,
      formData: { pdfBase64: data.pdfBase64, pdfName: data.pdfName, notes: data.notes },
    };
    onCreateOrder(newOrder);
    setCreateOpen(false);
    setSelected(newOrder);
    // If no PDF was uploaded, immediately open the PSPDFKit editor
    if (!data.pdfBase64) setPdfEditorOpen(true);
  };

  const handleSaveEdit = (data: {
    formType: string; clientName: string; clientEmail: string;
    clientPhone: string; notes: string; pdfBase64: string; pdfName: string;
  }) => {
    if (!selected) return;
    const updated: Order = {
      ...selected,
      name:          data.formType,
      customerName:  data.clientName  || selected.customerName,
      customerEmail: data.clientEmail || selected.customerEmail,
      customerPhone: data.clientPhone,
      detail:        data.notes || selected.detail,
      formType:      data.formType,
      formData: {
        ...selected.formData,
        pdfBase64: data.pdfBase64 || selected.formData?.pdfBase64 || '',
        pdfName:   data.pdfName   || selected.formData?.pdfName   || '',
        notes:     data.notes,
      },
    };
    onUpdateOrder(updated);
    setSelected(updated);
    setEditOpen(false);
  };

  return (
    <div>
      <div className={styles.toolbar}>
        <input className={styles.searchInput} placeholder="Search form type or client…" value={search} onChange={e => setSearch(e.target.value)} />
        <div className={styles.toolbarCount}>{formOrders.length} records</div>
        <button className={styles.createBtn} onClick={() => setCreateOpen(true)}>+ Add Form Record</button>
      </div>

      <div className={styles.splitView}>
        {/* ── Left: list ── */}
        <div className={styles.splitLeft}>
          {formOrders.length === 0 ? (
            <div className={styles.emptyState}><span>🏴󠁧󠁢󠁷󠁬󠁳󠁿</span><p>No Wales Form records yet.</p></div>
          ) : (
            <div className={styles.submissionCards}>
              {formOrders.map(o => (
                <div key={o.id}
                  className={`${styles.submissionCard} ${selected?.id === o.id ? styles.submissionCardActive : ''}`}
                  onClick={() => setSelected(o)}>
                  <div className={styles.submissionCardTop}>
                    <div>
                      <div className={styles.submissionAddr}>{o.formType}</div>
                      <div className={styles.submissionMeta}>{o.customerName}</div>
                    </div>
                    <span style={{
                      fontSize: '0.7rem', padding: '3px 8px', borderRadius: 6,
                      background: o.formData?.pdfBase64 ? '#dcfce7' : '#fef9c3',
                      color: o.formData?.pdfBase64 ? '#166534' : '#854d0e', fontWeight: 700,
                    }}>
                      {o.formData?.pdfBase64 ? '📄 PDF' : '⚠ No PDF'}
                    </span>
                  </div>
                  <div className={styles.submissionDate}>{o.date}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Right: detail ── */}
        <div className={styles.splitRight}>
          {!selected ? (
            <div className={styles.emptyState}><span>👈</span><p>Select a record to view.</p></div>
          ) : (
            <div className={styles.detailPanel}>
              <div className={styles.detailHeader}>
                <h2>{selected.formType}</h2>
                <div className={styles.actions}>
                  <button className={styles.btnEdit}   onClick={() => setEditOpen(true)}>✏️ Edit</button>
                  <button
                    className={styles.btnInfo}
                    onClick={() => setPdfEditorOpen(true)}
                    title="Open in PSPDFKit editor"
                  >
                    📝 PSPDFKit
                  </button>
                  <button className={styles.btnInfo}   onClick={() => downloadPDF(selected)} disabled={!selected.formData?.pdfBase64}>📥 Download PDF</button>
                  <button className={styles.btnDanger} onClick={() => setWarnDelete(selected)}>🗑️</button>
                </div>
              </div>

              <div className={styles.formEditorBox} style={{ marginTop: 16 }}>
                <div className={styles.editGrid}>
                  <div className={styles.editField}>
                    <label>Client Name</label>
                    <div className={styles.readVal}>{selected.customerName || '—'}</div>
                  </div>
                  <div className={styles.editField}>
                    <label>Client Email</label>
                    <div className={styles.readVal}>{selected.customerEmail || '—'}</div>
                  </div>
                  <div className={styles.editField}>
                    <label>Client Phone</label>
                    <div className={styles.readVal}>{selected.customerPhone || '—'}</div>
                  </div>
                  <div className={styles.editField}>
                    <label>Date Added</label>
                    <div className={styles.readVal}>{selected.date}</div>
                  </div>
                  <div className={`${styles.editField} ${styles.editSpan2}`}>
                    <label>Notes</label>
                    <div className={styles.readVal} style={{ whiteSpace: 'pre-wrap' }}>{selected.formData?.notes || '—'}</div>
                  </div>
                  <div className={`${styles.editField} ${styles.editSpan2}`}>
                    <label>Uploaded PDF</label>
                    {selected.formData?.pdfBase64 ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
                        <span style={{ fontSize: '1.4rem' }}>📄</span>
                        <div>
                          <div style={{ fontWeight: 700, color: '#1e293b' }}>{selected.formData.pdfName}</div>
                          <button className={styles.btnInfo} style={{ marginTop: 4, fontSize: '0.8rem', padding: '4px 12px' }} onClick={() => downloadPDF(selected)}>
                            Download
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div style={{ color: '#f59e0b', fontWeight: 600, marginTop: 4 }}>⚠ No PDF uploaded — click Edit to upload one.</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Create modal ── */}
      {createOpen && (
        <WalesFormModal
          title="Add Wales Form Record"
          existing={null}
          onClose={() => setCreateOpen(false)}
          onSave={handleSaveNew}
        />
      )}

      {/* ── Edit modal ── */}
      {editOpen && selected && (
        <WalesFormModal
          title="Edit Wales Form Record"
          existing={selected}
          onClose={() => setEditOpen(false)}
          onSave={handleSaveEdit}
        />
      )}

      {/* ── PSPDFKit editor modal ── */}
      {pdfEditorOpen && selected && (
        <PSPDFKitEditorModal
          order={selected}
          onClose={() => setPdfEditorOpen(false)}
          onSave={(pdfBase64, pdfName) => {
            const updated: Order = {
              ...selected,
              formData: { ...selected.formData, pdfBase64, pdfName },
            };
            onUpdateOrder(updated);
            setSelected(updated);
            setPdfEditorOpen(false);
          }}
        />
      )}

      {/* ── Delete confirm ── */}
      {warnDelete && (
        <ConfirmModal
          title="Delete Form Record?"
          body={`Delete "${warnDelete.formType}" for ${warnDelete.customerName}? This cannot be undone.`}
          confirmLabel="Delete"
          onConfirm={() => { onDeleteOrder(warnDelete.id); setSelected(null); setWarnDelete(null); }}
          onCancel={() => setWarnDelete(null)}
        />
      )}
    </div>
  );
}

/* ── PSPDFKit editor modal (admin) ── */
function PSPDFKitEditorModal({ order, onClose, onSave }: {
  order: Order;
  onClose: () => void;
  onSave: (pdfBase64: string, pdfName: string) => void;
}) {
  const instanceRef = useRef<unknown>(null);
  const [saving,  setSaving]  = useState(false);
  const [sharing, setSharing] = useState(false);
  const [shareEmail, setShareEmail] = useState(order.customerEmail || '');
  const [shareNote,  setShareNote]  = useState('');
  const [shareOk,    setShareOk]    = useState(false);
  const [shareErr,   setShareErr]   = useState('');
  const [showShare,  setShowShare]  = useState(false);

  /** Build the document URL for PSPDFKit:
   *  - If a filled PDF is already stored, create a blob URL from it.
   *  - Otherwise fall back to the template in /forms/. */
  const documentUrl = React.useMemo(() => {
    const b64 = order.formData?.pdfBase64;
    if (b64) {
      const bytes = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
      const blob  = new Blob([bytes], { type: 'application/pdf' });
      return URL.createObjectURL(blob);
    }
    // Fall back to public template
    const match = order.formType?.match(/RHW(\d+)/i);
    if (!match) return null;
    const padded = String(parseInt(match[1], 10)).padStart(2, '0');
    return `/forms/form-RHW${padded}.pdf`;
  }, [order.formData?.pdfBase64, order.formType]);

  const handleSave = async () => {
    if (!instanceRef.current) return;
    setSaving(true);
    try {
      const bytes  = await exportPDF(instanceRef.current);
      const base64 = uint8ToBase64(bytes);
      onSave(base64, order.formData?.pdfName || `${order.formType}.pdf`);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDownload = async () => {
    let bytes: Uint8Array;
    if (instanceRef.current) {
      bytes = await exportPDF(instanceRef.current);
    } else if (order.formData?.pdfBase64) {
      bytes = Uint8Array.from(atob(order.formData.pdfBase64), c => c.charCodeAt(0));
    } else return;
    const blob = new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' });
    const url  = URL.createObjectURL(blob);
    const a    = Object.assign(document.createElement('a'), {
      href: url,
      download: order.formData?.pdfName || `${order.formType}.pdf`,
    });
    document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    if (!shareEmail.trim()) { setShareErr('Please enter a recipient email.'); return; }
    setSharing(true); setShareErr(''); setShareOk(false);

    let base64 = order.formData?.pdfBase64 || '';
    if (instanceRef.current) {
      const bytes = await exportPDF(instanceRef.current);
      base64 = uint8ToBase64(bytes);
    }

    try {
      const res = await fetch('/api/share-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientEmail: shareEmail,
          recipientName:  order.customerName,
          formType:  order.formType,
          pdfBase64: base64,
          pdfName:   order.formData?.pdfName || `${order.formType}.pdf`,
          senderNote: shareNote,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      setShareOk(true);
      setShowShare(false);
    } catch (err) {
      console.error(err);
      setShareErr('Failed to send email. Please try again.');
    } finally {
      setSharing(false);
    }
  };

  if (!documentUrl) {
    return (
      <div className={styles.modalBackdrop} onClick={onClose}>
        <div className={styles.modal} style={{ maxWidth: 480, textAlign: 'center' }} onClick={e => e.stopPropagation()}>
          <div className={styles.modalHeader}>
            <h2>PSPDFKit Editor</h2>
            <button className={styles.modalClose} onClick={onClose}>✕</button>
          </div>
          <div className={styles.modalBody}>
            <p style={{ color: '#92400e', background: '#fef9c3', borderRadius: 8, padding: 16 }}>
              ⚠️ Could not determine the form template. Please check the form type is set correctly.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div
        className={styles.modal}
        style={{ width: '95vw', maxWidth: 1020, display: 'flex', flexDirection: 'column', overflowY: 'auto', maxHeight: '95vh' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className={styles.modalHeader} style={{ flexShrink: 0 }}>
          <h2>🏴󠁧󠁢󠁷󠁬󠁳󠁿 {order.formType} — PSPDFKit Editor</h2>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {shareOk && <span style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: 700 }}>✅ Email sent!</span>}
            <button
              onClick={() => setShowShare(s => !s)}
              style={{ background: '#0ea5e9', color: '#fff', border: 'none', borderRadius: 7, padding: '7px 14px', fontWeight: 700, cursor: 'pointer', fontSize: '0.8rem' }}
            >
              ✉️ Share
            </button>
            <button
              onClick={handleDownload}
              style={{ background: '#475569', color: '#fff', border: 'none', borderRadius: 7, padding: '7px 14px', fontWeight: 700, cursor: 'pointer', fontSize: '0.8rem' }}
            >
              📥 Download
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              style={{ background: '#6366f1', color: '#fff', border: 'none', borderRadius: 7, padding: '7px 16px', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', fontSize: '0.8rem', opacity: saving ? 0.6 : 1 }}
            >
              {saving ? 'Saving…' : '💾 Save'}
            </button>
            <button className={styles.modalClose} onClick={onClose}>✕</button>
          </div>
        </div>

        {/* Share panel */}
        {showShare && (
          <div style={{ padding: '12px 24px', background: '#f0f9ff', borderBottom: '1px solid #bae6fd', flexShrink: 0 }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 220 }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0369a1', display: 'block', marginBottom: 4 }}>Recipient Email</label>
                <input
                  type="email"
                  value={shareEmail}
                  onChange={e => setShareEmail(e.target.value)}
                  placeholder="client@example.com"
                  style={{ width: '100%', padding: '8px 10px', border: '1px solid #bae6fd', borderRadius: 7, fontSize: '0.875rem' }}
                />
              </div>
              <div style={{ flex: 2, minWidth: 200 }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0369a1', display: 'block', marginBottom: 4 }}>Note (optional)</label>
                <input
                  value={shareNote}
                  onChange={e => setShareNote(e.target.value)}
                  placeholder="Any message to include in the email…"
                  style={{ width: '100%', padding: '8px 10px', border: '1px solid #bae6fd', borderRadius: 7, fontSize: '0.875rem' }}
                />
              </div>
              <button
                onClick={handleShare}
                disabled={sharing}
                style={{ background: '#0ea5e9', color: '#fff', border: 'none', borderRadius: 7, padding: '9px 18px', fontWeight: 700, cursor: sharing ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap', opacity: sharing ? 0.6 : 1 }}
              >
                {sharing ? 'Sending…' : '✉️ Send Email'}
              </button>
            </div>
            {shareErr && <p style={{ color: '#b91c1c', fontSize: '0.8rem', marginTop: 6 }}>{shareErr}</p>}
          </div>
        )}

        {/* PSPDFKit */}
        <div style={{ height: 620, flexShrink: 0 }}>
          <PSPDFKitViewer
            document={documentUrl}
            onLoad={(inst) => { instanceRef.current = inst; }}
            style={{ height: 620 }}
          />
        </div>
      </div>
    </div>
  );
}

/* ── Wales Form create/edit modal ── */
function WalesFormModal({ title, existing, onClose, onSave }: {
  title: string;
  existing: Order | null;
  onClose: () => void;
  onSave: (data: {
    formType: string; clientName: string; clientEmail: string;
    clientPhone: string; notes: string; pdfBase64: string; pdfName: string;
  }) => void;
}) {
  const [formType,    setFormType]    = useState(existing?.formType    || WALES_FORMS[0]);
  const [clientName,  setClientName]  = useState(existing?.customerName  || '');
  const [clientEmail, setClientEmail] = useState(existing?.customerEmail || '');
  const [clientPhone, setClientPhone] = useState(existing?.customerPhone || '');
  const [notes,       setNotes]       = useState(existing?.formData?.notes || '');
  const [pdfBase64,   setPdfBase64]   = useState(existing?.formData?.pdfBase64 || '');
  const [pdfName,     setPdfName]     = useState(existing?.formData?.pdfName   || '');
  const [err,         setErr]         = useState('');

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.pdf')) { setErr('Only PDF files are accepted.'); return; }
    const reader = new FileReader();
    reader.onload = ev => {
      const b64 = (ev.target?.result as string).split(',')[1];
      setPdfBase64(b64);
      setPdfName(file.name);
      setErr('');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) { setErr('Client name is required.'); return; }
    onSave({ formType, clientName, clientEmail, clientPhone, notes,
      pdfBase64: pdfBase64 || existing?.formData?.pdfBase64 || '',
      pdfName:   pdfName   || existing?.formData?.pdfName   || '',
    });
  };

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modal} style={{ maxWidth: 560 }} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>🏴󠁧󠁢󠁷󠁬󠁳󠁿 {title}</h2>
          <button className={styles.modalClose} onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className={styles.modalBody}>
            <div className={styles.editGrid}>

              {/* Form type */}
              <div className={`${styles.editField} ${styles.editSpan2}`}>
                <label>Wales Form Type <span style={{ color: '#e11d48' }}>*</span></label>
                <select className={styles.filterSelect} style={{ width: '100%' }} value={formType} onChange={e => setFormType(e.target.value)}>
                  {WALES_FORMS.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>

              {/* Client info */}
              <div className={styles.editField}>
                <label>Client Name <span style={{ color: '#e11d48' }}>*</span></label>
                <input value={clientName} onChange={e => setClientName(e.target.value)} placeholder="Full name" />
              </div>
              <div className={styles.editField}>
                <label>Client Email</label>
                <input type="email" value={clientEmail} onChange={e => setClientEmail(e.target.value)} placeholder="email@example.com" />
              </div>
              <div className={styles.editField}>
                <label>Client Phone</label>
                <input value={clientPhone} onChange={e => setClientPhone(e.target.value)} placeholder="07xxx xxxxxx" />
              </div>
              <div className={styles.editField}>
                <label>Date</label>
                <div className={styles.readVal} style={{ paddingTop: 8, color: '#64748b' }}>{today()}</div>
              </div>

              {/* Notes */}
              <div className={`${styles.editField} ${styles.editSpan2}`}>
                <label>Notes <span style={{ color: '#94a3b8', fontWeight: 400 }}>(optional)</span></label>
                <textarea rows={3} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Any additional notes about this form…" />
              </div>

              {/* Optional PDF upload */}
              <div className={`${styles.editField} ${styles.editSpan2}`}>
                <label>
                  Upload PDF{' '}
                  <span style={{ color: '#94a3b8', fontWeight: 400 }}>
                    (optional — leave blank to edit the template in PSPDFKit after saving)
                  </span>
                  {existing?.formData?.pdfBase64 && !pdfBase64 && (
                    <span style={{ marginLeft: 8, color: '#16a34a', fontWeight: 400 }}>
                      (current: {existing.formData.pdfName})
                    </span>
                  )}
                </label>
                <label style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  border: '2px dashed #cbd5e1', borderRadius: 10, padding: '16px', cursor: 'pointer',
                  background: pdfBase64 ? '#f0fdf4' : '#f8fafc', transition: 'background 0.2s',
                }}>
                  <span style={{ fontSize: '1.8rem', marginBottom: 4 }}>{pdfBase64 ? '✅' : '📤'}</span>
                  <span style={{ fontWeight: 600, color: pdfBase64 ? '#16a34a' : '#475569', fontSize: '0.875rem' }}>
                    {pdfBase64 ? pdfName : 'Click to upload a PDF (optional)'}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: 2 }}>PDF files only</span>
                  <input type="file" accept=".pdf,application/pdf" style={{ display: 'none' }} onChange={handleFile} />
                </label>
              </div>

            </div>

            {err && (
              <div style={{ marginTop: 12, padding: '10px 14px', background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 8, color: '#b91c1c', fontSize: '0.85rem' }}>
                ⚠️ {err}
              </div>
            )}
          </div>
          <div className={styles.modalFooter}>
            <button type="button" className={styles.modalCancel} onClick={onClose}>Cancel</button>
            <button type="submit" className={styles.modalSave}>
              {existing ? 'Save Changes' : (pdfBase64 ? 'Save Record' : 'Save & Open Editor')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ═══════════════════════════════ APPOINTMENTS ═══════════════════════════════ */
function AppointmentsTab({ appointments, onCreate, onUpdate, onDelete }: {
  appointments: Appointment[];
  onCreate: (a: Omit<Appointment, 'id' | 'createdAt'>) => void;
  onUpdate: (a: Appointment) => void;
  onDelete: (id: string) => void;
}) {
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Appointment | null>(null);
  const [warn, setWarn] = useState<Appointment | null>(null);

  const filtered = appointments.filter(a => 
    !search || 
    a.name.toLowerCase().includes(search.toLowerCase()) || 
    a.number.toLowerCase().includes(search.toLowerCase()) ||
    a.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className={styles.toolbar}>
        <input className={styles.searchInput} placeholder="Search appointments…" value={search} onChange={e => setSearch(e.target.value)} />
        <div className={styles.toolbarCount}>{filtered.length} total</div>
        <button className={styles.createBtn} style={{ marginLeft: 'auto' }} onClick={() => { setEditing(null); setModalOpen(true); }}>Add Appointment</button>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Client Name</th>
              <th>Phone Number</th>
              <th>Timing</th>
              <th>Day</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>No appointments found.</td></tr>
            ) : (
              filtered.map(a => (
                <tr key={a.id}>
                  <td style={{ fontWeight: 800, color: '#e11d48' }}>{a.name}</td>
                  <td style={{ fontWeight: 600 }}>{a.number}</td>
                  <td><span className={styles.pillBlue} style={{ padding: '4px 10px', borderRadius: '6px' }}>{a.timing}</span></td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span className={styles.pillGray} style={{ padding: '4px 10px', borderRadius: '6px', alignSelf: 'flex-start' }}>{a.day}</span>
                      {a.day && <span style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '2px', fontWeight: 600 }}>{new Date(a.day).toLocaleDateString('en-GB', { weekday: 'short' })}</span>}
                    </div>
                  </td>
                  <td style={{ maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.description || '—'}</td>
                  <td>
                    <div className={styles.actionGroup}>
                      <button className={`${styles.actionBtn} ${styles.actionEdit}`} onClick={() => { setEditing(a); setModalOpen(true); }}>Edit</button>
                      <button className={`${styles.actionBtn} ${styles.actionHide}`} onClick={() => setWarn(a)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <AppointmentModal
          existing={editing}
          onClose={() => setModalOpen(false)}
          onSave={(data) => {
            if (editing) onUpdate({ ...editing, ...data });
            else onCreate(data);
            setModalOpen(false);
          }}
        />
      )}

      {warn && (
        <ConfirmModal
          title="Delete Appointment?"
          body={`Are you sure you want to remove the appointment for "${warn.name}"?`}
          confirmLabel="Delete"
          onConfirm={() => { onDelete(warn.id); setWarn(null); }}
          onCancel={() => setWarn(null)}
        />
      )}
    </div>
  );
}

function AppointmentModal({ existing, onClose, onSave }: {
  existing: Appointment | null;
  onClose: () => void;
  onSave: (data: Omit<Appointment, 'id' | 'createdAt'>) => void;
}) {
  const [form, setForm] = useState({
    name: existing?.name || '',
    number: existing?.number || '',
    timing: existing?.timing || '',
    day: existing?.day || '',
    description: existing?.description || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.number || !form.timing || !form.day) return;
    onSave(form);
  };

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modal} style={{ maxWidth: 500 }} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>{existing ? 'Edit Appointment' : 'Add Appointment'}</h2>
          <button className={styles.modalClose} onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className={styles.modalBody}>
            <div className={styles.editGrid}>
              <div className={`${styles.editField} ${styles.editSpan2}`}>
                <label>Client Name</label>
                <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Full Name" />
              </div>
              <div className={styles.editField}>
                <label>Phone Number</label>
                <input required value={form.number} onChange={e => setForm({ ...form, number: e.target.value })} placeholder="07xxx xxxxxx" />
              </div>
              
              <div className={`${styles.editField} ${styles.editSpan2}`}>
                <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                  Appointment Schedule
                  <span style={{ fontSize: '0.75rem', color: '#e11d48', fontWeight: 600 }}>
                    {form.day ? new Date(form.day).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }) : 'Select a date'}
                  </span>
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <input required type="date" className={styles.filterSelect} style={{ width: '100%' }} value={form.day} onChange={e => setForm({ ...form, day: e.target.value })} />
                  <input required type="time" className={styles.filterSelect} style={{ width: '100%' }} value={form.timing} onChange={e => setForm({ ...form, timing: e.target.value })} />
                </div>
              </div>

              <div className={`${styles.editField} ${styles.editSpan2}`}>
                <label>Description (Optional)</label>
                <textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Small details about the appointment…" />
              </div>
            </div>
          </div>
          <div className={styles.modalFooter}>
            <button type="button" className={styles.modalCancel} onClick={onClose}>Cancel</button>
            <button type="submit" className={styles.modalSave}>{existing ? 'Update Appointment' : 'Add Appointment'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ═══════════════════════════════ CASH BUYERS ═══════════════════════════════ */
function CashBuyersTab({ inquiries, onUpdate, onDelete }: {
  inquiries: CashInquiry[];
  onUpdate: (inc: CashInquiry) => void;
  onDelete: (id: string) => void;
}) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<CashInquiry | null>(null);
  const [warn, setWarn] = useState<CashInquiry | null>(null);

  const filtered = inquiries.filter(i => 
    !search || 
    i.name.toLowerCase().includes(search.toLowerCase()) || 
    i.address.toLowerCase().includes(search.toLowerCase()) ||
    i.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className={styles.toolbar}>
        <input className={styles.searchInput} placeholder="Search cash inquiries…" value={search} onChange={e => setSearch(e.target.value)} />
        <div className={styles.toolbarCount}>{filtered.length} inquiries</div>
      </div>

      <div className={styles.splitView}>
        <div className={styles.splitLeft}>
          {filtered.length === 0 ? (
            <div className={styles.emptyState}><span>💰</span><p>No cash inquiries found.</p></div>
          ) : (
            <div className={styles.submissionCards}>
              {filtered.map(i => (
                <div key={i.id}
                  className={`${styles.submissionCard} ${selected?.id === i.id ? styles.submissionCardActive : ''} ${i.status === 'new' ? styles.unreadCard : ''}`}
                  onClick={() => { setSelected(i); if (i.status === 'new') onUpdate({ ...i, status: 'viewed' }); }}>
                  <div className={styles.submissionCardTop}>
                    <div>
                      <div className={styles.submissionAddr}>{i.status === 'new' && <span className={styles.unreadDot} />} {i.address}</div>
                      <div className={styles.submissionMeta}>{i.name} · {i.price}</div>
                    </div>
                    <span className={`${styles.pill} ${i.status === 'rejected' ? styles.pillRed : i.status === 'accepted' ? styles.pillGreen : styles.pillGray}`}>{i.status.toUpperCase()}</span>
                  </div>
                  <div className={styles.submissionDate}>{i.date} · {i.postcode}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.splitRight}>
          {!selected ? (
            <div className={styles.emptyState}><span>👈</span><p>Select an inquiry to view details.</p></div>
          ) : (
            <div className={styles.detailPanel}>
              <div className={styles.detailHeader}>
                <h2>{selected.address}</h2>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <select value={selected.status} className={styles.filterSelect} style={{ width: 140 }}
                    onChange={e => { const upd = { ...selected, status: e.target.value as CashInquiry['status'] }; onUpdate(upd); setSelected(upd); }}>
                    <option value="new">New</option>
                    <option value="viewed">Viewed</option>
                    <option value="contacted">Contacted</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>

              <div className={styles.contactBlock}>
                <h4>Client Details</h4>
                <div className={styles.contactGrid}>
                  <ContactItem icon="👤" label="Name"  value={selected.name} />
                  <ContactItem icon="✉️" label="Email" value={selected.email} href={`mailto:${selected.email}`} />
                  <ContactItem icon="📞" label="Phone" value={selected.phone} href={`tel:${selected.phone}`} />
                  <ContactItem icon="📅" label="Date"  value={selected.date} />
                </div>
              </div>

              <div className={styles.detailGrid}>
                <DetailRow label="Asking Price" value={selected.price} />
                <DetailRow label="Postcode"     value={selected.postcode} />
                <DetailRow label="Address"      value={selected.address} />
                <DetailRow label="Inquiry ID"   value={selected.id} />
              </div>

              <div className={styles.crudBar} style={{ marginTop: 'auto' }}>
                <a href={`mailto:${selected.email}?subject=Property Inquiry: ${selected.address}`} className={`${styles.btn} ${styles.btnInfo}`}>✉️ Reply</a>
                <button className={`${styles.btn} ${styles.btnDanger}`} onClick={() => setWarn(selected)}>🗑️ Delete</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {warn && (
        <ConfirmModal
          title="Delete Inquiry?"
          body={`Delete inquiry from "${warn.name}" for ${warn.address}? This cannot be undone.`}
          confirmLabel="Delete"
          onConfirm={() => { onDelete(warn.id); setSelected(null); setWarn(null); }}
          onCancel={() => setWarn(null)}
        />
      )}
    </div>
  );
}

/* ═══════════════════════════════ TENANCY FORM TAB ═══════════════════════════════ */
const BLANK_TENANCY_FORM: Omit<TenancyFormRecord, 'id' | 'createdAt'> = {
  tenantName: '', tenantEmail: '', tenantPhone: '',
  landlordName: '', landlordEmail: '', landlordPhone: '',
  propertyAddress: '', contractStartDate: '', contractEndDate: '',
  monthlyRent: '', depositAmount: '', additionalNotes: '',
  uploadedContract: undefined,
  status: 'draft',
};

function TenancyFormTab({ forms, onCreate, onUpdate, onDelete }: {
  forms: TenancyFormRecord[];
  onCreate: (f: Omit<TenancyFormRecord, 'id' | 'createdAt'>) => void;
  onUpdate: (f: TenancyFormRecord) => void;
  onDelete: (id: string) => void;
}) {
  const [selected, setSelected] = useState<TenancyFormRecord | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<TenancyFormRecord | null>(null);
  const [warn, setWarn] = useState<TenancyFormRecord | null>(null);
  const [search, setSearch] = useState('');

  const filtered = forms.filter(f =>
    !search ||
    f.tenantName.toLowerCase().includes(search.toLowerCase()) ||
    f.landlordName.toLowerCase().includes(search.toLowerCase()) ||
    f.propertyAddress.toLowerCase().includes(search.toLowerCase())
  );

  const downloadContract = (f: TenancyFormRecord) => {
    if (!f.uploadedContract) return;
    const a = document.createElement('a');
    a.href = f.uploadedContract.base64;
    a.download = f.uploadedContract.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const statusColor = (s: TenancyFormRecord['status']) =>
    s === 'active' ? styles.pillGreen : s === 'ended' ? styles.pillGray : styles.pillAmber;

  return (
    <div>
      <div className={styles.toolbar}>
        <input
          className={styles.searchInput}
          placeholder="Search by tenant, landlord or address…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className={styles.toolbarCount}>{filtered.length} form{filtered.length !== 1 ? 's' : ''}</div>
        <button className={styles.createBtn} onClick={() => { setEditing(null); setModalOpen(true); }}>
          + Add Form
        </button>
      </div>

      <div className={styles.splitView}>
        <div className={styles.splitLeft}>
          {filtered.length === 0 ? (
            <div className={styles.emptyState}>
              <span>📄</span>
              <p>No tenancy forms yet. Click &quot;Add Form&quot; to create one.</p>
            </div>
          ) : (
            <div className={styles.submissionCards}>
              {filtered.map(f => (
                <div
                  key={f.id}
                  className={`${styles.submissionCard} ${selected?.id === f.id ? styles.submissionCardActive : ''}`}
                  onClick={() => setSelected(f)}
                >
                  <div className={styles.submissionCardTop}>
                    <div>
                      <div className={styles.submissionAddr}>
                        📄 {f.tenantName || '(No name)'}
                        {f.uploadedContract && <span style={{ marginLeft: 6, fontSize: '0.7rem', color: '#16a34a', fontWeight: 800 }}>● PDF</span>}
                      </div>
                      <div className={styles.submissionMeta}>{f.propertyAddress || '—'}</div>
                    </div>
                    <span className={`${styles.pill} ${statusColor(f.status)}`}>{f.status.toUpperCase()}</span>
                  </div>
                  <div className={styles.submissionDate}>Created: {f.createdAt}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.splitRight}>
          {!selected ? (
            <div className={styles.emptyState}><span>👈</span><p>Select a form to view details.</p></div>
          ) : (
            <div className={styles.detailPanel}>
              <div className={styles.detailHeader}>
                <div>
                  <h2>{selected.tenantName || 'Tenancy Form'}</h2>
                  <div style={{ marginTop: 4 }}>
                    <span className={`${styles.pill} ${statusColor(selected.status)}`}>{selected.status.toUpperCase()}</span>
                  </div>
                </div>
                <button className={`${styles.btn} ${styles.btnEdit}`} onClick={() => { setEditing(selected); setModalOpen(true); }}>✏️ Edit</button>
              </div>

              {/* Uploaded contract */}
              <div style={{ marginBottom: 16 }}>
                {selected.uploadedContract ? (
                  <div className={styles.filePreview}>
                    <span className={styles.fileIcon}>📄</span>
                    <div className={styles.fileInfo}>
                      <div className={styles.fileName}>{selected.uploadedContract.name}</div>
                      <div className={styles.fileSize}>Uploaded Contract</div>
                    </div>
                    <button className={`${styles.btn} ${styles.btnSuccess}`} style={{ flexShrink: 0 }} onClick={() => downloadContract(selected)}>📥 Download</button>
                    <button className={`${styles.btn} ${styles.btnInfo}`} style={{ flexShrink: 0 }} onClick={() => selected.uploadedContract && window.open(selected.uploadedContract.base64)}>👁️ View</button>
                  </div>
                ) : (
                  <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 10, padding: '12px 16px', fontSize: '0.875rem', color: '#92400e', fontWeight: 600 }}>
                    ⚠️ No contract PDF uploaded yet. Click <strong>Edit</strong> to attach one.
                  </div>
                )}
              </div>

              <div className={styles.contactBlock}>
                <h4>Tenant Details</h4>
                <div className={styles.contactGrid}>
                  <ContactItem icon="👤" label="Name"  value={selected.tenantName} />
                  <ContactItem icon="✉️" label="Email" value={selected.tenantEmail} href={`mailto:${selected.tenantEmail}`} />
                  <ContactItem icon="📞" label="Phone" value={selected.tenantPhone} href={`tel:${selected.tenantPhone}`} />
                </div>
              </div>

              <div className={styles.contactBlock} style={{ marginTop: 12 }}>
                <h4>Landlord Details</h4>
                <div className={styles.contactGrid}>
                  <ContactItem icon="🏢" label="Name"  value={selected.landlordName} />
                  <ContactItem icon="✉️" label="Email" value={selected.landlordEmail} href={`mailto:${selected.landlordEmail}`} />
                  <ContactItem icon="📞" label="Phone" value={selected.landlordPhone} href={`tel:${selected.landlordPhone}`} />
                </div>
              </div>

              <div className={styles.detailGrid} style={{ marginTop: 12 }}>
                <DetailRow label="Property Address" value={selected.propertyAddress || '—'} />
                <DetailRow label="Start Date"       value={selected.contractStartDate || '—'} />
                <DetailRow label="End Date"         value={selected.contractEndDate || '—'} />
                <DetailRow label="Monthly Rent"     value={selected.monthlyRent ? `£${selected.monthlyRent}` : '—'} />
                <DetailRow label="Deposit Amount"   value={selected.depositAmount ? `£${selected.depositAmount}` : '—'} />
                <DetailRow label="Created"          value={selected.createdAt} />
              </div>

              {selected.additionalNotes && (
                <div className={styles.detailSection} style={{ marginTop: 12 }}>
                  <h4>Additional Notes</h4>
                  <p>{selected.additionalNotes}</p>
                </div>
              )}

              <div className={styles.detailActions} style={{ marginTop: 20 }}>
                <h4>Contract Status</h4>
                <div className={styles.statusBtns}>
                  {(['draft', 'active', 'ended'] as TenancyFormRecord['status'][]).map(s => (
                    <button
                      key={s}
                      className={`${styles.statusBtn} ${selected.status === s ? styles.statusBtnActive : ''}`}
                      onClick={() => { const upd = { ...selected, status: s }; onUpdate(upd); setSelected(upd); }}
                    >
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.crudBar}>
                <button className={`${styles.btn} ${styles.btnDanger}`} onClick={() => setWarn(selected)}>🗑️ Delete Form</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {modalOpen && (
        <TenancyFormModal
          existing={editing}
          onClose={() => setModalOpen(false)}
          onSave={(data) => {
            if (editing) {
              const upd = { ...editing, ...data };
              onUpdate(upd);
              setSelected(upd);
            } else {
              onCreate(data);
            }
            setModalOpen(false);
          }}
        />
      )}

      {warn && (
        <ConfirmModal
          title="Delete Tenancy Form?"
          body={`Delete the tenancy form for "${warn.tenantName}"? This cannot be undone.`}
          confirmLabel="Delete"
          onConfirm={() => { onDelete(warn.id); setSelected(null); setWarn(null); }}
          onCancel={() => setWarn(null)}
        />
      )}
    </div>
  );
}

function TenancyFormModal({ existing, onClose, onSave }: {
  existing: TenancyFormRecord | null;
  onClose: () => void;
  onSave: (data: Omit<TenancyFormRecord, 'id' | 'createdAt'>) => void;
}) {
  const [form, setForm] = useState<Omit<TenancyFormRecord, 'id' | 'createdAt'>>(
    existing
      ? {
          tenantName: existing.tenantName, tenantEmail: existing.tenantEmail, tenantPhone: existing.tenantPhone,
          landlordName: existing.landlordName, landlordEmail: existing.landlordEmail, landlordPhone: existing.landlordPhone,
          propertyAddress: existing.propertyAddress, contractStartDate: existing.contractStartDate,
          contractEndDate: existing.contractEndDate, monthlyRent: existing.monthlyRent,
          depositAmount: existing.depositAmount, additionalNotes: existing.additionalNotes,
          uploadedContract: existing.uploadedContract,
          status: existing.status,
        }
      : { ...BLANK_TENANCY_FORM }
  );

  const set = (key: string, val: string) => setForm(f => ({ ...f, [key]: val }));

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setForm(prev => ({ ...prev, uploadedContract: { name: f.name, base64: reader.result as string } }));
    reader.readAsDataURL(f);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.tenantName || !form.propertyAddress) return;
    onSave(form);
  };

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modal} style={{ maxWidth: 700 }} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>{existing ? 'Edit Tenancy Form' : 'Add Tenancy Form'}</h2>
          <button className={styles.modalClose} onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className={styles.modalBody}>

            <div className={styles.propFormSection} style={{ marginTop: 0 }}><h4>Tenant Information</h4></div>
            <div className={styles.editGrid}>
              <div className={`${styles.editField} ${styles.editSpan2}`}>
                <label>Tenant Name *</label>
                <input required value={form.tenantName} onChange={e => set('tenantName', e.target.value)} placeholder="Full legal name of tenant" />
              </div>
              <div className={styles.editField}>
                <label>Tenant Email</label>
                <input type="email" value={form.tenantEmail} onChange={e => set('tenantEmail', e.target.value)} placeholder="tenant@email.com" />
              </div>
              <div className={styles.editField}>
                <label>Tenant Phone</label>
                <input type="tel" value={form.tenantPhone} onChange={e => set('tenantPhone', e.target.value)} placeholder="07xxx xxxxxx" />
              </div>
            </div>

            <div className={styles.propFormSection} style={{ marginTop: 16 }}><h4>Landlord Information</h4></div>
            <div className={styles.editGrid}>
              <div className={`${styles.editField} ${styles.editSpan2}`}>
                <label>Landlord Name *</label>
                <input required value={form.landlordName} onChange={e => set('landlordName', e.target.value)} placeholder="Full legal name of landlord" />
              </div>
              <div className={styles.editField}>
                <label>Landlord Email</label>
                <input type="email" value={form.landlordEmail} onChange={e => set('landlordEmail', e.target.value)} placeholder="landlord@email.com" />
              </div>
              <div className={styles.editField}>
                <label>Landlord Phone</label>
                <input type="tel" value={form.landlordPhone} onChange={e => set('landlordPhone', e.target.value)} placeholder="07xxx xxxxxx" />
              </div>
            </div>

            <div className={styles.propFormSection} style={{ marginTop: 16 }}><h4>Contract Details</h4></div>
            <div className={styles.editGrid}>
              <div className={`${styles.editField} ${styles.editSpan2}`}>
                <label>Property Address *</label>
                <input required value={form.propertyAddress} onChange={e => set('propertyAddress', e.target.value)} placeholder="Full property address including postcode" />
              </div>
              <div className={styles.editField}>
                <label>Contract Start Date</label>
                <input type="date" value={form.contractStartDate} onChange={e => set('contractStartDate', e.target.value)} />
              </div>
              <div className={styles.editField}>
                <label>Contract End Date</label>
                <input type="date" value={form.contractEndDate} onChange={e => set('contractEndDate', e.target.value)} />
              </div>
              <div className={styles.editField}>
                <label>Monthly Rent (£)</label>
                <input type="text" value={form.monthlyRent} onChange={e => set('monthlyRent', e.target.value)} placeholder="e.g. 950.00" />
              </div>
              <div className={styles.editField}>
                <label>Deposit Amount (£)</label>
                <input type="text" value={form.depositAmount} onChange={e => set('depositAmount', e.target.value)} placeholder="e.g. 1425.00" />
              </div>
              <div className={styles.editField}>
                <label>Status</label>
                <select value={form.status} onChange={e => set('status', e.target.value)} className={styles.filterSelect} style={{ width: '100%' }}>
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="ended">Ended</option>
                </select>
              </div>
              <div className={`${styles.editField} ${styles.editSpan2}`}>
                <label>Additional Notes</label>
                <textarea rows={3} value={form.additionalNotes} onChange={e => set('additionalNotes', e.target.value)} placeholder="Any special conditions, clauses, or notes…" />
              </div>
            </div>

            <div className={styles.propFormSection} style={{ marginTop: 16 }}><h4>Contract PDF</h4></div>
            <div className={styles.editField}>
              {!form.uploadedContract ? (
                <label className={styles.fileDropZone}>
                  <input type="file" accept=".pdf,.doc,.docx" style={{ display: 'none' }} onChange={handleFile} />
                  <i>📄</i>
                  <p>Drop file here or click to upload</p>
                  <span>Upload the signed Property Trader Contract PDF or any agreement document.</span>
                </label>
              ) : (
                <div className={styles.filePreview}>
                  <span className={styles.fileIcon}>📄</span>
                  <div className={styles.fileInfo}>
                    <div className={styles.fileName}>{form.uploadedContract.name}</div>
                    <div className={styles.fileSize}>Contract attached</div>
                  </div>
                  <button type="button" className={styles.removeFile} onClick={() => setForm(f => ({ ...f, uploadedContract: undefined }))}>✕</button>
                </div>
              )}
            </div>

          </div>
          <div className={styles.modalFooter}>
            <button type="button" className={styles.modalCancel} onClick={onClose}>Cancel</button>
            <button type="submit" className={styles.modalSave}>{existing ? 'Save Changes' : 'Create Form'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
