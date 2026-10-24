import { motion } from 'motion/react';
import { Zap, GitMerge, Gauge } from 'lucide-react';
import { DashboardMockup } from './DashboardMockup';

const highlights = [
  {
    icon: Zap,
    title: 'Automation',
    description: 'AI-powered evidence collection and analysis runs automatically within minutes',
    gradient: 'from-yellow-400 to-orange-500'
  },
  {
    icon: GitMerge,
    title: 'Integration',
    description: 'Seamlessly connects with your existing security tools and infrastructure',
    gradient: 'from-purple-400 to-pink-500'
  },
  {
    icon: Gauge,
    title: 'Speed',
    description: 'Complete your investigations in just 5 hours instead of weeks or months',
    gradient: 'from-cyan-400 to-blue-500'
  }
];

export function SolutionSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-blue-950/30 to-black relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-1/2 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl -translate-x-1/2" />
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Meet DFIR-Rapid
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Cambodia's first fully automated digital forensics platform built for SMEs
          </p>
        </motion.div>

        {/* Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {highlights.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative group"
            >
              <div className="bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-sm border border-cyan-500/30 rounded-xl p-6 hover:border-cyan-500/60 transition-all">
                <div className={`w-14 h-14 bg-gradient-to-br ${item.gradient} rounded-lg flex items-center justify-center mb-4 shadow-lg group-hover:shadow-2xl transition-shadow`}>
                  <item.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-gray-400">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <DashboardMockup />
        </motion.div>

        {/* Platform Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="inline-block bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">
              Everything you need for complete incident response
            </h3>
            <p className="text-gray-400 max-w-2xl mx-auto">
              From initial detection to final report, DFIR-Rapid handles every step of the forensic investigation process with enterprise-grade accuracy and speed.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}