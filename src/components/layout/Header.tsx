"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Logo } from '../common/Logo';
import { getUser, clearUser, type User } from '@/lib/auth';
import styles from './Header.module.css';

export const Header: React.FC = () => {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showTools, setShowTools] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setUser(getUser());
    const onStorage = () => setUser(getUser());
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMenuOpen]);

  const handleLogout = () => {
    clearUser();
    setUser(null);
    router.push('/');
  };

  return (
    <>
      <div className={`${styles.topBar} ${isScrolled ? styles.hidden : ''}`}>
        <div className={styles.container}>
          <div className={styles.topBarLeft}>
            <span className={styles.topBarItem}>
              📍 113-114 Commercial Road, Newport, NP20 2GW
            </span>
          </div>
          <div className={styles.topBarRight}>
            <a href="tel:08006890604" className={styles.topBarItem}>📞 0800 6890604</a>
            <span className={styles.divider}>|</span>
            <a href="mailto:info@propertytrader1.co.uk" className={styles.topBarItem}>✉️ info@propertytrader1.co.uk</a>
          </div>
        </div>
      </div>

      <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
        <div className={styles.container}>
          <Logo className={styles.logo} showPhone={false} />

          <nav className={styles.nav}>
            <Link href="/properties" className={styles.navLink}>Properties</Link>
            <Link href="/pricing" className={styles.navLink}>List Property</Link>
            <Link href="/we-buy-any-house" className={`${styles.navLink} ${styles.cashBuyLink}`}>We Buy Any House</Link>

            <div
              className={styles.dropdownWrapper}
              onMouseEnter={() => setShowTools(true)}
              onMouseLeave={() => setShowTools(false)}
            >
              <button className={styles.navLink}>
                Tools <span className={styles.arrow}>▾</span>
              </button>
              {showTools && (
                <div className={styles.dropdown}>
                  <Link href="/tools?tab=mortgage" className={styles.dropdownLink}>
                    <strong>Mortgage Calculator</strong>
                    <span>Estimate monthly repayments</span>
                  </Link>
                  <Link href="/tools?tab=stamp-duty" className={styles.dropdownLink}>
                    <strong>Stamp Duty</strong>
                    <span>Calculate UK tax rates</span>
                  </Link>
                  <Link href="/tools?tab=yield" className={styles.dropdownLink}>
                    <strong>Rental Yield</strong>
                    <span>Analyze investment returns</span>
                  </Link>
                </div>
              )}
            </div>

            <Link href="/services" className={styles.navLink}>Services</Link>
            <Link href="/about" className={styles.navLink}>About</Link>
            <Link href="/contact" className={styles.navLink}>Contact</Link>
          </nav>

          <div className={styles.actions}>
            {user ? (
              <div className={styles.userMenu}>
                <Link href="/dashboard" className={styles.avatarBtn} title="Dashboard">
                  <span className={styles.avatarCircle}>{user.name.charAt(0).toUpperCase()}</span>
                  <span className={styles.avatarName}>{user.name.split(' ')[0]}</span>
                </Link>
                <button className={styles.signOutBtn} onClick={handleLogout}>Sign Out</button>
              </div>
            ) : (
              <div className={styles.authBtns}>
                <Link href="/login" className={styles.signInBtn}>Sign In</Link>
                <Link href="/register" className={styles.getStartedBtn}>Get Started</Link>
              </div>
            )}

            <button
              className={styles.mobileToggle}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle Menu"
            >
              <div className={`${styles.hamburger} ${isMenuOpen ? styles.open : ''}`}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div className={`${styles.mobileMenu} ${isMenuOpen ? styles.menuOpen : ''}`}>
        <div className={styles.mobileMenuContent}>
          <div className={styles.mobileMenuHeader}>
            <Logo showPhone={false} />
            <button
              className={styles.closeBtn}
              onClick={() => setIsMenuOpen(false)}
            >
              ✕
            </button>
          </div>

          <nav className={styles.mobileNav}>
            <Link href="/properties" onClick={() => setIsMenuOpen(false)}>Properties</Link>
            <Link href="/pricing" onClick={() => setIsMenuOpen(false)}>List Property</Link>
            <Link href="/we-buy-any-house" onClick={() => setIsMenuOpen(false)}>We Buy Any House</Link>

            <div className={styles.mobileSubNav}>
              <span className={styles.mobileSubNavTitle}>Tools</span>
              <Link href="/tools?tab=mortgage" onClick={() => setIsMenuOpen(false)}>Mortgage Calculator</Link>
              <Link href="/tools?tab=stamp-duty" onClick={() => setIsMenuOpen(false)}>Stamp Duty</Link>
              <Link href="/tools?tab=yield" onClick={() => setIsMenuOpen(false)}>Rental Yield</Link>
            </div>

            <Link href="/services" onClick={() => setIsMenuOpen(false)}>Services</Link>
            <Link href="/about" onClick={() => setIsMenuOpen(false)}>About Us</Link>
            <Link href="/contact" onClick={() => setIsMenuOpen(false)}>Contact</Link>
          </nav>

          <div className={styles.mobileMenuFooter}>
            {user ? (
              <div className={styles.mobileAuthRow}>
                <Link href="/dashboard" className={styles.mobileGetStarted} onClick={() => setIsMenuOpen(false)}>
                  My Dashboard
                </Link>
                <button className={styles.mobileSignOut} onClick={() => { handleLogout(); setIsMenuOpen(false); }}>
                  Sign Out
                </button>
              </div>
            ) : (
              <div className={styles.mobileAuthRow}>
                <Link href="/register" className={styles.mobileGetStarted} onClick={() => setIsMenuOpen(false)}>
                  Get Started
                </Link>
                <Link href="/login" className={styles.mobileSignIn} onClick={() => setIsMenuOpen(false)}>
                  Sign In
                </Link>
              </div>
            )}
            <div className={styles.mobileContactItems}>
              <a href="tel:08006890604" className={styles.mobileContactItem}>📞 0800 6890604</a>
              <a href="mailto:info@propertytrader1.co.uk" className={styles.mobileContactItem}>✉️ info@propertytrader1.co.uk</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
