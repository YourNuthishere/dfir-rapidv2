// Database layer for DFIR-Rapid.
// Uses Supabase (free Postgres) when VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY are set in .env,
// otherwise falls back to the browser's localStorage so the site still works as a demo.
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const hasDB = Boolean(url && key);
export const supabase: SupabaseClient | null = hasDB ? createClient(url!, key!) : null;

export type LeadType = 'demo' | 'trial' | 'contact' | 'plan';

export interface Lead {
  id?: string;
  type: LeadType;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  plan?: string;
  company_size?: string;
  message?: string;
  status?: 'new' | 'contacted' | 'closed';
  created_at?: string;
}

const LOCAL_KEY = 'dfir-rapid-leads';

function readLocal(): Lead[] {
  try { return JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]'); } catch { return []; }
}
function writeLocal(leads: Lead[]) {
  try { localStorage.setItem(LOCAL_KEY, JSON.stringify(leads)); } catch { /* storage blocked */ }
}

export async function submitLead(lead: Lead): Promise<void> {
  const clean: Lead = {
    type: lead.type,
    name: lead.name.trim().slice(0, 100),
    email: lead.email.trim().slice(0, 150),
    company: lead.company?.trim().slice(0, 100) || '',
    phone: lead.phone?.trim().slice(0, 40) || '',
    plan: lead.plan || '',
    company_size: lead.company_size || '',
    message: lead.message?.trim().slice(0, 3000) || '',
  };
  if (supabase) {
    const { error } = await supabase.from('leads').insert(clean);
    if (error) throw new Error(error.message);
    return;
  }
  writeLocal([{ ...clean, id: crypto.randomUUID(), status: 'new', created_at: new Date().toISOString() }, ...readLocal()]);
}

// ---------- Admin (requires login when Supabase is configured) ----------
export async function listLeads(): Promise<Lead[]> {
  if (!supabase) return readLocal();
  const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data as Lead[];
}

export async function updateLeadStatus(id: string, status: Lead['status']) {
  if (!supabase) { writeLocal(readLocal().map(l => (l.id === id ? { ...l, status } : l))); return; }
  const { error } = await supabase.from('leads').update({ status }).eq('id', id);
  if (error) throw new Error(error.message);
}

export async function deleteLead(id: string) {
  if (!supabase) { writeLocal(readLocal().filter(l => l.id !== id)); return; }
  const { error } = await supabase.from('leads').delete().eq('id', id);
  if (error) throw new Error(error.message);
}
