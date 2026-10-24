import { motion } from 'motion/react';
import { AlertCircle, Database, Brain, FileText } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: AlertCircle,
    title: 'Detect Attack',
    description: 'Your security tools detect suspicious activity and trigger DFIR-Rapid investigation',
    color: 'from-red-500 to-orange-500',
    details: ['SIEM integration', 'EDR alerts', 'Manual triggers']
  },
  {
    number: '02',
    icon: Database,
    title: 'Collect Evidence',
    description: 'Automated agents securely collect forensic evidence from affected systems',
    color: 'from-orange-500 to-yellow-500',
    details: ['Memory dumps', 'Disk images', 'Network logs', 'System artifacts']
  },
  {
    number: '03',
    icon: Brain,
    title: 'Analyze Automatically',
    description: 'AI engine analyzes evidence, correlates events, and identifies attack patterns',
    color: 'from-cyan-500 to-blue-500',
    details: ['YARA scanning', 'Timeline building', 'IOC extraction', 'Threat correlation']
  },
  {
    number: '04',
    icon: FileText,
    title: 'Generate Report',
    description: 'Forensic-ready reports with full chain of custody and actionable recommendations',
    color: 'from-green-500 to-emerald-500',
    details: ['Technical analysis', 'Executive summary', 'Evidence chain', 'Remediation steps']
  }
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 bg-gradient-to-b from-blue-950/30 to-black relative overflow-hidden">
      {/* Connecting Lines Background */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="connection-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="50" cy="50" r="1" fill="#06b6d4" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#connection-pattern)" />
        </svg>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            How It Works
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            From detection to report in four simple steps
          </p>
        </motion.div>

        <div className="relative">
          {/* Timeline Line (Desktop) */}
          <div className="hidden lg:block absolute top-32 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-cyan-500 to-green-500 opacity-30" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="relative"
              >
                {/* Step Number */}
                <div className="text-center mb-6">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className={`inline-flex w-24 h-24 bg-gradient-to-br ${step.color} rounded-full items-center justify-center shadow-2xl relative group`}
                  >
                    <step.icon className="w-10 h-10 text-white" />
                    <div className="absolute -top-3 -right-3 w-10 h-10 bg-black border-2 border-current rounded-full flex items-center justify-center text-sm font-bold text-white">
                      {step.number}
                    </div>
                    {/* Pulse Effect */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${step.color} rounded-full animate-ping opacity-20 group-hover:opacity-30`} />
                  </motion.div>
                </div>

                {/* Content */}
                <div className="bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-sm border border-cyan-500/30 rounded-xl p-6 hover:border-cyan-500/60 transition-all">
                  <h3 className="text-xl font-bold text-white mb-3 text-center">{step.title}</h3>
                  <p className="text-gray-400 text-center mb-4">{step.description}</p>
                  
                  {/* Details */}
                  <div className="space-y-2">
                    {step.details.map((detail, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-br ${step.color}`} />
                        <span className="text-gray-500">{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Arrow (Desktop) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-32 -right-4 transform -translate-y-1/2 z-20">
                    <div className="w-8 h-8 border-t-2 border-r-2 border-cyan-400 transform rotate-45" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Timeline Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="inline-block bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-2xl p-8">
            <h3 className="text-3xl font-bold text-white mb-2">
              ⚡ Total Time: <span className="text-cyan-400">~ 5 Hours</span>
            </h3>
            <p className="text-gray-400">
              Traditional forensics takes 2-6 weeks. DFIR-Rapid delivers results before lunch.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}