import { useEffect, useState } from 'react';
import { RefreshCw, Trash2, Download } from 'lucide-react';
import { listLeads, updateLeadStatus, deleteLead, type Lead } from '../lib/db';
import { Card, Spinner, ErrorText, Empty, btnGhost, fmtDate } from './ui';

const typeColors: Record<string, string> = {
  demo: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
  trial: 'bg-green-500/15 text-green-300 border-green-500/30',
  plan: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
  contact: 'bg-orange-500/15 text-orange-300 border-orange-500/30',
};

function toCSV(rows: Lead[]) {
  const cols: (keyof Lead)[] = ['created_at', 'type', 'status', 'name', 'email', 'company', 'phone', 'plan', 'company_size', 'message'];
  const q = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  return [cols.join(','), ...rows.map(r => cols.map(c => q(r[c])).join(','))].join('\n');
}

export function LeadsView() {
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [filter, setFilter] = useState('all');

  async function load() {
    setLoading(true); setErr('');
    try { setLeads(await listLeads()); } catch (e) { setErr((e as Error).message); setLeads([]); }
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  if (!leads) return <Spinner />;
  const shown = filter === 'all' ? leads : leads.filter(l => l.type === filter);

  function exportCSV() {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([toCSV(shown)], { type: 'text/csv' }));
    a.download = `dfir-rapid-leads-${new Date().toISOString().slice(0, 10)}.csv`; a.click();
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Leads</h1>
          <p className="text-gray-400">Demo, trial, plan and contact requests from the public website.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className={btnGhost}><RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh</button>
          <button onClick={exportCSV} disabled={!shown.length} className={btnGhost}><Download className="w-4 h-4" /> Export CSV</button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        {['all', 'demo', 'trial', 'plan', 'contact'].map(t => (
          <button key={t} onClick={() => setFilter(t)}
            className={`p-4 rounded-xl border text-left transition-all ${filter === t ? 'border-cyan-400 bg-cyan-500/10' : 'border-white/10 bg-white/5 hover:border-cyan-500/40'}`}>
            <div className="text-2xl font-bold text-cyan-400">{t === 'all' ? leads.length : leads.filter(l => l.type === t).length}</div>
            <div className="text-sm text-gray-400 capitalize">{t === 'all' ? 'All leads' : t}</div>
          </button>
        ))}
      </div>
      <ErrorText msg={err} />

      {!shown.length ? <Empty>No submissions yet.</Empty> : (
        <div className="space-y-3">
          {shown.map(l => (
            <Card key={l.id} className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 text-xs rounded border ${typeColors[l.type]}`}>{l.type}</span>
                    {l.plan && <span className="px-2 py-0.5 text-xs rounded border border-white/10 text-gray-300">{l.plan}</span>}
                    <span className="text-xs text-gray-500">{fmtDate(l.created_at)}</span>
                  </div>
                  <div className="font-semibold">{l.name} <a className="text-cyan-400 font-normal hover:underline" href={`mailto:${l.email}`}>&lt;{l.email}&gt;</a></div>
                  <div className="text-sm text-gray-400">{[l.company, l.company_size && `${l.company_size} employees`, l.phone].filter(Boolean).join(' · ')}</div>
                </div>
                <div className="flex items-center gap-2">
                  <select value={l.status || 'new'} onChange={async e => { try { await updateLeadStatus(l.id!, e.target.value as Lead['status']); load(); } catch (x) { setErr((x as Error).message); } }}
                    className="px-3 py-1.5 text-sm bg-black border border-white/10 rounded-lg">
                    <option value="new">New</option><option value="contacted">Contacted</option><option value="closed">Closed</option>
                  </select>
                  <button aria-label="Delete" onClick={async () => { if (confirm('Delete this submission?')) { try { await deleteLead(l.id!); load(); } catch (x) { setErr((x as Error).message); } } }}
                    className="p-2 text-gray-400 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              {l.message && <p className="mt-3 text-gray-300 text-sm whitespace-pre-wrap">{l.message}</p>}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
