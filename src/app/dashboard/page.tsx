"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Logo } from '@/components/common/Logo';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { getUser, getOrders, getWalesForms, signOut, type User, type Order } from '@/lib/auth';
import styles from './dashboard.module.css';
import PropertyViewerModal from './PropertyViewerModal';
import FormViewer from '@/components/wales/FormViewer';
import { ThemeToggle } from '@/components/common/ThemeToggle';

interface MyListing {
  id: string; title: string; location: string; price: string; beds: string; baths: string; sqft: string;
  type: string; sector: string; status: string | null; createdAt: string; image_url: string; gallery_urls: string;
  is_approved: boolean; is_rejected: boolean; rejection_reason?: string; description: string; features: string;
  expires_at?: string; listing_type?: string;
}

async function getMyListings(): Promise<MyListing[]> {
  try {
    const res = await fetch('/api/properties/custom?mine=true');
    if (!res.ok) return [];
    const data = await res.json();
    return data.properties ?? [];
  } catch (err) {
    console.error("Failed to fetch listings", err);
    return [];
  }
}

async function getAssignedProperties(): Promise<MyListing[]> {
  try {
    const res = await fetch('/api/properties/custom?assigned=true');
    if (!res.ok) return [];
    const data = await res.json();
    return data.properties ?? [];
  } catch (err) {
    console.error("Failed to fetch assigned properties", err);
    return [];
  }
}

type Tab = 'overview' | 'list-property' | 'services' | 'compliance';



export default function DashboardPage() {
  return (
    <Suspense fallback={null}>
      <DashboardContent />
    </Suspense>
  );
}

