import { motion } from 'motion/react';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'IT Director',
    company: 'TechStart Solutions',
    image: 'https://images.unsplash.com/photo-1737573744382-73c017a9ab25?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNoJTIwc3RhcnR1cCUyMG9mZmljZSUyMHRlYW0lMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzc0MTU1NTQ2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    quote: "DFIR-Rapid saved us during a ransomware attack. What would've taken weeks with a consultant was done in 5 hours. The forensic report was court-ready and helped us recover quickly.",
    rating: 5
  },
  {
    name: 'Michael Chen',
    role: 'Security Manager',
    company: 'FinanceHub Inc.',
    image: 'https://images.unsplash.com/photo-1737573744382-73c017a9ab25?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNoJTIwc3RhcnR1cCUyMG9mZmljZSUyMHRlYW0lMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzc0MTU1NTQ2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    quote: "As an SME, we couldn't afford traditional forensics. DFIR-Rapid gives us enterprise-grade capabilities at a fraction of the cost. The ROI is incredible.",
    rating: 5
  },
  {
    name: 'Emily Rodriguez',
    role: 'CEO',
    company: 'CloudScale Systems',
    image: 'https://images.unsplash.com/photo-1737573744382-73c017a9ab25?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNoJTIwc3RhcnR1cCUyMG9mZmljZSUyMHRlYW0lMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzc0MTU1NTQ2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    quote: "The automation is game-changing. Our team can now handle incidents without waiting for external consultants. It's like having a forensic expert on staff 24/7.",
    rating: 5
  }
];

const clients = [
  { name: 'TechStart', logo: 'TS' },
  { name: 'FinanceHub', logo: 'FH' },
  { name: 'CloudScale', logo: 'CS' },
  { name: 'DataSecure', logo: 'DS' },
  { name: 'NetGuard', logo: 'NG' },
  { name: 'CyberShield', logo: 'CB' }
];

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-black to-blue-950/30 relative overflow-hidden">
      {/* Background Effect */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, #06b6d4 1px, transparent 0)`,
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
          <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-tight pb-2 bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent">
            Trusted by SMEs Nationwide
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Join hundreds of companies protecting their business with DFIR-Rapid
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="relative group"
            >
              <div className="bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 h-full hover:border-cyan-500/50 transition-all">
                {/* Quote Icon */}
                <div className="mb-4">
                  <Quote className="w-10 h-10 text-cyan-400 opacity-50" />
                </div>

                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-gray-300 mb-6 leading-relaxed">
                  "{testimonial.quote}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="text-white font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-gray-400">{testimonial.role}</div>
                    <div className="text-sm text-cyan-400">{testimonial.company}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trusted By Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h3 className="text-xl text-gray-400 mb-8">Trusted by leading SMEs</h3>
          
          <div className="grid grid-cols-3 md:grid-cols-6 gap-6 max-w-4xl mx-auto">
            {clients.map((client, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ scale: 1.1 }}
                className="group"
              >
                <div className="bg-gradient-to-b from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-cyan-500/50 transition-all aspect-square flex items-center justify-center">
                  <div className="text-2xl font-bold text-gray-500 group-hover:text-cyan-400 transition-colors">
                    {client.logo}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-cyan-400 mb-2">500+</div>
              <div className="text-gray-400">Active Customers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-cyan-400 mb-2">10,000+</div>
              <div className="text-gray-400">Investigations Completed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-cyan-400 mb-2">4.9/5</div>
              <div className="text-gray-400">Customer Satisfaction</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}