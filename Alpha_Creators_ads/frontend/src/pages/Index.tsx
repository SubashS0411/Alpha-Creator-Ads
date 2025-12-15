import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { DashboardPreview } from "@/components/DashboardPreview";
import { Footer } from "@/components/Footer";
import { TrustedBy } from "@/components/TrustedBy";
import { HowItWorks } from "@/components/HowItWorks";
import { Testimonials } from "@/components/Testimonials";
import { Pricing } from "@/components/Pricing";
import { CTA } from "@/components/CTA";
import { useEffect } from "react";
import { useTheme } from "@/components/theme-provider";

const Index = () => {
  const { setTheme } = useTheme();

  useEffect(() => {
    // Ensure dark mode is consistent
    setTheme("dark");
  }, [setTheme]);

  return (
    <div className="min-h-screen bg-background transition-colors duration-700 ease-in-out">
      <Header />
      <main>
        <HeroSection />
        <TrustedBy />
        <FeaturesSection />
        <HowItWorks />
        <DashboardPreview />
        <Testimonials />
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
