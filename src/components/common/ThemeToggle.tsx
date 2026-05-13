'use client';

import React, { useEffect, useState } from 'react';

export const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check initial state
    const current = document.body.classList.contains('dark-mode');
    setIsDark(current);
    
    // Check localStorage
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      document.body.classList.add('dark-mode');
      setIsDark(true);
    }
  }, []);

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <button 
      onClick={toggle}
      style={{
        padding: '8px 12px',
        borderRadius: '8px',
        background: isDark ? '#1e293b' : '#f1f5f9',
        color: isDark ? '#f8fafc' : '#0f172a',
        fontSize: '0.875rem',
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        border: '1px solid var(--border)',
        transition: 'all 0.2s ease',
        width: '100%'
      }}
    >
      {isDark ? '🌙 Dark Mode' : '☀️ Light Mode'}
    </button>
  );
};
