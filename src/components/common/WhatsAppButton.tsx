"use client";

import React, { useState } from 'react';

export const WhatsAppButton: React.FC = () => {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href="https://wa.me/448006890604"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'fixed',
        bottom: '28px',
        right: '28px',
        zIndex: 9000,
        width: '58px',
        height: '58px',
        background: '#25D366',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: hovered
          ? '0 10px 32px rgba(37,211,102,0.55)'
          : '0 6px 24px rgba(37,211,102,0.45)',
        transform: hovered ? 'scale(1.1)' : 'scale(1)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        textDecoration: 'none',
      }}
    >
      <svg width="30" height="30" viewBox="0 0 32 32" fill="white" xmlns="http://www.w3.org/2000/svg">
        <path d="M16.002 2.667C8.638 2.667 2.667 8.637 2.667 16c0 2.358.633 4.663 1.833 6.68L2.667 29.333l6.84-1.794A13.267 13.267 0 0 0 16.002 29.333c7.363 0 13.331-5.97 13.331-13.333S23.365 2.667 16.002 2.667zm0 24c-2.115 0-4.183-.57-5.99-1.647l-.43-.256-4.06 1.065 1.083-3.952-.28-.453A10.62 10.62 0 0 1 5.333 16c0-5.882 4.787-10.667 10.669-10.667S26.667 10.118 26.667 16 21.882 26.667 16.002 26.667zm5.856-7.988c-.32-.16-1.895-.934-2.189-1.04-.294-.107-.508-.16-.722.16-.213.32-.828 1.04-.015 1.254.107.213.32.32.107.534-.213.214-.32.107-.534-.107-.534-.32-.16-1.895-.934-2.242-1.123-.134-.107-.24-.267-.374-.374l-.267-.267c-.16-.213-.107-.534.053-.694l.534-.56c.053-.107.107-.267.053-.374l-.934-2.242c-.24-.587-.494-.507-.694-.52l-.587-.01c-.213 0-.56.08-.854.374-.293.294-1.12 1.094-1.12 2.67 0 1.576 1.147 3.098 1.307 3.312.16.213 2.255 3.445 5.467 4.83.763.33 1.36.527 1.824.674.766.244 1.464.21 2.015.127.615-.092 1.895-.775 2.162-1.523.267-.748.267-1.39.187-1.523-.08-.133-.293-.213-.613-.373z"/>
      </svg>
    </a>
  );
};
