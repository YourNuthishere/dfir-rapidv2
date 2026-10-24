import { useLeadModal } from './LeadModal';
import { motion } from 'motion/react';
import { 
  Database, 
  LayoutDashboard, 
  Clock, 
  Link2, 
  FileText, 
  FileCheck, 
  Shield, 
  Bug 
} from 'lucide-react';

const features = [
  {
    icon: Database,
    title: 'Automated Evidence Collection',
    description: 'Instantly capture memory dumps, disk images, logs, and network traffic with one click',
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    icon: LayoutDashboard,
    title: 'Investigation Dashboard',
    description: 'Real-time visibility into ongoing investigations with interactive timelines and analytics',
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    icon: Clock,
    title: 'Timeline Correlation',
    description: 'AI-powered event correlation creates a complete attack timeline automatically',
    gradient: 'from-green-500 to-emerald-500'
  },
  {
    icon: Link2,
    title: 'Chain of Custody',
    description: 'Cryptographic verification ensures evidence integrity for legal proceedings',
    gradient: 'from-orange-500 to-red-500'
  },
  {
    icon: FileCheck,
    title: 'Incident Reports',
    description: 'Generate court-ready forensic reports with technical details and executive summaries',
    gradient: 'from-cyan-500 to-blue-500'
  },
  {
    icon: Bug,
    title: 'Malware Detection (YARA)',
    description: 'Industry-standard YARA rules detect known malware families and threat indicators',
    gradient: 'from-red-500 to-pink-500'
  },
//  {
//    icon: Shield,
//    title: 'IOC Extraction',
//    description: 'Automatically extract and catalog Indicators of Compromise from evidence',
//    gradient: 'from-indigo-500 to-purple-500'
//  },
//  {
//    icon: FileText,
//    title: 'Forensic-Ready Logs',
//    description: 'All actions logged with timestamps and checksums for audit trails',
//    gradient: 'from-yellow-500 to-orange-500'
//  }
];

export function FeaturesSection() {
  const openLead = useLeadModal();
  return (
    <section id="features" className="py-24 bg-gradient-to-b from-black to-blue-950/30 relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(to right, #06b6d4 1px, transparent 1px),
            linear-gradient(to bottom, #06b6d4 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold leading-tight pb-2 mb-4 leading-tight pb-2 bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent">
            Comprehensive Features
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Enterprise-grade digital forensics capabilities designed for small and medium businesses
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="relative group"
            >
              <div className="bg-gradient-to-b from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-xl p-6 h-full hover:border-cyan-500/50 transition-all">
                <div className={`w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-lg flex items-center justify-center mb-4 shadow-lg group-hover:shadow-2xl group-hover:scale-110 transition-all`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{feature.description}</p>

                {/* Glow Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 rounded-xl transition-opacity pointer-events-none`} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mt-16"
        >
          <div className="inline-block bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-2xl p-6">
            <p className="text-gray-300 mb-4">
              All features included in every plan — no hidden tiers or paywalls
            </p>
            <button onClick={() => openLead({ type: 'demo' })} className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all">
              Explore Full Feature List
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
