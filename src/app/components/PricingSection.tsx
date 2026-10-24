import { motion } from 'motion/react';
import { Check, Zap, Building2, Crown } from 'lucide-react';
import { useLeadModal } from './LeadModal';

const plans = [
  {
    name: 'Basic',
    price: '$200',
    period: '/month',
    description: 'Perfect for small businesses getting started',
    icon: Zap,
    gradient: 'from-cyan-500 to-blue-500',
    features: [
      'Up to 5 investigations/month',
      'Automated evidence collection',
      'Basic timeline analysis',
      'Standard reports',
      'Email support',
      '30-day evidence retention'
    ],
    popular: false
  },
  {
    name: 'Professional',
    price: '$500',
    period: '/month',
    description: 'Most popular for growing companies',
    icon: Building2,
    gradient: 'from-purple-500 to-pink-500',
    features: [
      'Up to 20 investigations/month',
      'Advanced malware detection',
      'AI-powered correlation',
      'Custom report templates',
      'Priority support (24/7)',
      '90-day evidence retention',
      'SIEM integration',
      'API access'
    ],
    popular: true
  },
  {
    name: 'Enterprise',
    price: '$1,200',
    period: '/month',
    description: 'For organizations requiring compliance',
    icon: Crown,
    gradient: 'from-orange-500 to-red-500',
    features: [
      'Unlimited investigations',
      'Dedicated forensic analyst',
      'Custom YARA rules',
      'Legal-ready documentation',
      'White-glove support',
      'Unlimited retention',
      'On-premise deployment option',
      'Compliance reports (SOC2, ISO)',
      'Training & onboarding'
    ],
    popular: false
  }
];

export function PricingSection() {
  const openLead = useLeadModal();
  return (
    <section id="pricing" className="py-24 bg-gradient-to-b from-blue-950/30 to-black relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-tight pb-2 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-4">
            Choose the plan that fits your security needs
          </p>
          <div className="inline-block px-6 py-3 bg-green-500/10 border border-green-500/30 rounded-full">
            <span className="text-green-400 font-semibold">💰 75% cheaper than traditional consultants</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="relative"
            >
              {plan.popular && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-10">
                  <div className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-bold rounded-full shadow-lg">
                    ⭐ MOST POPULAR
                  </div>
                </div>
              )}

              <div className={`relative bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-sm border ${
                plan.popular ? 'border-purple-500/50 shadow-2xl shadow-purple-500/20' : 'border-white/10'
              } rounded-2xl p-8 h-full hover:border-cyan-500/50 transition-all`}>
                {/* Icon */}
                <div className={`w-16 h-16 bg-gradient-to-br ${plan.gradient} rounded-xl flex items-center justify-center mb-6 shadow-lg`}>
                  <plan.icon className="w-8 h-8 text-white" />
                </div>

                {/* Plan Name */}
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-gray-400 text-sm mb-6">{plan.description}</p>

                {/* Price */}
                <div className="mb-8">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold text-white">{plan.price}</span>
                    <span className="text-gray-400">{plan.period}</span>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className={`w-5 h-5 bg-gradient-to-br ${plan.gradient} rounded-full flex items-center justify-center flex-shrink-0 mt-0.5`}>
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <button onClick={() => openLead({ type: 'plan', plan: plan.name })} className={`w-full py-4 rounded-lg font-semibold transition-all ${
                  plan.popular
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:shadow-purple-500/50'
                    : 'bg-white/5 border border-cyan-500/50 text-cyan-400 hover:bg-white/10'
                }`}>
                  Get Started
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Cost Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="inline-block bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-2xl p-8 max-w-4xl">
            <h3 className="text-2xl font-bold text-white mb-4">Compare to Traditional Costs</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div>
                <div className="text-red-400 font-semibold mb-2">Traditional Consultant</div>
                <p className="text-gray-400">$5,000 - $20,000 per incident</p>
                <p className="text-sm text-gray-500">Plus 2-6 weeks wait time</p>
              </div>
              <div>
                <div className="text-green-400 font-semibold mb-2">DFIR-Rapid Professional</div>
                <p className="text-gray-400">$500/month for 20 investigations</p>
                <p className="text-sm text-gray-500">Results in 5 hours</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Enterprise Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-400">
            Need a custom solution?{' '}
            <button onClick={() => openLead({ type: 'contact' })} className="text-cyan-400 hover:text-cyan-300 underline">
              Contact our sales team
            </button>
          </p>
        </motion.div>
      </div>
    </section>
  );
}