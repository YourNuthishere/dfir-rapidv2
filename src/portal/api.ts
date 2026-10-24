// Data access for the portal. Every call goes through Supabase Row Level Security,
// so a client account physically cannot read other clients' data even if it tries.
import { supabase } from '../lib/db';

export type Role = 'admin' | 'analyst' | 'client';
export type Severity = 'critical' | 'high' | 'medium' | 'low';
export type Status = 'new' | 'triage' | 'investigating' | 'reporting' | 'closed';

export interface Profile { id: string; email: string; full_name: string; company: string; role: Role; created_at?: string }
export interface Case {
  id: string; case_number: string; title: string; category: string; severity: Severity; status: Status;
  summary: string; client_id: string | null; assigned_to: string | null;
  created_at: string; updated_at: string; closed_at: string | null;
  client?: Pick<Profile, 'full_name' | 'email' | 'company'> | null;
  assignee?: Pick<Profile, 'full_name' | 'email'> | null;
}
export interface Evidence {
  id: string; case_id: string; label: string; evidence_type: string; source_host: string; sha256: string;
  size_text: string; collected_by: string; collected_at: string | null; storage_location: string; notes: string; created_at: string;
}
export interface TimelineEvent { id: string; case_id: string; event_time: string; description: string; source: string; mitre: string }
export interface Ioc { id: string; case_id: string; ioc_type: string; value: string; description: string; created_at: string }
export interface Note { id: string; case_id: string; author_name: string; author_role: string; body: string; client_visible: boolean; created_at: string }

export const STATUSES: Status[] = ['new', 'triage', 'investigating', 'reporting', 'closed'];
export const SEVERITIES: Severity[] = ['critical', 'high', 'medium', 'low'];
export const CATEGORIES = ['Incident Response', 'Ransomware', 'Malware Analysis', 'Memory Forensics', 'Disk Forensics', 'Network Forensics', 'Phishing / BEC', 'Insider Threat', 'Cloud Forensics', 'Other'];
export const EVIDENCE_TYPES = ['Disk image', 'Memory dump', 'Event logs', 'PCAP', 'Triage collection (KAPE)', 'Cloud logs', 'Email', 'Mobile', 'Malware sample', 'Other'];
export const IOC_TYPES = ['IPv4', 'IPv6', 'Domain', 'URL', 'SHA256', 'MD5', 'SHA1', 'File path', 'Registry key', 'Email', 'User account', 'Other'];

function sb() {
  if (!supabase) throw new Error('Database not connected. Add your Supabase keys to .env (see README).');
  return supabase;
}
function check<T>(res: { data: T | null; error: { message: string } | null }): T {
  if (res.error) throw new Error(res.error.message);
  return res.data as T;
}

// ---------- Auth & profiles ----------
export async function myProfile(): Promise<Profile | null> {
  const { data: { user } } = await sb().auth.getUser();
  if (!user) return null;
  return check(await sb().from('profiles').select('*').eq('id', user.id).maybeSingle()) as Profile | null;
}
export const listProfiles = async () =>
  check(await sb().from('profiles').select('*').order('role').order('email')) as Profile[];
export const updateProfile = async (id: string, patch: Partial<Pick<Profile, 'full_name' | 'company' | 'role'>>) =>
  check(await sb().from('profiles').update(patch).eq('id', id));

// ---------- Cases ----------
const CASE_SELECT = '*, client:profiles!cases_client_id_fkey(full_name,email,company), assignee:profiles!cases_assigned_to_fkey(full_name,email)';

export const listCases = async () =>
  check(await sb().from('cases').select(CASE_SELECT).order('updated_at', { ascending: false })) as Case[];
export const getCase = async (id: string) =>
  check(await sb().from('cases').select(CASE_SELECT).eq('id', id).maybeSingle()) as Case | null;
export const createCase = async (c: Partial<Case>) =>
  check(await sb().from('cases').insert(c).select('id').single()) as { id: string };
export const updateCase = async (id: string, patch: Partial<Case>) =>
  check(await sb().from('cases').update(patch).eq('id', id));
export const deleteCase = async (id: string) => check(await sb().from('cases').delete().eq('id', id));

// ---------- Case children ----------
type Child = 'evidence' | 'timeline_events' | 'iocs' | 'case_notes';
const ORDER: Record<Child, [string, boolean]> = {
  evidence: ['created_at', true], timeline_events: ['event_time', true], iocs: ['created_at', true], case_notes: ['created_at', true],
};
export async function listChild<T>(table: Child, caseId: string): Promise<T[]> {
  const [col, asc] = ORDER[table];
  return check(await sb().from(table).select('*').eq('case_id', caseId).order(col, { ascending: asc })) as T[];
}
export const addChild = async (table: Child, row: Record<string, unknown>) => check(await sb().from(table).insert(row));
export const deleteChild = async (table: Child, id: string) => check(await sb().from(table).delete().eq('id', id));
