export interface PricingTier {
  name: string;
  price: string;
  subtitle?: string;
  isPopular?: boolean;
  highlight?: string;
}

export interface PricingFeature {
  name: string;
  values: (boolean | string)[]; // true = check, false = cross, string = text
}

export interface CatalogItem {
  name: string;
  price: string;
  desc: string;
}

export interface CatalogCategory {
  category: string;
  items: CatalogItem[];
}

/** SELLING PACKAGES DATA */
export const SELL_TIERS: PricingTier[] = [
  { name: 'Basic', price: '£65', subtitle: '3 Months with 3 months free' },
  { name: 'Silver', price: '£250', isPopular: true, highlight: 'Best Value' },
  { name: 'Gold', price: '£450' },
  { name: 'Ultimate', price: '1% fee', subtitle: 'No Sale No Fee' },
];

export const SELL_FEATURES: PricingFeature[] = [
  { name: 'Upfront Payment', values: [true, true, true, 'No Sale No Fee'] },
  { name: 'Property advertised on our website', values: [true, true, true, true] },
  { name: '24/7 access to manage viewings and offers', values: [true, true, true, true] },
  { name: 'Free instant valuation', values: [true, true, true, true] },
  { name: 'Property listing on OnTheMarket.com', values: [false, true, true, true] },
  { name: 'Viewing Arrangement', values: [false, true, true, true] },
  { name: 'Dedicated Account Manager', values: [false, true, true, true] },
  { name: 'Weekly Performance Update', values: [false, true, true, true] },
  { name: 'Professional Photography and Floor Plan', values: [false, false, true, true] },
  { name: 'Preparation of Paperwork', values: [false, false, true, true] },
  { name: 'Full Property Description', values: [true, true, true, true] },
  { name: 'Premium display on OnTheMarket.com', values: [false, false, true, true] },
  { name: 'EPC', values: [false, false, true, true] },
];

/** LETTING PACKAGES DATA */
export const LET_TIERS: PricingTier[] = [
  { name: 'Basic', price: '£50', subtitle: '4 Months Advertising' },
  { name: 'Essential', price: '£150', isPopular: true, subtitle: '4 Months Advertising' },
  { name: 'Premium', price: '£280', subtitle: '4 Months Advertising' },
];

export const LET_FEATURES: PricingFeature[] = [
  { name: 'Upfront Payment', values: [true, true, true] },
  { name: 'Property advertised on our website & OnTheMarket.com', values: [true, true, true] },
  { name: '24/7 access to manage viewings and offers', values: [true, true, true] },
  { name: 'Free instant valuation', values: [true, true, true] },
  { name: 'Property listing on Rightmove, Zoopla & PrimeLocation', values: [false, true, true] },
  { name: 'Viewing Arrangement', values: [false, true, true] },
  { name: 'Dedicated Account Manager', values: [false, true, true] },
  { name: 'Weekly Performance Update', values: [false, true, true] },
  { name: 'Professional Photography and Floor Plan', values: [false, false, true] },
  { name: 'Preparation of Paperwork', values: [false, false, true] },
  { name: 'Full Property Description', values: [true, true, true] },
  { name: 'Premium display on Zoopla', values: [false, false, true] },
  { name: 'Premium display on Rightmove', values: [false, false, true] },
  { name: 'EPC', values: [false, false, true] },
];

/** SHARED HELPERS */
export const getPricingData = (type: 'sell' | 'let') => {
  return type === 'sell' 
    ? { tiers: SELL_TIERS, features: SELL_FEATURES } 
    : { tiers: LET_TIERS, features: LET_FEATURES };
};

export const SERVICE_CATALOG: CatalogCategory[] = [
  {
    category: '📢 Marketing & Boards',
    items: [
      { name: '🪧 “To Let” Board', price: '£45.00', desc: 'Advertise your property 24 hours a day, locally.' },
      { name: '🪧 “For Sale” Board', price: '£45.00', desc: 'Advertise your property 24 hours a day, locally.' },
      { name: '👤 Accompanied Viewings', price: '£195.00', desc: 'Let us take care of the viewings for you and host up to 5 viewings.' },
      { name: '📸 Photo & Floor Plan', price: '£125.00', desc: 'Professionally taken 10 photographs and floor plan.' }
    ]
  },
  {
    category: '🛡️ Safety & Compliance',
    items: [
      { name: '🔥 Gas Certificate', price: '£65.00', desc: 'Official CP12 gas safety certification.' },
      { name: '⚡ EPC Certificate', price: '£95.00', desc: 'Energy Performance Certificate requirement.' },
      { name: '🔌 Electric Certificate', price: '£140.00', desc: 'Five-year electrical safety check (EICR).' },
      { name: '🚨 Fire Alarm Certificate', price: '£100.00', desc: 'System testing and certification.' },
      { name: '💨 CO Detector', price: '£15.00', desc: 'Backlit digital display with household/commercial scope.' },
      { name: '🔔 Smoke Alarm', price: '£16.00', desc: 'Essential safety hardware for any property.' }
    ]
  },
  {
    category: '👥 Tenant Find & Referencing',
    items: [
      { name: '🏢 Tenant Find – Commercial', price: '£250.00', desc: 'Comprehensive commercial tenant matching.' },
      { name: '🏠 Tenant Find – Residential', price: '£150.00', desc: 'End-to-end residential tenant placement.' },
      { name: '📋 Tenant Referencing', price: '£20.00', desc: 'Credit check for one applicant with free guarantor check.' }
    ]
  },
  {
    category: '📊 Reports & Valuations',
    items: [
      { name: '🏠 House Report – England', price: '£130.00', desc: 'Detailed comprehensive property valuation.' },
      { name: '🏴󠁧󠁢󠁷󠁬󠁳󠁿 House Report – Wales', price: '£130.00', desc: 'Detailed comprehensive property valuation.' },
      { name: '📋 Inventory Report – England', price: '£80.00', desc: 'Full property condition log for move-in.' },
      { name: '📋 Inventory Report – Wales', price: '£50.00', desc: 'Full property condition log for move-in.' }
    ]
  },
  {
    category: '⚖️ Legal & Documentation',
    items: [
      { name: '📄 Tenancy Agreements', price: '£40.00', desc: 'Professionally prepared AST or commercial agreements.' },
      { name: '✍️ Digital Signing', price: '£40.00', desc: 'Includes electronic signatures for all parties.' },
      { name: '💼 Commercial Lease', price: '£130.00', desc: 'Specialized legal commercial leasing documents.' },
      { name: '🔒 Deposit Holding', price: '£30.00', desc: 'Secure management of tenant deposits (DPS).' },
      { name: '🔔 Section 13 Notice', price: '£30.00', desc: 'Issuance of legal notices for rent review.' },
      { name: '⚠️ Section 8 Notice', price: '£50.00', desc: 'Legal notice for possession due to breach.' },
      { name: '📈 Rent Increase England', price: '£20.00', desc: 'Formal procedure for rent review.' },
      { name: '📈 Rent Increase Wales', price: '£13.00', desc: 'Formal procedure for rent review in Wales.' }
    ]
  },
  {
    category: '🛠️ Hardware & Other',
    items: [
      { name: '🔥 Infered Panel Heater', price: '£55.00', desc: 'Efficient heating solution for properties.' }
    ]
  }
];
