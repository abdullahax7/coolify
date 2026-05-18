import type { Metadata } from 'next';

const TITLE = 'Landlord Application | Property Trader';
const DESCRIPTION = 'Apply for letting and property management services with Property Trader. Independent letting agents covering Wales and England since 1996.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/contact/landlord-application' },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: '/contact/landlord-application',
    type: 'website',
  },
};

export default function LandlordApplicationLayout({ children }: { children: React.ReactNode }) {
  return children;
}
