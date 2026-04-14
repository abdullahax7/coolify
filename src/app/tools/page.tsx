"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MortgageCalculator } from '@/components/tools/MortgageCalculator';
import { StampDutyCalculator } from '@/components/tools/StampDutyCalculator';
import { RentalYieldCalculator } from '@/components/tools/RentalYieldCalculator';
import styles from '@/components/tools/Calculators.module.css';

const ToolsContent = () => {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState('mortgage');

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['mortgage', 'stamp-duty', 'yield'].includes(tab)) {
      requestAnimationFrame(() => setActiveTab(tab));
    }
  }, [searchParams]);

  const renderCalculator = () => {
    switch (activeTab) {
      case 'mortgage': return <MortgageCalculator />;
      case 'stamp-duty': return <StampDutyCalculator />;
      case 'yield': return <RentalYieldCalculator />;
      default: return <MortgageCalculator />;
    }
  };

  const getTitle = () => {
    switch (activeTab) {
      case 'mortgage': return 'Mortgage Calculator';
      case 'stamp-duty': return 'Stamp Duty (SDLT) Calculator';
      case 'yield': return 'Rental Yield Calculator';
      default: return 'Mortgage Calculator';
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>{getTitle()}</h1>
        
        <div style={{ display: 'flex', gap: '12px', marginBottom: '40px' }}>
          <button 
            onClick={() => setActiveTab('mortgage')}
            style={{ 
              padding: '10px 20px', 
              borderRadius: 'var(--radius-sm)',
              background: activeTab === 'mortgage' ? 'var(--primary)' : 'var(--background)',
              color: activeTab === 'mortgage' ? 'white' : 'var(--secondary)',
              border: 'none',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Mortgage
          </button>
          <button 
            onClick={() => setActiveTab('stamp-duty')}
            style={{ 
              padding: '10px 20px', 
              borderRadius: 'var(--radius-sm)',
              background: activeTab === 'stamp-duty' ? 'var(--primary)' : 'var(--background)',
              color: activeTab === 'stamp-duty' ? 'white' : 'var(--secondary)',
              border: 'none',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Stamp Duty
          </button>
          <button 
            onClick={() => setActiveTab('yield')}
            style={{ 
              padding: '10px 20px', 
              borderRadius: 'var(--radius-sm)',
              background: activeTab === 'yield' ? 'var(--primary)' : 'var(--background)',
              color: activeTab === 'yield' ? 'white' : 'var(--secondary)',
              border: 'none',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Rental Yield
          </button>
        </div>

        {renderCalculator()}
      </div>
    </div>
  );
};

export default function ToolsPage() {
  return (
    <main style={{ background: 'var(--background)', minHeight: '100vh', paddingTop: '140px' }}>
      <Header />
      <Suspense fallback={<div>Loading tools...</div>}>
        <ToolsContent />
      </Suspense>
      <Footer />
    </main>
  );
}
