import React from 'react';
import { CashBuyClient } from './CashBuyClient';
import { getPageContent } from '@/lib/getContent';

export const revalidate = 86400; // 24 hours

export const metadata = {
  title: 'We Buy Any House | Property Trader NTS',
  description: 'Sell your house fast for cash with Property Trader. Guaranteed offer in 24 hours, zero fees, and total peace of mind.',
};

export default async function CashBuyPage() {
  const content = await getPageContent('we-buy-any-house', {
    hero_badge: "UK's Trusted Cash Buyer",
    hero_title: "Sell Your House Fast <span>For Cash</span>",
    hero_subtitle: "Get a guaranteed offer in 24 hours. No fees, no viewings, and total peace of mind. We buy houses in any condition, across the UK.",
    form_success_heading: "Offer Request Received!",
    form_success_text: "Thank you. One of our property experts will review your details and contact you within 24 hours with a formal offer.",
    form_default_heading: "Get Your <span>Free Offer</span>",
    form_default_text: "Complete the form below and we'll be in touch within 24 hours.",
    process_heading: "How It <span>Works</span>",
    process_subtext: "Our 3-step process to a fast, stress-free sale.",
    step_1_title: "Request Offer",
    step_1_desc: "Call or email us with your property details. We'll research your area and value your property instantly.",
    step_2_title: "Receive Offer",
    step_2_desc: "We'll provide a formal cash offer within 24 hours. There's no obligation to accept.",
    step_3_title: "Cash In Bank",
    step_3_desc: "If you accept, we'll instruct lawyers and complete the sale in as little as 7-14 days.",
    benefit_1_title: "NAPB Approved",
    benefit_1_desc: "Member of the National Association of Property Buyers.",
    benefit_2_title: "Zero Costs",
    benefit_2_desc: "No agency fees, no legal fees, no hidden costs.",
    benefit_3_title: "Any Chain",
    benefit_3_desc: "We buy even if you have a broken chain or need a quick move."
  });

  return <CashBuyClient content={content} />;
}
