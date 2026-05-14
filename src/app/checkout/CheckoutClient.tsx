"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { useRouter } from 'next/navigation';
import { getUser } from '@/lib/auth';
import type { User } from '@/lib/auth';
import styles from './checkout.module.css';
import { useCart } from '@/context/CartContext';

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
  initialUser: User | null;
}

type CardInstance = {
  tokenize: () => Promise<{ status: string; token?: string; errors?: unknown[] }>;
  destroy: () => Promise<boolean>;
};

const SANDBOX_APP_ID = (process.env.NEXT_PUBLIC_SQUARE_APP_ID ?? '').trim();
const LOCATION_ID = (process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID ?? '').trim();
const IS_SANDBOX = SANDBOX_APP_ID.startsWith('sandbox');

export default function CheckoutClient({ searchParams, initialUser }: CheckoutClientProps) {
  const router = useRouter();
  const { items: cartItems, total: cartTotal, clearCart } = useCart();
  const [user, setUser] = useState<User | null>(initialUser);
  const [userLoading, setUserLoading] = useState(!initialUser);
  const [payLoading, setPayLoading] = useState(false);
  const [done, setDone] = useState<{ active: boolean; pdfUrl?: string }>({ active: false });
  const [error, setError] = useState('');
  const [sdkReady, setSdkReady] = useState(false);
  const [cardReady, setCardReady] = useState(false);
  const [takingTooLong, setTakingTooLong] = useState(false);

  useEffect(() => {
    if (sdkReady) return;
    const timer = setTimeout(() => {
      if (!sdkReady) setTakingTooLong(true);
    }, 10000);
    return () => clearTimeout(timer);
  }, [sdkReady]);

  const cardRef = useRef<CardInstance | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const initializingRef = useRef(false);

  const useCartItems = searchParams.cart === 'true';
  const plan = searchParams.plan ?? '';
  const type = searchParams.type ?? '';
  const service = searchParams.service ?? '';
  const price = searchParams.price ?? '';

  const isListing = !!plan;

  const orderName = useCartItems
    ? `${cartItems.length} Services`
    : (isListing
      ? `${plan} Plan – ${type === 'sell' ? 'Selling' : 'Letting'}`
      : (service || 'Property Service'));

  const [pricingOverrides, setPricingOverrides] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch('/api/content?page=pricing')
      .then(res => res.json())
      .then(data => {
        if (data.content) {
          const mapped: Record<string, string> = {};
          data.content.forEach((item: { section_key: string; content_value: string }) => {
            mapped[item.section_key] = item.content_value;
          });
          setPricingOverrides(mapped);
        }
      })
      .catch(err => console.error('Failed to fetch pricing overrides for checkout:', err));
  }, []);

  const orderPrice = useCartItems
    ? `£${cartTotal.toFixed(2)}`
    : (isListing
      ? (pricingOverrides[`${type}_${plan.toLowerCase()}_price`] || getPlanPrice(plan, type))
      : (price || '£0.00'));

  const orderDetail = useCartItems
    ? cartItems.map(i => i.name).join(', ')
    : (isListing
      ? `Property ${type === 'sell' ? 'selling' : 'letting'} package`
      : 'Professional property service');

  const amountNumeric = useCartItems ? cartTotal : parseAmount(orderPrice);

  useEffect(() => {
    if (!initialUser) {
      getUser().then(u => {
        setUser(u);
        setUserLoading(false);
      }).catch(() => setUserLoading(false));
    }
  }, [initialUser]);

  // Fallback check for Square SDK in case onLoad is delayed
  useEffect(() => {
    if (typeof window !== 'undefined' && window.Square && !sdkReady) {
      setSdkReady(true);
    }

    // Periodically check if SDK loaded but event didn't fire
    const interval = setInterval(() => {
      if (typeof window !== 'undefined' && window.Square && !sdkReady) {
        setSdkReady(true);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [sdkReady]);

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

  useEffect(() => {
    if (!sdkReady || !user || !containerRef.current) return;
    initSquare();
  }, [sdkReady, user, initSquare]);

  useEffect(() => {
    return () => {
      if (cardRef.current) {
        cardRef.current.destroy().catch(() => { });
        cardRef.current = null;
      }
    };
  }, []);

  const handleConfirm = async () => {
    if (!user) { router.push('/login'); return; }

    // Only check for payment form if it's not a free plan
    if (amountNumeric > 0 && !cardRef.current) {
      setError('Payment form is not ready. Please wait a moment.');
      return;
    }

    setPayLoading(true);
    setError('');

    try {
      const pdfData = typeof window !== 'undefined' ? sessionStorage.getItem('rhw_draft_pdf') : null;
      const formType = typeof window !== 'undefined' ? sessionStorage.getItem('rhw_form_type') : null;
      const formDataStr = typeof window !== 'undefined' ? sessionStorage.getItem('rhw_form_data') : null;
      const formData = formDataStr ? JSON.parse(formDataStr) : null;

      let sourceId = 'FREE_PLAN';

      if (amountNumeric > 0 && cardRef.current) {
        const result = await cardRef.current.tokenize();
        if (result.status !== 'OK' || !result.token) {
          setError('Card details are invalid. Please check and try again.');
          setPayLoading(false);
          return;
        }
        sourceId = result.token;
      }

      const res = await fetch('/api/checkout/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceId,
          amount: amountNumeric,
          currency: 'GBP',
          pdfData: pdfData,
          orderDetails: {
            name: orderName,
            price: orderPrice,
            detail: orderDetail,
            type: isListing ? 'listing' : 'service',
            plan: plan,
            listingType: type,
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
        (window as any).__rhw_pdf_draft = null;
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

          <div className={styles.successActions}>
            <Link href="/dashboard" className={styles.primaryBtn}>View Dashboard</Link>
            <Link href={isListing ? '/pricing' : '/services'} className={styles.ghostBtn}>Browse More</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
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
                <h3>Order Summary</h3>
                <div style={{ marginBottom: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
                    <span>{orderName}</span>
                    <span>{orderPrice}</span>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: 4 }}>
                    {orderDetail}
                  </p>
                </div>

                {amountNumeric > 0 ? (
                  <>
                    <h3 style={{ marginTop: 30 }}>Payment Details</h3>
                    {/* Square card container */}
                    <div ref={containerRef} style={{ minHeight: 89, marginBottom: 16 }} />

                    {!sdkReady && !error && (
                      <div style={{ marginTop: 8 }}>
                        <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
                          Connecting to secure payment gateway…
                        </p>
                        {takingTooLong && (
                          <p style={{ color: '#dc2626', fontSize: '0.8rem', marginTop: 4 }}>
                            This is taking longer than expected. Please <a href="#" onClick={(e) => { e.preventDefault(); window.location.reload(); }} style={{ textDecoration: 'underline' }}>refresh the page</a> if it doesn't load soon.
                          </p>
                        )}
                      </div>
                    )}
                    {sdkReady && !cardReady && !error && (
                      <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
                        Preparing payment form…
                      </p>
                    )}
                  </>
                ) : (
                  <div className={styles.freeNotice} style={{
                    background: '#f0fdf4',
                    padding: '16px',
                    borderRadius: '8px',
                    border: '1px solid #bbf7d0',
                    color: '#166534',
                    marginBottom: 20
                  }}>
                    <span style={{ marginRight: 8 }}>✅</span>
                    This is a free plan. No payment information is required.
                  </div>
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
                disabled={payLoading || (amountNumeric > 0 && !cardReady)}
              >
                {payLoading
                  ? <span className={styles.spinner} />
                  : amountNumeric > 0 ? `Confirm & Pay ${orderPrice}` : 'Activate Free Plan'}
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
  const sellMap: Record<string, string> = { Basic: 'Free', Silver: '£250', Gold: '£450', Ultimate: '1% Fee' };
  const letMap: Record<string, string> = { Basic: 'Free', Essential: '£150', Premium: '£280' };
  return type === 'sell' ? (sellMap[plan] ?? '—') : (letMap[plan] ?? '—');
}

function parseAmount(price: string): number {
  if (!price) return 0;
  const match = price.replace(/,/g, '').match(/[\d.]+/);
  return match ? parseFloat(match[0]) : 0;
}
