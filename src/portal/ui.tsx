import type { ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import type { Severity, Status } from './api';

export const inputCls =
  'w-full px-3 py-2.5 bg-black/40 border border-cyan-500/20 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-colors';

export const btnPrimary =
  'inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/30 transition-all disabled:opacity-50';
export const btnGhost =
  'inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-white/10 text-gray-200 text-sm rounded-lg hover:border-cyan-500/50 hover:text-cyan-300 transition-all disabled:opacity-50';

export const statusLabel: Record<Status, string> = {
  new: 'New', triage: 'Triage', investigating: 'Investigating', reporting: 'Reporting', closed: 'Closed',
};
const statusCls: Record<Status, string> = {
  new: 'bg-gray-500/15 text-gray-300 border-gray-500/30',
  triage: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30',
  investigating: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
  reporting: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
  closed: 'bg-green-500/15 text-green-300 border-green-500/30',
};
const sevCls: Record<Severity, string> = {
  critical: 'bg-red-500/15 text-red-300 border-red-500/30',
  high: 'bg-orange-500/15 text-orange-300 border-orange-500/30',
  medium: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30',
  low: 'bg-green-500/15 text-green-300 border-green-500/30',
};

export const StatusBadge = ({ s }: { s: Status }) => (
  <span className={`px-2 py-0.5 text-xs rounded border whitespace-nowrap ${statusCls[s]}`}>{statusLabel[s]}</span>
);
export const SeverityBadge = ({ s }: { s: Severity }) => (
  <span className={`px-2 py-0.5 text-xs rounded border uppercase tracking-wide whitespace-nowrap ${sevCls[s]}`}>{s}</span>
);

export const Card = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <div className={`bg-white/5 border border-white/10 rounded-xl ${className}`}>{children}</div>
);

export const Spinner = () => (
  <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-cyan-400" /></div>
);

export const Empty = ({ children }: { children: ReactNode }) => (
  <div className="p-10 text-center text-gray-500 border border-dashed border-white/10 rounded-xl text-sm">{children}</div>
);

export const ErrorText = ({ msg }: { msg: string }) =>
  msg ? <p className="text-red-400 text-sm my-3">{msg}</p> : null;

export const Field = ({ label, children }: { label: string; children: ReactNode }) => (
  <label className="block">
    <span className="block text-xs text-gray-400 mb-1.5">{label}</span>
    {children}
  </label>
);

export function fmtDate(d?: string | null, withTime = true) {
  if (!d) return '—';
  const x = new Date(d);
  return withTime ? x.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : x.toLocaleDateString(undefined, { dateStyle: 'medium' });
}

export const go = (path: string) => { window.location.hash = path; };
