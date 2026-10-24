import { Menu, X, LogIn } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'motion/react';
import { useLeadModal } from './LeadModal';
import logo from 'figma:asset/ad897e27c9019da277ae7ca4120f6d7a0bdb8116.png';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const openLead = useLeadModal();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-cyan-500/20">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <button 
            onClick={scrollToTop}
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity group"
          >
            <img 
              src={logo} 
              alt="DFIR-Rapid Logo" 
              className="w-10 h-10 object-contain"
            />
            <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              DFIR-Rapid
            </span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollToSection('features')} className="text-gray-300 hover:text-cyan-400 transition-colors">
              Features
            </button>
            <button onClick={() => scrollToSection('how-it-works')} className="text-gray-300 hover:text-cyan-400 transition-colors">
              How It Works
            </button>
            <button onClick={() => scrollToSection('pricing')} className="text-gray-300 hover:text-cyan-400 transition-colors">
              Pricing
            </button>
            <button onClick={() => scrollToSection('contact')} className="text-gray-300 hover:text-cyan-400 transition-colors">
              Contact
            </button>
            <a href="#/portal" className="text-gray-300 hover:text-cyan-400 transition-colors flex items-center gap-1.5">
              <LogIn className="w-4 h-4" /> Login
            </a>
            <button onClick={() => { setIsMenuOpen(false); openLead({ type: 'demo' }); }} className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all">
              Request Demo
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-cyan-400"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden mt-4 pb-4 flex flex-col gap-4"
          >
            <button onClick={() => scrollToSection('features')} className="text-gray-300 hover:text-cyan-400 transition-colors text-left">
              Features
            </button>
            <button onClick={() => scrollToSection('how-it-works')} className="text-gray-300 hover:text-cyan-400 transition-colors text-left">
              How It Works
            </button>
            <button onClick={() => scrollToSection('pricing')} className="text-gray-300 hover:text-cyan-400 transition-colors text-left">
              Pricing
            </button>
            <button onClick={() => scrollToSection('contact')} className="text-gray-300 hover:text-cyan-400 transition-colors text-left">
              Contact
            </button>
            <a href="#/portal" className="text-gray-300 hover:text-cyan-400 transition-colors text-left flex items-center gap-1.5">
              <LogIn className="w-4 h-4" /> Client / Team Login
            </a>
            <button onClick={() => { setIsMenuOpen(false); openLead({ type: 'demo' }); }} className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg text-left">
              Request Demo
            </button>
          </motion.div>
        )}
      </nav>
    </header>
  );
}
