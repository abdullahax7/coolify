"use client";

import React from 'react';
import FormRHW1 from './FormRHW1';
import FormRHW2 from './FormRHW2';
import FormRHW3 from './FormRHW3';
import FormRHW4 from './FormRHW4';
import FormRHW6 from './FormRHW6';
import FormRHW7 from './FormRHW7';
import FormRHW8 from './FormRHW8';
import FormRHW12 from './FormRHW12';
import FormRHW15 from './FormRHW15';
import FormRHW16 from './FormRHW16';
import FormRHW17 from './FormRHW17';
import FormRHW18 from './FormRHW18';
import FormRHW19 from './FormRHW19';
import FormRHW20 from './FormRHW20';
import FormRHW21 from './FormRHW21';
import FormRHW22 from './FormRHW22';
import FormRHW23 from './FormRHW23';
import FormRHW24 from './FormRHW24';
import FormRHW25 from './FormRHW25';
import FormRHW26 from './FormRHW26';
import FormRHW27 from './FormRHW27';
import FormRHW28 from './FormRHW28';
import FormRHW29 from './FormRHW29';
import FormRHW30 from './FormRHW30';
import FormRHW32 from './FormRHW32';
import FormRHW33 from './FormRHW33';
import FormRHW34 from './FormRHW34';
import FormRHW35 from './FormRHW35';
import FormRHW36 from './FormRHW36';
import FormRHW37 from './FormRHW37';
import FormRHW38 from './FormRHW38';
import FormTenancyAgreement from './FormTenancyAgreement';
import GenericWalesForm from './GenericWalesForm';

interface FormViewerProps {
  formType: string;
  data: any;
}

export default function FormViewer({ formType, data }: FormViewerProps) {
  const normalizedType = (formType || '').trim();

  // Wrap the selected form in a container that includes the "Secured by Webxoo" badge
  const renderForm = () => {
    // 1. Check for Tenancy Agreement / FSOC (High Fidelity 26-page template)
    if (/Tenancy Agreement|Fixed Term Standard Occupation Contract/i.test(normalizedType)) {
      return <FormTenancyAgreement data={data} />;
    }

    // 2. Exact matches for specific RHW forms
    switch (normalizedType) {
      case 'Form RHW1': return <FormRHW1 data={data} />;
      case 'Form RHW2': return <FormRHW2 data={data} />;
      case 'Form RHW3': return <FormRHW3 data={data} />;
      case 'Form RHW4': return <FormRHW4 data={data} />;
      case 'Form RHW6': return <FormRHW6 data={data} />;
      case 'Form RHW7': return <FormRHW7 data={data} />;
      case 'Form RHW8': return <FormRHW8 data={data} />;
      case 'Form RHW12': return <FormRHW12 data={data} />;
      case 'Form RHW15': return <FormRHW15 data={data} />;
      case 'Form RHW16': return <FormRHW16 data={data} />;
      case 'Form RHW17': return <FormRHW17 data={data} />;
      case 'Form RHW18': return <FormRHW18 data={data} />;
      case 'Form RHW19': return <FormRHW19 data={data} />;
      case 'Form RHW20': return <FormRHW20 data={data} />;
      case 'Form RHW21': return <FormRHW21 data={data} />;
      case 'Form RHW22': return <FormRHW22 data={data} />;
      case 'Form RHW23': return <FormRHW23 data={data} />;
      case 'Form RHW24': return <FormRHW24 data={data} />;
      case 'Form RHW25': return <FormRHW25 data={data} />;
      case 'Form RHW26': return <FormRHW26 data={data} />;
      case 'Form RHW27': return <FormRHW27 data={data} />;
      case 'Form RHW28': return <FormRHW28 data={data} />;
      case 'Form RHW29': return <FormRHW29 data={data} />;
      case 'Form RHW30': return <FormRHW30 data={data} />;
      case 'Form RHW32': return <FormRHW32 data={data} />;
      case 'Form RHW33': return <FormRHW33 data={data} />;
      case 'Form RHW34': return <FormRHW34 data={data} />;
      case 'Form RHW35': return <FormRHW35 data={data} />;
      case 'Form RHW36': return <FormRHW36 data={data} />;
      case 'Form RHW37': return <FormRHW37 data={data} />;
      case 'Form RHW38': return <FormRHW38 data={data} />;
      default:
        // Fallback for unknown RHW forms
        if (normalizedType.startsWith('Form RHW')) {
          return <GenericWalesForm formType={normalizedType} data={data} />;
        }
    }

    return <GenericWalesForm formType={normalizedType || 'Unknown'} data={data} />;
  };

  return (
    <div className="wales-form-wrapper" style={{ position: 'relative' }}>
      {renderForm()}
      <div style={{ 
        textAlign: 'center', 
        fontSize: '10px', 
        color: '#666', 
        marginTop: '-30px', 
        paddingBottom: '40px',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        fontFamily: 'sans-serif'
      }}>
        🛡️ Secured & Validated by Webxoo
      </div>
    </div>
  );
}
