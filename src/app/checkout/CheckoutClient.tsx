"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { useRouter } from 'next/navigation';
import { getUser } from '@/lib/auth';
import type { User } from '@/lib/auth';
import styles from './checkout.module.css';

declare global {
  interface Window {
    Square?: {
      payments: (appId: string, locationId: string) => Promise<{
        card: () => Promise<{
          attach: (element: HTMLElement | string) => Promise<void>;
          tokenize: () => Promise<{ status: string; token?: string; errors?: unknown[] }>;
          destroy: () => Promise<boolean>;
        }>;
      }>;
    };
  }
}

interface CheckoutClientProps {
  searchParams: {
    plan?: string;
    type?: string;
    service?: string;
    price?: string;
    cart?: string;
  };
}

type CardInstance = {
  tokenize: () => Promise<{ status: string; token?: string; errors?: unknown[] }>;
  destroy: () => Promise<boolean>;
};

const SANDBOX_APP_ID = (process.env.NEXT_PUBLIC_SQUARE_APP_ID ?? '').trim();
const LOCATION_ID = (process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID ?? '').trim();
const IS_SANDBOX = SANDBOX_APP_ID.startsWith('sandbox');

import { useCart } from '@/context/CartContext';

export default function CheckoutClient({ searchParams }: CheckoutClientProps) {
  const router = useRouter();
  const { items: cartItems, total: cartTotal, clearCart } = useCart();
  const [user, setUser] = useState<User | null>(null);
  const [userLoading, setUserLoading] = useState(true);
  const [payLoading, setPayLoading] = useState(false);
  const [done, setDone] = useState<{ active: boolean; pdfUrl?: string }>({ active: false });
  const [error, setError] = useState('');
  const [sdkReady, setSdkReady] = useState(false);
  const [cardReady, setCardReady] = useState(false);

  const cardRef = useRef<CardInstance | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  // Separate flag ref so it doesn't interfere with card instance
  const initializingRef = useRef(false);

  const useCartItems = searchParams.cart === 'true';
  const plan = searchParams.plan ?? '';
  const type = searchParams.type ?? '';
  const service = searchParams.service ?? '';
  const price = searchParams.price ?? '';

  const isListing = !!plan;

  // Derive order data from Cart or Single Item
  const orderName = useCartItems 
    ? `${cartItems.length} Services`
    : (isListing 
        ? `${plan} Plan – ${type === 'sell' ? 'Selling' : 'Letting'}`
        : (service || 'Property Service'));
        
  const orderPrice = useCartItems 
    ? `£${cartTotal.toFixed(2)}`
    : (isListing ? getPlanPrice(plan, type) : (price || '£0.00'));

  const orderDetail = useCartItems 
    ? cartItems.map(i => i.name).join(', ')
    : (isListing 
        ? `Property ${type === 'sell' ? 'selling' : 'letting'} package`
        : 'Professional property service');

  const amountNumeric = useCartItems ? cartTotal : parseAmount(orderPrice);

  useEffect(() => {
    getUser().then(u => {
      setUser(u);
      setUserLoading(false);
    }).catch(() => setUserLoading(false));
  }, []);

  const initSquare = useCallback(async () => {
    if (initializingRef.current || cardRef.current) return;
    if (!window.Square || !containerRef.current) return;
    if (!SANDBOX_APP_ID || !LOCATION_ID) {
      setError('Payment system is not configured. Please contact support.');
      return;
    }

    initializingRef.current = true;
    setError('');

    try {
      const payments = await window.Square.payments(SANDBOX_APP_ID, LOCATION_ID);
      const card = await payments.card();
      if (!containerRef.current) {
        await card.destroy();
        initializingRef.current = false;
        return;
      }
      await card.attach(containerRef.current);
      cardRef.current = card;
      setCardReady(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error('Square init error:', msg, { appId: SANDBOX_APP_ID, locationId: LOCATION_ID });
      if (msg.includes('applicationId') || msg.includes('ApplicationId')) {
        setError(`Square app ID is invalid. Check NEXT_PUBLIC_SQUARE_APP_ID in .env.local (current: "${SANDBOX_APP_ID}").`);
      } else {
        setError('Payment form failed to load. Please refresh the page.');
      }
    } finally {
      initializingRef.current = false;
    }
  }, []);

  // Run Square init once SDK is ready and user is authenticated
  useEffect(() => {
    if (!sdkReady || !user || !containerRef.current) return;
    // Small delay to ensure the DOM container is painted before Square attaches
    const id = setTimeout(initSquare, 50);
    return () => clearTimeout(id);
  }, [sdkReady, user, initSquare]);

  // Cleanup card on unmount
  useEffect(() => {
    return () => {
      if (cardRef.current) {
        cardRef.current.destroy().catch(() => {});
        cardRef.current = null;
      }
    };
  }, []);

  const handleConfirm = async () => {
    if (!user) { router.push('/login'); return; }
    if (!cardRef.current) { setError('Payment form is not ready. Please wait a moment.'); return; }
    setPayLoading(true);
    setError('');

    try {
      // ── Get PDF Draft from Session storage ──
      const pdfData = typeof window !== 'undefined' ? sessionStorage.getItem('rhw_draft_pdf') : null;
      const formType = typeof window !== 'undefined' ? sessionStorage.getItem('rhw_form_type') : null;
      const formDataStr = typeof window !== 'undefined' ? sessionStorage.getItem('rhw_form_data') : null;
      const formData = formDataStr ? JSON.parse(formDataStr) : null;

      const result = await cardRef.current.tokenize();
      if (result.status !== 'OK' || !result.token) {
        setError('Card details are invalid. Please check and try again.');
        setPayLoading(false);
        return;
      }

      const res = await fetch('/api/checkout/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceId: result.token,
          amount: amountNumeric,
          currency: 'GBP',
          pdfData: pdfData,
          orderDetails: {
            name: orderName,
            price: orderPrice,
            detail: orderDetail,
            type: isListing ? 'listing' : 'service',
            formType: formType,
            formData: formData,
          },
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? 'Payment failed. Please try again.');
        setPayLoading(false);
        return;
      }

      const paymentResult = await res.json();
      
      if (useCartItems) clearCart();
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('rhw_draft_pdf');
        sessionStorage.removeItem('rhw_form_data');
        sessionStorage.removeItem('rhw_form_type');
      }
      setPayLoading(false);
      setDone({ active: true, pdfUrl: paymentResult.pdfUrl });
    } catch (err) {
      console.error('Payment error:', err);
      setError('An unexpected error occurred. Please try again.');
      setPayLoading(false);
    }
  };

  if (done.active) {
    return (
      <div className={styles.successPage}>
        <div className={styles.successCard}>
          <div className={styles.successIcon}>✓</div>
          <h2>Order Confirmed!</h2>
          <p>Your order for <strong>{orderName}</strong> has been placed successfully.</p>
          
          {done.pdfUrl && (
            <div className={styles.pdfDownloadSection}>
              <a 
                href={done.pdfUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className={styles.downloadBtn}
                download
              >
                📥 Download Official PDF
              </a>
              <p className={styles.pdfHint}>Your document is ready. You can also find it in your dashboard.</p>
            </div>
          )}

          <div className={styles.successActions}>
            <Link href="/dashboard" className={styles.primaryBtn}>Go to Dashboard</Link>
            <Link href={isListing ? '/pricing' : '/services'} className={styles.ghostBtn}>Browse More</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Script
        src={IS_SANDBOX
          ? 'https://sandbox.web.squarecdn.com/v1/square.js'
          : 'https://web.squarecdn.com/v1/square.js'}
        strategy="afterInteractive"
        onLoad={() => setSdkReady(true)}
        onError={() => setError('Failed to load payment SDK. Please check your connection and refresh.')}
      />

      <div className={styles.layout}>
        {/* ── Order Summary ── */}
        <div className={styles.summary}>
          <Link href={isListing ? '/pricing' : '/services'} className={styles.backLink}>← Back</Link>
          <h2>Order Summary</h2>

          {useCartItems ? (
             <div className={styles.cartItemsList}>
               {cartItems.map(item => (
                 <div key={item.id} className={styles.summaryCard} style={{ marginBottom: 8 }}>
                    <div className={styles.summaryIcon}>🛠️</div>
                    <div className={styles.summaryInfo}>
                      <div className={styles.summaryName}>{item.name}</div>
                    </div>
                    <div className={styles.summaryPrice}>{item.price}</div>
                 </div>
               ))}
             </div>
          ) : (
            <div className={styles.summaryCard}>
              <div className={styles.summaryIcon}>{isListing ? '🏠' : '🛠️'}</div>
              <div className={styles.summaryInfo}>
                <div className={styles.summaryName}>{orderName}</div>
                <div className={styles.summaryDetail}>{orderDetail}</div>
              </div>
              <div className={styles.summaryPrice}>{orderPrice}</div>
            </div>
          )}

          <div className={styles.total}>
            <span>Total</span>
            <span className={styles.totalPrice}>{orderPrice}</span>
          </div>

          <div className={styles.secure}>
            <span>🔒 Secure checkout powered by Square</span>
          </div>
        </div>

        {/* ── Payment Panel ── */}
        <div className={styles.payment}>
          <h2>Complete Order</h2>

          {userLoading ? (
            <div className={styles.loading} style={{ flex: 'unset', paddingTop: 60 }}>
              <div className={styles.spinner} />
              <span style={{ marginLeft: 12 }}>Loading your account…</span>
            </div>
          ) : !user ? (
            <div className={styles.authPrompt}>
              <p>Please sign in or create an account to complete your order.</p>
              <Link href={buildLoginRedirect(searchParams)} className={styles.primaryBtn}>
                Sign In
              </Link>
              <Link href="/register" className={styles.ghostBtn}>Create Account</Link>
            </div>
          ) : (
            <>
              <div className={styles.accountBanner}>
                <span>👤</span>
                <span>Ordering as <strong>{user.name}</strong> ({user.email})</span>
              </div>

              <div className={styles.paySection}>
                <h3>Payment Details</h3>

                {/* Square card container — always mounted when user is present */}
                <div ref={containerRef} style={{ minHeight: 89, marginBottom: 16 }} />

                {!sdkReady && !error && (
                  <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
                    Connecting to secure payment gateway…
                  </p>
                )}
                {sdkReady && !cardReady && !error && (
                  <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
                    Preparing payment form…
                  </p>
                )}
                {error && (
                  <div style={{ color: '#dc2626', marginBottom: 12, fontSize: '0.875rem' }}>
                    {error}
                  </div>
                )}
              </div>

              <button
                className={styles.confirmBtn}
                onClick={handleConfirm}
                disabled={payLoading || !cardReady}
              >
                {payLoading
                  ? <span className={styles.spinner} />
                  : `Confirm & Pay ${orderPrice}`}
              </button>

              <p className={styles.disclaimer}>
                By confirming, you agree to our terms of service. Payment is processed securely by Square.
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
}

function buildLoginRedirect(params: CheckoutClientProps['searchParams']): string {
  const qs = new URLSearchParams();
  if (params.plan) qs.set('plan', params.plan);
  if (params.type) qs.set('type', params.type);
  if (params.service) qs.set('service', params.service);
  if (params.price) qs.set('price', params.price);
  const checkoutPath = `/checkout${qs.toString() ? `?${qs.toString()}` : ''}`;
  return `/login?redirect=${encodeURIComponent(checkoutPath)}`;
}

function getPlanPrice(plan: string, type: string): string {
  const sellMap: Record<string, string> = { Basic: '£65', Silver: '£250', Gold: '£450', Ultimate: '1% Fee' };
  const letMap: Record<string, string> = { Basic: '£50', Essential: '£150', Premium: '£280' };
  return type === 'sell' ? (sellMap[plan] ?? '—') : (letMap[plan] ?? '—');
}

function parseAmount(price: string): number {
  if (!price) return 0;
  const match = price.replace(/,/g, '').match(/[\d.]+/);
  return match ? parseFloat(match[0]) : 0;
}
