"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getUser, getOrders, signOut, type User, type Order } from '@/lib/auth';
import styles from './dashboard.module.css';

interface PropertySubmission {
  id: string;
  address: string;
  postcode: string;
  type: string;
  beds: string;
  baths: string;
  sqft: string;
  price: string;
  description: string;
  features: string;
  submittedAt: string;
  status: 'pending' | 'under-review' | 'published';
  contactName: string;
  contactEmail: string;
  contactPhone: string;
}

async function getSubmissions(): Promise<PropertySubmission[]> {
  const res = await fetch('/api/submissions');
  if (!res.ok) return [];
  const data = await res.json();
  return (data.submissions ?? []).map((s: Record<string, unknown>) => ({
    id: s.id, address: s.address, postcode: s.postcode, type: s.type,
    beds: s.beds, baths: s.baths, sqft: s.sqft, price: s.price,
    description: s.description, features: s.features,
    submittedAt: s.submitted_at ? new Date(s.submitted_at as string).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '',
    status: s.status as PropertySubmission['status'],
    contactName: s.contact_name, contactEmail: s.contact_email, contactPhone: s.contact_phone,
  }));
}

type Tab = 'overview' | 'list-property' | 'services';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [submissions, setSubmissions] = useState<PropertySubmission[]>([]);
  const [tab, setTab] = useState<Tab>('overview');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const u = await getUser();
      if (!u) { router.replace('/login'); return; }
      setUser(u);
      const [orders, subs] = await Promise.all([getOrders(), getSubmissions()]);
      setOrders(orders);
      setSubmissions(subs);
    })();
  }, [router]);

  const handleLogout = async () => { await signOut(); router.push('/'); router.refresh(); };

  if (!user) return null;

  const listingOrders = orders.filter(o => o.type === 'listing');
  const serviceOrders = orders.filter(o => o.type === 'service');
  const memberSince = new Date(user.createdAt).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });

  const pageTitles: Record<Tab, string> = {
    'overview': 'Dashboard',
    'list-property': 'List a Property',
    'services': 'My Services',
  };

  return (
    <div className={`${styles.page} ${menuOpen ? styles.menuOpen : ''}`}>
      {/* Sidebar Overlay for mobile */}
      {menuOpen && <div className={styles.sidebarOverlay} onClick={() => setMenuOpen(false)} />}
      
      <aside className={`${styles.sidebar} ${menuOpen ? styles.sidebarOpen : ''}`}>
        <Link href="/" className={styles.logoLink}>
          <div className={styles.logo}>PROPERTY <span>TRADER</span></div>
        </Link>

        <div className={styles.userCard}>
          <div className={styles.avatar}>{user.name.charAt(0).toUpperCase()}</div>
          <div>
            <div className={styles.userName}>{user.name}</div>
            <div className={styles.userEmail}>{user.email}</div>
          </div>
        </div>

        <nav className={styles.nav}>
          <button
            className={`${styles.navItem} ${tab === 'overview' ? styles.navActive : ''}`}
            onClick={() => { setTab('overview'); setMenuOpen(false); }}
          >
            <span>📊</span> Overview
          </button>

          <button
            className={`${styles.navItem} ${tab === 'list-property' ? styles.navActive : ''}`}
            onClick={() => { setTab('list-property'); setMenuOpen(false); }}
          >
            <span>🏡</span> List Property
            {(submissions.length > 0 || listingOrders.length > 0) && (
              <span className={styles.badge}>{submissions.length + listingOrders.length}</span>
            )}
          </button>

          <button
            className={`${styles.navItem} ${tab === 'services' ? styles.navActive : ''}`}
            onClick={() => { setTab('services'); setMenuOpen(false); }}
          >
            <span>🛠️</span> My Services
            {serviceOrders.length > 0 && <span className={styles.badge}>{serviceOrders.length}</span>}
          </button>
        </nav>

        <div className={styles.sidebarFooter}>
          <Link href="/pricing" className={styles.addBtn}>+ Add Listing Plan</Link>
          <Link href="/services" className={styles.addBtn}>+ Book a Service</Link>
          <button className={styles.logoutBtn} onClick={handleLogout}>Sign Out</button>
        </div>
      </aside>

      {/* Main content */}
      <main className={styles.main}>
        <div className={styles.topBar}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <button className={styles.mobToggle} onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? '✕' : '☰'}
            </button>
            <div>
              <h1 className={styles.pageTitle}>{pageTitles[tab]}</h1>
              <p className={styles.pageSub}>Member since {memberSince}</p>
            </div>
          </div>
          <Link href="/" className={styles.backSite}>← Back to site</Link>
        </div>

        {/* ── OVERVIEW ── */}
        {tab === 'overview' && (
          <div className={styles.overviewContent}>
            <div className={styles.statsRow}>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>🏡</div>
                <div className={styles.statNum}>{submissions.length}</div>
                <div className={styles.statLabel}>Properties Submitted</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>📋</div>
                <div className={styles.statNum}>{listingOrders.length}</div>
                <div className={styles.statLabel}>Listing Plans</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>✅</div>
                <div className={styles.statNum}>{orders.filter(o => o.status === 'active').length}</div>
                <div className={styles.statLabel}>Active Items</div>
              </div>
            </div>

            {submissions.length === 0 && orders.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>📭</div>
                <h3>Welcome to your dashboard</h3>
                <p>Get started by listing your property or booking a professional service.</p>
                <div className={styles.emptyActions}>
                  <button className={styles.primaryAction} onClick={() => setTab('list-property')}>List a Property</button>
                  <Link href="/services" className={styles.secondaryAction}>Browse Services</Link>
                </div>
              </div>
            ) : (
              <>
                {submissions.length > 0 && (
                  <>
                    <h2 className={styles.sectionTitle}>My Properties</h2>
                    <div className={styles.submissionList}>
                      {submissions.slice(0, 3).map(s => (
                        <div key={s.id} className={styles.submissionRow}>
                          <div className={styles.submissionIcon}>🏠</div>
                          <div className={styles.orderInfo}>
                            <div className={styles.orderName}>{s.address}{s.postcode ? `, ${s.postcode}` : ''}</div>
                            <div className={styles.orderDetail}>{s.type} · {s.beds} beds · {s.baths} baths · {s.price}</div>
                          </div>
                          <div className={styles.orderMeta}>
                            <span className={`${styles.statusBadge} ${styles[`status_${s.status}`]}`}>{s.status.replace('-', ' ')}</span>
                            <span className={styles.orderDate}>{s.submittedAt}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {listingOrders.length > 0 && (
                  <>
                    <h2 className={styles.sectionTitle} style={{ marginTop: '40px' }}>Listing Plans</h2>
                    <div className={styles.orderList}>
                      {listingOrders.slice(0, 3).map(order => <OrderRow key={order.id} order={order} />)}
                    </div>
                  </>
                )}

              </>
            )}
          </div>
        )}

        {/* ── LIST A PROPERTY AND PLANS ── */}
        {tab === 'list-property' && (
          <div className={styles.listPropertyPage}>
            {/* Listing Plans Section */}
            <div style={{ marginBottom: '48px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 className={styles.sectionTitle} style={{ margin: 0 }}>My Listing Plans</h2>
                <Link href="/pricing" className={styles.plansBannerLink}>+ Get New Plan</Link>
              </div>
              
              {listingOrders.length === 0 ? (
                <div className={styles.emptyState} style={{ padding: '40px', background: 'rgba(255,255,255,0.5)' }}>
                  <div className={styles.emptyIcon} style={{ fontSize: '2rem' }}>📋</div>
                  <h3>No active listing plans</h3>
                  <p>You need a plan to list your property on our marketplace.</p>
                  <Link href="/pricing" className={styles.primaryAction} style={{ marginTop: '16px' }}>View Plans</Link>
                </div>
              ) : (
                <div className={styles.planCards} style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                  {listingOrders.map(order => <PlanCard key={order.id} order={order} />)}
                </div>
              )}
            </div>

            {/* Submitted properties */}
            {submissions.length > 0 && (
              <div style={{ marginBottom: '48px' }}>
                <h2 className={styles.sectionTitle}>My Submitted Properties</h2>
                <div className={styles.submissionList}>
                  {submissions.map(s => (
                    <div key={s.id} className={styles.submissionRow}>
                      <div className={styles.submissionIcon}>🏠</div>
                      <div className={styles.orderInfo}>
                        <div className={styles.orderName}>{s.address}{s.postcode ? `, ${s.postcode}` : ''}</div>
                        <div className={styles.orderDetail}>{s.type} · {s.beds} beds · {s.price}</div>
                      </div>
                      <div className={styles.orderMeta}>
                        <span className={`${styles.statusBadge} ${styles[`status_${s.status}`]}`}>{s.status.replace('-', ' ')}</span>
                        <span className={styles.orderDate}>{s.submittedAt}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Form */}
            <div className={`${styles.formSection} ${listingOrders.length === 0 ? styles.formLocked : ''}`}>
              {listingOrders.length === 0 && (
                <div className={styles.formLockOverlay}>
                  <span>🔒</span>
                  <p>Purchase a listing plan to unlock this form</p>
                  <Link href="/pricing" className={styles.primaryAction}>Choose a Plan</Link>
                </div>
              )}
              <h2 className={styles.sectionTitle}>
                {submissions.length > 0 ? 'Submit Another Property' : 'Submit Your Property Details'}
              </h2>
              <SubmitPropertyForm
                user={user}
                onSubmitted={(s) => setSubmissions(prev => [s, ...prev])}
                disabled={listingOrders.length === 0}
              />
            </div>
          </div>
        )}

        {/* ── MY SERVICES ── */}
        {tab === 'services' && (
          <div>
            {/* Wales Forms section */}
            {serviceOrders.filter(o => !!o.formType).length > 0 && (
              <div style={{ marginBottom: 40 }}>
                <h2 className={styles.sectionTitle}>🏴󠁧󠁢󠁷󠁬󠁳󠁿 Wales Housing Forms</h2>
                <div className={styles.orderList}>
                  {serviceOrders.filter(o => !!o.formType).map(order => (
                    <OrderRow key={order.id} order={order} />
                  ))}
                </div>
              </div>
            )}

            {/* Other services */}
            {serviceOrders.filter(o => !o.formType).length > 0 && (
              <div>
                <h2 className={styles.sectionTitle}>🛠️ Other Services</h2>
                <div className={styles.orderList}>
                  {serviceOrders.filter(o => !o.formType).map(order => <OrderRow key={order.id} order={order} />)}
                </div>
              </div>
            )}

            {serviceOrders.length === 0 && (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>🛠️</div>
                <h3>No services booked yet</h3>
                <p>Browse our professional property services — from safety certificates to tenant referencing.</p>
                <div className={styles.emptyActions}>
                  <Link href="/services" className={styles.primaryAction}>Browse Services</Link>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

/* ─── Sub-components ─── */

function OrderRow({ order }: { order: Order }) {
  const pdfReady = !!order.pdfUrl;
  return (
    <div className={styles.orderRow}>
      <div className={styles.orderInfo}>
        <div className={styles.orderName}>{order.name}</div>
        <div className={styles.orderDetail}>{order.detail}</div>
      </div>
      <div className={styles.orderMeta}>
        <span className={`${styles.statusBadge} ${styles[`status_${order.status}`]}`}>{order.status}</span>
        <span className={styles.orderDate}>{order.date}</span>
        <span className={styles.orderPrice}>{order.price}</span>
      </div>
      {(order.formType || pdfReady) && (
        <div className={styles.orderActions}>
          {pdfReady ? (
            <a 
              href={order.pdfUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className={styles.editFormBtn}
              style={{ background: '#16a34a', color: '#fff', textAlign: 'center' }}
              download
            >
              📥 Download
            </a>
          ) : (
            <Link href={`/dashboard/forms/${order.id}`} className={styles.editFormBtn}>
              📋 View Status
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

function PlanCard({ order }: { order: Order }) {
  return (
    <div className={styles.planCard}>
      <div className={styles.planTop}>
        <div>
          <div className={styles.planName}>{order.name}</div>
          <div className={styles.planDetail}>{order.detail}</div>
        </div>
        <div className={styles.planPrice}>{order.price}</div>
      </div>
      <div className={styles.planMeta}>
        <span className={`${styles.statusBadge} ${styles[`status_${order.status}`]}`}>{order.status}</span>
        <span className={styles.orderDate}>Purchased {order.date}</span>
      </div>
      <div className={styles.planFeatures}>
        <div className={styles.planFeature}><span>✓</span> Property listed on our website</div>
        <div className={styles.planFeature}><span>✓</span> 24/7 dashboard access</div>
        <div className={styles.planFeature}><span>✓</span> Support team available</div>
      </div>
    </div>
  );
}

/* ─── Property submission form ─── */

const PROPERTY_TYPES = ['Detached House', 'Semi-Detached House', 'Terraced House', 'Flat / Apartment', 'Bungalow', 'Maisonette', 'Studio', 'Commercial'];
const SALE_TYPES = ['For Sale', 'For Rent', 'Both'];

function SubmitPropertyForm({
  user,
  onSubmitted,
  disabled = false,
}: {
  user: User;
  onSubmitted: (s: PropertySubmission) => void;
  disabled?: boolean;
}) {
  const [form, setForm] = useState({
    address: '', postcode: '', type: '', saleType: 'For Sale',
    beds: '', baths: '', sqft: '', price: '',
    description: '', features: '',
    name: user.name, email: user.email, phone: user.phone || '',
  });
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (field: string, val: string) => {
    setForm(p => ({ ...p, [field]: val }));
    setErrors(p => { const n = { ...p }; delete n[field]; return n; });
  };

  const validateStep1 = () => {
    const e: Record<string, string> = {};
    if (!form.address.trim()) e.address = 'Address is required';
    if (!form.postcode.trim()) e.postcode = 'Postcode is required';
    if (!form.type) e.type = 'Property type is required';
    if (!form.beds) e.beds = 'Number of bedrooms is required';
    if (!form.price.trim()) e.price = 'Asking price is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e: Record<string, string> = {};
    if (!form.description.trim()) e.description = 'Please provide a description';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const res = await fetch('/api/submissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        address: form.address, postcode: form.postcode,
        type: `${form.saleType} — ${form.type}`,
        beds: form.beds, baths: form.baths || '—',
        sqft: form.sqft || '—', price: form.price,
        description: form.description, features: form.features,
        contactName: form.name, contactEmail: form.email, contactPhone: form.phone,
      }),
    });
    setLoading(false);
    if (!res.ok) return;
    const submission = await res.json();
    setDone(true);
    onSubmitted({
      id: submission.id, address: submission.address, postcode: submission.postcode,
      type: submission.type, beds: submission.beds, baths: submission.baths,
      sqft: submission.sqft, price: submission.price,
      description: submission.description, features: submission.features,
      submittedAt: new Date(submission.submitted_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: 'pending',
      contactName: submission.contact_name, contactEmail: submission.contact_email, contactPhone: submission.contact_phone,
    });
  };

  const resetForm = () => {
    setDone(false);
    setStep(1);
    setForm(f => ({ ...f, address: '', postcode: '', type: '', beds: '', baths: '', sqft: '', price: '', description: '', features: '' }));
  };

  if (done) {
    return (
      <div className={styles.submitSuccess}>
        <div className={styles.successIcon}>✓</div>
        <h2>Property Submitted!</h2>
        <p>Your property details have been received. Our team will review your submission and get in touch within 24–48 hours.</p>
        <p className={styles.successSub}>To maximise your property&apos;s reach, choose a listing plan to publish it on our site.</p>
        <div className={styles.successActions}>
          <Link href="/pricing" className={styles.primaryAction}>Choose a Listing Plan</Link>
          <button className={styles.secondaryAction} onClick={resetForm}>Submit Another</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.submitWrap}>
      {/* Step indicator */}
      <div className={styles.steps}>
        {(['Property Details', 'Description', 'Contact & Review'] as const).map((label, i) => (
          <div key={i} className={`${styles.step} ${step === i + 1 ? styles.stepActive : ''} ${step > i + 1 ? styles.stepDone : ''}`}>
            <div className={styles.stepNum}>{step > i + 1 ? '✓' : i + 1}</div>
            <span>{label}</span>
          </div>
        ))}
      </div>

      <div className={styles.submitCard}>

        {/* ── STEP 1 ── */}
        {step === 1 && (
          <>
            <h2 className={styles.submitCardTitle}>Property Details</h2>
            <p className={styles.submitCardSub}>Tell us about the property you want to list.</p>

            <div className={styles.formGrid}>
              <div className={`${styles.formGroup} ${styles.span2}`}>
                <label>Property Address <span className={styles.req}>*</span></label>
                <input type="text" placeholder="e.g. 12 Oak Avenue, Cardiff"
                  value={form.address} onChange={e => set('address', e.target.value)} />
                {errors.address && <span className={styles.fieldError}>{errors.address}</span>}
              </div>

              <div className={styles.formGroup}>
                <label>Postcode <span className={styles.req}>*</span></label>
                <input type="text" placeholder="e.g. CF10 1AA"
                  value={form.postcode} onChange={e => set('postcode', e.target.value.toUpperCase())} />
                {errors.postcode && <span className={styles.fieldError}>{errors.postcode}</span>}
              </div>

              <div className={styles.formGroup}>
                <label>Listing Type <span className={styles.req}>*</span></label>
                <select value={form.saleType} onChange={e => set('saleType', e.target.value)}>
                  {SALE_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Property Type <span className={styles.req}>*</span></label>
                <select value={form.type} onChange={e => set('type', e.target.value)}>
                  <option value="">Select type…</option>
                  {PROPERTY_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
                {errors.type && <span className={styles.fieldError}>{errors.type}</span>}
              </div>

              <div className={styles.formGroup}>
                <label>Bedrooms <span className={styles.req}>*</span></label>
                <select value={form.beds} onChange={e => set('beds', e.target.value)}>
                  <option value="">Select…</option>
                  {['Studio', '1', '2', '3', '4', '5', '6', '7+'].map(n => <option key={n}>{n}</option>)}
                </select>
                {errors.beds && <span className={styles.fieldError}>{errors.beds}</span>}
              </div>

              <div className={styles.formGroup}>
                <label>Bathrooms</label>
                <select value={form.baths} onChange={e => set('baths', e.target.value)}>
                  <option value="">Select…</option>
                  {['1', '2', '3', '4', '5+'].map(n => <option key={n}>{n}</option>)}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Floor Area (sq ft)</label>
                <input type="number" placeholder="e.g. 1200" value={form.sqft}
                  onChange={e => set('sqft', e.target.value)} min="0" />
              </div>

              <div className={styles.formGroup}>
                <label>Asking Price <span className={styles.req}>*</span></label>
                <input type="text" placeholder="e.g. £250,000 or £1,200 pcm" value={form.price}
                  onChange={e => set('price', e.target.value)} />
                {errors.price && <span className={styles.fieldError}>{errors.price}</span>}
              </div>
            </div>

            <div className={styles.formNav}>
              <div />
              <button className={styles.nextBtn} onClick={handleNext} disabled={disabled}>Next: Description →</button>
            </div>
          </>
        )}

        {/* ── STEP 2 ── */}
        {step === 2 && (
          <>
            <h2 className={styles.submitCardTitle}>Description & Features</h2>
            <p className={styles.submitCardSub}>Help buyers understand what makes your property special.</p>

            <div className={styles.formGroup} style={{ marginBottom: '20px' }}>
              <label>Property Description <span className={styles.req}>*</span></label>
              <textarea rows={6}
                placeholder="Describe the property — key features, nearby amenities, condition, unique selling points…"
                value={form.description} onChange={e => set('description', e.target.value)} />
              {errors.description && <span className={styles.fieldError}>{errors.description}</span>}
            </div>

            <div className={styles.formGroup}>
              <label>Key Features <span className={styles.featureHint}>(one per line)</span></label>
              <textarea rows={5}
                placeholder={"Private garden\nOff-road parking\nNew kitchen fitted 2023\nClose to local schools"}
                value={form.features} onChange={e => set('features', e.target.value)} />
              <span className={styles.fieldHint}>List standout features that buyers will search for.</span>
            </div>

            <div className={styles.uploadArea}>
              <div className={styles.uploadIcon}>📷</div>
              <p><strong>Photos</strong></p>
              <p>Our team will contact you to arrange photography, or email photos to <a href="mailto:info@propertytrader1.co.uk">info@propertytrader1.co.uk</a></p>
            </div>

            <div className={styles.formNav}>
              <button className={styles.backBtn} onClick={() => setStep(1)}>← Back</button>
              <button className={styles.nextBtn} onClick={handleNext}>Next: Review →</button>
            </div>
          </>
        )}

        {/* ── STEP 3 ── */}
        {step === 3 && (
          <>
            <h2 className={styles.submitCardTitle}>Contact & Review</h2>
            <p className={styles.submitCardSub}>Confirm your details and submit your property.</p>

            <div className={styles.reviewBlock}>
              <h3>Property Summary</h3>
              <div className={styles.reviewGrid}>
                <div><span>Address</span><strong>{form.address}, {form.postcode}</strong></div>
                <div><span>Type</span><strong>{form.saleType} — {form.type}</strong></div>
                <div><span>Bedrooms</span><strong>{form.beds}</strong></div>
                <div><span>Bathrooms</span><strong>{form.baths || '—'}</strong></div>
                <div><span>Floor Area</span><strong>{form.sqft ? `${form.sqft} sq ft` : '—'}</strong></div>
                <div><span>Asking Price</span><strong>{form.price}</strong></div>
              </div>
            </div>

            <div className={styles.formGrid} style={{ marginTop: '24px' }}>
              <div className={styles.formGroup}>
                <label>Your Name</label>
                <input type="text" value={form.name} onChange={e => set('name', e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label>Email Address</label>
                <input type="email" value={form.email} onChange={e => set('email', e.target.value)} />
              </div>
              <div className={`${styles.formGroup} ${styles.span2}`}>
                <label>Phone Number</label>
                <input type="tel" placeholder="e.g. 07700 900000" value={form.phone}
                  onChange={e => set('phone', e.target.value)} />
              </div>
            </div>

            <div className={styles.submitNote}>
              <span>ℹ️</span>
              By submitting, you agree to be contacted by our team regarding your property listing. No payment is required at this stage.
            </div>

            <div className={styles.formNav}>
              <button className={styles.backBtn} onClick={() => setStep(2)}>← Back</button>
              <button className={styles.submitFinalBtn} onClick={handleSubmit} disabled={loading}>
                {loading ? <span className={styles.spinner} /> : 'Submit Property →'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
