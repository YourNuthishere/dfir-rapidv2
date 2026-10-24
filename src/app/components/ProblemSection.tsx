import { motion } from 'motion/react';
import { AlertTriangle, Clock, DollarSign, UserX } from 'lucide-react';

const problems = [
  {
    icon: AlertTriangle,
    title: 'Evidence Loss',
    description: 'Critical digital evidence disappears before proper collection, compromising investigations.',
    color: 'from-red-500 to-orange-500'
  },
  {
    icon: Clock,
    title: 'Slow Investigation',
    description: 'Manual forensics takes weeks or months, leaving systems vulnerable and business disrupted.',
    color: 'from-orange-500 to-yellow-500'
  },
  {
    icon: DollarSign,
    title: 'High Costs',
    description: 'Traditional forensic consultants charge $5,000-$20,000+ per incident, unaffordable for SMEs.',
    color: 'from-yellow-500 to-green-500'
  },
  {
    icon: UserX,
    title: 'No Expertise',
    description: 'SMEs lack in-house forensic experts, leading to delayed response and poor incident handling.',
    color: 'from-green-500 to-cyan-500'
  }
];

export function ProblemSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-black to-blue-950/30 relative overflow-hidden">
      {/* Background Effect */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent" />
      </div>

      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-tight pb-2 bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
            Why SMEs Struggle with Cyber Incidents
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Traditional forensics wasn't built for small and medium enterprises
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="relative group"
            >
              <div className="bg-gradient-to-b from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-xl p-6 h-full hover:border-cyan-500/50 transition-all">
                <div className={`w-14 h-14 bg-gradient-to-br ${problem.color} rounded-lg flex items-center justify-center mb-4 shadow-lg group-hover:shadow-2xl transition-shadow`}>
                  <problem.icon className="w-7 h-7 text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3">{problem.title}</h3>
                <p className="text-gray-400 leading-relaxed">{problem.description}</p>

                {/* Glow Effect on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${problem.color} opacity-0 group-hover:opacity-5 rounded-xl transition-opacity`} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
