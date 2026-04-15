"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { getUser, addOrder } from '@/lib/auth';
import styles from './checkout.module.css';

function CheckoutContent() {
  const router = useRouter();
  const params = useSearchParams();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  // Read query params
  const plan = params.get('plan') || '';
  const type = params.get('type') || '';       // 'sell' | 'let'
  const service = params.get('service') || ''; // service name
  const price = params.get('price') || '';     // service price

  const isListing = !!plan;

  // Derive display info
  const orderName = isListing
    ? `${plan} Plan – ${type === 'sell' ? 'Selling' : 'Letting'}`
    : service;
  const orderPrice = isListing ? getPlanPrice(plan, type) : price;
  const orderDetail = isListing
    ? `Property ${type === 'sell' ? 'selling' : 'letting'} package`
    : 'Professional property service';

  useEffect(() => {
    const u = getUser();
    if (u) requestAnimationFrame(() => setUser(u));
  }, []);

  const handleConfirm = () => {
    if (!getUser()) { router.push(`/login`); return; }
    setLoading(true);
    setTimeout(() => {
      const isWalesForm = orderName.startsWith('Form RHW');
      addOrder({
        type: isListing ? 'listing' : 'service',
        name: orderName,
        price: orderPrice,
        detail: orderDetail,
        status: 'active',
        formType: isWalesForm ? orderName : undefined,
        formData: isWalesForm ? {} : undefined,
      });
      setLoading(false);
      setDone(true);
    }, 1000);
  };

  if (done) {
    return (
      <div className={styles.successPage}>
        <div className={styles.successCard}>
          <div className={styles.successIcon}>✓</div>
          <h2>Order Confirmed!</h2>
          <p>Your order for <strong>{orderName}</strong> has been placed successfully. Our team will be in touch shortly.</p>
          <div className={styles.successActions}>
            <Link href="/dashboard" className={styles.primaryBtn}>Go to Dashboard</Link>
            <Link href={isListing ? '/pricing' : '/services'} className={styles.ghostBtn}>Browse More</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.layout}>
      {/* Left – Order Summary */}
      <div className={styles.summary}>
        <Link href={isListing ? '/pricing' : '/services'} className={styles.backLink}>← Back</Link>
        <h2>Order Summary</h2>

        <div className={styles.summaryCard}>
          <div className={styles.summaryIcon}>{isListing ? '🏠' : '🛠️'}</div>
          <div className={styles.summaryInfo}>
            <div className={styles.summaryName}>{orderName}</div>
            <div className={styles.summaryDetail}>{orderDetail}</div>
          </div>
          <div className={styles.summaryPrice}>{orderPrice}</div>
        </div>

        {isListing && (
          <div className={styles.featureList}>
            <div className={styles.featureItem}><span>✓</span> Property listed on our website</div>
            <div className={styles.featureItem}><span>✓</span> 24/7 access to manage viewings</div>
            <div className={styles.featureItem}><span>✓</span> Free instant valuation</div>
            {(plan === 'Silver' || plan === 'Essential' || plan === 'Gold' || plan === 'Premium' || plan === 'Ultimate') && (
              <div className={styles.featureItem}><span>✓</span> Dedicated Account Manager</div>
            )}
            {(plan === 'Gold' || plan === 'Premium' || plan === 'Ultimate') && (
              <div className={styles.featureItem}><span>✓</span> Professional Photography & Floor Plan</div>
            )}
          </div>
        )}

        <div className={styles.total}>
          <span>Total</span>
          <span className={styles.totalPrice}>{orderPrice}</span>
        </div>

        <div className={styles.secure}>
          <span>🔒 Secure checkout</span>
          <span>•</span>
          <span>No hidden fees</span>
        </div>
      </div>

      {/* Right – Payment form */}
      <div className={styles.payment}>
        <h2>Complete Order</h2>

        {!user ? (
          <div className={styles.authPrompt}>
            <p>Please sign in or create an account to complete your order.</p>
            <Link href={`/login`} className={styles.primaryBtn}>Sign In</Link>
            <Link href={`/register`} className={styles.ghostBtn}>Create Account</Link>
          </div>
        ) : (
          <>
            <div className={styles.accountBanner}>
              <span>👤</span>
              <span>Ordering as <strong>{user.name}</strong> ({user.email})</span>
            </div>

            <div className={styles.paySection}>
              <h3>Payment Details</h3>
              <div className={styles.cardRow}>
                <div className={styles.field}>
                  <label>Card Number</label>
                  <input type="text" placeholder="1234 5678 9012 3456" maxLength={19} />
                </div>
              </div>
              <div className={styles.cardRow2}>
                <div className={styles.field}>
                  <label>Expiry Date</label>
                  <input type="text" placeholder="MM / YY" maxLength={7} />
                </div>
                <div className={styles.field}>
                  <label>CVV</label>
                  <input type="text" placeholder="•••" maxLength={4} />
                </div>
              </div>
              <div className={styles.field}>
                <label>Name on Card</label>
                <input type="text" placeholder={user.name} />
              </div>
            </div>

            <div className={styles.billingSection}>
              <h3>Billing Address</h3>
              <div className={styles.field}>
                <label>Address Line 1</label>
                <input type="text" placeholder="12 High Street" />
              </div>
              <div className={styles.cardRow2}>
                <div className={styles.field}>
                  <label>City</label>
                  <input type="text" placeholder="Newport" />
                </div>
                <div className={styles.field}>
                  <label>Postcode</label>
                  <input type="text" placeholder="NP20 2GW" />
                </div>
              </div>
            </div>

            <button className={styles.confirmBtn} onClick={handleConfirm} disabled={loading}>
              {loading ? <span className={styles.spinner} /> : `Confirm & Pay ${orderPrice}`}
            </button>

            <p className={styles.disclaimer}>
              By confirming, you agree to our terms of service. Payment is processed securely. Contact us on 0800 6890604 for assistance.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

// Helper – map plan name to price
function getPlanPrice(plan: string, type: string): string {
  const sellMap: Record<string, string> = { Basic: '£65', Silver: '£250', Gold: '£450', Ultimate: '1% Fee' };
  const letMap: Record<string, string> = { Basic: '£50', Essential: '£150', Premium: '£280' };
  return type === 'sell' ? (sellMap[plan] || '—') : (letMap[plan] || '—');
}

export default function CheckoutPage() {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Link href="/" className={styles.logoLink}>PROPERTY <span>TRADER</span></Link>
        <span className={styles.headerSub}>Secure Checkout</span>
      </div>
      <Suspense fallback={<div className={styles.loading}>Loading…</div>}>
        <CheckoutContent />
      </Suspense>
    </div>
  );
}
