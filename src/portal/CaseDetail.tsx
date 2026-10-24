import { useCallback, useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { ArrowLeft, Trash2, Save, Loader2, Plus, Lock, Eye, Copy, Check } from 'lucide-react';
import {
  getCase, updateCase, deleteCase, listProfiles, listChild, addChild, deleteChild,
  CATEGORIES, SEVERITIES, STATUSES, EVIDENCE_TYPES, IOC_TYPES,
  type Case, type Profile, type Evidence, type TimelineEvent, type Ioc, type Note, type Severity, type Status,
} from './api';
import { Card, Spinner, ErrorText, Empty, StatusBadge, SeverityBadge, fmtDate, inputCls, btnPrimary, btnGhost, Field, statusLabel, go } from './ui';

type Tab = 'overview' | 'timeline' | 'evidence' | 'iocs' | 'notes';

// Small hook: load a child table for this case and reload after changes
function useChild<T>(table: 'evidence' | 'timeline_events' | 'iocs' | 'case_notes', caseId: string) {
  const [rows, setRows] = useState<T[] | null>(null);
  const [err, setErr] = useState('');
  const load = useCallback(() => { listChild<T>(table, caseId).then(setRows).catch(e => { setErr(e.message); setRows([]); }); }, [table, caseId]);
  useEffect(load, [load]);
  return { rows, err, load, setErr };
}

function AddForm({ onSubmit, children, label }: { onSubmit: (f: Record<string, string>, form: HTMLFormElement) => Promise<void>; children: ReactNode; label: string }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setBusy(true); setErr('');
    try { await onSubmit(Object.fromEntries(new FormData(form)) as Record<string, string>, form); form.reset(); setOpen(false); }
    catch (e) { setErr((e as Error).message); }
    setBusy(false);
  }
  if (!open) return <button onClick={() => setOpen(true)} className={`${btnGhost} mb-4`}><Plus className="w-4 h-4" /> {label}</button>;
  return (
    <Card className="p-5 mb-4 border-cyan-500/30">
      <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {children}
        <div className="md:col-span-2"><ErrorText msg={err} /></div>
        <div className="md:col-span-2 flex gap-3">
          <button disabled={busy} className={btnPrimary}>{busy && <Loader2 className="w-4 h-4 animate-spin" />} Save</button>
          <button type="button" onClick={() => setOpen(false)} className={btnGhost}>Cancel</button>
        </div>
      </form>
    </Card>
  );
}

function DelBtn({ onDelete }: { onDelete: () => Promise<void> }) {
  return (
    <button aria-label="Delete" title="Delete" onClick={async () => { if (confirm('Delete this item?')) await onDelete(); }} className="p-1.5 text-gray-500 hover:text-red-400">
      <Trash2 className="w-4 h-4" />
    </button>
  );
}

