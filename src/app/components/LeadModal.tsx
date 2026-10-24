import { createContext, useContext, useEffect, useState, type ReactNode, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, Loader2, Shield } from 'lucide-react';
import { submitLead, type LeadType } from '../../lib/db';

interface OpenOptions { type: LeadType; plan?: string }
const LeadContext = createContext<(o: OpenOptions) => void>(() => {});
export const useLeadModal = () => useContext(LeadContext);

const titles: Record<LeadType, { title: string; sub: string; cta: string }> = {
  demo: { title: 'Request a Demo', sub: 'See a full ransomware investigation run live in under 30 minutes.', cta: 'Request Demo' },
  trial: { title: 'Start Your Free Trial', sub: '14 days, no credit card required.', cta: 'Start Free Trial' },
  plan: { title: 'Get Started', sub: "Tell us about your team and we'll set up your account.", cta: 'Get Started' },
  contact: { title: 'Contact Sales', sub: 'Custom deployments, compliance needs or volume pricing.', cta: 'Send Message' },
};

const inputCls =
  'w-full px-4 py-3 bg-black/40 border border-cyan-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40 transition-colors';

export function LeadForm({ type, plan, onDone, compact = false }: { type: LeadType; plan?: string; onDone?: () => void; compact?: boolean }) {
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [error, setError] = useState('');

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    if (f.website) return; // honeypot: bots fill hidden fields
    setState('sending');
    try {
      await submitLead({ type, plan: plan || f.plan, name: f.name, email: f.email, company: f.company, phone: f.phone, company_size: f.company_size, message: f.message });
      setState('done');
      onDone?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setState('error');
    }
  }

  if (state === 'done') {
    return (
      <div className="text-center py-8">
        <CheckCircle2 className="w-14 h-14 text-green-400 mx-auto mb-4" />
        <h4 className="text-2xl font-bold text-white mb-2">Thank you!</h4>
        <p className="text-gray-400">We received your request and will reply within 24 hours.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input name="name" required maxLength={100} placeholder="Full name *" className={inputCls} />
        <input name="email" type="email" required maxLength={150} placeholder="Work email *" className={inputCls} />
        <input name="company" maxLength={100} placeholder="Company" className={inputCls} />
        <input name="phone" maxLength={40} placeholder="Phone (optional)" className={inputCls} />
      </div>
      {!compact && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <select name="company_size" defaultValue="" className={inputCls}>
            <option value="" disabled>Company size</option>
            <option>1-10</option><option>11-50</option><option>51-200</option><option>201-1000</option><option>1000+</option>
          </select>
          <select name="plan" defaultValue={plan || ''} className={inputCls} disabled={!!plan}>
            <option value="">Interested plan</option>
            <option>Basic</option><option>Professional</option><option>Enterprise</option>
          </select>
        </div>
      )}
      <textarea name="message" rows={compact ? 5 : 3} maxLength={3000} placeholder={type === 'contact' ? 'How can we help? *' : 'Tell us about your environment (optional)'} required={type === 'contact'} className={inputCls} />
      {state === 'error' && <p className="text-red-400 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={state === 'sending'}
        className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/60 transition-all disabled:opacity-60"
      >
        {state === 'sending' && <Loader2 className="w-5 h-5 animate-spin" />}
        {titles[type].cta}
      </button>
      <p className="text-xs text-gray-500 text-center">We'll never share your details.</p>
    </form>
  );
}

export function LeadModalProvider({ children }: { children: ReactNode }) {
  const [opts, setOpts] = useState<OpenOptions | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpts(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = opts ? 'hidden' : '';
  }, [opts]);

  return (
    <LeadContext.Provider value={setOpts}>
      {children}
      <AnimatePresence>
        {opts && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setOpts(null)}
          >
            <motion.div
              role="dialog" aria-modal="true"
              initial={{ opacity: 0, y: 30, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto bg-gradient-to-b from-blue-950/90 to-black border border-cyan-500/30 rounded-2xl p-8 shadow-2xl shadow-cyan-500/20"
            >
              <button onClick={() => setOpts(null)} className="absolute top-4 right-4 text-gray-400 hover:text-cyan-400" aria-label="Close">
                <X className="w-6 h-6" />
              </button>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">
                  {titles[opts.type].title}{opts.plan ? ` — ${opts.plan}` : ''}
                </h3>
              </div>
              <p className="text-gray-400 mb-6">{titles[opts.type].sub}</p>
              <LeadForm type={opts.type} plan={opts.plan} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </LeadContext.Provider>
  );
}
