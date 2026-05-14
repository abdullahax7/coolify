import React from 'react';
import { ToolsClient } from './ToolsClient';
import { getPageContent } from '@/lib/getContent';

export const metadata = {
  title: 'Property Investment Tools | Property Trader NTS',
  description: 'Calculate mortgage repayments, stamp duty, and rental yields with our free suite of property investment tools.',
};

export default async function ToolsPage() {
  const content = await getPageContent('tools', {
    tools_mortgage_title: "Mortgage Calculator",
    tools_stamp_duty_title: "Stamp Duty (SDLT) Calculator",
    tools_yield_title: "Rental Yield Calculator"
  });

  return <ToolsClient content={content} />;
}
