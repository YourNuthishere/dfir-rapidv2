import { useEffect, useState } from 'react';
import { Save, Loader2, UserPlus } from 'lucide-react';
import { listProfiles, updateProfile, type Profile, type Role } from './api';
import { Card, Spinner, ErrorText, inputCls, btnPrimary, fmtDate } from './ui';

function Row({ p, me, onSaved }: { p: Profile; me: Profile; onSaved: () => void }) {
  const [v, setV] = useState({ full_name: p.full_name, company: p.company, role: p.role });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const dirty = v.full_name !== p.full_name || v.company !== p.company || v.role !== p.role;

  async function save() {
    if (p.id === me.id && v.role !== 'admin' && !confirm('You are removing your own admin rights. You will lose access to this page. Continue?')) return;
    setBusy(true); setErr('');
    try { await updateProfile(p.id, { full_name: v.full_name.trim(), company: v.company.trim(), role: v.role }); onSaved(); }
    catch (e) { setErr((e as Error).message); }
    setBusy(false);
  }

  return (
    <tr className="align-top">
      <td className="px-4 py-3">
        <div className="text-sm">{p.email}{p.id === me.id && <span className="ml-2 text-xs text-cyan-400">(you)</span>}</div>
        <div className="text-xs text-gray-500">since {fmtDate(p.created_at, false)}</div>
      </td>
      <td className="px-4 py-3"><input value={v.full_name} onChange={e => setV({ ...v, full_name: e.target.value })} maxLength={100} placeholder="Full name" className={inputCls} /></td>
      <td className="px-4 py-3"><input value={v.company} onChange={e => setV({ ...v, company: e.target.value })} maxLength={100} placeholder="Company" className={inputCls} /></td>
      <td className="px-4 py-3">
        <select value={v.role} onChange={e => setV({ ...v, role: e.target.value as Role })} className={inputCls}>
          <option value="client">Client</option><option value="analyst">Analyst</option><option value="admin">Admin</option>
        </select>
      </td>
      <td className="px-4 py-3">
        <button onClick={save} disabled={!dirty || busy} className={btnPrimary}>{busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save</button>
        <ErrorText msg={err} />
      </td>
    </tr>
  );
}

export function UsersView({ me }: { me: Profile }) {
  const [people, setPeople] = useState<Profile[] | null>(null);
  const [err, setErr] = useState('');
  const load = () => listProfiles().then(setPeople).catch(e => { setErr(e.message); setPeople([]); });
  useEffect(() => { load(); }, []);
  if (!people) return <Spinner />;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-1">Users</h1>
      <p className="text-gray-400 mb-6">Set each person's name, company and role.</p>

      <Card className="p-5 mb-6 border-cyan-500/30">
        <div className="flex gap-3">
          <UserPlus className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
          <div className="text-sm text-gray-300 space-y-1">
            <p className="font-semibold text-white">How to add a new client or team member</p>
            <p>1. In Supabase go to <b>Authentication → Users → Add user → Create new user</b>, enter their email and a password, tick <b>Auto Confirm User</b>.</p>
            <p>2. Refresh this page. They appear below as <b>Client</b>. Fill in their name and company, and change the role to <b>Analyst</b> if they are on your team.</p>
            <p>3. Send them the portal link and their password. Clients only ever see cases you link to them.</p>
          </div>
        </div>
      </Card>

      <ErrorText msg={err} />
      <Card className="overflow-x-auto">
        <table className="w-full text-sm min-w-[52rem]">
          <thead className="bg-white/5 text-gray-400 text-left">
            <tr><th className="px-4 py-3 font-medium">Account</th><th className="px-4 py-3 font-medium">Name</th><th className="px-4 py-3 font-medium">Company</th><th className="px-4 py-3 font-medium w-40">Role</th><th className="px-4 py-3 w-32" /></tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {people.map(p => <Row key={`${p.id}-${p.role}-${p.full_name}-${p.company}`} p={p} me={me} onSaved={load} />)}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
