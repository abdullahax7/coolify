import React, { Suspense } from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import CheckoutClient from './CheckoutClient';
import styles from './checkout.module.css';

export const metadata: Metadata = {
  title: 'Secure Checkout',
  description: 'Complete your property service order securely via Square.',
};

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CheckoutPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;

  // Normalize params for the client component
  const params = {
    plan: typeof resolvedParams.plan === 'string' ? resolvedParams.plan : undefined,
    type: typeof resolvedParams.type === 'string' ? resolvedParams.type : undefined,
    service: typeof resolvedParams.service === 'string' ? resolvedParams.service : undefined,
    price: typeof resolvedParams.price === 'string' ? resolvedParams.price : undefined,
    cart: typeof resolvedParams.cart === 'string' ? resolvedParams.cart : undefined,
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Link href="/" className={styles.logoLink}>PROPERTY <span>TRADER</span></Link>
        <span className={styles.headerSub}>Secure Checkout</span>
      </div>
      <Suspense fallback={<div className={styles.loading}>Loading Checkout…</div>}>
        <CheckoutClient searchParams={params} />
      </Suspense>
    </div>
  );
}
