import React, { Suspense } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/common/Logo';
import type { Metadata } from 'next';
import CheckoutClient from './CheckoutClient';
import { createClient } from '@/lib/supabase/server';
import styles from './checkout.module.css';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Secure Checkout',
  description: 'Complete your property service order securely via Square.',
};

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CheckoutPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let profile = null;
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('id, name, phone, is_admin, created_at')
      .eq('id', user.id)
      .single();
    if (data) {
      profile = {
        id: user.id,
        name: data.name,
        email: user.email!,
        phone: data.phone ?? undefined,
        isAdmin: data.is_admin ?? false,
        createdAt: data.created_at,
      };
    }
  }

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
        <Link href="/" className={styles.logoLink}>
          <Logo className={styles.logoBrand} showPhone={false} disableLink={true} />
        </Link>
        <span className={styles.headerSub}>Secure Checkout</span>
      </div>
      <Suspense fallback={<div className={styles.loading}>Loading Checkout…</div>}>
        <CheckoutClient searchParams={params} initialUser={profile} />
      </Suspense>
    </div>
  );
}
