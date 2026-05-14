import React from 'react';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { getStaff } from '@/data/staff';
import { getTestimonials } from '@/data/testimonials';
import { getPageContent } from '@/lib/getContent';
import { createStaticClient } from '@/lib/supabase/server';
import styles from './about.module.css';

export const metadata = {
  title: 'About Us | Property Trader',
  description: 'Property Trader has been buying, selling, and managing UK residential property since 1996. Meet the team behind the UK\'s straightforward property service.',
  alternates: { canonical: '/about' },
};

export const revalidate = 86400; // 24 hours

export default async function AboutPage() {
  const content = await getPageContent('about', {
    hero_badge: 'About Us',
    hero_title: 'A Tradition of <span>Excellence</span>',
    hero_subtitle: 'Property Trader was born from a simple vision: to make high-end property management as seamless as the luxury living it supports.',
    intro_headline: 'We think <span>nationally.</span> We act <span>locally</span> and <span>regionally</span>',
    intro_established: 'Established since 1996',
    intro_paragraph_1: 'We are an independent, privately owned Estate and letting agents and has already established itself as one of the most progressive and forward thinking agency in Wales & England.',
    intro_paragraph_2: 'We offer various services from the simple introduction of tenants to entire property management, and we work extremely hard to ensure we provide the best possible service whatever option you choose.',
    intro_paragraph_3: 'We provide clients with comprehensive bespoke services and industry-leading independent advice. Our property investment advisors focused on the delivery of exciting property investment opportunities to private individuals, corporate and institutional investors.',
    intro_paragraph_4: "We know success isn't just about figures, it's about the satisfaction of knowing that we are also providing a first class service to our customers.",
    ceo_badge: 'Business Owner & CEO',
    ceo_name: 'Mohammed Athar <span>Rashid</span>',
    ceo_bio: 'Mohammed Rashid has been at the forefront of the UK property market for nearly three decades. Under his leadership, Property Trader has grown from a local boutique to a nationally recognized standard-setter in luxury property management and investment sourcing.',
    ceo_quote: '"Our mission is to bridge the gap between architectural elegance and operational superiority. We believe every property has a story, and our job is to ensure it\'s told with precision and care."'
  });

  const globalContent = await getPageContent('global');

  const staticClient = await createStaticClient();
  const allStaff = await getStaff(staticClient);
  const allTestimonials = await getTestimonials();

  const ceo = allStaff.find(s => s.id === 'mohammed');
  const otherTeam = allStaff.filter(s => s.id !== 'mohammed');

  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.container}>
            <div className={styles.heroInner}>
              <div className={styles.badge} dangerouslySetInnerHTML={{__html: content.hero_badge }} />
              <h1 className={styles.title} dangerouslySetInnerHTML={{__html: content.hero_title }} />
              <p className={styles.subtitle} dangerouslySetInnerHTML={{__html: content.hero_subtitle }} />
            </div>
          </div>
        </section>

        {/* New Detailed Intro Section */}
        <section className={styles.introSection}>
          <div className={styles.container}>
            <div className={styles.introContent}>
              <h2 dangerouslySetInnerHTML={{__html: content.intro_headline }} />
              <div className={styles.introGrid}>
                <div className={styles.introText}>
                  <p className={styles.highlight} dangerouslySetInnerHTML={{__html: content.intro_established }} />
                  <p dangerouslySetInnerHTML={{__html: content.intro_paragraph_1 }} />
                  <p dangerouslySetInnerHTML={{__html: content.intro_paragraph_2 }} />
                </div>
                <div className={styles.introImageSide}>
                  <Image 
                    src="/images/about-agent-new.png"
                    alt="Property Trader Professional"
                    width={900}
                    height={1200}
                    className={styles.agentPng}
                  />
                </div>
              </div>

              <div className={styles.introGridMirrored}>
                <div className={styles.introImageSide}>
                  <Image 
                    src="/images/about-investment-new.png"
                    alt="Property Investment Advisor"
                    width={900}
                    height={900}
                    className={styles.agentPng}
                  />
                </div>
                <div className={styles.introText}>
                  <p dangerouslySetInnerHTML={{__html: content.intro_paragraph_3 }} />
                  <p dangerouslySetInnerHTML={{__html: content.intro_paragraph_4 }} />
                  <p>
                    Our unique combination of friendly and highly professional staff, market leading IT systems,
                    award winning marketing and, of course, the website – means our customers – including
                    landlords and tenants – can be assured that they are receiving some of the leading property services.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CEO / Founder Section */}
        {ceo && (
          <section className={styles.founderSection}>
            <div className={styles.container}>
              <div className={styles.founderGrid}>
                <div className={styles.founderImageArea}>
                  <div className={styles.founderImageFrame}>
                    <Image
                      src={globalContent[`staff_${ceo.id}_image`] || ceo.image}
                      alt={ceo.name}
                      width={500}
                      height={600}
                      className={styles.founderImg}
                      priority
                    />
                  </div>
                </div>
                <div className={styles.founderText}>
                  <div className={styles.founderBadge} dangerouslySetInnerHTML={{__html: content.ceo_badge }} />
                  <h2 className={styles.founderName} dangerouslySetInnerHTML={{__html: content.ceo_name }} />
                  <p className={styles.founderBio} dangerouslySetInnerHTML={{__html: content.ceo_bio }} />
                  <p className={styles.founderPhilosophy} dangerouslySetInnerHTML={{__html: content.ceo_quote }} />
                  <div className={styles.founderStats}>
                    <div className={styles.miniStat}>
                      <strong>25+</strong>
                      <span>Years Experience</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        <section id="team" className={styles.team}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Meet <span>The Support Team</span></h2>
            <div className={styles.teamGrid}>
              {otherTeam.map((member) => (
                <div key={member.id} className={styles.teamCard}>
                  <div className={styles.teamImgWrapper}>
                    <Image
                      src={globalContent[`staff_${member.id}_image`] || member.image}
                      alt={member.name}
                      width={400}
                      height={500}
                      className={styles.teamImg}
                    />
                  </div>
                  <div className={styles.teamInfo}>
                    <h3>{member.name}</h3>
                    <p className={styles.roleLabel}>{member.role}</p>
                    <p className={styles.teamBioSnippet}>{member.description}</p>
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
              {allTestimonials.slice(0, 3).map((t, i) => (
                <div key={i} className={styles.testimonialCard}>
                  <div className={styles.quoteIcon}>&quot;</div>
                  <p>{t.quote}</p>
                  <div className={styles.author}>
                    <div className={styles.authorFlex}>
                      <Image
                        src={t.image}
                        alt={t.author}
                        width={48}
                        height={48}
                        className={styles.authorImg}
                      />
                      <div className={styles.authorMeta}>
                        <strong>{t.author}</strong>
                        <span>{t.role}</span>
                      </div>
                    </div>
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
