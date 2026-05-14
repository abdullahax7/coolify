import React from 'react';

export default function Loading() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      width: '100vw',
      position: 'fixed',
      top: 0,
      left: 0,
      background: 'var(--background)',
      zIndex: 9999
    }}>
      <div className="loader"></div>
      <p style={{ 
        marginTop: '20px', 
        fontSize: '1.125rem', 
        fontWeight: 600, 
        color: 'var(--primary)',
        fontFamily: 'var(--font-serif)'
      }}>
        Property Trader is preparing your view...
      </p>
      <style dangerouslySetInnerHTML={{ __html: `
        .loader {
          width: 50px;
          height: 50px;
          border: 5px solid var(--border-light);
          border-top: 5px solid var(--primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}} />
    </div>
  );
}
