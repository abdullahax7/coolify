import React from 'react';
import type { Metadata } from 'next';
import Script from 'next/script';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import styles from '../blog.module.css';
import Link from 'next/link';

const TITLE = 'The Best Roofs Wales-England since 1996';
const DESCRIPTION = 'A look back at Property Trader’s history since 1996 — how an independent letting and estate agency grew to serve clients across Wales and England.';
const PUBLISHED = '2024-04-26';
const URL = 'https://pt1.co.uk/blog/best-roofs-wales-england';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/blog/best-roofs-wales-england' },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: 'article',
    publishedTime: PUBLISHED,
    url: '/blog/best-roofs-wales-england',
  },
};

export default function BestRoofsWales() {
  return (
    <div className={styles.page}>
      <Script
        id="blog-article-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: TITLE,
            description: DESCRIPTION,
            datePublished: PUBLISHED,
            dateModified: PUBLISHED,
            author: { '@type': 'Organization', name: 'Property Trader', url: 'https://pt1.co.uk' },
            publisher: { '@id': 'https://pt1.co.uk/#organization' },
            mainEntityOfPage: { '@type': 'WebPage', '@id': URL },
            articleSection: 'Company History',
            inLanguage: 'en-GB',
          }),
        }}
      />
      <Script
        id="blog-breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://pt1.co.uk/' },
              { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://pt1.co.uk/blog' },
              { '@type': 'ListItem', position: 3, name: TITLE, item: URL },
            ],
          }),
        }}
      />
      <Header />
      <div className={styles.container}>
        <Link href="/" className={styles.backBtn}>← Back to Home</Link>
        <article className={styles.card}>
          <header className={styles.header}>
            <p>26th April 2024 • Company History</p>
            <h1>The Best Roofs Wales-England since 1996</h1>
          </header>

          <div className={styles.content}>
            <p>
              Established since 1996, Property Trader is an independent, privately owned Estate and letting agents
              and has already established itself as one of the most progressive and forward thinking agency in Wales & England.
            </p>

            <p>
              We offer various services from the simple introduction of tenants to entire property management,
              and we work extremely hard to ensure we provide the best possible service whatever option you choose.
            </p>

            <p>
              We provide clients with comprehensive bespoke services and industry-leading independent advice.
              Our property investment advisors focused on the delivery of exciting property investment
              opportunities to private individuals, corporate and institutional investors.
            </p>

            <p>
              We know success isn&apos;t just about figures, it&apos;s about the satisfaction of knowing that we are also
              providing a first class service. Our unique approach to the industry has seen us grow from a
              small local firm to a nationally recognized agency.
            </p>

            <h2>Our Vision</h2>
            <p>
              We think nationally, but we act locally and regionally. This allows us to maintain the personal
              touch that our clients value while providing the expertise and reach of a larger organization.
            </p>
          </div>
        </article>
      </div>
      <Footer />
    </div>
  );
}
