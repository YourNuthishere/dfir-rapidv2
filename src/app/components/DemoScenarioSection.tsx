import { motion } from 'motion/react';
import { X, Check } from 'lucide-react';

const traditional = [
  { label: 'Detection to engagement', value: '24-48 hours', bad: true },
  { label: 'Evidence collection', value: '3-5 days', bad: true },
  { label: 'Analysis time', value: '1-2 weeks', bad: true },
  { label: 'Report generation', value: '3-5 days', bad: true },
  { label: 'Cost', value: '$8,000-$15,000', bad: true },
  { label: 'Total time', value: '2-4 weeks', bad: true }
];

const dfirRapid = [
  { label: 'Detection to engagement', value: 'Instant', good: true },
  { label: 'Evidence collection', value: '40 minutes', good: true },
  { label: 'Analysis time', value: '40 minutes', good: true },
  { label: 'Report generation', value: '3 Hour max', good: true },
  { label: 'Cost', value: '$200-$500', good: true },
  { label: 'Total time', value: '~ 5 hours', good: true }
];

export function DemoScenarioSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-black to-blue-950/30 relative overflow-hidden">
      {/* Background Effect */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-block px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-full text-red-400 mb-6">
            <span className="text-sm">🔥 Real-World Scenario</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-tight pb-2 bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent">
            Ransomware Investigation in less than 5 Hours
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            See how DFIR-Rapid transforms incident response for a TeslaCrypt ransomware attack
          </p>
        </motion.div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Traditional Approach */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="bg-gradient-to-b from-red-500/10 to-red-900/10 backdrop-blur-sm border border-red-500/30 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                  <X className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Traditional Forensics</h3>
                  <p className="text-sm text-gray-400">Manual investigation process</p>
                </div>
              </div>

              <div className="space-y-4">
                {traditional.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-black/30 rounded-lg border border-red-500/20"
                  >
                    <span className="text-gray-300">{item.label}</span>
                    <span className="text-red-400 font-semibold">{item.value}</span>
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-sm text-gray-400 text-center">
                  ⚠️ Extended downtime, high costs, requires external consultants
                </p>
              </div>
            </div>
          </motion.div>

          {/* DFIR-Rapid Approach */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="bg-gradient-to-b from-cyan-500/10 to-blue-900/10 backdrop-blur-sm border border-cyan-500/30 rounded-2xl p-8 shadow-2xl shadow-cyan-500/20">
              {/* Best Choice Badge */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-bold rounded-full shadow-lg">
                ⚡ RECOMMENDED
              </div>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center">
                  <Check className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">DFIR-Rapid</h3>
                  <p className="text-sm text-gray-400">Automated investigation</p>
                </div>
              </div>

              <div className="space-y-4">
                {dfirRapid.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-black/30 rounded-lg border border-cyan-500/30"
                  >
                    <span className="text-gray-300">{item.label}</span>
                    <span className="text-cyan-400 font-semibold">{item.value}</span>
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                <p className="text-sm text-gray-400 text-center">
                  ✅ Minimal downtime, 75% cost savings, no external dependencies
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Results Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="inline-block bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-2xl p-8 max-w-4xl">
            <h3 className="text-2xl font-bold text-white mb-4">Investigation Results</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div>
                <div className="text-green-400 font-semibold mb-2">✓ Attack Vector Identified</div>
                <p className="text-sm text-gray-400">Phishing email with malicious attachment</p>
              </div>
              <div>
                <div className="text-green-400 font-semibold mb-2">✓ Malware Detected</div>
                <p className="text-sm text-gray-400">TeslaCrypt 4.0 ransomware variant</p>
              </div>
              <div>
                <div className="text-green-400 font-semibold mb-2">✓ IOCs Extracted</div>
                <p className="text-sm text-gray-400">18 indicators for threat intel sharing</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}