import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { WhatsAppButton } from "@/components/common/WhatsAppButton";
import { CartProvider } from "@/context/CartContext";
import "./globals.css";

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
  metadataBase: new URL('https://property-trader1.co.uk'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Property Trader | Luxury Property Management",
    description: "Expert property management and high-end listings.",
    url: 'https://property-trader1.co.uk',
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
        <link rel="dns-prefetch" href="https://wa.me" />
      </head>
      <body suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Property Trader",
              "url": "https://property-trader1.co.uk",
              "logo": "https://property-trader1.co.uk/logo.png",
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+44-800-689-0604",
                "contactType": "customer service",
                "areaServed": "GB",
                "availableLanguage": "en"
              },
              "sameAs": [
                "https://facebook.com/propertytrader",
                "https://instagram.com/propertytrader"
              ]
            })
          }}
        />
        <CartProvider>
          {children}
        </CartProvider>

        <WhatsAppButton />
      </body>
    </html>
  );
}
