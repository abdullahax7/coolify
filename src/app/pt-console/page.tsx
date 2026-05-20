"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { Logo } from '@/components/common/Logo';
import Captcha from '@/components/common/Captcha';
import { type Property } from '@/data/properties';
import styles from './admin.module.css';
import MessagesTab, { type Message } from './components/MessagesTab';
import ConfirmModalShared from './components/ConfirmModal';
import SiteContentTab from './components/SiteContentTab';
import ServicesCatalogTab from './components/ServicesCatalogTab';
import MediaTab from './components/MediaTab';
import PricingTab from './components/PricingTab';
import UsersTab, { type UserProfile } from './components/UsersTab';
import StaffTab from './components/StaffTab';
import TrashTab from './components/TrashTab';
import AuditLogTab from './components/AuditLogTab';
import RejectModal from './components/RejectModal';
import WalesWizardModalV2 from './components/WalesWizardModalV2';
import FormViewer from '@/components/wales/FormViewer';
import { createClient } from '@/lib/supabase/client';


/* ═══════════════════════════════ TYPES ═══════════════════════════════ */
interface Order {
  id: string; type: 'listing' | 'service'; name: string;
  price: string; detail: string; date: string; status: string;
  customerName: string; customerEmail: string; customerPhone: string;
  formData?: Record<string, any>;
  formType?: string;
  pdfUrl?: string;
}

interface PropOverride { hidden?: boolean; featured?: boolean; notes?: string; }
interface CustomProp {
  id: string; title: string; location: string; price: string;
  addressLine1?: string; city?: string; postcode?: string;
  beds: string; baths: string; sqft: string; type: string;
  sector: string; status: string; createdAt: string; notes: string;
  image: string; gallery: string; mapEmbedUrl: string;
  description: string; features: string;
  user_id?: string;
  listedByAdmin?: boolean;
  listedByEmail?: string;
  is_approved?: boolean;
  is_rejected?: boolean;
  rejection_reason?: string;
  assigned_to_email?: string | null;
  listingType?: 'Sale' | 'Rent';
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
  image_urls?: string[];
}


import { signIn as supabaseSignIn, signOut as supabaseSignOut, getUser } from '@/lib/auth';

type Tab = 'overview' | 'properties' | 'listing-plans' | 'services' | 'inbox' | 'documents' | 'tenants' | 'appointments' | 'forms' | 'tenancy-form' | 'site-content' | 'media-manager' | 'services-catalog' | 'pricing-manager' | 'team' | 'trash' | 'audit-log';



interface WalesFormRecordV2 {
  id: string;
  form_type: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  notes: string;
  form_data: Record<string, any>;
  created_at: string;
  is_user_purchased?: boolean;
  status?: string;
}

function uint8ToBase64(arr: Uint8Array): string {
  let binary = '';
  const len = arr.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(arr[i]);
  }
  return btoa(binary);
}

function today() { return new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }); }

/* ═══════════════════════════════ ROOT ═══════════════════════════════ */


export default function AdminPanelWrapper() {
  return (
    <Suspense fallback={null}>
      <AdminPanel />
    </Suspense>
  );
}

function AdminPanel() {
  const [authed, setAuthed] = useState(false);
  const [ready, setReady]   = useState(false);
  
  const params = useSearchParams();
  const initialTab = (params.get('tab') as Tab) || 'overview';
  const [tab, setTab]       = useState<Tab>(initialTab);

  const changeTab = (t: Tab) => {
    setTab(t);
    const url = new URL(window.location.href);
    url.searchParams.set('tab', t);
    window.history.replaceState(null, '', url.toString());
  };

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
  return <Shell tab={tab} setTab={changeTab} onLogout={async () => { await supabaseSignOut(); setAuthed(false); }} />;
}

