'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export const PageProgressBar = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // When the route or search params change, trigger a short loading bar animation
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  if (!loading) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      height: '3px',
      background: 'var(--primary)',
      zIndex: 10000,
      transition: 'width 0.4s ease',
      width: '100%',
      animation: 'progressMove 0.8s ease-in-out forwards'
    }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes progressMove {
          0% { width: 0; opacity: 1; }
          70% { width: 80%; opacity: 1; }
          100% { width: 100%; opacity: 0; }
        }
      `}} />
    </div>
  );
};
