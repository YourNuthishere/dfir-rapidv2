import { useEffect, useState, type FormEvent } from 'react';
import { LayoutDashboard, FolderSearch, Inbox, Users, LogOut, Shield, Menu, X, ArrowLeft, Loader2 } from 'lucide-react';
import { hasDB, supabase } from '../lib/db';
import { myProfile, type Profile } from './api';
import { inputCls, btnPrimary, ErrorText, Spinner } from './ui';
import { Dashboard } from './Dashboard';
import { CasesView } from './CasesView';
import { CaseDetail } from './CaseDetail';
import { LeadsView } from './LeadsView';
import { UsersView } from './UsersView';

function useRoute() {
  const parse = () => window.location.hash.replace(/^#\/(portal|admin)\/?/, '').split('/').filter(Boolean);
  const [parts, setParts] = useState(parse);
  useEffect(() => {
    const on = () => { setParts(parse()); window.scrollTo(0, 0); };
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return parts;
}

function Login() {
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    setBusy(true); setError('');
    const { error } = await supabase!.auth.signInWithPassword({ email: f.email, password: f.password });
    if (error) setError(error.message === 'Invalid login credentials' ? 'Wrong email or password.' : error.message);
    setBusy(false);
  }
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-black via-blue-950/40 to-black">
      <div className="w-full max-w-md">
        <a href="#" className="flex items-center gap-2 text-sm text-gray-400 hover:text-cyan-400 mb-6"><ArrowLeft className="w-4 h-4" /> Back to website</a>
        <form onSubmit={submit} className="bg-white/5 border border-cyan-500/30 rounded-2xl p-8 shadow-2xl shadow-cyan-500/10 space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-11 h-11 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center"><Shield className="w-6 h-6" /></div>
            <div>
              <h1 className="text-2xl font-bold">DFIR-Rapid Portal</h1>
              <p className="text-sm text-gray-400">Clients and technical team sign in here</p>
            </div>
          </div>
          <input name="email" type="email" required autoComplete="email" placeholder="Email" className={inputCls} />
          <input name="password" type="password" required autoComplete="current-password" placeholder="Password" className={inputCls} />
          <ErrorText msg={error} />
          <button disabled={busy} className={`${btnPrimary} w-full py-3`}>{busy && <Loader2 className="w-4 h-4 animate-spin" />} Sign in</button>
          <p className="text-xs text-gray-500 text-center">Accounts are created by DFIR-Rapid. Need access? Contact your analyst.</p>
        </form>
      </div>
    </div>
  );
}

export default function PortalApp() {
  const parts = useRoute();
  const [session, setSession] = useState<boolean | null>(null);
  const [me, setMe] = useState<Profile | null>(null);
  const [loadErr, setLoadErr] = useState('');
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => setSession(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(!!s));
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) { setMe(null); return; }
    myProfile().then(setMe).catch(e => setLoadErr(e.message));
  }, [session]);

  useEffect(() => { setMenu(false); }, [parts.join('/')]);

  if (!hasDB) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 bg-black">
        <div className="max-w-lg p-8 border border-yellow-500/30 bg-yellow-500/10 rounded-2xl text-yellow-100">
          <h1 className="text-2xl font-bold mb-3">Portal needs the database</h1>
          <p className="text-sm mb-4">The client and team portal stores real cases, so it only works once Supabase is connected. Add your keys to the <code>.env</code> file (see README → "Connect the database"), then restart <code>npm run dev</code>.</p>
          <a href="#" className="text-cyan-300 underline text-sm">← Back to website</a>
        </div>
      </div>
    );
  }
  if (session === null) return <div className="min-h-screen bg-black"><Spinner /></div>;
  if (!session) return <Login />;
  if (!me) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        {loadErr ? (
          <div className="text-center max-w-md">
            <p className="text-red-400 mb-2">Could not load your account: {loadErr}</p>
            <p className="text-gray-400 text-sm mb-4">Make sure you ran the latest <code>supabase/schema.sql</code>.</p>
            <button className="text-cyan-400 underline" onClick={() => supabase!.auth.signOut()}>Sign out</button>
          </div>
        ) : <Spinner />}
      </div>
    );
  }

  const staff = me.role !== 'client';
  const [section = staff ? 'dashboard' : 'cases', id] = parts;

  const nav = staff
    ? [
        { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { key: 'cases', label: 'Cases', icon: FolderSearch },
        { key: 'leads', label: 'Leads', icon: Inbox },
        ...(me.role === 'admin' ? [{ key: 'users', label: 'Users', icon: Users }] : []),
      ]
    : [{ key: 'cases', label: 'My Cases', icon: FolderSearch }];

  let page;
  if (section === 'cases' && id === 'new' && staff) page = <CasesView me={me} startNew />;
  else if (section === 'cases' && id) page = <CaseDetail id={id} me={me} />;
  else if (section === 'cases') page = <CasesView me={me} />;
  else if (staff && section === 'leads') page = <LeadsView />;
  else if (me.role === 'admin' && section === 'users') page = <UsersView me={me} />;
  else if (staff) page = <Dashboard me={me} />;
  else page = <CasesView me={me} />;

  const roleCls = { admin: 'text-purple-300', analyst: 'text-cyan-300', client: 'text-green-300' }[me.role];

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar */}
      <aside className={`fixed md:sticky top-0 z-40 h-screen w-64 shrink-0 bg-gradient-to-b from-blue-950/60 to-black border-r border-cyan-500/20 flex flex-col transition-transform md:translate-x-0 ${menu ? 'translate-x-0' : '-translate-x-full'}`}>
        <a href="#/portal" className="flex items-center gap-3 px-6 h-16 border-b border-cyan-500/20">
          <div className="w-9 h-9 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center"><Shield className="w-5 h-5" /></div>
          <div>
            <div className="font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent leading-tight">DFIR-Rapid</div>
            <div className="text-[11px] text-gray-400">{staff ? 'Technical Team Portal' : 'Client Portal'}</div>
          </div>
        </a>
        <nav className="flex-1 p-3 space-y-1">
          {nav.map(({ key, label, icon: Icon }) => (
            <a key={key} href={`#/portal/${key}`}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${section === key ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30' : 'text-gray-300 hover:bg-white/5 border border-transparent'}`}>
              <Icon className="w-4 h-4" /> {label}
            </a>
          ))}
        </nav>
        <div className="p-4 border-t border-cyan-500/20">
          <div className="text-sm font-medium truncate">{me.full_name || me.email}</div>
          <div className="text-xs text-gray-500 truncate">{me.company || me.email}</div>
          <div className={`text-xs uppercase tracking-wider mt-1 ${roleCls}`}>{me.role}</div>
          <button onClick={() => supabase!.auth.signOut()} className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 text-sm border border-white/10 rounded-lg hover:border-red-500/50 hover:text-red-300">
            <LogOut className="w-4 h-4" /> Sign out
          </button>
          <a href="#" className="block text-center text-xs text-gray-500 hover:text-cyan-400 mt-3">← Public website</a>
        </div>
      </aside>
      {menu && <div className="fixed inset-0 z-30 bg-black/60 md:hidden" onClick={() => setMenu(false)} />}

      {/* Main */}
      <div className="flex-1 min-w-0">
        <div className="md:hidden flex items-center justify-between h-14 px-4 border-b border-cyan-500/20 sticky top-0 bg-black/90 backdrop-blur z-20">
          <span className="font-bold text-cyan-300">DFIR-Rapid</span>
          <button onClick={() => setMenu(!menu)} aria-label="Menu" className="text-cyan-400">{menu ? <X /> : <Menu />}</button>
        </div>
        <main className="p-4 md:p-8 max-w-7xl mx-auto">{page}</main>
      </div>
    </div>
  );
}
