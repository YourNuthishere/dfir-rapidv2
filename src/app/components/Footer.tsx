import { Mail, Phone, MapPin, Twitter, Linkedin, Github } from 'lucide-react';
import logo from 'figma:asset/ad897e27c9019da277ae7ca4120f6d7a0bdb8116.png';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="footer" className="bg-black border-t border-cyan-500/20">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div>
            <button 
              onClick={scrollToTop}
              className="flex items-center gap-3 mb-4 group cursor-pointer hover:opacity-80 transition-opacity"
            >
              <img 
                src={logo} 
                alt="DFIR-Rapid Logo" 
                className="w-12 h-12 object-contain"
              />
              <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                DFIR-Rapid
              </span>
            </button>
            <p className="text-gray-400 text-sm mb-4">
              Automated digital forensics and incident response platform for SMEs. Fast, affordable, and forensic-ready.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-500/50 rounded-lg flex items-center justify-center transition-all group">
                <Twitter className="w-5 h-5 text-gray-400 group-hover:text-cyan-400" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-500/50 rounded-lg flex items-center justify-center transition-all group">
                <Linkedin className="w-5 h-5 text-gray-400 group-hover:text-cyan-400" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-500/50 rounded-lg flex items-center justify-center transition-all group">
                <Github className="w-5 h-5 text-gray-400 group-hover:text-cyan-400" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-3">
              <li>
                <a href="#features" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                  Features
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#pricing" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                  API Reference
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm text-gray-400">Email</div>
                  <a href="mailto:contact@dfir-rapid.com" className="text-sm text-white hover:text-cyan-400 transition-colors">
                    contact@dfir-rapid.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm text-gray-400">Phone</div>
                  <a href="tel:+1-800-DFIR-911" className="text-sm text-white hover:text-cyan-400 transition-colors">
                    +855 (10) DFIR-911
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm text-gray-400">Address</div>
                  <p className="text-sm text-white">
                    123 Cyber Street<br />
                    Chrouy Changvar, Phnom Penh Capital
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-cyan-500/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              © {currentYear} DFIR-Rapid. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-gray-400">
              <a href="#/portal" className="hover:text-cyan-400 transition-colors">
                Client Portal
              </a>
              <a href="#" className="hover:text-cyan-400 transition-colors">
                Security
              </a>
              <a href="#" className="hover:text-cyan-400 transition-colors">
                Compliance
              </a>
              <a href="#" className="hover:text-cyan-400 transition-colors">
                Trust Center
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
