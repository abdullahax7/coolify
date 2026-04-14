import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import styles from './about.module.css';

export default function AboutPage() {
  return (
    <div className={styles.page}>
      <Header />
      
      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.container}>
            <div className={styles.badge}>Our Story</div>
            <h1>A Tradition of <span>Excellence</span></h1>
            <p className={styles.subtitle}>
              Property Trader was born from a simple vision: to make high-end property 
              management as seamless as the luxury living it supports.
            </p>
          </div>
        </section>

        <section className={styles.content}>
          <div className={styles.container}>
            <div className={styles.row}>
              <div className={styles.textContent}>
                <h2>Experience the <span>Property Trader</span> Difference</h2>
                <p>
                  With over 15 years of experience in the luxury real estate market, 
                  we have refined our processes to ensure that owners and tenants 
                  receive nothing short of perfection.
                </p>
                <p>
                  Our platform combines cutting-edge technology with the personal touch 
                  of industry veterans. We don&apos;t just manage buildings; we manage futures.
                </p>
                <div className={styles.stats}>
                  <div className={styles.stat}>
                    <strong>15+</strong>
                    <span>Years</span>
                  </div>
                  <div className={styles.stat}>
                    <strong>500+</strong>
                    <span>Properties</span>
                  </div>
                  <div className={styles.stat}>
                    <strong>£12B</strong>
                    <span>Managed</span>
                  </div>
                </div>
              </div>
              <div className={styles.imagePlaceholder}>
                {/* Image of the team or office */}
                <div className={styles.glassImg}>
                  <span>Elegance in Every Detail</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="team" className={styles.team}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Meet <span>The Team</span></h2>
            <div className={styles.teamGrid}>
              {[
                { name: 'Mohammed Athar Rashid', role: 'Business Owner & Property Manager', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400' },
                { name: 'Sarah Williams', role: 'Head of Lettings', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400' },
                { name: 'James Thompson', role: 'Investment Consultant', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400' }
              ].map((member, i) => (
                <div key={i} className={styles.teamCard}>
                  <div className={styles.teamImg} style={{ backgroundImage: `url(${member.image})` }} />
                  <div className={styles.teamInfo}>
                    <h3>{member.name}</h3>
                    <p>{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="testimonials" className={styles.testimonials}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Client <span>Testimonials</span></h2>
            <div className={styles.testimonialGrid}>
              {[
                { quote: "Property Trader has transformed how we manage our portfolio. Their attention to detail is unmatched.", author: "David Henderson", role: "Property Investor" },
                { quote: "Professional, transparent and highly efficient. The best letting agency in Newport.", author: "Emma Ratcliffe", role: "Landlord" },
                { quote: "Made finding my new home an absolute breeze. Highly recommend their professional services.", author: "Michael Chen", role: "Tenant" }
              ].map((t, i) => (
                <div key={i} className={styles.testimonialCard}>
                  <div className={styles.quoteIcon}>&quot;</div>
                  <p>{t.quote}</p>
                  <div className={styles.author}>
                    <strong>{t.author}</strong>
                    <span>{t.role}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
