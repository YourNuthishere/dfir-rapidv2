import { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { ProblemSection } from './components/ProblemSection';
import { SolutionSection } from './components/SolutionSection';
import { FeaturesSection } from './components/FeaturesSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { DemoScenarioSection } from './components/DemoScenarioSection';
import { PricingSection } from './components/PricingSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { CTASection } from './components/CTASection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { LeadModalProvider } from './components/LeadModal';
import PortalApp from '../portal/PortalApp';

// Simple hash routing so it works on any free static host: /#/portal opens the client & team portal.
function useIsPortal() {
  const check = () => /^#\/(portal|admin)/.test(window.location.hash);
  const [isAdmin, setIsAdmin] = useState(check);
  useEffect(() => {
    const on = () => setIsAdmin(check());
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return isAdmin;
}

export default function App() {
  const isPortal = useIsPortal();
  if (isPortal) return <PortalApp />;

  return (
    <LeadModalProvider>
      <div className="min-h-screen bg-black text-white">
        <Header />
        <HeroSection />
        <ProblemSection />
        <SolutionSection />
        <FeaturesSection />
        <HowItWorksSection />
        <DemoScenarioSection />
        <PricingSection />
        <TestimonialsSection />
        <CTASection />
        <ContactSection />
        <Footer />
      </div>
    </LeadModalProvider>
  );
}
