import React from 'react';
import { getPageContent } from '@/lib/getContent';
import { ContactClient } from './ContactClient';

export const metadata = {
  title: 'Contact Property Trader | UK Property Specialists',
  description: 'Get in touch with Property Trader. Sell your house fast, list a property, or speak to a UK property specialist. Phone 0800 6890604.',
  alternates: { canonical: '/contact' },
};

export default async function ContactPage() {
  const content = await getPageContent('contact', {
    contact_title: 'Contact <span>Property Trader</span>',
    contact_subtitle: 'Ready to elevate your property experience? Speak with our dedicated specialists today.',
    general_inquiries_title: 'Direct <span>Lines</span>',
    general_inquiries_phone: '08006890604',
    general_inquiries_email: 'info@propertytrader1.co.uk',
    hero_image_url: '/contact.jpeg',
    office_hours_weekday: '10:30 – 18:00',
    office_hours_saturday: '09:00 – 16:00',
    office_hours_sunday: 'Closed'
  });

  return (
    <React.Suspense fallback={<div>Loading Page...</div>}>
      <ContactClient content={content} />
    </React.Suspense>
  );
}
