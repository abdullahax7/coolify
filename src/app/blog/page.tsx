"use client";

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import styles from './blog.module.css';
import Link from 'next/link';

const BLOGS = [
  {
    slug: 'brexit-right-to-rent',
    title: 'How Will Brexit Affect Your Tenants’ Right to Rent?',
    date: '15th August 2024',
    category: 'Landlords, News',
    excerpt: 'What’s changing for citizens from the EU, EEA and Switzerland regarding their right to rent in the UK post-Brexit.'
  },
  {
    slug: 'best-roofs-wales-england',
    title: 'The Best Roofs Wales-England since 1996',
    date: '26th April 2024',
    category: 'Company History',
    excerpt: 'A look back at our history since 1996 and how we became a leading independent agency in Wales and England.'
  },
  {
    slug: 'property-trader-strategy',
    title: 'Property Trader at your service Since 1996',
    date: '25th April 2024',
    category: 'Our Strategy',
    excerpt: 'Our core business strategy focused on organic growth and delivering first-class service to landlords and investors.'
  }
];

export default function BlogIndex() {
  return (
    <div className={styles.page}>
      <Header />
      <div className={styles.container}>
        <header className={styles.header} style={{ borderBottom: 'none' }}>
          <p>Insights & Updates</p>
          <h1>Property Trader <span>Blog</span></h1>
          <p style={{ marginTop: 20, textTransform: 'none', color: '#64748b', fontSize: '1.1rem', letterSpacing: 'normal' }}>
            Expert advice, market updates, and company news from the leaders in Wales and England property management.
          </p>
        </header>

        <div className={styles.blogGrid}>
          {BLOGS.map((blog) => (
            <Link href={`/blog/${blog.slug}`} key={blog.slug} className={styles.blogCard}>
              <div className={styles.cardHeader}>
                <span className={styles.cardCategory}>{blog.category}</span>
                <span className={styles.cardDate}>{blog.date}</span>
              </div>
              <h3>{blog.title}</h3>
              <p>{blog.excerpt}</p>
              <span className={styles.readMore}>Read Article →</span>
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
