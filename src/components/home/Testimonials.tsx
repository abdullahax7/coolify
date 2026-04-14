"use client";

import React from 'react';
import styles from './HomeSections.module.css';

const TESTIMONIALS = [
  {
    quote: "Property Trader has completely transformed how I manage my central London portfolio. Their attention to detail is unparalleled.",
    author: "Alexandra Vane",
    role: "Portfolio Owner, Mayfair",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200"
  },
  {
    quote: "The tenant screening process is rigorous and professional. I've had zero issues since switching to Property Trader.",
    author: "Marcus Thorne",
    role: "Property Investor",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&h=200"
  },
  {
    quote: "Exceptional service from start to finish. The dashboard makes tracking my rental income and maintenance so easy.",
    author: "Elena Rossi",
    role: "Luxury Residential Owner",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200&h=200"
  },
  {
    quote: "A truly modern approach to property management. They handle everything, giving me complete peace of mind.",
    author: "James Radcliffe",
    role: "Commercial Landlord",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200&h=200"
  }
];

export const Testimonials: React.FC = () => {
  // Duplicate list for infinite scroll
  const scrollList = [...TESTIMONIALS, ...TESTIMONIALS];

  return (
    <section className={styles.testimonials}>
      <div className={styles.sectionHeader}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 900 }}>Client <span>Testimonials</span></h2>
        <p style={{ color: 'var(--text-muted)' }}>What our partners say about the Property Trader standard.</p>
      </div>

      <div className={styles.track}>
        {scrollList.map((t, idx) => (
          <div key={idx} className={styles.card}>
            <p className={styles.quote}>"{t.quote}"</p>
            <div className={styles.author}>
              <img src={t.image} alt={t.author} className={styles.authorImg} />
              <div className={styles.authorInfo}>
                <h4>{t.author}</h4>
                <p>{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
