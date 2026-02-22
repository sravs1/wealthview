import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import ExchangeLogos from "@/components/landing/ExchangeLogos";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import PortfolioTypes from "@/components/landing/PortfolioTypes";
import Stats from "@/components/landing/Stats";
import Testimonials from "@/components/landing/Testimonials";
import Help from "@/components/landing/Help";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#050a14]">
      <Navbar />
      <Hero />
      <ExchangeLogos />
      <Features />
      <HowItWorks />
      <PortfolioTypes />
      <Stats />
      <Testimonials />
      <Help />
      <CTA />
      <Footer />
    </main>
  );
}