function DashboardContent() {
  const router = useRouter();
  const [now] = useState(() => Date.now()); // Capture current time once for purity
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [myListings, setMyListings] = useState<MyListing[]>([]);
  const [assignedProperties, setAssignedProperties] = useState<MyListing[]>([]);
  const params = useSearchParams();
  const initialTab = (params.get('tab') as Tab) || 'overview';
  const [tab, setTab] = useState<Tab>(initialTab);

  // Sync tab with URL
  const changeTab = (newTab: Tab) => {
    setTab(newTab);
    const url = new URL(window.location.href);
    url.searchParams.set('tab', newTab);
    window.history.replaceState(null, '', url.toString());
  };
  const [viewingProperty, setViewingProperty] = useState<MyListing | null>(null);
  const [printOrder, setPrintOrder] = useState<Order | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const u = await getUser();
      if (!u) { router.replace('/login'); return; }
      setUser(u);
      const [ordersData, listingsData, assignedData, walesData] = await Promise.all([
        getOrders(),
        getMyListings(),
        getAssignedProperties(),
        getWalesForms()
      ]);

      // Merge wales_forms into orders for display if they aren't already there
      const mergedOrders = [...ordersData];
      walesData.forEach((wf: any) => {
        const existingIdx = mergedOrders.findIndex(o => 
          (o.formData?.walesFormId === wf.id) || 
          (o.name === wf.form_type && o.customerEmail === wf.user_email)
        );

        if (existingIdx !== -1) {
          // Update existing order status to match wales_form status
          mergedOrders[existingIdx].status = wf.status || 'pending';
        } else {
          mergedOrders.push({
            id: wf.id,
            type: 'service',
            name: wf.form_type,
            price: 'Purchased',
            detail: wf.notes || 'Completed Form',
            date: new Date(wf.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
            status: wf.status || 'pending',
            formType: wf.form_type,
            formData: wf.form_data,
            pdfUrl: wf.pdf_url
          });
        }
      });

      setOrders(mergedOrders);
      setMyListings(listingsData);
      setAssignedProperties(assignedData);
      setLoading(false);
    })();
  }, [router]);

  const handleLogout = async () => { await signOut(); router.push('/'); router.refresh(); };

  const activeListingOrders = orders.filter(o => {
    if (!['listing', 'sell', 'let'].includes(o.type?.toLowerCase() || '')) return false;

    // If we have a server-provided expiration date, use it
    if (o.expiresAt) return new Date(o.expiresAt) > new Date();

    // Fallback for legacy orders (120 days)
    const t = new Date(o.date).getTime();
    if (isNaN(t)) return true;
    return (now - t) <= 120 * 24 * 60 * 60 * 1000;
  });

  const serviceOrders = orders.filter(o => !['listing', 'sell', 'let'].includes(o.type?.toLowerCase() || ''));

  // Auto-archive properties if membership expired
  useEffect(() => {
    if (user && activeListingOrders.length === 0 && !loading && myListings.some(l => l.status === 'Live')) {
      const archiveExpired = async () => {
        const liveProps = myListings.filter(l => l.status === 'Live');
        for (const p of liveProps) {
          await fetch(`/api/properties/custom/${p.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...p, status: null })
          });
        }
        setMyListings(prev => prev.map(l => liveProps.find(lp => lp.id === l.id) ? { ...l, status: null } : l));
      };
      archiveExpired();
    }
  }, [user, activeListingOrders.length, loading, myListings]);

  if (!user || loading) return null;

  const memberSince = new Date(user.createdAt).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });

  const pageTitles: Record<Tab, string> = {
    'overview': 'Dashboard',
    'list-property': 'Property Management',
    'services': 'My Services',
    'compliance': 'Compliance & Certificates',
  };

  return (
    <div className={`${styles.page} ${menuOpen ? styles.menuOpen : ''}`}>
      {/* Sidebar Overlay for mobile */}
      {menuOpen && <div className={styles.sidebarOverlay} onClick={() => setMenuOpen(false)} />}

      <aside className={`${styles.sidebar} ${menuOpen ? styles.sidebarOpen : ''}`}>
        <Link href="/" className={styles.logoLink}>
          <Logo className={styles.logo} showPhone={false} variant="sidebar" disableLink={true} />
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
            onClick={() => { changeTab('overview'); setMenuOpen(false); }}
          >
            <span>📊</span> Overview
          </button>

          <button
            className={`${styles.navItem} ${tab === 'list-property' ? styles.navActive : ''}`}
            onClick={() => { changeTab('list-property'); setMenuOpen(false); }}
          >
            <span>🏡</span> My Listings
            {myListings.length > 0 && (
              <span className={styles.badge}>{myListings.length}</span>
            )}
          </button>

          <button
            className={`${styles.navItem} ${tab === 'services' ? styles.navActive : ''}`}
            onClick={() => { changeTab('services'); setMenuOpen(false); }}
          >
            <span>🛠️</span> My Services
            {serviceOrders.length > 0 && <span className={styles.badge}>{serviceOrders.length}</span>}
          </button>

          <button
            className={`${styles.navItem} ${tab === 'compliance' ? styles.navActive : ''}`}
            onClick={() => { changeTab('compliance'); setMenuOpen(false); }}
          >
            <span>🚨</span> Compliance
          </button>
        </nav>

        <div className={styles.sidebarFooter}>
          <Link href="/pricing" className={styles.addBtn}>+ Add Listing Plan</Link>
          <Link href="/services" className={styles.addBtn}>+ Book a Service</Link>
          <button className={styles.logoutBtn} onClick={handleLogout}>Sign Out</button>
          <div style={{ marginTop: '15px', fontSize: '10px', color: 'rgba(255,255,255,0.3)', textAlign: 'center', fontWeight: 600 }}>
            DEVELOPED BY <a href="https://webxoo.com" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'underline' }}>WEBXOO</a>
          </div>
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

        {activeListingOrders.length === 0 && (
          <div className={styles.noPlanBanner}>
            <div>
              <strong>Plan Required</strong>
              <p>No current plan. Go and activate one first before adding property.</p>
            </div>
            <Link href="/pricing" className={styles.noPlanBtn}>Activate a Plan</Link>
          </div>
        )}

        {/* ── OVERVIEW ── */}
        {tab === 'overview' && (
          <div className={styles.overviewContent}>
            <div className={styles.statsRow}>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>🏡</div>
                <div className={styles.statNum}>{myListings.length}</div>
                <div className={styles.statLabel}>Total Listings</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>⏳</div>
                <div className={styles.statNum}>{myListings.filter(l => !l.is_approved && !l.is_rejected).length}</div>
                <div className={styles.statLabel}>Pending Approval</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>✅</div>
                <div className={styles.statNum}>{myListings.filter(l => l.is_approved).length}</div>
                <div className={styles.statLabel}>Live on Site</div>
              </div>
            </div>

            {myListings.length === 0 && orders.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>📭</div>
                <h3>Welcome to your dashboard</h3>
                <p>Get started by listing your property or booking a professional service.</p>
                <div className={styles.emptyActions}>
                  <button className={styles.primaryAction} onClick={() => setTab('list-property')}>Manage Listings</button>
                  <Link href="/services" className={styles.secondaryAction}>Browse Services</Link>
                </div>
              </div>
            ) : (
              <>
                {myListings.length > 0 && (
                  <>
                    <div className={styles.sectionHeader}>
                      <h2 className={styles.sectionTitle}>Recent Listings</h2>
                      <button className={styles.viewAllBtn} onClick={() => setTab('list-property')}>View all →</button>
                    </div>
                    <div className={styles.listingGrid}>
                      {myListings.slice(0, 3).map(l => (
                        <div key={l.id} className={styles.listingCard}>
                          <div className={styles.listingImgWrap}>
                            {l.image_url ? (
                              <Image src={l.image_url} alt={l.title} width={400} height={300} className={styles.listingImg} unoptimized />
                            ) : (
                              <div className={styles.listingPlaceholder}>No Image</div>
                            )}
                          </div>
                          <div className={styles.listingInfo}>
                            <div className={styles.listingTitle}>{l.title}</div>
                            <div className={styles.listingPrice}>{l.price}</div>
                            <div className={styles.listingMeta}>
                              <span className={`${styles.statusBadge} ${l.is_approved ? styles.status_published : (l.is_rejected ? styles.status_rejected : styles.status_pending)}`}>
                                {l.is_approved ? 'Live' : (l.is_rejected ? 'Rejected' : 'Pending')}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {activeListingOrders.length > 0 && (
                  <>
                    <h2 className={styles.sectionTitle} style={{ marginTop: '40px' }}>Listing Plans</h2>
                    <div className={styles.orderList}>
                      {activeListingOrders.slice(0, 3).map(order => <OrderRow key={order.id} order={order} onPrint={setPrintOrder} />)}
                    </div>
                  </>
                )}

                {assignedProperties.length > 0 && (
                  <>
                    <h2 className={styles.sectionTitle} style={{ marginTop: '40px' }}>Assigned to You</h2>
                    <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '16px' }}>Properties officially managed by or assigned to your account.</p>
                    <div className={styles.listingGrid}>
                      {assignedProperties.map(l => (
                        <div key={l.id} className={styles.listingCard}>
                          <div className={styles.listingImgWrap}>
                            <div className={styles.statusBadge} style={{ position: 'absolute', top: 10, left: 10, zIndex: 1, background: 'var(--primary)', color: 'white' }}>
                              Assigned
                            </div>
                            {l.image_url ? (
                              <Image src={l.image_url} alt={l.title} width={400} height={300} className={styles.listingImg} unoptimized />
                            ) : (
                              <div className={styles.listingPlaceholder}>No Image</div>
                            )}
                          </div>
                          <div className={styles.listingInfo}>
                            <div className={styles.listingTitle}>{l.title}</div>
                            <div className={styles.listingPrice}>{l.price}</div>
                            <div style={{ marginTop: '12px' }}>
                              <button
                                onClick={() => setViewingProperty(l)}
                                className={styles.viewAllBtn}
                                style={{ background: '#f1f5f9', width: '100%', textAlign: 'center', display: 'block', borderRadius: '6px', fontSize: '0.8rem', border: 'none', cursor: 'pointer' }}
                              >
                                View Details →
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        )}

        {/* ── MY LISTINGS ── */}
        {tab === 'list-property' && (
          <MyListingsTab
            listings={myListings}
            plans={activeListingOrders}
            onUpdate={async (id, data) => {
              const res = await fetch(`/api/properties/custom/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
              });
              if (res.ok) {
                const updated = await res.json();
                setMyListings(prev => prev.map(l => l.id === id ? updated : l));
                return true;
              }
              return false;
            }}
            onCreate={async (data) => {
              const res = await fetch('/api/properties/custom', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
              });
              if (res.ok) {
                const newList = await res.json();
                setMyListings(prev => [newList, ...prev]);
                return true;
              }
              return false;
            }}
            onDelete={async (id) => {
              const res = await fetch(`/api/properties/custom/${id}`, { method: 'DELETE' });
              if (res.ok) setMyListings(prev => prev.filter(l => l.id !== id));
            }}
            onViewDocuments={(l) => setViewingProperty(l)}
          />
        )}

        {/* ── MY SERVICES ── */}
        {tab === 'services' && (() => {
          const tenancyAgreements = serviceOrders.filter(o => 
            o.formType === 'Fixed Term Standard Occupation Contract' || 
            o.name === 'Fixed Term Standard Occupation Contract' ||
            o.name === 'Tenancy Agreements'
          );
          const walesForms = serviceOrders.filter(o => 
            (!!o.formType || o.name?.toLowerCase().includes('form rhw')) &&
            !tenancyAgreements.find(t => t.id === o.id)
          );
          const otherServices = serviceOrders.filter(o => 
            !walesForms.find(w => w.id === o.id) &&
            !tenancyAgreements.find(t => t.id === o.id)
          );

          return (
            <div>
              {tenancyAgreements.length > 0 && (
                <div style={{ marginBottom: 40 }}>
                  <h2 className={styles.sectionTitle}>📄 Tenancy Agreements</h2>
                  <div className={styles.orderList}>
                    {tenancyAgreements.map(order => (
                      <OrderRow key={order.id} order={order} onPrint={setPrintOrder} />
                    ))}
                  </div>
                </div>
              )}

              {walesForms.length > 0 && (
                <div style={{ marginBottom: 40 }}>
                  <h2 className={styles.sectionTitle}>🏴󠁧󠁢󠁷󠁬󠁳󠁿 Wales Housing Forms</h2>
                  <div className={styles.orderList}>
                    {walesForms.map(order => (
                      <OrderRow key={order.id} order={order} onPrint={setPrintOrder} />
                    ))}
                  </div>
                </div>
              )}

              {otherServices.length > 0 && (
                <div>
                  <h2 className={styles.sectionTitle}>🛠️ Other Services</h2>
                  <div className={styles.orderList}>
                    {otherServices.map(order => <OrderRow key={order.id} order={order} onPrint={setPrintOrder} />)}
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
          );
        })()}
        {/* ── COMPLIANCE ── */}
        {tab === 'compliance' && (
          <div className={styles.complianceContent}>
             <div className={styles.alertBanner}>
               <div className={styles.alertIcon}>💡</div>
               <div className={styles.alertText}>
                 <strong>Proactive Compliance Tracking</strong>
                 <p>We automatically monitor your certificate expiry dates. You will receive alerts 30 days before any document expires.</p>
               </div>
             </div>

             <div className={styles.complianceGrid}>
               <ComplianceCard 
                 title="Gas Safety (CP12)" 
                 status="Good" 
                 expiry="12 Oct 2026" 
                 icon="🔥" 
                 color="#10b981"
               />
               <ComplianceCard 
                 title="EPC Certificate" 
                 status="Expiring Soon" 
                 expiry="15 Jun 2026" 
                 icon="⚡" 
                 color="#f59e0b"
                 alert
               />
               <ComplianceCard 
                 title="Electrical (EICR)" 
                 status="Required" 
                 expiry="N/A" 
                 icon="🔌" 
                 color="#ef4444"
                 action="Book Now"
               />
               <ComplianceCard 
                 title="Tenancy Agreement" 
                 status="Active" 
                 expiry="31 Dec 2026" 
                 icon="📄" 
                 color="#3b82f6"
               />
             </div>

             <div className={styles.recentDocs}>
               <h3 className={styles.sectionTitle}>Document Repository</h3>
               <div className={styles.tableWrap}>
                 <table className={styles.table}>
                   <thead>
                     <tr>
                       <th>Document Name</th>
                       <th>Property</th>
                       <th>Issue Date</th>
                       <th>Expiry Date</th>
                       <th>Status</th>
                     </tr>
                   </thead>
                   <tbody>
                     <tr>
                       <td>Gas Safety CP12</td>
                       <td>24 Park Lane, Cardiff</td>
                       <td>12 Oct 2025</td>
                       <td>12 Oct 2026</td>
                       <td><span className={styles.statusPill} style={{ background: '#ecfdf5', color: '#10b981' }}>Valid</span></td>
                     </tr>
                     <tr style={{ background: '#fff9f2' }}>
                       <td>EPC Certificate</td>
                       <td>12 High Street, Swansea</td>
                       <td>15 Jun 2016</td>
                       <td style={{ color: '#d97706', fontWeight: 700 }}>15 Jun 2026</td>
                       <td><span className={styles.statusPill} style={{ background: '#fff7ed', color: '#d97706' }}>Expiring</span></td>
                     </tr>
                   </tbody>
                 </table>
               </div>
             </div>
          </div>
        )}
      </main>

      {/* Read-Only Viewer */}
      {viewingProperty && (
        <PropertyViewerModal
          property={viewingProperty}
          onClose={() => setViewingProperty(null)}
        />
      )}

      {/* Wales Form Print Modal */}
      {printOrder && (
        <div className={styles.modalBackdrop} onClick={() => setPrintOrder(null)}>
          <div className={styles.modal} style={{ maxWidth: 1000, width: '95vw', padding: 0, overflow: 'auto', background: '#d0d0d0', height: '95vh' }} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader} style={{ background: '#fff', borderBottom: '1px solid #ddd', position: 'sticky', top: 0, zIndex: 10 }}>
              <h2>Print Preview - {printOrder.formType}</h2>
              <div style={{ display: 'flex', gap: 10 }}>
                <button className={styles.primaryAction} onClick={() => window.print()}>🖨️ Print Form</button>
                <button className={styles.modalClose} onClick={() => setPrintOrder(null)}>✕</button>
              </div>
            </div>
            <div className={styles.modalBody}>
              <FormViewer formType={printOrder.formType!} data={printOrder.formData} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ComplianceCard({ title, status, expiry, icon, color, alert, action }: { 
  title: string; status: string; expiry: string; icon: string; color: string; alert?: boolean; action?: string;
}) {
  return (
    <div className={`${styles.complianceCard} ${alert ? styles.cardAlert : ''}`}>
      <div className={styles.cardIcon} style={{ background: color + '15', color: color }}>{icon}</div>
      <div className={styles.cardInfo}>
        <h4>{title}</h4>
        <div className={styles.cardStatus} style={{ color: color }}>{status}</div>
        <div className={styles.cardExpiry}>Expires: {expiry}</div>
      </div>
      {action && <button className={styles.cardAction}>{action}</button>}
    </div>
  );
}

function OrderRow({ order, onPrint }: { order: Order; onPrint: (o: Order) => void }) {
  const pdfReady = !!order.pdfUrl;
  return (
    <div className={styles.orderRow}>
      <div className={styles.orderInfo}>
        <div className={styles.orderName}>{order.name}</div>
        <div className={styles.orderDetail}>{order.detail}</div>
      </div>
      <div className={styles.orderMeta}>
        <span className={styles.orderDate}>{order.date}</span>
        <span className={styles.orderPrice}>{order.price}</span>
      </div>
      <div className={styles.orderActions}>

        <div style={{ display: 'flex', gap: 8 }}>
          {order.formType && (
            <>
              <button onClick={() => onPrint(order)} className={styles.editFormBtn} style={{ background: '#3b82f6', color: '#fff' }}>
                👁️ View Form
              </button>
              <Link 
                href={`/forms/preview?form=${encodeURIComponent(order.formType)}&orderId=${order.id}`}
                className={styles.editFormBtn} 
                style={{ background: '#f59e0b', color: '#fff', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
              >
                ✏️ Edit Form
              </Link>
            </>
          )}
          {pdfReady ? (
            <a
              href={order.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.editFormBtn}
              style={{ background: '#16a34a', color: '#fff' }}
            >
              📥 Download
            </a>
          ) : order.formType ? (
            <button 
              onClick={() => onPrint(order)} 
              className={styles.editFormBtn}
              style={{ background: '#64748b', color: '#fff' }}
            >
              📥 Download
            </button>
          ) : null}

        </div>
      </div>
    </div>
  );
}

function MyListingsTab({ listings, plans, onUpdate, onCreate, onDelete, onViewDocuments }: {
  listings: MyListing[]; plans: Order[]; onUpdate: (id: string, d: Partial<MyListing>) => Promise<boolean>;
  onCreate: (d: Partial<MyListing>) => Promise<boolean>; onDelete: (id: string) => Promise<void>;
  onViewDocuments: (l: MyListing) => void;
}) {
  const [editing, setEditing] = useState<MyListing | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  return (
    <div className={styles.manageListings}>
      {plans.length > 0 && (
        <div className={styles.activePlansSection}>
          <h3 className={styles.subSectionTitle}>Active Listing Plans</h3>
          <div className={styles.planCards}>
            {plans.map(order => <PlanCard key={order.id} order={order} />)}
          </div>
        </div>
      )}

      <div className={styles.tabHeader}>
        <h2 className={styles.sectionTitle}>Property Listings</h2>
        <button
          className={styles.primaryAction}
          onClick={() => setIsCreating(true)}
          disabled={plans.length === 0}
          title={plans.length === 0 ? "You need a listing plan to add a property" : ""}
        >
          + Add New Property
        </button>
      </div>

      {listings.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🏘️</div>
          <h3>You haven&apos;t listed any properties yet</h3>
          {plans.length > 0 ? (
            <p>Click the button above to start your first listing.</p>
          ) : (
            <p>No current plan. Go and activate one first before adding property.</p>
          )}
        </div>
      ) : (
        <div className={styles.listingsTable}>
          {listings.map(l => (
            <div key={l.id} className={styles.listingRow}>
              <div className={styles.listingMain}>
                <div className={styles.listingThumb}>
                  {l.image_url ? <Image src={l.image_url} alt="" width={80} height={80} unoptimized /> : <span>🏠</span>}
                </div>
                <div className={styles.listingDetails}>
                  <div className={styles.listingName}>{l.title}</div>
                  <div className={styles.listingAddr}>{l.location}</div>
                  <div className={styles.listingPrice}>{l.price}</div>
                </div>
              </div>

              <div className={styles.listingStatus}>
                <span className={`${styles.statusBadge} ${l.is_approved ? styles.status_published : (l.is_rejected ? styles.status_rejected : styles.status_pending)}`}>
                  {l.is_approved ? 'Live' : (l.is_rejected ? 'Rejected' : 'Pending')}
                </span>
                {l.is_rejected && l.rejection_reason && (
                  <div className={styles.rejectionReason} title={l.rejection_reason}>
                    Reason: {l.rejection_reason}
                  </div>
                )}
              </div>

              <div className={styles.listingActions}>
                <button className={styles.editBtn} style={{ background: '#f8fafc', color: '#475569', border: '1px solid #e2e8f0' }} onClick={() => onViewDocuments(l)}>View Documents</button>
                <button className={styles.editBtn} onClick={() => setEditing(l)}>Edit</button>
                <button className={styles.deleteBtn} onClick={() => setIsDeleting(l.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {(isCreating || editing) && (
        <ListingModal
          listing={editing || undefined}
          onClose={() => { setEditing(null); setIsCreating(false); }}
          onSave={async (data) => {
            let success = false;
            if (editing) {
              success = await onUpdate(editing.id, data);
            } else {
              success = await onCreate(data);
            }
            
            if (success) {
              setEditing(null);
              setIsCreating(false);
            }
            return success;
          }}
        />
      )}

      {isDeleting && (
        <div className={styles.modalOverlay}>
          <div className={styles.confirmModal}>
            <h3>Delete Listing?</h3>
            <p>Are you sure you want to remove this property? This action cannot be undone.</p>
            <div className={styles.modalFooter}>
              <button className={styles.cancelBtn} onClick={() => setIsDeleting(null)}>Cancel</button>
              <button className={styles.dangerBtn} onClick={async () => { await onDelete(isDeleting); setIsDeleting(null); }}>Delete Permanently</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ListingModal({ listing, onClose, onSave }: { listing?: MyListing; onClose: () => void; onSave: (d: Partial<MyListing> & { addressLine1?: string; city?: string; postcode?: string }) => Promise<boolean> }) {
  const initialLoc = listing?.location || '';
  const locParts = initialLoc.split(',').map(s => s.trim());

  const [form, setForm] = useState({
    title: listing?.title || '',
    addressLine1: locParts[0] || '',
    city: locParts[1] || '',
    postcode: locParts.slice(2).join(', ') || '',
    price: listing?.price || '',
    beds: listing?.beds || '',
    baths: listing?.baths || '',
    sqft: listing?.sqft || '',
    type: listing?.type || 'House',
    sector: listing?.sector || 'Residential',
    description: listing?.description || '',
    features: listing?.features || '',
    image_url: listing?.image_url || '',
    gallery_urls: listing?.gallery_urls || '',
    map_embed_url: (listing as MyListing & { map_embed_url?: string })?.map_embed_url || '',
    interior: (listing as any)?.interior || '',
    exterior: (listing as any)?.exterior || '',
    listing_type: listing?.listing_type || 'Sale',
  });
  const [uploading, setUploading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, isGallery = false) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const results: string[] = [];
      const filesArray = Array.from(files);

      for (const file of filesArray) {
        const fd = new FormData();
        fd.append('file', file);
        fd.append('bucket', 'properties');

        const res = await fetch('/api/storage/upload', { method: 'POST', body: fd });
        const data = await res.json();
        if (data.url) results.push(data.url);
      }

      if (isGallery) {
        setForm(f => {
          const existing = f.gallery_urls.split('|DELIM|').filter(Boolean);
          const combined = [...existing, ...results];
          return {
            ...f,
            gallery_urls: combined.join('|DELIM|')
          };
        });
      } else if (results.length > 0) {
        setForm(f => ({ ...f, image_url: results[0] }));
      }
    } catch (err) {
      console.error('Upload failed', err);
    } finally {
      setUploading(false);
    }
  };

  const removeGalleryImg = (url: string) => {
    setForm(f => ({
      ...f,
      gallery_urls: f.gallery_urls.split('|DELIM|').filter(u => u !== url).join('|DELIM|')
    }));
  };

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>{listing ? `Edit: ${listing.title}` : 'Add New Property'}</h2>
          <button className={styles.modalClose} onClick={onClose}>✕</button>
        </div>

        <div className={styles.modalBody}>
          {error && <div className={styles.errorBanner} style={{ marginBottom: 16, padding: 12, background: '#fee2e2', color: '#b91c1c', borderRadius: 8, fontSize: '0.9rem' }}>{error}</div>}
          <div className={styles.formGrid}>
            <div className={`${styles.formGroup} ${styles.span2}`}>
              <label>Property Title</label>
              <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Stunning 5 Bed Villa with Pool" />
            </div>

            <div className={styles.formGroup}>
              <label>Price / Rent</label>
              <input type="text" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="e.g. £2,500,000 or £1,200 pcm" />
            </div>
            <div className={`${styles.formGroup} ${styles.span2}`}>
              <label>First Line of Address</label>
              <input type="text" value={form.addressLine1} onChange={e => setForm({ ...form, addressLine1: e.target.value })} placeholder="e.g. 14 Eskdale Close" />
            </div>
            <div className={styles.formGroup}>
              <label>City / Town</label>
              <input type="text" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} placeholder="e.g. Cardiff" />
            </div>
            <div className={styles.formGroup}>
              <label>Postcode</label>
              <input type="text" value={form.postcode} onChange={e => setForm({ ...form, postcode: e.target.value })} placeholder="e.g. CF23 5LF" />
            </div>

            <div className={styles.formGroup}>
              <label>Property Type</label>
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
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
            <div className={styles.formGroup}>
              <label>Portfolio Sector</label>
              <select value={form.sector} onChange={e => setForm({ ...form, sector: e.target.value })}>
                <option>Residential</option>
                <option>Commercial</option>
                <option>Industrial</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Listing Type</label>
              <select value={form.listing_type} onChange={e => setForm({ ...form, listing_type: e.target.value })}>
                <option>Sale</option>
                <option>Rent</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Bedrooms</label>
              <input type="text" value={form.beds} onChange={e => setForm({ ...form, beds: e.target.value })} placeholder="e.g. 5" />
            </div>
            <div className={styles.formGroup}>
              <label>Bathrooms</label>
              <input type="text" value={form.baths} onChange={e => setForm({ ...form, baths: e.target.value })} placeholder="e.g. 3" />
            </div>
            <div className={styles.formGroup}>
              <label>Sq Ft (Optional)</label>
              <input type="text" value={form.sqft} onChange={e => setForm({ ...form, sqft: e.target.value })} placeholder="e.g. 3500" />
            </div>
            <div className={`${styles.formGroup} ${styles.span2}`}>
              <label>Short Description</label>
              <textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Briefly describe the property..." />
            </div>


            <div className={`${styles.formGroup} ${styles.span2}`}>
              <label>Key Features (one per line)</label>
              <textarea rows={4} value={form.features} onChange={e => setForm({ ...form, features: e.target.value })} placeholder="Master bedroom&#10;Large garden&#10;Private driveway" />
            </div>

            {/* Photo Section */}
            <div className={`${styles.formGroup} ${styles.span2}`}>
              <label>Main Property Image</label>
              <div className={styles.mainUpload}>
                {form.image_url ? (
                  <div className={styles.imgPreview}>
                    <Image src={form.image_url} alt="" fill style={{ objectFit: 'cover' }} unoptimized />
                    <button onClick={() => setForm({ ...form, image_url: '' })}>Remove</button>
                  </div>
                ) : (
                  <label className={styles.uploadBtn}>
                    {uploading ? '⌛ Uploading...' : '📁 Upload Cover Photo'}
                    <input type="file" hidden onChange={e => handleUpload(e, false)} accept="image/*" />
                  </label>
                )}
              </div>
            </div>

            <div className={`${styles.formGroup} ${styles.span2}`}>
              <label>Gallery Photos ({form.gallery_urls.split('|DELIM|').filter(Boolean).length})</label>
              <div className={styles.galleryGrid}>
                {form.gallery_urls.split('|DELIM|').filter(Boolean).map((u, i) => (
                  <div key={i} className={styles.galleryItem}>
                    <Image src={u} alt="" fill style={{ objectFit: 'cover' }} unoptimized />
                    <button onClick={() => removeGalleryImg(u)}>✕</button>
                  </div>
                ))}
                <label className={styles.galleryAdd}>
                  {uploading ? '...' : '+'}
                  <input type="file" multiple hidden onChange={(e) => handleUpload(e, true)} accept="image/*" />
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.modalCancel} onClick={onClose}>Discard</button>
          <button
            className={styles.modalSave}
            disabled={busy || uploading || !form.title}
            onClick={async () => {
              setBusy(true);
              const submissionData = {
                ...form,
                location: [form.addressLine1, form.city, form.postcode].filter(Boolean).join(', ')
              } as Partial<MyListing> & Record<string, unknown>;
              delete submissionData.addressLine1;
              delete submissionData.city;
              delete submissionData.postcode;
              try {
                const ok = await onSave(submissionData);
                if (!ok) setError('Failed to save. Please check your connection and try again.');
              } catch (err) {
                setError('An unexpected error occurred while saving.');
              } finally {
                setBusy(false);
              }
            }}
          >
            {busy ? 'Processing...' : (listing ? 'Update Listing' : 'Submit for Approval')}
          </button>
        </div>
      </div>
    </div>
  );
}

function PlanCard({ order }: { order: Order }) {
  const isExpired = order.expiresAt ? new Date(order.expiresAt) < new Date() : false;
  const expiryStr = order.expiresAt ? new Date(order.expiresAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : null;

  return (
    <div className={`${styles.planCard} ${isExpired ? styles.planExpired : ''}`}>
      <div className={styles.planTop}>
        <div>
          <div className={styles.planName}>{order.name}</div>
          <div className={styles.planDetail}>{order.detail}</div>
        </div>
        <div className={styles.planPrice}>{order.price}</div>
      </div>
      <div className={styles.planMeta}>
        <span className={`${styles.statusBadge} ${isExpired ? styles.status_expired : styles[`status_${order.status}`]}`}>
          {isExpired ? 'EXPIRED' : order.status.toUpperCase()}
        </span>
        <span className={styles.orderDate}>Purchased {order.date}</span>
      </div>

      {expiryStr && (
        <div className={styles.expiryInfo} style={{
          marginTop: '12px',
          padding: '8px 12px',
          background: isExpired ? '#fef2f2' : '#f0f9ff',
          borderRadius: '6px',
          fontSize: '0.85rem',
          color: isExpired ? '#b91c1c' : '#0369a1',
          fontWeight: 600,
          display: 'flex',
          justifyContent: 'space-between'
        }}>
          <span>{isExpired ? 'Expired on:' : 'Expires on:'}</span>
          <span>{expiryStr}</span>
        </div>
      )}

      <div className={styles.planFeatures}>
        <div className={styles.planFeature}><span>✓</span> Property listed on our website</div>
        <div className={styles.planFeature}><span>✓</span> 24/7 dashboard access</div>
        <div className={styles.planFeature}><span>✓</span> Support team available</div>
      </div>
    </div>
  );
}
