import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Plus, Search, X, Loader2 } from 'lucide-react';
import { listCases, listProfiles, createCase, CATEGORIES, SEVERITIES, STATUSES, type Case, type Profile, type Severity } from './api';
import { Card, Spinner, ErrorText, Empty, StatusBadge, SeverityBadge, fmtDate, inputCls, btnPrimary, btnGhost, Field, statusLabel, go } from './ui';

export function CaseForm({ people, onCancel, onCreated }: { people: Profile[]; onCancel: () => void; onCreated: (id: string) => void }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const clients = people.filter(p => p.role === 'client');
  const staff = people.filter(p => p.role !== 'client');

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    setBusy(true); setErr('');
    try {
      const { id } = await createCase({
        title: f.title.trim(), category: f.category, severity: f.severity as Severity, summary: f.summary.trim(),
        client_id: f.client_id || null, assigned_to: f.assigned_to || null,
      });
      onCreated(id);
    } catch (e) { setErr((e as Error).message); setBusy(false); }
  }

  return (
    <Card className="p-6 mb-6 border-cyan-500/30">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Open a new case</h2>
        <button onClick={onCancel} aria-label="Close" className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
      </div>
      <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2"><Field label="Case title *"><input name="title" required maxLength={200} placeholder="e.g. Ransomware on finance file server" className={inputCls} /></Field></div>
        <Field label="Category"><select name="category" className={inputCls}>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></Field>
        <Field label="Severity"><select name="severity" defaultValue="high" className={inputCls}>{SEVERITIES.map(s => <option key={s} value={s}>{s}</option>)}</select></Field>
        <Field label="Client (who can see this case)">
          <select name="client_id" className={inputCls}>
            <option value="">— No client yet —</option>
            {clients.map(p => <option key={p.id} value={p.id}>{p.company ? `${p.company} — ` : ''}{p.full_name || p.email}</option>)}
          </select>
        </Field>
        <Field label="Assigned analyst">
          <select name="assigned_to" className={inputCls}>
            <option value="">— Unassigned —</option>
            {staff.map(p => <option key={p.id} value={p.id}>{p.full_name || p.email}</option>)}
          </select>
        </Field>
        <div className="md:col-span-2"><Field label="Initial summary (visible to the client)"><textarea name="summary" rows={3} maxLength={5000} placeholder="What was reported, scope, first observations…" className={inputCls} /></Field></div>
        {clients.length === 0 && <p className="md:col-span-2 text-xs text-yellow-300/80">Tip: no client accounts yet. You can still create the case and link a client later (see README → "Add a client").</p>}
        <div className="md:col-span-2"><ErrorText msg={err} /></div>
        <div className="md:col-span-2 flex gap-3">
          <button disabled={busy} className={btnPrimary}>{busy && <Loader2 className="w-4 h-4 animate-spin" />} Create case</button>
          <button type="button" onClick={onCancel} className={btnGhost}>Cancel</button>
        </div>
      </form>
    </Card>
  );
}

export function CasesView({ me, startNew = false }: { me: Profile; startNew?: boolean }) {
  const staff = me.role !== 'client';
  const [cases, setCases] = useState<Case[] | null>(null);
  const [people, setPeople] = useState<Profile[]>([]);
  const [err, setErr] = useState('');
  const [q, setQ] = useState('');
  const [status, setStatus] = useState<'open' | 'all' | Case['status']>('open');
  const [showNew, setShowNew] = useState(startNew);

  useEffect(() => { setShowNew(startNew); }, [startNew]);
  useEffect(() => {
    listCases().then(setCases).catch(e => { setErr(e.message); setCases([]); });
    if (staff) listProfiles().then(setPeople).catch(() => {});
  }, [staff]);

  const shown = useMemo(() => (cases || []).filter(c => {
    if (status === 'open' && c.status === 'closed') return false;
    if (status !== 'open' && status !== 'all' && c.status !== status) return false;
    const hay = `${c.case_number} ${c.title} ${c.category} ${c.client?.company || ''} ${c.client?.full_name || ''}`.toLowerCase();
    return hay.includes(q.toLowerCase());
  }), [cases, q, status]);

  if (!cases) return <Spinner />;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">{staff ? 'Cases' : 'My Cases'}</h1>
          <p className="text-gray-400">{staff ? 'All investigations across clients.' : 'Track the progress of your investigations with DFIR-Rapid.'}</p>
        </div>
        {staff && !showNew && <button onClick={() => setShowNew(true)} className={btnPrimary}><Plus className="w-4 h-4" /> New case</button>}
      </div>

      {staff && showNew && (
        <CaseForm people={people} onCancel={() => { setShowNew(false); if (startNew) go('/portal/cases'); }} onCreated={id => go(`/portal/cases/${id}`)} />
      )}
      <ErrorText msg={err} />

      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-[14rem]">
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search case number, title, client…" className={`${inputCls} pl-9`} />
        </div>
        <select value={status} onChange={e => setStatus(e.target.value as typeof status)} className={`${inputCls} w-auto`}>
          <option value="open">Open cases</option>
          <option value="all">All cases</option>
          {STATUSES.map(s => <option key={s} value={s}>{statusLabel[s]}</option>)}
        </select>
      </div>

      {shown.length === 0 ? (
        <Empty>{cases.length === 0 ? (staff ? 'No cases yet.' : 'You have no cases yet. When DFIR-Rapid opens an investigation for you, it will appear here.') : 'No cases match your filters.'}</Empty>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-white/5 text-gray-400 text-left">
                <tr>
                  <th className="px-4 py-3 font-medium">Case</th>
                  <th className="px-4 py-3 font-medium">Title</th>
                  {staff && <th className="px-4 py-3 font-medium">Client</th>}
                  <th className="px-4 py-3 font-medium">Severity</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Analyst</th>
                  <th className="px-4 py-3 font-medium">Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {shown.map(c => (
                  <tr key={c.id} onClick={() => go(`/portal/cases/${c.id}`)} className="hover:bg-cyan-500/5 cursor-pointer">
                    <td className="px-4 py-3 font-mono text-xs text-cyan-400 whitespace-nowrap">{c.case_number}</td>
                    <td className="px-4 py-3"><div className="font-medium">{c.title}</div><div className="text-xs text-gray-500">{c.category}</div></td>
                    {staff && <td className="px-4 py-3 text-gray-300">{c.client ? (c.client.company || c.client.full_name || c.client.email) : <span className="text-gray-600">—</span>}</td>}
                    <td className="px-4 py-3"><SeverityBadge s={c.severity} /></td>
                    <td className="px-4 py-3"><StatusBadge s={c.status} /></td>
                    <td className="px-4 py-3 text-gray-300">{c.assignee ? (c.assignee.full_name || c.assignee.email) : <span className="text-gray-600">Unassigned</span>}</td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{fmtDate(c.updated_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
