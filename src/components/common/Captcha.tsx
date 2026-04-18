"use client";

import React, { useRef, useEffect } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import styles from './Captcha.module.css';

interface CaptchaProps {
  onChange: (token: string | null) => void;
}

const Captcha: React.FC<CaptchaProps> = ({ onChange }) => {
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  const isEnabled = process.env.NEXT_PUBLIC_RECAPTCHA_ENABLED === 'true';

  useEffect(() => {
    if (!isEnabled) onChange('bypass-token');
  }, [isEnabled, onChange]);

  if (!isEnabled) {
    return (
      <div className={styles.disabledCaptcha}>
        <span className={styles.secureText}>Secured by Webxoo</span>
      </div>
    );
  }

  if (!siteKey) {
    console.warn("reCAPTCHA site key is missing! Check your .env file.");
    return null;
  }

  return (
    <div className={styles.captchaContainer}>
      <ReCAPTCHA
        ref={recaptchaRef}
        sitekey={siteKey}
        onChange={onChange}
        theme="light"
      />
      <div className={styles.attribution}>
        Secured by <a href="https://webxoo.com" target="_blank" rel="noopener noreferrer">Webxoo</a>
      </div>
    </div>
  );
};

export default Captcha;