function CopyBtn({ text }: { text: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button aria-label="Copy" title="Copy" className="p-1 text-gray-500 hover:text-cyan-300"
      onClick={() => { navigator.clipboard?.writeText(text).then(() => { setOk(true); setTimeout(() => setOk(false), 1200); }); }}>
      {ok ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

// ---------------- Overview ----------------
function Overview({ c, staff, isAdmin, people, onSaved }: { c: Case; staff: boolean; isAdmin: boolean; people: Profile[]; onSaved: () => void }) {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  if (!staff) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 lg:col-span-2">
          <h3 className="font-semibold mb-3">Summary</h3>
          <p className="text-gray-300 whitespace-pre-wrap">{c.summary || 'Your analyst will add a summary shortly.'}</p>
        </Card>
        <Card className="p-6 space-y-4 text-sm">
          <Info label="Status"><StatusBadge s={c.status} /></Info>
          <Info label="Severity"><SeverityBadge s={c.severity} /></Info>
          <Info label="Category">{c.category}</Info>
          <Info label="Your analyst">{c.assignee ? (c.assignee.full_name || c.assignee.email) : 'Being assigned'}</Info>
          <Info label="Opened">{fmtDate(c.created_at)}</Info>
          <Info label="Last update">{fmtDate(c.updated_at)}</Info>
          {c.closed_at && <Info label="Closed">{fmtDate(c.closed_at)}</Info>}
        </Card>
        <Card className="p-6 lg:col-span-3">
          <h3 className="font-semibold mb-4">Progress</h3>
          <div className="flex items-center">
            {STATUSES.map((s, i) => {
              const done = STATUSES.indexOf(c.status) >= i;
              return (
                <div key={s} className="flex-1 flex flex-col items-center relative">
                  {i > 0 && <div className={`absolute top-3 right-1/2 w-full h-0.5 ${done ? 'bg-cyan-500' : 'bg-white/10'}`} />}
                  <div className={`relative z-10 w-6 h-6 rounded-full border-2 ${done ? 'bg-cyan-500 border-cyan-400' : 'bg-black border-white/20'}`} />
                  <div className={`text-xs mt-2 ${done ? 'text-cyan-300' : 'text-gray-500'}`}>{statusLabel[s]}</div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    );
  }

  const clients = people.filter(p => p.role === 'client');
  const team = people.filter(p => p.role !== 'client');

  async function save(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    setBusy(true); setErr(''); setMsg('');
    try {
      await updateCase(c.id, {
        title: f.title.trim(), category: f.category, severity: f.severity as Severity, status: f.status as Status,
        summary: f.summary, client_id: f.client_id || null, assigned_to: f.assigned_to || null,
      });
      setMsg('Saved ✓'); onSaved();
    } catch (e) { setErr((e as Error).message); }
    setBusy(false);
  }

  return (
    <Card className="p-6">
      <form key={c.updated_at} onSubmit={save} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2"><Field label="Title"><input name="title" defaultValue={c.title} required maxLength={200} className={inputCls} /></Field></div>
        <Field label="Status"><select name="status" defaultValue={c.status} className={inputCls}>{STATUSES.map(s => <option key={s} value={s}>{statusLabel[s]}</option>)}</select></Field>
        <Field label="Severity"><select name="severity" defaultValue={c.severity} className={inputCls}>{SEVERITIES.map(s => <option key={s} value={s}>{s}</option>)}</select></Field>
        <Field label="Category"><select name="category" defaultValue={c.category} className={inputCls}>{[...new Set([c.category, ...CATEGORIES])].map(x => <option key={x}>{x}</option>)}</select></Field>
        <Field label="Assigned analyst">
          <select name="assigned_to" defaultValue={c.assigned_to || ''} className={inputCls}>
            <option value="">— Unassigned —</option>
            {team.map(p => <option key={p.id} value={p.id}>{p.full_name || p.email}</option>)}
          </select>
        </Field>
        <div className="md:col-span-2">
          <Field label="Client account (this person can view the case in the Client Portal)">
            <select name="client_id" defaultValue={c.client_id || ''} className={inputCls}>
              <option value="">— No client linked —</option>
              {clients.map(p => <option key={p.id} value={p.id}>{p.company ? `${p.company} — ` : ''}{p.full_name || p.email}</option>)}
            </select>
          </Field>
        </div>
        <div className="md:col-span-2"><Field label="Summary (visible to the client)"><textarea name="summary" rows={6} defaultValue={c.summary} maxLength={5000} className={inputCls} /></Field></div>
        <div className="md:col-span-2 flex flex-wrap items-center gap-3">
          <button disabled={busy} className={btnPrimary}>{busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save changes</button>
          {msg && <span className="text-green-400 text-sm">{msg}</span>}
          {isAdmin && (
            <button type="button" className="ml-auto inline-flex items-center gap-2 px-4 py-2.5 text-sm text-red-300 border border-red-500/30 rounded-lg hover:bg-red-500/10"
              onClick={async () => {
                if (!confirm(`Permanently delete ${c.case_number} and ALL its evidence, IOCs, timeline and notes?`)) return;
                try { await deleteCase(c.id); go('/portal/cases'); } catch (e) { setErr((e as Error).message); }
              }}>
              <Trash2 className="w-4 h-4" /> Delete case
            </button>
          )}
        </div>
        <div className="md:col-span-2"><ErrorText msg={err} /></div>
      </form>
    </Card>
  );
}

const Info = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className="flex justify-between gap-4"><span className="text-gray-400">{label}</span><span className="text-right">{children}</span></div>
);

// ---------------- Timeline ----------------
function TimelineTab({ caseId, staff, onChange }: { caseId: string; staff: boolean; onChange: () => void }) {
  const { rows, err, load, setErr } = useChild<TimelineEvent>('timeline_events', caseId);
  if (!rows) return <Spinner />;
  return (
    <div>
      {staff && (
        <AddForm label="Add event" onSubmit={async f => {
          await addChild('timeline_events', { case_id: caseId, event_time: new Date(f.event_time).toISOString(), description: f.description.trim(), source: f.source.trim(), mitre: f.mitre.trim().toUpperCase() });
          load(); onChange();
        }}>
          <Field label="Date & time (your local time) *"><input name="event_time" type="datetime-local" step="1" required className={inputCls} /></Field>
          <Field label="Source / artifact"><input name="source" maxLength={200} placeholder="Security.evtx 4624, $MFT, Prefetch…" className={inputCls} /></Field>
          <div className="md:col-span-2"><Field label="What happened *"><textarea name="description" required rows={2} maxLength={2000} className={inputCls} /></Field></div>
          <Field label="MITRE ATT&CK (optional)"><input name="mitre" maxLength={30} placeholder="T1021.001" className={inputCls} /></Field>
        </AddForm>
      )}
      <ErrorText msg={err} />
      {rows.length === 0 ? <Empty>No timeline events yet.</Empty> : (
        <div className="border-l-2 border-cyan-500/30 ml-2 pl-6 space-y-5">
          {rows.map(ev => (
            <div key={ev.id} className="relative">
              <div className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-black border-2 border-cyan-400" />
              <div className="flex flex-wrap items-center gap-2 text-xs mb-1">
                <span className="font-mono text-cyan-300">{fmtDate(ev.event_time)}</span>
                {ev.source && <span className="text-gray-500">· {ev.source}</span>}
                {ev.mitre && /^T\d{4}(\.\d{3})?$/.test(ev.mitre) && (
                  <a href={`https://attack.mitre.org/techniques/${ev.mitre.replace('.', '/')}/`} target="_blank" rel="noopener noreferrer" className="px-1.5 py-0.5 rounded bg-purple-500/15 text-purple-300 border border-purple-500/30">{ev.mitre}</a>
                )}
                {staff && <span className="ml-auto"><DelBtn onDelete={async () => { try { await deleteChild('timeline_events', ev.id); load(); } catch (e) { setErr((e as Error).message); } }} /></span>}
              </div>
              <p className="text-gray-200 text-sm whitespace-pre-wrap">{ev.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------- Evidence ----------------
function EvidenceTab({ caseId, staff, onChange }: { caseId: string; staff: boolean; onChange: () => void }) {
  const { rows, err, load, setErr } = useChild<Evidence>('evidence', caseId);
  if (!rows) return <Spinner />;
  return (
    <div>
      {staff && (
        <AddForm label="Log evidence" onSubmit={async f => {
          await addChild('evidence', {
            case_id: caseId, label: f.label.trim(), evidence_type: f.evidence_type, source_host: f.source_host.trim(),
            sha256: f.sha256.trim().toLowerCase(), size_text: f.size_text.trim(), collected_by: f.collected_by.trim(),
            collected_at: f.collected_at ? new Date(f.collected_at).toISOString() : null, storage_location: f.storage_location.trim(), notes: f.notes.trim(),
          });
          load(); onChange();
        }}>
          <Field label="Evidence name / ID *"><input name="label" required maxLength={200} placeholder="EV-001 FS01 disk image" className={inputCls} /></Field>
          <Field label="Type"><select name="evidence_type" className={inputCls}>{EVIDENCE_TYPES.map(t => <option key={t}>{t}</option>)}</select></Field>
          <Field label="Source host / device"><input name="source_host" maxLength={200} placeholder="FS01 (10.0.0.12)" className={inputCls} /></Field>
          <Field label="Size"><input name="size_text" maxLength={50} placeholder="465 GB" className={inputCls} /></Field>
          <div className="md:col-span-2"><Field label="SHA-256 hash"><input name="sha256" pattern="[A-Fa-f0-9]{64}" title="64 hex characters" placeholder="64-character SHA-256" className={`${inputCls} font-mono`} /></Field></div>
          <Field label="Collected by"><input name="collected_by" maxLength={100} className={inputCls} /></Field>
          <Field label="Collected at"><input name="collected_at" type="datetime-local" className={inputCls} /></Field>
          <Field label="Storage location"><input name="storage_location" maxLength={200} placeholder="Evidence locker A / encrypted share" className={inputCls} /></Field>
          <Field label="Notes / custody remarks"><input name="notes" maxLength={1000} className={inputCls} /></Field>
        </AddForm>
      )}
      <ErrorText msg={err} />
      {rows.length === 0 ? <Empty>No evidence logged yet.</Empty> : (
        <div className="space-y-3">
          {rows.map(ev => (
            <Card key={ev.id} className="p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <div className="font-medium">{ev.label}</div>
                  <div className="text-xs text-gray-400">{ev.evidence_type}{ev.source_host && ` · ${ev.source_host}`}{ev.size_text && ` · ${ev.size_text}`}</div>
                </div>
                {staff && <DelBtn onDelete={async () => { try { await deleteChild('evidence', ev.id); load(); } catch (e) { setErr((e as Error).message); } }} />}
              </div>
              {ev.sha256 && <div className="mt-2 flex items-center gap-1 font-mono text-xs text-cyan-300 break-all">SHA256: {ev.sha256} <CopyBtn text={ev.sha256} /></div>}
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-gray-400">
                <div>Collected by: <span className="text-gray-200">{ev.collected_by || '—'}</span></div>
                <div>Collected at: <span className="text-gray-200">{fmtDate(ev.collected_at)}</span></div>
                <div>Stored: <span className="text-gray-200">{ev.storage_location || '—'}</span></div>
              </div>
              {ev.notes && <p className="mt-2 text-sm text-gray-300">{ev.notes}</p>}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------- IOCs ----------------
function IocTab({ caseId, staff, onChange }: { caseId: string; staff: boolean; onChange: () => void }) {
  const { rows, err, load, setErr } = useChild<Ioc>('iocs', caseId);
  if (!rows) return <Spinner />;
  const csv = () => {
    const q = (v: string) => `"${v.replace(/"/g, '""')}"`;
    const body = ['type,value,description', ...rows.map(r => [r.ioc_type, r.value, r.description].map(q).join(','))].join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([body], { type: 'text/csv' })); a.download = `iocs-${caseId.slice(0, 8)}.csv`; a.click();
  };
  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {staff && (
          <div className="flex-1">
            <AddForm label="Add IOC" onSubmit={async f => {
              await addChild('iocs', { case_id: caseId, ioc_type: f.ioc_type, value: f.value.trim(), description: f.description.trim() });
              load(); onChange();
            }}>
              <Field label="Type"><select name="ioc_type" className={inputCls}>{IOC_TYPES.map(t => <option key={t}>{t}</option>)}</select></Field>
              <Field label="Value *"><input name="value" required maxLength={1000} className={`${inputCls} font-mono`} placeholder="203.0.113.45" /></Field>
              <div className="md:col-span-2"><Field label="Description"><input name="description" maxLength={500} placeholder="C2 server, phishing domain…" className={inputCls} /></Field></div>
            </AddForm>
          </div>
        )}
        {rows.length > 0 && <button onClick={csv} className={`${btnGhost} mb-4 h-fit`}>Export CSV</button>}
      </div>
      <ErrorText msg={err} />
      {rows.length === 0 ? <Empty>No indicators of compromise recorded yet.</Empty> : (
        <Card className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-gray-400 text-left"><tr><th className="px-4 py-3 font-medium">Type</th><th className="px-4 py-3 font-medium">Value</th><th className="px-4 py-3 font-medium">Description</th>{staff && <th />}</tr></thead>
            <tbody className="divide-y divide-white/5">
              {rows.map(r => (
                <tr key={r.id}>
                  <td className="px-4 py-3 whitespace-nowrap text-gray-300">{r.ioc_type}</td>
                  <td className="px-4 py-3 font-mono text-cyan-300 break-all"><span className="inline-flex items-center gap-1">{r.value}<CopyBtn text={r.value} /></span></td>
                  <td className="px-4 py-3 text-gray-400">{r.description}</td>
                  {staff && <td className="px-2"><DelBtn onDelete={async () => { try { await deleteChild('iocs', r.id); load(); } catch (e) { setErr((e as Error).message); } }} /></td>}
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}

// ---------------- Notes / Updates ----------------
function NotesTab({ caseId, staff, onChange }: { caseId: string; staff: boolean; onChange: () => void }) {
  const { rows, err, load, setErr } = useChild<Note>('case_notes', caseId);
  const [busy, setBusy] = useState(false);
  if (!rows) return <Spinner />;

  async function post(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const f = Object.fromEntries(new FormData(form)) as Record<string, string>;
    if (!f.body.trim()) return;
    setBusy(true); setErr('');
    try {
      await addChild('case_notes', { case_id: caseId, body: f.body.trim(), client_visible: staff ? f.visibility === 'client' : true });
      form.reset(); load(); onChange();
    } catch (e) { setErr((e as Error).message); }
    setBusy(false);
  }

  return (
    <div>
      <Card className="p-4 mb-5">
        <form onSubmit={post} className="space-y-3">
          <textarea name="body" rows={3} maxLength={5000} required placeholder={staff ? 'Write an internal note or an update for the client…' : 'Send a message or question to your analyst…'} className={inputCls} />
          <div className="flex flex-wrap items-center gap-3">
            {staff && (
              <select name="visibility" defaultValue="internal" className={`${inputCls} w-auto`}>
                <option value="internal">🔒 Internal note (team only)</option>
                <option value="client">👁 Update shared with client</option>
              </select>
            )}
            <button disabled={busy} className={btnPrimary}>{busy && <Loader2 className="w-4 h-4 animate-spin" />} {staff ? 'Post' : 'Send'}</button>
          </div>
        </form>
      </Card>
      <ErrorText msg={err} />
      {rows.length === 0 ? <Empty>{staff ? 'No notes yet.' : 'No updates yet.'}</Empty> : (
        <div className="space-y-3">
          {[...rows].reverse().map(n => (
            <Card key={n.id} className={`p-4 ${!n.client_visible ? 'border-yellow-500/20 bg-yellow-500/[0.03]' : n.author_role === 'client' ? 'border-green-500/20' : ''}`}>
              <div className="flex flex-wrap items-center gap-2 text-xs mb-2">
                <span className="font-semibold text-sm text-white">{n.author_name || 'Unknown'}</span>
                <span className="text-gray-500 capitalize">{n.author_role}</span>
                <span className="text-gray-500">· {fmtDate(n.created_at)}</span>
                {staff && (n.client_visible
                  ? <span className="inline-flex items-center gap-1 text-cyan-300"><Eye className="w-3 h-3" /> visible to client</span>
                  : <span className="inline-flex items-center gap-1 text-yellow-300"><Lock className="w-3 h-3" /> internal</span>)}
                {staff && <span className="ml-auto"><DelBtn onDelete={async () => { try { await deleteChild('case_notes', n.id); load(); } catch (e) { setErr((e as Error).message); } }} /></span>}
              </div>
              <p className="text-gray-200 text-sm whitespace-pre-wrap">{n.body}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------- Page ----------------
export function CaseDetail({ id, me }: { id: string; me: Profile }) {
  const staff = me.role !== 'client';
  const [c, setC] = useState<Case | null | undefined>(undefined);
  const [people, setPeople] = useState<Profile[]>([]);
  const [err, setErr] = useState('');
  const [tab, setTab] = useState<Tab>('overview');

  const load = useCallback(() => { getCase(id).then(setC).catch(e => { setErr(e.message); setC(null); }); }, [id]);
  useEffect(load, [load]);
  useEffect(() => { if (staff) listProfiles().then(setPeople).catch(() => {}); }, [staff]);

  if (c === undefined) return <Spinner />;
  if (!c) {
    return (
      <div>
        <a href="#/portal/cases" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-cyan-400 mb-6"><ArrowLeft className="w-4 h-4" /> Back to cases</a>
        <ErrorText msg={err} />
        <Empty>Case not found, or you don't have access to it.</Empty>
      </div>
    );
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'timeline', label: 'Timeline' },
    { key: 'evidence', label: 'Evidence' },
    { key: 'iocs', label: 'IOCs' },
    { key: 'notes', label: staff ? 'Notes & updates' : 'Updates & messages' },
  ];

  return (
    <div>
      <a href="#/portal/cases" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-cyan-400 mb-6"><ArrowLeft className="w-4 h-4" /> Back to cases</a>
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="font-mono text-sm text-cyan-400">{c.case_number}</span>
          <SeverityBadge s={c.severity} /><StatusBadge s={c.status} />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold">{c.title}</h1>
        <p className="text-sm text-gray-400 mt-1">
          {c.category}
          {staff && c.client && <> · Client: <span className="text-gray-200">{c.client.company || c.client.full_name || c.client.email}</span></>}
          {' · '}Analyst: <span className="text-gray-200">{c.assignee ? (c.assignee.full_name || c.assignee.email) : 'Unassigned'}</span>
        </p>
      </div>

      <div className="flex gap-1 border-b border-white/10 mb-6 overflow-x-auto">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-2.5 text-sm whitespace-nowrap border-b-2 -mb-px transition-colors ${tab === t.key ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-gray-400 hover:text-white'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'overview' && <Overview c={c} staff={staff} isAdmin={me.role === 'admin'} people={people} onSaved={load} />}
      {tab === 'timeline' && <TimelineTab caseId={c.id} staff={staff} onChange={load} />}
      {tab === 'evidence' && <EvidenceTab caseId={c.id} staff={staff} onChange={load} />}
      {tab === 'iocs' && <IocTab caseId={c.id} staff={staff} onChange={load} />}
      {tab === 'notes' && <NotesTab caseId={c.id} staff={staff} onChange={load} />}
    </div>
  );
}
