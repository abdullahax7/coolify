import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { WhatsAppButton } from "@/components/common/WhatsAppButton";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Property Trader | Luxury Property Management",
  description: "Comprehensive property management platform for listings, tenants, owners, and digital lease management.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body suppressHydrationWarning>
        {children}

        <WhatsAppButton />
      </body>
    </html>
  );
}
