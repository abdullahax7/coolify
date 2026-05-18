import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { QuickActions } from "@/components/home/QuickActions";
import { FeaturedProperties } from "@/components/home/FeaturedProperties";
import { Services } from "@/components/home/Services";
import { Testimonials } from "@/components/home/Testimonials";
import { CEOFeature } from "@/components/home/CEOFeature";
import { ImpactStats } from "@/components/home/ImpactStats";
import { CashBuy } from "@/components/home/CashBuy";
import { getPageContent, getGlobalData } from "@/lib/getContent";
import { SERVICE_CATALOG } from "@/data/pricing_data";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Property Trader | Letting Agents & Property Management Wales & England",
  description: "Independent estate and letting agents since 1996 — full property management, lettings, sales and cash house buying across Wales and England. Get a free valuation today.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Property Trader | Letting Agents & Property Management Wales & England",
    description: "Independent estate and letting agents since 1996. Full property management, lettings, sales and cash house buying across Wales and England.",
    url: "/",
    type: "website",
  },
};

export const revalidate = 3600; // Refresh every hour

export default async function Home() {
  const content = await getPageContent('homepage', {
    hero_badge: 'Luxury Property Management',
    hero_title: 'THE ULTIMATE PROPERTY STANDARD. <br /><span>LUXURY MANAGEMENT REDEFINED.</span>',
    hero_subtitle: "Exclusive real estate and high-end property management across the UK. We provide elite services for the country's most prestigious residences."
  });

  const catalog = await getGlobalData('service_catalog', SERVICE_CATALOG);

  return (
    <div className={styles.page}>
      <Header />
      
      <main>
        <Hero content={content} />
        
        <div className={styles.container}>
          <QuickActions />
          <FeaturedProperties />
          <CashBuy />
          <CEOFeature />
          <Testimonials />
          <ImpactStats />
          <Services initialCatalog={catalog} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
