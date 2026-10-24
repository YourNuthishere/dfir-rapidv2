import { useEffect, useState } from 'react';
import { FolderOpen, AlertTriangle, UserCheck, Inbox, Plus } from 'lucide-react';
import { listCases, type Case, type Profile } from './api';
import { listLeads, type Lead } from '../lib/db';
import { Card, Spinner, ErrorText, StatusBadge, SeverityBadge, Empty, fmtDate, btnPrimary, statusLabel } from './ui';
import { STATUSES } from './api';

export function Dashboard({ me }: { me: Profile }) {
  const [cases, setCases] = useState<Case[] | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [err, setErr] = useState('');

  useEffect(() => {
    listCases().then(setCases).catch(e => { setErr(e.message); setCases([]); });
    listLeads().then(setLeads).catch(() => {});
  }, []);

  if (!cases) return <Spinner />;
  const open = cases.filter(c => c.status !== 'closed');
  const mine = open.filter(c => c.assigned_to === me.id);
  const critical = open.filter(c => c.severity === 'critical' || c.severity === 'high');
  const newLeads = leads.filter(l => (l.status || 'new') === 'new');

  const stats = [
    { label: 'Open cases', value: open.length, icon: FolderOpen, cls: 'text-cyan-400', href: '#/portal/cases' },
    { label: 'Critical / high', value: critical.length, icon: AlertTriangle, cls: 'text-red-400', href: '#/portal/cases' },
    { label: 'Assigned to me', value: mine.length, icon: UserCheck, cls: 'text-purple-400', href: '#/portal/cases' },
    { label: 'New leads', value: newLeads.length, icon: Inbox, cls: 'text-green-400', href: '#/portal/leads' },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {me.full_name || me.email.split('@')[0]}</h1>
          <p className="text-gray-400">Here's what's happening across your investigations.</p>
        </div>
        <a href="#/portal/cases/new" className={btnPrimary}><Plus className="w-4 h-4" /> New case</a>
      </div>
      <ErrorText msg={err} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(s => (
          <a key={s.label} href={s.href}>
            <Card className="p-5 hover:border-cyan-500/40 transition-colors">
              <s.icon className={`w-6 h-6 mb-3 ${s.cls}`} />
              <div className="text-3xl font-bold">{s.value}</div>
              <div className="text-sm text-gray-400">{s.label}</div>
            </Card>
          </a>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 lg:col-span-2">
          <h2 className="font-semibold mb-4">Recently updated cases</h2>
          {cases.length === 0 ? <Empty>No cases yet. Create your first one with "New case".</Empty> : (
            <div className="divide-y divide-white/5">
              {cases.slice(0, 8).map(c => (
                <a key={c.id} href={`#/portal/cases/${c.id}`} className="flex flex-wrap items-center gap-3 py-3 hover:bg-white/5 -mx-2 px-2 rounded-lg">
                  <span className="font-mono text-xs text-cyan-400 w-32 shrink-0">{c.case_number}</span>
                  <span className="flex-1 min-w-[10rem] truncate">{c.title}</span>
                  <SeverityBadge s={c.severity} />
                  <StatusBadge s={c.status} />
                  <span className="text-xs text-gray-500 w-36 text-right hidden sm:block">{fmtDate(c.updated_at)}</span>
                </a>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-6">
          <h2 className="font-semibold mb-4">Pipeline</h2>
          <div className="space-y-3">
            {STATUSES.map(s => {
              const n = cases.filter(c => c.status === s).length;
              const pct = cases.length ? (n / cases.length) * 100 : 0;
              return (
                <div key={s}>
                  <div className="flex justify-between text-sm mb-1"><span className="text-gray-300">{statusLabel[s]}</span><span className="text-gray-400">{n}</span></div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-cyan-500 to-blue-600" style={{ width: `${pct}%` }} /></div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
