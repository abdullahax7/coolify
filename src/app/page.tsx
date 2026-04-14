import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { QuickActions } from "@/components/home/QuickActions";
import { FeaturedProperties } from "@/components/home/FeaturedProperties";
import { Services } from "@/components/home/Services";
import { Testimonials } from "@/components/home/Testimonials";
import { ImpactStats } from "@/components/home/ImpactStats";
import { CashBuy } from "@/components/home/CashBuy";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <Header />
      
      <main>
        <Hero />
        
        <div className={styles.container}>
          <QuickActions />
          <CashBuy />
          <FeaturedProperties />

          <Testimonials />
          <ImpactStats />
          <Services />
        </div>
      </main>

      <Footer />
    </div>
  );
}
