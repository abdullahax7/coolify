"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/common/Button';
import { PropertyCard } from '@/components/home/PropertyCard';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import styles from './property-detail.module.css';

interface Property {
  id: string;
  title: string;
  location: string;
  price: string;
  beds: string | number;
  baths: string | number;
  sqft: string | number;
  type: string;
  description?: string;
  image?: string;
  gallery?: string[];
  features?: string[];
  mapEmbedUrl?: string;
  agent?: {
    name: string;
    role: string;
    image: string;
    phone: string;
  };
}

interface PropertyDetailClientProps {
  property: Property;
  allProperties: Property[];
}

export default function PropertyDetailClient({ property: initialProperty, allProperties }: PropertyDetailClientProps) {
  const [property] = useState(initialProperty);
  const [current, setCurrent] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const thumbsRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

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
    if (Math.abs(diff) > 40) {
      if (diff > 0) next();
      else prev();
    }
    touchStartX.current = null;
  };

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.breadcrumb}>
            <Link href="/properties">Properties</Link> / <span>{property.title}</span>
          </div>

          <section className={styles.gallery}>
            <div className={styles.sliderTrack} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
              <div className={styles.mainSlide} onClick={() => { setLightboxIndex(current); setLightboxOpen(true); }}>
                <Image
                  key={current}
                  src={images[current]}
                  alt={`${property.title} – photo ${current + 1}`}
                  className={`${styles.slideImg} ${isAnimating ? styles.fadeIn : ''}`}
                  width={1200}
                  height={800}
                  priority
                  unoptimized
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
                {images.map((img: string, i: number) => (
                  <button key={i} className={`${styles.thumb} ${i === current ? styles.thumbActive : ''}`} onClick={() => goTo(i)} aria-label={`Go to image ${i + 1}`}>
                    <Image src={img} alt={`Thumbnail ${i + 1}`} width={100} height={100} unoptimized />
                  </button>
                ))}
              </div>
            )}
          </section>

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

          <section className={styles.details}>
            <div className={styles.grid}>
              <div className={styles.description}>
                <h2>About this <span>Residence</span></h2>
                <p>{property.description || 'No description available for this property.'}</p>
                {features.length > 0 && (
                  <>
                    <div className={styles.highlightsHeader}>
                      <h3 className={styles.subHeading}>Exclusive Features <span>& Amenities</span></h3>
                      <p className={styles.subText}>The finest details curated for a sophisticated lifestyle.</p>
                    </div>
                    <div className={styles.featuresGrid}>
                      {features.map((feature: string, idx: number) => (
                        <div key={idx} className={styles.featureCard}>
                          <div className={styles.featureLabel}>{feature}</div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {property.mapEmbedUrl && (
                  <div className={styles.mapSection} style={{ marginTop: '40px' }}>
                    <h3 className={styles.subHeading}>Location <span>& Map</span></h3>
                    <p className={styles.subText} style={{ marginBottom: '16px' }}>View the property location and surrounding neighborhood.</p>
                    <div className={styles.mapFrameWrap} style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                      <iframe 
                        src={property.mapEmbedUrl} 
                        width="100%" 
                        height="400" 
                        style={{ border: 0 }} 
                        allowFullScreen 
                        loading="lazy" 
                        referrerPolicy="no-referrer-when-downgrade" 
                      />
                    </div>
                  </div>
                )}
              </div>

              <aside className={styles.sidebar}>
                <div className={styles.agentCard}>
                  <h3>Listing Agent</h3>
                  <div className={styles.agentInfo}>
                    <Image src={agent.image} alt={agent.name} className={styles.agentImg} width={64} height={64} />
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
              </aside>
            </div>
          </section>

          <section className={styles.recentSection}>
            <div className={styles.recentHeader}>
              <h2>Explore More <span>Properties</span></h2>
              <p>Discover other exclusive residences from our curated collection.</p>
            </div>
            <div className={styles.recentGrid}>
              {allProperties
                .filter((p: Property) => p.id !== property.id)
                .slice(0, 3)
                .map((prop: Property) => (
                  <PropertyCard key={prop.id} {...prop} 
                  image={Array.isArray(prop.gallery) && prop.gallery.length > 0 ? prop.gallery[0] : (prop.image ?? '/images/prop_1.png')} 
                  beds={Number(prop.beds) || 0} 
                  baths={Number(prop.baths) || 0} 
                  sqft={Number(prop.sqft) || 0} 
                />
                ))}
            </div>
            <div className={styles.viewMoreBox}>
              <Link href="/properties">
                <Button variant="outline" size="lg">Explore All Listings</Button>
              </Link>
            </div>
          </section>
        </div>
      </main>

      {lightboxOpen && (
        <div className={styles.lightbox} onClick={() => setLightboxOpen(false)}>
          <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeLightbox} onClick={() => setLightboxOpen(false)} aria-label="Close">×</button>
            <button className={`${styles.lbArrow} ${styles.lbArrowLeft}`} onClick={() => setLightboxIndex(i => (i - 1 + total) % total)} aria-label="Previous">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
            </button>
            <Image src={images[lightboxIndex]} alt={`View ${lightboxIndex + 1}`} className={styles.lightboxImage} width={1600} height={1000} unoptimized />
            <button className={`${styles.lbArrow} ${styles.lbArrowRight}`} onClick={() => setLightboxIndex(i => (i + 1) % total)} aria-label="Next">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
            </button>
            <div className={styles.lbCounter}>{lightboxIndex + 1} / {total}</div>
            <div className={styles.lbThumbs}>
              {images.map((img: string, i: number) => (
                <button key={i} className={`${styles.lbThumb} ${i === lightboxIndex ? styles.lbThumbActive : ''}`} onClick={() => setLightboxIndex(i)}>
                  <Image src={img} alt={`Thumbnail ${i + 1}`} width={100} height={100} unoptimized />
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