/* ═══════════════════════════════ LOGIN ═══════════════════════════════ */
function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('');
  const [pass, setPass]   = useState('');
  const [err, setErr]     = useState('');
  const [busy, setBusy]   = useState(false);
  const [show, setShow]   = useState(false);
  const [captchaToken, setCaptchaToken] = React.useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setErr(''); setBusy(true);
    const { error } = await supabaseSignIn(email, pass, captchaToken);
    if (error) { setErr(error); setBusy(false); return; }
    const user = await getUser();
    if (!user?.isAdmin) { setErr('You do not have admin access.'); setBusy(false); return; }
    onLogin();
  };
  return (
    <div className={styles.loginPage}>
      <div className={styles.loginCard}>
        <div className={styles.loginBrand}>
          <span className={styles.loginLock}>🔐</span>
          <Logo className={styles.loginBrandName} showPhone={false} variant="sidebar" />
          <p>Staff Access Only</p>
        </div>
        <form onSubmit={submit} className={styles.loginForm} noValidate>
          <div className={styles.loginField}>
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="info@…" disabled={busy} autoComplete="username" />
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
          <Captcha onChange={setCaptchaToken} />
          {err && <div className={styles.loginErr}>⚠️ {err}</div>}
          <button type="submit" className={styles.loginBtn} disabled={busy || !captchaToken}>
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
  const [messages,    setMessages]    = useState<Message[]>([]);
  const [overrides,   setOverrides]   = useState<Record<string, PropOverride>>({});
  const [customProps, setCustomProps] = useState<CustomProp[]>([]);
  const [allUsers,    setAllUsers]    = useState<UserProfile[]>([]);
  const [loadingUsers,setLoadingUsers]= useState(true);
  const [documents,   setDocuments]   = useState<PropertyDocument[]>([]);
  const [tenancies,   setTenancies]   = useState<Tenancy[]>([]);
  const [docToManage, setDocToManage] = useState<{ propId: string; doc?: PropertyDocument } | null>(null);
  const [viewingPropId, setViewingPropId] = useState<string | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [cashInquiries, setCashInquiries] = useState<CashInquiry[]>([]);
  const [walesForms, setWalesForms] = useState<WalesFormRecordV2[]>([]);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [dataVersion, setDataVersion] = useState(0);
  const refresh = () => setDataVersion(v => v + 1);

  useEffect(() => {
    (async () => {
      const fetchItem = async (url: string, key: string) => {
        try {
          const res = await fetch(url, { cache: 'no-store' });
          if (!res.ok) {
            const body = await res.json().catch(() => ({}));
            throw new Error(body.error || `Failed to fetch ${key}`);
          }
          return await res.json();
        } catch (e: unknown) {
          console.error(`Error loading ${key}:`, e instanceof Error ? e.message : e);
          return { [key]: [] }; // Return empty set on failure
        }
      };

      const [oD, mD, dD, tD, aD, cD, wfD, cpD, orD] = await Promise.all([
        fetchItem('/api/orders', 'orders'),
        fetchItem('/api/messages', 'messages'),
        fetchItem('/api/documents', 'documents'),
        fetchItem('/api/tenancies', 'tenancies'),
        fetchItem('/api/appointments', 'appointments'),
        fetchItem('/api/cash-inquiries', 'inquiries'),
        fetchItem('/api/wales-forms', 'wales'),
        fetchItem('/api/properties/custom', 'properties'),
        fetchItem('/api/properties/overrides', 'overrides'),
      ]);

      setOrders((oD.orders ?? []).map((o: Record<string,unknown>) => ({
        id: o.id, type: o.type, name: o.name, price: o.price, detail: o.detail ?? '',
        date: o.date ?? '', status: o.status, formType: o.form_type ?? undefined,
        formData: o.form_data ?? undefined, customerName: o.customer_name ?? '',
        customerEmail: o.customer_email ?? '', customerPhone: o.customer_phone ?? '',
        pdfUrl: o.pdf_url ?? undefined,
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
        image_urls: c.image_urls ?? [],
      })));
      const userPurchasedForms = (oD.orders ?? [])
        .filter((o: any) => !!o.form_type)
        .map((o: any) => ({
          id: o.id,
          form_type: o.form_type,
          client_name: o.customer_name || 'User',
          client_email: o.customer_email || '',
          client_phone: o.customer_phone || '',
          notes: `User Purchased Form\nOrder ID: ${o.id}`,
          form_data: o.form_data || {},
          created_at: o.date || new Date().toISOString(),
          is_user_purchased: true
        }));

      const walesFromDB = (wfD.wales ?? []).map((f: Record<string,any>) => ({
        id: f.id || '', 
        form_type: f.form_type, 
        client_name: f.client_name,
        client_email: f.client_email, 
        client_phone: f.client_phone,
        notes: f.notes, 
        form_data: f.form_data || {},
        created_at: f.created_at,
        is_user_purchased: !!f.status, // Any status means it's a valid record
        status: f.status
      }));

      // Only add orders that don't already have a corresponding record in wales_forms
      const missingOrders = userPurchasedForms.filter((order: any) => 
        !walesFromDB.some((wf: any) => wf.client_email === order.client_email && wf.form_type === order.form_type)
      );

      setWalesForms([
        ...walesFromDB,
        ...missingOrders
      ]);
      setCustomProps((cpD.properties ?? []).map((p: Record<string,unknown>) => {
        const initialLoc = (p.location as string) || '';
        const locParts = initialLoc.split(',').map(s => s.trim());
        return {
        id: p.id, title: p.title, location: p.location, price: p.price,
        addressLine1: locParts[0] || '', city: locParts[1] || '', postcode: locParts.slice(2).join(', ') || '',
        beds: p.beds, baths: p.baths, sqft: p.sqft, type: p.type,
        sector: p.sector, status: p.status, createdAt: p.created_at ?? '',
        notes: p.notes ?? '', image: p.image_url ?? '', gallery: p.gallery_urls ?? '',
        mapEmbedUrl: p.map_embed_url ?? '', description: p.description ?? '',
        features: p.features ?? '',
        user_id: p.user_id as string,
        listedByAdmin: (p.profiles as Record<string, unknown>)?.is_admin ?? false,
        listedByEmail: (p.profiles as Record<string, unknown>)?.email ?? '',
        is_approved: p.is_approved as boolean,
        is_rejected: p.is_rejected as boolean,
        rejection_reason: p.rejection_reason as string,
        assigned_to_email: p.assigned_to_email as string || null,
      };
      }));
      const overrideMap: Record<string, PropOverride> = {};
      (orD.overrides ?? []).forEach((o: Record<string,unknown>) => {
        overrideMap[o.property_id as string] = { hidden: o.hidden as boolean, featured: o.featured as boolean, notes: o.notes as string };
      });
      setOverrides(overrideMap);

      // Fetch all users
      const supabase = createClient();
      const { data: users } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      setAllUsers(users || []);
      setLoadingUsers(false);
    })();
  }, [dataVersion]);

  const api = {
    post: (url: string, body: unknown) => fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }),
    put:  (url: string, body: unknown) => fetch(url, { method: 'PUT',  headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }),
    del:  (url: string)               => fetch(url, { method: 'DELETE' }),
  };

  /* Orders CRUD */
  const createOrder = async (o: Omit<Order, 'id' | 'date'> | Order): Promise<Order> => {
    const res = await api.post('/api/orders', o);
    const data = await res.json();
    if (res.ok && data.id) {
      const saved: Order = {
        ...(o as Order),
        id:   data.id   ?? (o as Order).id,
        date: data.date ?? today(),
        pdfUrl: data.pdf_url ?? (o as Order).pdfUrl,
      };
      setOrders(prev => [saved, ...prev]);
      refresh();
      return saved;
    } else {
      alert('Failed to create order: ' + (data.error || 'Unknown error'));
      throw new Error(data.error || 'Failed to create order');
    }
  };
  const updateOrder = async (upd: Order) => {
    await api.put(`/api/orders/${upd.id}`, upd);
    setOrders(prev => prev.map(o => o.id === upd.id ? upd : o));
    refresh();
  };
  const deleteOrder = async (id: string) => {
    await api.del(`/api/orders/${id}`);
    setOrders(prev => prev.filter(o => o.id !== id));
    refresh();
  };


  /* Messages CRUD */
  const markRead = async (id: string) => {
    await api.put(`/api/messages/${id}`, { read: true });
    setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m));
    refresh();
  };
  const markAllRead = async () => {
    await Promise.all(messages.filter(m => !m.read).map(m => api.put(`/api/messages/${m.id}`, { read: true })));
    setMessages(prev => prev.map(m => ({ ...m, read: true })));
    refresh();
  };
  const deleteMsg = async (id: string) => {
    await api.del(`/api/messages/${id}`);
    setMessages(prev => prev.filter(m => m.id !== id));
    refresh();
  };

  /* Property overrides */
  const saveOverride = async (id: string, patch: Partial<PropOverride>) => {
    const next = { ...(overrides[id] ?? {}), ...patch };
    await api.post('/api/properties/overrides', { propertyId: id, ...next });
    setOverrides(prev => ({ ...prev, [id]: { ...(prev[id] ?? {}), ...patch } }));
    refresh();
  };

  /* Custom properties CRUD */
  const createCustom = async (c: Omit<CustomProp, 'id' | 'createdAt'>) => {
    const combinedLoc = [c.addressLine1, c.city, c.postcode].filter(Boolean).join(', ');
    const assignedEmail = c.assigned_to_email ? c.assigned_to_email.toLowerCase() : null;
    const res = await api.post('/api/properties/custom', {
      title: c.title, location: combinedLoc, price: c.price,
      beds: c.beds, baths: c.baths, sqft: c.sqft,
      type: c.type, sector: c.sector, status: c.status,
      notes: c.notes, image_url: c.image, gallery_urls: c.gallery,
      description: c.description,
      features: c.features,
      assigned_to_email: assignedEmail,
    });
    const data = await res.json();
    if (res.ok && data.id) {
      setCustomProps(prev => [{ ...c, id: data.id, createdAt: today(), assigned_to_email: assignedEmail }, ...prev]);
      refresh();
    } else {
      alert('Failed to create property: ' + (data.error || 'Unknown error'));
    }
  };
  const updateCustom = async (upd: CustomProp) => {
    const combinedLoc = [upd.addressLine1, upd.city, upd.postcode].filter(Boolean).join(', ');
    const res = await api.put(`/api/properties/custom/${upd.id}`, { 
      title: upd.title, location: combinedLoc, price: upd.price,
      beds: upd.beds, baths: upd.baths, sqft: upd.sqft,
      type: upd.type, sector: upd.sector, status: upd.status,
      notes: upd.notes, image_url: upd.image, gallery_urls: upd.gallery,
      description: upd.description,
      features: upd.features,
      is_approved: upd.is_approved,
      is_rejected: upd.is_rejected,
      rejection_reason: upd.rejection_reason
    });
    if (res.ok) {
      setCustomProps(prev => prev.map(c => c.id === upd.id ? upd : c));
      refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      alert('Failed to update property: ' + (data.error || 'Unknown error'));
    }
  };
  const deleteCustom = async (id: string) => {
    await api.del(`/api/properties/custom/${id}`);
    setCustomProps(prev => prev.filter(c => c.id !== id));
    refresh();
  };

  /* Documents CRUD */
  const base64ToBlob = (base64Data: string): Blob => {
    const [meta, encoded] = base64Data.split(',');
    const contentType = meta?.match(/data:([^;]+);/)?.[1] ?? 'application/octet-stream';
    const binary = atob(encoded);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) {
      bytes[i] = binary.charCodeAt(i);
    }
    return new Blob([bytes], { type: contentType });
  };

  const createDoc = async (d: Omit<PropertyDocument, 'id' | 'dateUploaded'>) => {
    const fd = new FormData();
    fd.append('meta', JSON.stringify({ propertyId: d.propertyId, propertyName: d.propertyName, documentType: d.documentType, expiryDate: d.expiryDate, status: d.status }));
    if (d.fileBase64 && d.fileName) {
      const blob = base64ToBlob(d.fileBase64);
      fd.append('file', blob, d.fileName);
    }
    const res = await fetch('/api/documents', { method: 'POST', body: fd });
    const data = await res.json();
    if (res.ok && data.id) {
      setDocuments(prev => [{ ...d, id: data.id, fileUrl: data.file_url ?? undefined, dateUploaded: today() }, ...prev]);
      refresh();
    } else {
      console.error('Failed to create document:', data.error || 'Unknown error');
      alert('Failed to save document. Please try again.');
    }
  };
  const updateDoc = async (upd: PropertyDocument) => {
    // We now send full metadata so that the server can update property links, names, etc.
    await api.put(`/api/documents/${upd.id}`, {
      status: upd.status,
      expiry_date: upd.expiryDate,
      property_id: upd.propertyId,
      property_name: upd.propertyName,
      document_type: upd.documentType
    });
    setDocuments(prev => prev.map(d => d.id === upd.id ? upd : d));
    refresh();
  };
  const deleteDoc = async (id: string) => {
    await api.del(`/api/documents/${id}`);
    setDocuments(prev => prev.filter(d => d.id !== id));
    refresh();
  };

  /* Tenancies CRUD */
  const updateTenancy = async (upd: Tenancy) => {
    await api.put(`/api/tenancies/${upd.id}`, upd);
    setTenancies(prev => prev.map(t => t.id === upd.id ? upd : t));
    refresh();
  };
  const deleteTenancy = async (id: string) => {
    await api.del(`/api/tenancies/${id}`);
    setTenancies(prev => prev.filter(t => t.id !== id));
    refresh();
  };

  /* Appointments CRUD */
  const createAppointment = async (a: Omit<Appointment, 'id' | 'createdAt'>) => {
    const res = await api.post('/api/appointments', a);
    const data = await res.json();
    setAppointments(prev => [{ ...a, id: data.id, createdAt: today() }, ...prev]);
    refresh();
  };
  const updateAppointment = async (upd: Appointment) => {
    await api.put(`/api/appointments/${upd.id}`, { name: upd.name, number: upd.number, timing: upd.timing, day: upd.day, description: upd.description ?? null });
    setAppointments(prev => prev.map(a => a.id === upd.id ? upd : a));
    refresh();
  };
  const deleteAppointment = async (id: string) => {
    await api.del(`/api/appointments/${id}`);
    setAppointments(prev => prev.filter(a => a.id !== id));
    refresh();
  };

  /* Cash Inquiries CRUD */
  const updateCashInquiry = async (inc: CashInquiry) => {
    await api.put(`/api/cash-inquiries/${inc.id}`, { status: inc.status });
    setCashInquiries(prev => prev.map(i => i.id === inc.id ? inc : i));
    refresh();
  };
  const deleteCashInquiry = async (id: string) => {
    await api.del(`/api/cash-inquiries/${id}`);
    setCashInquiries(prev => prev.filter(i => i.id !== id));
    refresh();
  };



  /* Wales Forms V2 CRUD */
  const createWalesForm = (f: any) => { setWalesForms(prev => [f, ...prev]); refresh(); };
  const updateWalesForm = (upd: any) => { setWalesForms(prev => prev.map(f => f.id === upd.id ? upd : f)); refresh(); };
  const deleteWalesForm = async (id: string) => {
    await api.del(`/api/wales-forms/${id}`);
    setWalesForms(prev => prev.filter(f => f.id !== id));
    refresh();
  };

  const unread       = messages.filter(m => !m.read).length;
  const listingOrders = orders.filter(o => o.type === 'listing');
  const serviceOrders = orders.filter(o => o.type === 'service');

  const nav: { id: Tab; label: string; icon: string; badge?: number }[] = [
    { id: 'overview',       label: 'Overview',       icon: '📊' },
    { id: 'properties',     label: 'Properties',     icon: '🏠', badge: customProps.length },

    { id: 'listing-plans',  label: 'Listing Plans',  icon: '📋', badge: listingOrders.length || undefined },
    { id: 'services',       label: 'Services',       icon: '🛠️', badge: serviceOrders.length || undefined },
    { id: 'documents',      label: 'Documents',      icon: '📂', badge: documents.filter(d => d.status === 'Expiring' || d.status === 'Expired').length || undefined },
    { id: 'tenants',        label: 'Users',        icon: '👥', badge: tenancies.filter(t => t.status === 'Active').length || undefined },
    { id: 'inbox',          label: 'Inbox',          icon: '📨', badge: (unread || 0) + cashInquiries.filter(i => i.status === 'new').length || undefined },
    { id: 'appointments',   label: 'Appointments',   icon: '📅' },
    { id: 'forms',          label: 'Wales Forms',     icon: '🏴󠁧󠁢󠁷󠁬󠁳󠁿', badge: walesForms.filter(f => !/Fixed Term Standard Occupation Contract|Tenancy Agreement/i.test(f.form_type)).length || undefined },
    { id: 'tenancy-form',   label: 'Tenancy Form',    icon: '📄', badge: walesForms.filter(f => /Fixed Term Standard Occupation Contract|Tenancy Agreement/i.test(f.form_type)).length || undefined },
    { id: 'team',           label: 'Team',           icon: '🏢' },
    { id: 'site-content',   label: 'Site Content',    icon: '✍️' },
    { id: 'media-manager',  label: 'Media Manager',   icon: '🖼️' },
    { id: 'pricing-manager', label: 'Pricing Manager', icon: '💰' },
    { id: 'services-catalog', label: 'Services Catalog', icon: '🛒' },
    { id: 'trash',          label: 'Trash',           icon: '🗑️' },
    { id: 'audit-log',      label: 'Activity Log',    icon: '📋' },
  ];

  const assignProperty = async (propId: string, email: string) => {
    // We'll update the custom_properties table
    const res = await api.put(`/api/properties/custom/${propId}`, { assigned_to_email: email });
    if (res.ok) {
      setCustomProps(prev => prev.map(p => p.id === propId ? { ...p, assigned_to_email: email } : p));
    } else {
      const data = await res.json().catch(() => ({}));
      alert('Failed to assign property: ' + (data.error || 'Unknown error'));
    }
  };

  const unassignProperty = async (propId: string) => {
    const res = await api.put(`/api/properties/custom/${propId}`, { assigned_to_email: null });
    if (res.ok) {
      setCustomProps(prev => prev.map(p => p.id === propId ? { ...p, assigned_to_email: null } : p));
    } else {
      const data = await res.json().catch(() => ({}));
      alert('Failed to unassign property: ' + (data.error || 'Unknown error'));
    }
  };

  const deleteUser = async (id: string) => {
    const res = await api.del(`/api/users/${id}`);
    if (res.ok) {
      setAllUsers(prev => prev.filter(u => u.id !== id));
    } else {
      const data = await res.json().catch(() => ({}));
      alert('Failed to delete user: ' + (data.error || 'Unknown error'));
    }
  };

  return (
    <div className={`${styles.shell} ${menuOpen ? styles.menuOpen : ''}`}>
      {/* Sidebar Overlay for mobile */}
      {menuOpen && <div className={styles.sidebarOverlay} onClick={() => setMenuOpen(false)} />}
      
      <aside className={`${styles.sidebar} ${menuOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarTop}>
          <div className={styles.brand}>
            <Logo className={styles.brandName} showPhone={false} variant="sidebar" />
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
          <div style={{ marginTop: '15px', fontSize: '10px', color: 'rgba(255,255,255,0.3)', textAlign: 'center', fontWeight: 600 }}>
            DEVELOPED BY <a href="https://webxoo.com" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'underline' }}>WEBXOO</a>
          </div>
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
            <span className={styles.adminEmail}>info@propertytrader1.co.uk</span>
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
              onAddTenancy={() => { setViewingPropId(null); setTab('tenants'); }}
              onManageDoc={(id, doc) => setDocToManage({ propId: id, doc })}
              onAssign={assignProperty}
              allUsers={allUsers}
            />
          ) : (
            <>
              {tab === 'overview'      && <Overview orders={orders} messages={messages} setTab={setTab} documents={documents} tenancies={tenancies} customProps={customProps} allUsers={allUsers} />}
              {tab === 'properties'    && <PropertiesTab overrides={overrides} onOverride={saveOverride} customProps={customProps} onCreate={createCustom} onUpdate={updateCustom} onDelete={deleteCustom} onAddTenancy={() => { setTab('tenants'); }} onManageDoc={(id, doc) => setDocToManage({ propId: id, doc })} onViewCompliance={(id) => setViewingPropId(id)} onViewDetails={(id) => setViewingPropId(id)} allUsers={allUsers} />}
              {tab === 'listing-plans' && <OrdersTab type="listing" orders={listingOrders} onCreate={createOrder} onUpdate={updateOrder} onDelete={deleteOrder} />}
              {tab === 'services'      && <OrdersTab type="service" orders={serviceOrders} onCreate={createOrder} onUpdate={updateOrder} onDelete={deleteOrder} />}
              {tab === 'inbox'         && <InboxTab messages={messages} inquiries={cashInquiries} onMarkRead={markRead} onMarkAllRead={markAllRead} onDeleteMsg={deleteMsg} onUpdateInquiry={updateCashInquiry} onDeleteInquiry={deleteCashInquiry} />}
              {tab === 'documents'     && <DocumentsTab documents={documents} onCreate={createDoc} onUpdate={updateDoc} onDelete={deleteDoc} customProps={customProps} />}
              {tab === 'tenants'       && <UsersTab users={allUsers} loading={loadingUsers} properties={customProps} onAssign={assignProperty} onUnassign={unassignProperty} onDelete={deleteUser} />}
              {tab === 'appointments'  && <AppointmentsTab appointments={appointments} onCreate={createAppointment} onUpdate={updateAppointment} onDelete={deleteAppointment} />}
              {tab === 'forms'         && <FormsTab records={walesForms.filter(f => !/Fixed Term Standard Occupation Contract|Tenancy Agreement/i.test(f.form_type))} onUpdate={updateWalesForm} onCreate={createWalesForm} onDelete={deleteWalesForm} />}
              {tab === 'tenancy-form'  && <TenancyAgreementsTab records={walesForms.filter(f => /Fixed Term Standard Occupation Contract|Tenancy Agreement/i.test(f.form_type))} onUpdate={updateWalesForm} onCreate={createWalesForm} onDelete={deleteWalesForm} />}
              {tab === 'team'          && <StaffTab />}
              {tab === 'site-content'  && <SiteContentTab />}
              {tab === 'media-manager' && <MediaTab />}
              {tab === 'pricing-manager' && <PricingTab />}
              {tab === 'services-catalog' && <ServicesCatalogTab />}
              {tab === 'trash'         && <TrashTab />}
              {tab === 'audit-log'     && <AuditLogTab />}
            </>
          )}
        </div>
      </div>

      {docToManage && (
        <DocModal
        properties={customProps}
        initialPropertyId={docToManage.propId}
        existingDoc={docToManage.doc}
          onClose={() => setDocToManage(null)}
          onSave={(d) => {
            if (docToManage.doc) updateDoc({ ...docToManage.doc, ...d } as PropertyDocument);
            else createDoc(d);
            setDocToManage(null);
          }}
        />
      )}
    </div>
  );
}

/* ConfirmModal — now lives in ./components/ConfirmModal.tsx */
const ConfirmModal = ConfirmModalShared;

function Overview({ orders, messages, setTab, documents, tenancies, customProps, allUsers }: {
  orders: Order[]; messages: Message[];
  setTab: (t: Tab) => void;
  documents: PropertyDocument[]; tenancies: Tenancy[];
  customProps: CustomProp[];
  allUsers: UserProfile[];
}) {
  
  const expiringDocs = documents.filter(d => d.status === 'Expiring' || d.status === 'Expired');
  const expiringTenancies = tenancies.filter(t => {
    if (!t.endDate) return false;
    const diff = new Date(t.endDate).getTime() - new Date().getTime();
    return diff > 0 && diff < 30 * 24 * 60 * 60 * 1000;
  });

  const stats = [
    { label: 'Properties', value: customProps.length, icon: '🏡', color: '#6366f1' },
    { label: 'Active Tenancies', value: tenancies.filter(t => t.status === 'Active').length, icon: '📄', color: '#10b981' },
    { label: 'Compliance Docs', value: documents.length, icon: '🛡️', color: '#f59e0b' },
    { label: 'Total Users', value: allUsers.length, icon: '👥', color: '#e11d48' },
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
          { title: 'Recent Orders',      tab: 'listing-plans' as Tab, items: orders.slice(0, 5).map(o => ({ key: o.id, title: o.name, sub: `${o.type === 'listing' ? 'Listing Plan' : 'Service'} · ${o.date}`, right: <span className={styles.miniPrice}>{o.price}</span> })) },
          { title: 'Unread Messages',    tab: 'inbox'         as Tab, items: messages.filter(m => !m.read).slice(0, 5).map(m => ({ key: m.id, title: m.name, sub: m.subject || '(no subject)', right: null })) },
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
function PropertyListItem({ 
  title, image, sector, isCustom, onEdit, onDelete, onAddTenancy, onAddDoc, 
  onViewCompliance, isHidden, onViewDetails, onToggleVisibility,
  isApproved, isRejected, listedByAdmin, listedByEmail, assignedToEmail, status, onApprove, onReject
}: {
  id: string; title: string; location: string; image?: string; sector: string; isCustom: boolean;
  onEdit: () => void; onDelete: () => void; onAddTenancy: () => void; onAddDoc: () => void;
  onViewCompliance: () => void; onViewDetails: () => void; onToggleVisibility?: () => void; 
  isApproved?: boolean; isRejected?: boolean; listedByAdmin?: boolean; listedByEmail?: string;
  assignedToEmail?: string | null;
  status?: string;
  onApprove?: () => void; onReject?: () => void;
  isHidden?: boolean;
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
        {isCustom && (
          <div className={styles.statusRow} style={{ marginTop: 4 }}>
            {isApproved ? (
              <span className={`${styles.pill} ${styles.pillGreen}`}>Live</span>
            ) : isRejected ? (
              <span className={`${styles.pill} ${styles.pillRed}`}>Rejected</span>
            ) : (
              <span className={`${styles.pill} ${styles.pillYellow}`}>Pending Approval</span>
            )}
            <span className={styles.pill} style={{ background: '#e2e8f0', color: '#475569' }}>
              Listed by {listedByAdmin ? 'Admin' : (listedByEmail || 'User')}
            </span>
            {assignedToEmail && (
              <span className={styles.pill} style={{ background: '#dbeafe', color: '#1e40af', marginLeft: 4 }}>
                Assigned to {assignedToEmail}
              </span>
            )}
          </div>
        )}
        <div className={styles.propCardMeta}>Last updated 4 hours ago</div>
        {isHidden && <span className={`${styles.pill} ${styles.pillRed}`} style={{ marginTop: 8, alignSelf: 'flex-start' }}>Occupied / Hidden</span>}
      </div>
      <div className={styles.propCardActions}>
        {(!isApproved || status === 'Inactive') && isCustom && onApprove && (
          <button className={styles.btnPurple} style={{ background: '#16a34a' }} onClick={onApprove}>Approve</button>
        )}
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
          {isCustom && onReject && !isRejected && <button className={styles.menuItem} onClick={() => { setMenuOpen(false); onReject(); }}>❌ Reject listing</button>}
          {isCustom && <button className={`${styles.menuItem} ${styles.menuItemDanger}`} onClick={() => { setMenuOpen(false); onDelete(); }}>🗑️ Delete</button>}
        </div>
      )}
    </div>
  );
}

const EMPTY_CUSTOM: Omit<CustomProp, 'id' | 'createdAt'> = {
  title: '', location: '', addressLine1: '', city: '', postcode: '', price: '', beds: '', baths: '', sqft: '',
  type: 'Sale', sector: 'Residential', status: 'Live', notes: '',
  image: '', gallery: '', mapEmbedUrl: '',
  description: '', features: '',
  assigned_to_email: null,
};

function PropertiesTab({ overrides, onOverride, customProps, onCreate, onUpdate, onDelete, onAddTenancy, onManageDoc, onViewCompliance, onViewDetails, allUsers }: {
  overrides: Record<string, PropOverride>; onOverride: (id: string, p: Partial<PropOverride>) => void;
  customProps: CustomProp[]; onCreate: (c: Omit<CustomProp, 'id' | 'createdAt'>) => void;
  onUpdate: (c: CustomProp) => void; onDelete: (id: string) => void;
  onAddTenancy: (id: string) => void; onManageDoc: (id: string, doc?: PropertyDocument) => void;
  onViewCompliance: (id: string) => void; onViewDetails: (id: string) => void;
  allUsers: UserProfile[];
}) {
  const landlordUsers = useMemo(() => allUsers.filter(u => u.role === 'landlord'), [allUsers]);
  const [search, setSearch]       = useState('');
  const [ft, setFt]               = useState('All Properties');
  const [fs, setFs]               = useState('All Portfolios');
  const [editStatic, setEditStatic] = useState<Property | null>(null);
  const [editCustom, setEditCustom] = useState<CustomProp | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [draft, setDraft]           = useState<Omit<CustomProp, 'id' | 'createdAt'>>(EMPTY_CUSTOM);
  const [warn, setWarn]             = useState<{ id: string; title: string } | null>(null);
  const [rejecting, setRejecting]   = useState<CustomProp | null>(null);
  const [staticNotes, setStaticNotes] = useState('');

  // Static properties are removed to be 100% database-driven.

  const customFiltered = useMemo(() => customProps.filter(p => {
    const q = search.toLowerCase();
    const matchesSearch = !q || p.title.toLowerCase().includes(q) || p.location.toLowerCase().includes(q);
    const matchesType = ft === 'All Properties' || p.type === (ft === 'Sale' ? 'Sale' : 'Rent') || p.type === ft; 
    const matchesSector = fs === 'All Portfolios' || p.sector === fs;
    return matchesSearch && matchesType && matchesSector;
  }).sort((a, b) => {
    // Show pending properties (not approved, not rejected) at the very top
    const aPending = !a.is_approved && !a.is_rejected ? 1 : 0;
    const bPending = !b.is_approved && !b.is_rejected ? 1 : 0;
    return bPending - aPending;
  }), [search, ft, fs, customProps]);


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
            onAddDoc={() => onManageDoc(p.id)}
            onViewCompliance={() => onViewCompliance(p.id)}
            onViewDetails={() => onViewDetails(p.id)}
            isApproved={p.is_approved}
            isRejected={p.is_rejected}
            listedByAdmin={p.listedByAdmin}
            listedByEmail={p.listedByEmail}
            assignedToEmail={p.assigned_to_email}
            status={p.status}
            onApprove={() => onUpdate({ ...p, is_approved: true, is_rejected: false, status: 'Live' })}
            onReject={() => setRejecting(p)}
          />
        ))}
      </div>

      {rejecting && (
        <RejectModal
          propertyName={rejecting.title}
          onCancel={() => setRejecting(null)}
          onConfirm={(reason) => {
            onUpdate({ ...rejecting, is_approved: false, is_rejected: true, rejection_reason: reason });
            setRejecting(null);
          }}
        />
      )}

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

              <div className={styles.propFormSection}><h4>Landlord Assignment (optional)</h4></div>
              <div className={styles.editGrid}>
                <div className={`${styles.editField} ${styles.editSpan2}`}>
                  <label>Assign to Landlord</label>
                  <select
                    value={draft.assigned_to_email ?? ''}
                    onChange={e => setDraft(d => ({ ...d, assigned_to_email: e.target.value || null }))}
                  >
                    <option value="">— None (publish publicly) —</option>
                    {landlordUsers.map(u => (
                      <option key={u.id} value={u.email}>
                        {u.name || 'Anonymous'} — {u.email}
                      </option>
                    ))}
                  </select>
                  <p style={{ fontSize: '0.8125rem', color: '#64748b', marginTop: 6 }}>
                    {draft.assigned_to_email
                      ? '🔒 This property will be private and visible only to the selected landlord in their dashboard. It will NOT appear on the public website.'
                      : 'Leave empty to publish this property publicly on the website.'}
                  </p>
                </div>
              </div>
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
        {inp('addressLine1','First Line of Address')}
        {inp('city','City / Town')}
        {inp('postcode','Postcode')}
        {inp('price','Price','£250,000')}
        {inp('beds','Beds')}
        {inp('baths','Baths')}
        {inp('sqft','Sqft')}
        <div className={styles.editField}>
          <label>Property Type</label>
          <select value={draft.type} onChange={e => onChange('type', e.target.value)}>
            <option>House</option>
            <option>Detached House</option>
            <option>Semi-Detached House</option>
            <option>Terraced House</option>
            <option>End of Terrace House</option>
            <option>Apartment</option>
            <option>Flat</option>
            <option>Studio</option>
            <option>Maisonette</option>
            <option>Penthouse</option>
            <option>Duplex</option>
            <option>Bungalow</option>
            <option>Office</option>
            <option>Retail</option>
          </select>
        </div>
        <div className={styles.editField}>
          <label>Listing Type</label>
          <select value={draft.listingType || 'Sale'} onChange={e => onChange('listingType', e.target.value)}>
            <option>Sale</option>
            <option>Rent</option>
          </select>
        </div>
        <div className={styles.editField}><label>Sector</label>
          <select value={draft.sector} onChange={e => onChange('sector', e.target.value)}><option>Residential</option><option>Commercial</option></select>
        </div>
        <div className={styles.editField}><label>Listing Status</label>
          <select value={draft.status} onChange={e => onChange('status', e.target.value)}><option value="Live">Active</option><option value="Inactive">Inactive</option></select>
        </div>
      </div>

      {/* Narrative Info */}
      <div className={styles.propFormSection}><h4>Narrative & Details</h4></div>
      <div className={styles.editGrid}>
        {ta('description', 'Short Description', 3)}
        {ta('features', 'Key Features (one per line)', 4)}
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

      {/* Admin notes */}
      <div className={styles.propFormSection}><h4>Admin Notes</h4></div>
      <div className={styles.editGrid}>
        {ta('notes','Internal Notes',2,'Private notes…')}
      </div>
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
  onCreate: (o: Omit<Order, 'id' | 'date'>) => Promise<Order>;
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
          <option key="all-types">All Types</option>
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
              <tr key="empty-docs"><td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>No documents found.</td></tr>
            ) : (
              filtered.map((doc, idx) => (
                <tr key={doc.id || idx}>
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
                        <button className={styles.renewBtn} onClick={() => setEditDoc(doc)} title="Open document to upload a renewed version">
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
  
  // Initialize file state from existing document if it has a URL or base64
  const [file, setFile] = useState<{ name: string; base64?: string; url?: string } | null>(
    existingDoc ? { 
      name: existingDoc.fileName || 'Existing Document', 
      base64: existingDoc.fileBase64,
      url: existingDoc.fileUrl 
    } : null
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
    // Prevent overwriting with "Unknown" if lookup fails but we have an existing name
    const foundProp = properties.find(p => p.id === propertyId);
    const propName = foundProp?.title || existingDoc?.propertyName || 'Unknown';
    
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
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>📁</div>
                  <div style={{ fontWeight: 600 }}>Click to upload PDF</div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>Max size: 10MB</div>
                </div>
              </label>
            ) : (
              <div className={styles.fileUploadedCard}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ fontSize: '24px' }}>📄</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {file.name}
                    </div>
                    <div style={{ fontSize: '12px', color: '#10b981' }}>
                      {file.base64 ? 'Ready to upload' : 'Already on server'}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <label className={styles.fileReplaceBtn} title="Replace File">
                      Replace
                      <input type="file" style={{ display: 'none' }} onChange={handleFile} />
                    </label>
                    {!existingDoc && (
                      <button className={styles.fileRemoveBtn} onClick={() => setFile(null)}>Remove</button>
                    )}
                  </div>
                </div>
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

function PropertyDetailView({ id, onBack, customProps, documents, tenancies, overrides, onUpdateNotes, onAddTenancy, onManageDoc, onAssign, allUsers }: {
  id: string; onBack: () => void; customProps: CustomProp[];
  documents: PropertyDocument[]; tenancies: Tenancy[];
  overrides: Record<string, PropOverride>;
  onUpdateNotes: (id: string, notes: string) => void;
  onAddTenancy: (id: string) => void;
  onManageDoc: (id: string, doc?: PropertyDocument) => void;
  onAssign: (id: string, email: string) => void;
  allUsers: UserProfile[];
}) {
  const prop = customProps.find(p => p.id === id);
  const propDocs = documents.filter(d => d.propertyId === id);
  const propTens = tenancies.filter(t => t.propertyId === id);
  const notes = overrides[id]?.notes || '';

  const [assignEmail, setAssignEmail] = useState(prop?.assigned_to_email || '');
  const [assignBusy, setAssignBusy] = useState(false);

  const assignedUser = allUsers.find(u => u.email === prop?.assigned_to_email);
  const assignRole = assignedUser?.role || null;

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
                  Status <span>{prop.status === 'Live' ? 'Active' : prop.is_rejected ? 'Rejected' : 'Pending'}</span> 
                  <span style={{ fontSize: '1rem', marginLeft: 6 }}>{prop.status === 'Live' ? '✅' : prop.is_rejected ? '❌' : '⏳'}</span>
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
                <div className={styles.checklistPanel}>
                  {cat.items?.map((item, i) => {
                    const doc = getDoc(item.type);
                    const isExpired = doc?.expiryDate && new Date(doc.expiryDate) < new Date();
                    const status = !doc ? 'missing' : isExpired ? 'expired' : 'ok';
                    
                    return (
                      <div key={i} className={styles.checklistCard}>
                        <div className={`${styles.checkCircle} ${
                          status === 'ok' ? styles.checkCircleOk : 
                          status === 'expired' ? styles.checkCircleExpired : 
                          styles.checkCircleMissing
                        }`}>
                          {status === 'ok' ? '✓' : status === 'expired' ? '⏳' : '!'}
                        </div>
                        <div className={styles.checkLabel}>
                          <div className={styles.checkTitle}>{item.label}</div>
                          <div className={styles.checkMeta}>
                            <span>{status === 'ok' ? 'Compliant' : status === 'expired' ? 'Expired' : 'Action Required'}</span>
                            {doc?.expiryDate && (
                              <>
                                <span>•</span>
                                <span style={{ color: isExpired ? '#e11d48' : '#16a34a' }}>
                                  Expires: {doc.expiryDate}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                        <button 
                          className={styles.itemAction} 
                          onClick={() => onManageDoc(id, doc)}
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
        <div className={styles.assignBox}>
          <div className={styles.assignHeader}>
            <h3>👥 Assign User (Landlord/Tenant)</h3>
            <p style={{ fontSize: '0.8125rem', color: '#64748b', marginTop: 4 }}>
              Link a registered user to this property to grant them access.
            </p>
          </div>
          
          <div className={styles.userInputGroup}>
            <select 
              className={styles.filterSelect} 
              style={{ flex: 1, height: 44 }}
              value={assignEmail}
              onChange={(e) => setAssignEmail(e.target.value)}
            >
              <option value="">-- Select Registered User --</option>
              {allUsers.map(u => (
                <option key={u.id} value={u.email}>
                  {u.name || 'Anonymous'} ({u.role}) - {u.email}
                </option>
              ))}
            </select>
            <button 
              className={styles.btnInfo} 
              style={{ height: 44, width: 120 }}
              disabled={assignBusy || !assignEmail}
              onClick={async () => {
                setAssignBusy(true);
                await onAssign(id, assignEmail);
                setAssignBusy(false);
              }}
            >
              {assignBusy ? '...' : 'Assign'}
            </button>
          </div>

          { prop.assigned_to_email && (
            <div className={styles.assignedBadge}>
              <div className={styles.assignedIcon}>👤</div>
              <div className={styles.assignedDetails}>
                <div className={styles.assignedRole}>Current Member</div>
                <div className={styles.assignedName}>{prop.assigned_to_email}</div>
              </div>
              {assignRole && (
                <span className={styles.pillBlue} style={{ textTransform: 'uppercase', fontStyle: 'normal' }}>
                  {assignRole}
                </span>
              )}
            </div>
          )}
        </div>

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

function TenancyAgreementsTab({ records, onUpdate, onCreate, onDelete }: {
  records: WalesFormRecordV2[];
  onUpdate: (r: WalesFormRecordV2) => void;
  onCreate: (r: WalesFormRecordV2) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="tenancy-agreements-wrapper">
      <div style={{ marginBottom: '20px', padding: '15px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
        <h3 style={{ margin: 0, color: '#1e293b', fontSize: '1rem' }}>Tenancy Agreements</h3>
        <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.8rem' }}>Manage and generate high-fidelity occupation contracts and tenancy agreements.</p>
      </div>
      <FormsTab 
        records={records} 
        onUpdate={onUpdate} 
        onCreate={onCreate} 
        onDelete={onDelete} 
        fixedType="Fixed Term Standard Occupation Contract"
      />
    </div>
  );
}

function FormsTab({ records, onUpdate, onCreate, onDelete, fixedType }: {
  records: WalesFormRecordV2[];
  onUpdate: (r: WalesFormRecordV2) => void;
  onCreate: (r: WalesFormRecordV2) => void;
  onDelete: (id: string) => void;
  fixedType?: string;
}) {
  const [selected, setSelected] = useState<WalesFormRecordV2 | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [printOpen, setPrintOpen] = useState(false);
  const [formTypeFilter, setFormTypeFilter] = useState('All Forms');
  const [search, setSearch] = useState('');
  const [warnDelete, setWarnDelete] = useState<WalesFormRecordV2 | null>(null);

  const filtered = records.filter(r => {
    const matchesSearch = !search || 
      r.form_type.toLowerCase().includes(search.toLowerCase()) ||
      r.client_name.toLowerCase().includes(search.toLowerCase());
    
    const matchesType = formTypeFilter === 'All Forms' || r.form_type === formTypeFilter;
    
    return matchesSearch && matchesType;
  });

  return (
    <div>
      <div className={styles.toolbar}>
        <input className={styles.searchInput} placeholder="Search form type or client…" value={search} onChange={e => setSearch(e.target.value)} />
        <select 
          className={styles.filterSelect} 
          value={formTypeFilter} 
          onChange={e => setFormTypeFilter(e.target.value)}
          disabled={!!fixedType}
        >
          <option>All Forms</option>
          {(fixedType ? [fixedType] : WALES_FORMS).map(f => <option key={f} value={f}>{f}</option>)}
        </select>
        <div className={styles.toolbarCount}>{filtered.length} records</div>
        <button className={styles.createBtn} onClick={() => setCreateOpen(true)}>+ Add {fixedType ? 'Agreement' : 'Form Record'}</button>
      </div>

      <div className={styles.splitView}>
        <div className={styles.splitLeft}>
          {filtered.length === 0 ? (
            <div className={styles.emptyState}>
              <span>{fixedType ? '📄' : '🏴󠁧󠁢󠁷󠁬󠁳󠁿'}</span>
              <p>No {fixedType ? 'Tenancy Agreements' : 'Wales Form records'} yet.</p>
            </div>
          ) : (
            <div className={styles.submissionCards}>
              {filtered.map(r => (
                <div key={r.id}
                  className={`${styles.submissionCard} ${selected?.id === r.id ? styles.submissionCardActive : ''}`}
                  onClick={() => setSelected(r)}>
                  <div className={styles.submissionCardTop}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className={styles.submissionAddr} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.form_type}</div>
                      <div className={styles.submissionMeta}>{r.client_name}</div>
                      {r.is_user_purchased && (
                        <div style={{ fontSize: '0.7rem', color: '#6366f1', fontWeight: 600, marginTop: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          📧 {r.client_email}
                        </div>
                      )}
                    </div>
                    <span style={{ 
                      fontSize: '0.65rem', 
                      padding: '2px 6px', 
                      borderRadius: 4, 
                      background: r.is_user_purchased ? '#eef2ff' : '#f1f5f9', 
                      color: r.is_user_purchased ? '#4f46e5' : '#475569', 
                      fontWeight: 800,
                      border: `1px solid ${r.is_user_purchased ? '#c7d2fe' : '#e2e8f0'}`,
                      height: 'fit-content'
                    }}>
                      {r.is_user_purchased ? 'USER' : 'ADMIN'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                    <div className={styles.submissionDate}>{new Date(r.created_at).toLocaleDateString('en-GB')}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.splitRight}>
          {!selected ? (
            <div className={styles.emptyState}><span>👈</span><p>Select a record to view.</p></div>
          ) : (
            <div className={styles.detailPanel}>
              <div className={styles.detailHeader}>
                <h2>{selected.form_type}</h2>
                <div className={styles.actions} style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                  <button className={`${styles.btn} ${styles.btnSuccess}`} onClick={() => setPrintOpen(true)}>🖨️ View & Print</button>
                  <button className={`${styles.btn} ${styles.btnEdit}`}   onClick={() => setEditOpen(true)}>✏️ Edit Data</button>
                  <button className={`${styles.btn} ${styles.btnDanger}`} onClick={() => setWarnDelete(selected)} style={{ padding: '8px 12px' }}>🗑️</button>
                </div>
              </div>

              <div className={styles.formEditorBox} style={{ marginTop: 16 }}>
                <div className={styles.editGrid}>
                  <div className={styles.editField}>
                    <label>Client Name</label>
                    <div className={styles.readVal}>{selected.client_name || '—'}</div>
                  </div>
                  <div className={styles.editField}>
                    <label>Client Email</label>
                    <div className={styles.readVal}>{selected.client_email || '—'}</div>
                  </div>
                  <div className={styles.editField}>
                    <label>Client Phone</label>
                    <div className={styles.readVal}>{selected.client_phone || '—'}</div>
                  </div>
                  <div className={styles.editField}>
                    <label>Date Added</label>
                    <div className={styles.readVal}>{new Date(selected.created_at).toLocaleDateString('en-GB')}</div>
                  </div>

                  <div className={`${styles.editField} ${styles.editSpan2}`}>
                    <label>Notes</label>
                    <div className={styles.readVal} style={{ whiteSpace: 'pre-wrap' }}>{selected.notes || '—'}</div>
                  </div>
                  

                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {createOpen && (
        <WalesWizardModalV2
          title={fixedType ? "Add Tenancy Agreement" : "Add Wales Form Record"}
          existing={null}
          onClose={() => setCreateOpen(false)}
          onSave={onCreate}
          fixedType={fixedType}
        />
      )}

      {editOpen && selected && (
        <WalesWizardModalV2
          title={fixedType ? "Edit Tenancy Agreement" : "Edit Wales Form Record"}
          existing={selected}
          onClose={() => setEditOpen(false)}
          onSave={onUpdate}
          fixedType={fixedType}
        />
      )}

      {printOpen && selected && (
        <div className={styles.modalBackdrop} onClick={() => setPrintOpen(false)}>
          <div className={styles.modal} style={{ maxWidth: 1000, width: '95vw', padding: 0, overflow: 'auto', background: '#d0d0d0', height: '95vh' }} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader} style={{ background: '#fff', borderBottom: '1px solid #ddd', position: 'sticky', top: 0, zIndex: 10 }}>
              <h2>Print Preview - {selected.form_type}</h2>
              <div style={{ display: 'flex', gap: 10 }}>
                <button className={`${styles.btn} ${styles.btnSuccess}`} onClick={() => window.print()}>🖨️ Print and Download</button>
                <button className={styles.modalClose} onClick={() => setPrintOpen(false)}>✕</button>
              </div>
            </div>
            <div className={styles.modalBody} style={{ padding: 0, background: '#525659', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <FormViewer formType={selected.form_type} data={selected.form_data} />
            </div>
          </div>
        </div>
      )}

      {warnDelete && (
        <ConfirmModal
          title="Delete Form Record?"
          body={`Delete "${warnDelete.form_type}" for ${warnDelete.client_name}? This cannot be undone.`}
          confirmLabel="Delete"
          onConfirm={() => { onDelete(warnDelete.id); setSelected(null); setWarnDelete(null); }}
          onCancel={() => setWarnDelete(null)}
        />
      )}
    </div>
  );
}

/* ── Wales Form Wizard Modal logic moved to components/WalesWizardModalV2.tsx ── */

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
              <tr key="empty-appointments"><td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>No appointments found.</td></tr>
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

/* ═══════════════════════════════ INBOX (Combined) ═══════════════════════════════ */
function InboxTab({ 
  messages, inquiries, onMarkRead, onMarkAllRead, onDeleteMsg, onUpdateInquiry, onDeleteInquiry 
}: {
  messages: Message[]; inquiries: CashInquiry[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onDeleteMsg: (id: string) => void;
  onUpdateInquiry: (i: CashInquiry) => void;
  onDeleteInquiry: (id: string) => void;
}) {
  const [sub, setSub] = useState<'messages' | 'cash'>('messages');

  return (
    <div>
      <div className={styles.tabHeader}>
        <button onClick={() => setSub('messages')} 
          className={`${styles.tabBtn} ${sub === 'messages' ? styles.tabBtnActive : ''}`}>
          General Messages ({messages.length})
        </button>
        <button onClick={() => setSub('cash')} 
          className={`${styles.tabBtn} ${sub === 'cash' ? styles.tabBtnActive : ''}`}>
          Cash Inquiries ({inquiries.length})
        </button>
      </div>

      {sub === 'messages' ? (
        <MessagesTab messages={messages} onMarkRead={onMarkRead} onMarkAllRead={onMarkAllRead} onDelete={onDeleteMsg} />
      ) : (
        <CashBuyersTab inquiries={inquiries} onUpdate={onUpdateInquiry} onDelete={onDeleteInquiry} />
      )}
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
            <div className={styles.emptyState}><span>💷</span><p>No cash inquiries found.</p></div>
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

              {selected.image_urls && selected.image_urls.length > 0 && (
                <div style={{ marginTop: '24px' }}>
                  <h4 style={{ marginBottom: '12px', fontSize: '0.875rem', fontWeight: 700, color: '#1e293b' }}>Property Photos</h4>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', 
                    gap: '12px' 
                  }}>
                    {selected.image_urls.map((url, idx) => (
                      <a key={idx} href={url} target="_blank" rel="noopener noreferrer" style={{ 
                        display: 'block', 
                        aspectRatio: '1', 
                        borderRadius: '8px', 
                        overflow: 'hidden',
                        border: '1px solid #e2e8f0',
                        position: 'relative'
                      }}>
                        <Image src={url} alt={`Property ${idx + 1}`} fill style={{ objectFit: 'cover' }} unoptimized />
                      </a>
                    ))}
                  </div>
                </div>
              )}

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
