import React from 'react';
import { getPageContent } from '@/lib/getContent';
import { ServicesClient } from './ServicesClient';

import { SERVICE_CATALOG, CatalogCategory } from '@/data/pricing_data';

export const metadata = {
  title: 'Services & Compliance Certificates | Property Trader',
  description: 'Gas Safety, EPC, EICR, tenancy agreements and Welsh statutory forms for UK landlords. Book individual property services online.',
  alternates: { canonical: '/services' },
};

export const revalidate = 3600; // 1 hour

export default async function ServicesHubPage() {
  const content = await getPageContent('services', {
    services_title: 'Full Service <span>Catalog</span>',
    services_subtitle: 'Individual services, products, and compliance certificates for landlords.',
    cta_heading: 'Need a Bespoke Solution?',
    cta_subtext: 'Contact our expert team for portfolio management or specialized commercial services.',
    hero_image_url: '/servicesbg.png'
  });

  const globalData = await getPageContent('global_data', {
    service_catalog: ''
  });

  // Ensure all categories from static SERVICE_CATALOG exist in the final catalog
  let finalCatalog = SERVICE_CATALOG;
  if (globalData.service_catalog) {
    try {
      const dbCatalog = JSON.parse(globalData.service_catalog);
      // Create a map of existing categories in DB
      const dbCatMap = new Map(dbCatalog.map((c: any) => [c.category, c]));
      
      // Merge: use DB version if exists, otherwise fallback to static
      finalCatalog = SERVICE_CATALOG.map(staticCat => {
        return (dbCatMap.get(staticCat.category) as CatalogCategory) || staticCat;
      });

      // Also include any extra categories from DB that aren't in static
      const staticCatNames = new Set(SERVICE_CATALOG.map(c => c.category));
      dbCatalog.forEach((dbCat: any) => {
        if (!staticCatNames.has(dbCat.category)) {
          finalCatalog.push(dbCat);
        }
      });
    } catch (e) {
      // Failed to parse catalog from DB
    }
  }
  
  // Final Sort/Order Logic (applied to both static and merged catalog)
  // 1. Move Renting Homes Wales Forms to the absolute end
  const walesIdx = finalCatalog.findIndex(c => c.category.includes('Wales Forms'));
  if (walesIdx !== -1) {
    const [walesCat] = finalCatalog.splice(walesIdx, 1);
    finalCatalog.push(walesCat);
  }

  // 2. Move Marketing & Boards to second last (right before Wales Forms)
  const marketingIdx = finalCatalog.findIndex(c => c.category.includes('Marketing & Boards'));
  if (marketingIdx !== -1) {
    const [marketingCat] = finalCatalog.splice(marketingIdx, 1);
    // If Wales is at the end, inserting at length-1 makes Marketing second-to-last
    finalCatalog.splice(finalCatalog.length - 1, 0, marketingCat);
  }

  return <ServicesClient content={content} rawCatalog={JSON.stringify(finalCatalog)} />;
}
