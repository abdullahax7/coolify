"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, notFound } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/common/Button';
import { PROPERTIES as allProperties } from '@/data/properties';
import styles from './property-detail.module.css';

const getFeatureIcon = (feature: string) => {
  const lower = feature.toLowerCase();
  if (lower.includes('pool') || lower.includes('infinity')) return '🏊‍♂️';
  if (lower.includes('terrace') || lower.includes('balcony')) return '🌅';
  if (lower.includes('smart') || lower.includes('automated')) return '🤖';
  if (lower.includes('cinema')) return '🎬';
  if (lower.includes('gym')) return '🏋️‍♀️';
  if (lower.includes('park') || lower.includes('garage')) return '🅿️';
  if (lower.includes('garden')) return '🌿';
  if (lower.includes('spa')) return '🧖‍♀️';
  if (lower.includes('wine')) return '🍷';
  if (lower.includes('beach')) return '🏖️';
  if (lower.includes('floor') || lower.includes('heating')) return '🔥';
  if (lower.includes('solar')) return '☀️';
  return '✨';
};

// ── Component ────────────────────────────────────────────────────────────────
export default function PropertyDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const property = allProperties.find((p) => p.id === id) ?? null;

  const [current, setCurrent] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const thumbsRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  if (!property) notFound();

  const images = Array.isArray(property.gallery) && property.gallery.length > 0
    ? property.gallery
    : [property.image || '/images/prop_1.png'];

  const features = Array.isArray(property.features) ? property.features : [];
  const agent = property.agent || { name: 'Support Team', role: 'Property Consultant', image: '/images/hero_ready.png', phone: '0800 6890604' };
  const total = images.length;

  const goTo = useCallback((index: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrent((index + total) % total);
    setTimeout(() => setIsAnimating(false), 400);
  }, [isAnimating, total]);

  const prev = useCallback(() => goTo(current - 1), [current, goTo]);
  const next = useCallback(() => goTo(current + 1), [current, goTo]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (lightboxOpen) {
        if (e.key === 'ArrowLeft') setLightboxIndex(i => (i - 1 + total) % total);
        if (e.key === 'ArrowRight') setLightboxIndex(i => (i + 1) % total);
        if (e.key === 'Escape') setLightboxOpen(false);
      } else {
        if (e.key === 'ArrowLeft') prev();
        if (e.key === 'ArrowRight') next();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxOpen, prev, next, total]);

  useEffect(() => {
    const container = thumbsRef.current;
    if (!container) return;
    const activeThumb = container.children[current] as HTMLElement;
    if (activeThumb) activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [current]);

  useEffect(() => {
    document.body.style.overflow = lightboxOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [lightboxOpen]);

  const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) diff > 0 ? next() : prev();
    touchStartX.current = null;
  };

  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.breadcrumb}>
            <a href="/properties">Properties</a> / <span>{property.title}</span>
          </div>

          {/* ── IMAGE SLIDER ── */}
          <section className={styles.gallery}>
            <div className={styles.sliderTrack} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
              <div className={styles.mainSlide} onClick={() => { setLightboxIndex(current); setLightboxOpen(true); }}>
                <img
                  key={current}
                  src={images[current]}
                  alt={`${property.title} – photo ${current + 1}`}
                  className={`${styles.slideImg} ${isAnimating ? styles.fadeIn : ''}`}
                />
                <div className={styles.counter}>{current + 1} / {total}</div>
              </div>
              <button className={`${styles.arrow} ${styles.arrowLeft}`} onClick={prev} aria-label="Previous image">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
              </button>
              <button className={`${styles.arrow} ${styles.arrowRight}`} onClick={next} aria-label="Next image">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
              </button>
            </div>
            {total > 1 && (
              <div className={styles.thumbStrip} ref={thumbsRef}>
                {images.map((img, i) => (
                  <button key={i} className={`${styles.thumb} ${i === current ? styles.thumbActive : ''}`} onClick={() => goTo(i)} aria-label={`Go to image ${i + 1}`}>
                    <img src={img} alt={`Thumbnail ${i + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* ── PROPERTY INFO ── */}
          <section className={styles.infoSection}>
            <div className={styles.infoLeft}>
              <div className={styles.badge}>{property.type}</div>
              <h1 className={styles.title}>{property.title}</h1>
              <p className={styles.location}>📍 {property.location}</p>
              <div className={styles.amenitiesBar}>
                <div className={styles.amenity}><span>{property.beds}</span>Beds</div>
                <div className={styles.amenity}><span>{property.baths}</span>Baths</div>
                <div className={styles.amenity}><span>{property.sqft}</span>Sqft</div>
              </div>
            </div>
            <div className={styles.infoRight}>
              <div className={styles.price}>{property.price}</div>
              <div className={styles.actions} style={{ marginTop: '24px' }}>
                <a href="tel:08006890604"><Button variant="primary" size="lg" className={styles.cta}>Book a Viewing</Button></a>
                <Button variant="outline" size="lg" className={styles.cta}>Brochure</Button>
              </div>
            </div>
          </section>

          {/* ── DESCRIPTION + SIDEBAR ── */}
          <section className={styles.details}>
            <div className={styles.grid}>
              <div className={styles.description}>
                <h2>About this <span>Residence</span></h2>
                <p>{property.description || 'No description available for this property.'}</p>
                {features.length > 0 && (
                  <>
                    <h3 className={styles.subHeading}>Key Highlights</h3>
                    <div className={styles.featuresGrid}>
                      {features.map((feature: string, idx: number) => (
                        <div key={idx} className={styles.featureCard}>
                          <div className={styles.featureIcon}>{getFeatureIcon(feature)}</div>
                          <div className={styles.featureLabel}>{feature}</div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <aside className={styles.sidebar}>
                <div className={styles.agentCard}>
                  <h3>Listing Agent</h3>
                  <div className={styles.agentInfo}>
                    <img src={agent.image} alt={agent.name} className={styles.agentImg} />
                    <div>
                      <div className={styles.agentName}>{agent.name}</div>
                      <div className={styles.agentRole}>{agent.role}</div>
                    </div>
                  </div>
                  <a href={`tel:${agent.phone.replace(/\s/g, '')}`} style={{ display: 'block', width: '100%' }}>
                    <Button variant="outline" className={styles.agentBtn} style={{ color: 'white', borderColor: 'rgba(255,255,255,0.2)', width: '100%' }}>{agent.phone}</Button>
                  </a>
                  <a href="tel:08006890604" style={{ display: 'block', width: '100%' }}>
                    <Button variant="primary" className={styles.agentBtn} style={{ width: '100%' }}>Contact Agent</Button>
                  </a>
                </div>
                <div className={styles.mortgageCalc}>
                  <h3>Financial Intelligence</h3>
                  <div className={styles.payment}>Estimate <span>/ month</span></div>
                  <p>Consult with our financial team for premium market rates and tailored amortization plans.</p>
                  <a href="tel:08006890604" style={{ display: 'block' }}>
                    <Button variant="outline" className={styles.calcBtn} style={{ width: '100%' }}>Speak to Advisor</Button>
                  </a>
                </div>
              </aside>
            </div>
          </section>

          {/* ── MAP ── */}
          {property.mapEmbedUrl && (
            <section className={styles.mapSection}>
              <h2>Location & <span>Satellite View</span></h2>
              <div className={styles.mapContainer}>
                <iframe src={property.mapEmbedUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
              </div>
            </section>
          )}
        </div>
      </main>

      {/* ── LIGHTBOX ── */}
      {lightboxOpen && (
        <div className={styles.lightbox} onClick={() => setLightboxOpen(false)}>
          <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeLightbox} onClick={() => setLightboxOpen(false)} aria-label="Close">×</button>
            <button className={`${styles.lbArrow} ${styles.lbArrowLeft}`} onClick={() => setLightboxIndex(i => (i - 1 + total) % total)} aria-label="Previous">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
            </button>
            <img src={images[lightboxIndex]} alt={`View ${lightboxIndex + 1}`} className={styles.lightboxImage} />
            <button className={`${styles.lbArrow} ${styles.lbArrowRight}`} onClick={() => setLightboxIndex(i => (i + 1) % total)} aria-label="Next">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
            </button>
            <div className={styles.lbCounter}>{lightboxIndex + 1} / {total}</div>
            <div className={styles.lbThumbs}>
              {images.map((img, i) => (
                <button key={i} className={`${styles.lbThumb} ${i === lightboxIndex ? styles.lbThumbActive : ''}`} onClick={() => setLightboxIndex(i)}>
                  <img src={img} alt={`Thumbnail ${i + 1}`} />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
