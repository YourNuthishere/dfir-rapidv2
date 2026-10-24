import { motion } from 'motion/react';
import { ArrowRight, Shield, Clock, DollarSign } from 'lucide-react';
import { useLeadModal } from './LeadModal';

export function CTASection() {
  const openLead = useLeadModal();
  return (
    <section className="py-24 bg-gradient-to-b from-blue-950/30 to-black relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto"
        >
          {/* Main CTA Box */}
          <div className="bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-500/10 backdrop-blur-sm border border-cyan-500/30 rounded-3xl p-12 shadow-2xl shadow-cyan-500/20">
            {/* Shield Icon */}
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-cyan-500/50">
                <Shield className="w-10 h-10 text-white" />
              </div>
            </div>

            {/* Heading */}
            <h2 className="text-4xl md:text-6xl font-bold text-center mb-6 leading-tight pb-2 bg-gradient-to-r from-white via-cyan-200 to-blue-300 bg-clip-text text-transparent">
              Protect Your Business Today
            </h2>

            <p className="text-xl text-gray-300 text-center mb-12 max-w-3xl mx-auto">
              Don't wait for the next cyber incident. Get enterprise-grade forensics at SME pricing.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => openLead({ type: 'demo' })}
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-semibold text-lg flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/70 transition-all"
              >
                Book a Demo
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => openLead({ type: 'contact' })}
                className="px-8 py-4 bg-white/5 border border-cyan-500/50 text-cyan-400 rounded-lg font-semibold text-lg hover:bg-white/10 transition-all"
              >
                Contact Sales
              </motion.button>
            </div>

            {/* Benefits Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-black/30 rounded-xl border border-cyan-500/20">
                <div className="w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-6 h-6 text-cyan-400" />
                </div>
                <div className="text-2xl font-bold text-white mb-2">~ 5 Hours</div>
                <div className="text-sm text-gray-400">Average investigation time</div>
              </div>

              <div className="text-center p-6 bg-black/30 rounded-xl border border-cyan-500/20">
                <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-6 h-6 text-purple-400" />
                </div>
                <div className="text-2xl font-bold text-white mb-2">75% Savings</div>
                <div className="text-sm text-gray-400">Compared to consultants</div>
              </div>

              <div className="text-center p-6 bg-black/30 rounded-xl border border-cyan-500/20">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-green-400" />
                </div>
                <div className="text-2xl font-bold text-white mb-2">100% Forensic</div>
                <div className="text-sm text-gray-400">Court-ready evidence</div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="mt-12 pt-8 border-t border-cyan-500/20">
              <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span>14-day free trial</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span>Cancel anytime</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}