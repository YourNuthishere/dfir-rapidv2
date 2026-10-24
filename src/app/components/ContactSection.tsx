import { motion } from 'motion/react';
import { Mail, Clock, ShieldCheck } from 'lucide-react';
import { LeadForm } from './LeadModal';

export function ContactSection() {
  return (
    <section id="contact" className="py-24 bg-black relative overflow-hidden">
      <div className="absolute top-10 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto items-start">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-tight pb-2 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Get in Touch
            </h2>
            <p className="text-xl text-gray-400 mb-10">
              Under attack right now, or planning ahead? Send us a message and our forensic team will respond fast.
            </p>
            <div className="space-y-6">
              {[
                { icon: Clock, title: 'Response within 24 hours', text: 'Urgent incidents are prioritized immediately.' },
                { icon: ShieldCheck, title: 'Confidential by default', text: 'Your details are only used to reply to you.' },
                { icon: Mail, title: 'contact@dfir-rapid.com', text: 'Prefer email? Write to us directly.' },
              ].map(({ icon: Icon, title, text }) => (
                <div key={title} className="flex gap-4">
                  <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-500/30 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <div className="text-white font-semibold">{title}</div>
                    <div className="text-gray-400 text-sm">{text}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-sm border border-cyan-500/30 rounded-2xl p-8 shadow-2xl shadow-cyan-500/10"
          >
            <LeadForm type="contact" compact />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
