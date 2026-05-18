import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { WhatsAppButton } from "@/components/common/WhatsAppButton";
import { CartProvider } from "@/context/CartContext";
import Script from "next/script";
import "./globals.css";
import DynamicTheme from "@/components/theme/DynamicTheme";
import { PageProgressBar } from "@/components/common/PageProgressBar";
import { Suspense } from 'react';

const SANDBOX_APP_ID = (process.env.NEXT_PUBLIC_SQUARE_APP_ID ?? '').trim();
const IS_SANDBOX = SANDBOX_APP_ID.startsWith('sandbox');
const SQUARE_URL = IS_SANDBOX 
  ? 'https://sandbox.web.squarecdn.com/v1/square.js' 
  : 'https://web.squarecdn.com/v1/square.js';

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: 'swap',
});

const outfit = Outfit({
  variable: "--font-serif",
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: "Property Trader | Luxury Property Management",
    template: "%s | Property Trader"
  },
  description: "Comprehensive property management platform for listings, tenants, owners, and digital lease management in Wales and England.",
  metadataBase: new URL('https://pt1.co.uk'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Property Trader | Luxury Property Management",
    description: "Expert property management and high-end listings.",
    url: 'https://pt1.co.uk',
    siteName: 'Property Trader',
    locale: 'en_GB',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://web.squarecdn.com" />
        <link rel="preconnect" href="https://sandbox.web.squarecdn.com" />
        <link rel="dns-prefetch" href="https://wa.me" />
        <DynamicTheme />
      </head>
      <body suppressHydrationWarning>
        <Script
          id="json-ld-website"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "@id": "https://pt1.co.uk/#website",
              "url": "https://pt1.co.uk",
              "name": "Property Trader",
              "inLanguage": "en-GB",
              "publisher": { "@id": "https://pt1.co.uk/#organization" },
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://pt1.co.uk/properties?search={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": ["Organization", "RealEstateAgent"],
              "@id": "https://pt1.co.uk/#organization",
              "name": "Property Trader",
              "alternateName": "Property Trader NTS Letting & Sales",
              "legalName": "Property Trader Ltd",
              "url": "https://pt1.co.uk",
              "logo": {
                "@type": "ImageObject",
                "url": "https://pt1.co.uk/images/logo.png",
                "width": 512,
                "height": 512
              },
              "image": "https://pt1.co.uk/images/logo.png",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "113-114 Commercial Road",
                "addressLocality": "Newport",
                "addressRegion": "Wales",
                "postalCode": "NP20 2GW",
                "addressCountry": "GB"
              },
              "areaServed": [
                { "@type": "Country", "name": "United Kingdom" },
                { "@type": "AdministrativeArea", "name": "Wales" },
                { "@type": "AdministrativeArea", "name": "England" }
              ],
              "knowsAbout": ["Property Sales", "Property Management", "Residential Lettings", "Cash House Buying", "Estate Agency"],
              "contactPoint": [{
                "@type": "ContactPoint",
                "telephone": "+44-800-689-0604",
                "email": "info@propertytrader1.co.uk",
                "contactType": "customer service",
                "areaServed": "GB",
                "availableLanguage": ["English"]
              }],
              "openingHoursSpecification": [
                {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                  "opens": "09:00",
                  "closes": "18:00"
                },
                {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": "Saturday",
                  "opens": "10:00",
                  "closes": "16:00"
                }
              ],
              "priceRange": "££",
              "foundingDate": "1996",
              "sameAs": [
                "https://facebook.com/propertytrader",
                "https://instagram.com/propertytrader"
              ]
            })
          }}
        />
        <Script 
          src={SQUARE_URL}
          strategy="afterInteractive"
        />
        <Suspense fallback={null}>
          <PageProgressBar />
        </Suspense>
        <CartProvider>
          {children}
        </CartProvider>

        <WhatsAppButton />
      </body>
    </html>
  );
}
