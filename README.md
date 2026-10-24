# DFIR-Rapid — Website + Client Portal + Technical Team Portal

One website, three areas:

| Area | Address | Who | What they can do |
|---|---|---|---|
| **Public website** | `/` | Everyone | Read about DFIR-Rapid, request a demo / trial / plan, contact form |
| **Technical team portal** | `/#/portal` (log in) | You (**admin**) and your team (**analyst**) | Dashboard, cases, evidence (chain of custody), attack timeline, IOCs, internal notes, client updates, website leads. Admin also manages users and can delete cases |
| **Client portal** | `/#/portal` (same login page) | Your customers (**client**) | See ONLY their own cases: status & progress, summary, timeline, evidence, IOCs, updates shared with them; send messages to the analyst |

Everyone logs in at the same page; the portal shows the right view based on the account's role.
Security is enforced inside the database (Row Level Security), not just hidden in the page — a client account cannot read other clients' cases, internal notes, or leads even with technical tricks.

Total cost: **$0** — Supabase free plan (database + logins) and Netlify free plan (hosting).

---

## 1. Run it on your computer

Requires Node.js LTS (https://nodejs.org).

```
npm install
npm run dev
```

Open http://localhost:5173 — portal: http://localhost:5173/#/portal

## 2. Set up the database (Supabase, free)

1. https://supabase.com → **New project** (region: Southeast Asia / Singapore). Save the database password.
2. Open `supabase/schema.sql` in Notepad. On the **last line**, replace `YOUR-EMAIL@example.com` with your own email.
3. Supabase → **SQL Editor** → **+ New** → paste the whole file → **Run**. You should see "Success".
4. **Authentication → Users → Add user → Create new user** — your email + strong password, tick **Auto Confirm User**.
5. Go back to the SQL Editor and click **Run** once more → this makes your account **admin**.
6. **Authentication → Sign In / Providers → Email** → turn **OFF** "Allow new users to sign up" → Save.
   (Only you create accounts. This is important.)
7. **Project Settings → API Keys / Data API**: copy the **Project URL** and the **anon public** (or **publishable**) key. Never use the secret / service_role key.

Already ran an older `schema.sql`? Just run the new one — it upgrades without deleting anything.

## 3. Connect the website to the database

In the project folder:

```
copy .env.example .env
notepad .env
```

Paste your values (no quotes, no spaces):

```
VITE_SUPABASE_URL=https://xxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi....
```

Save, then restart: `Ctrl + C`, `npm run dev`.

Test: submit a form on the site → go to `/#/portal` → log in → **Leads** shows it.

## 4. Using the portal

**Add a team member (analyst)**
1. Supabase → Authentication → Users → Add user (their email + a password, Auto Confirm).
2. Portal → **Users** → set their name, change role to **Analyst** → Save.
3. Send them the portal link and password.

**Add a client**
1. Same as above in Supabase.
2. Portal → **Users** → fill in their name and **company**, keep role **Client** → Save.
3. Open (or create) a case → **Overview** → choose them in **Client account** → Save.
4. Send them the portal link and password. They will only see cases linked to them.

**Work a case**
- **Cases → New case**: title, category, severity, client, analyst, summary.
- **Overview**: change status (New → Triage → Investigating → Reporting → Closed). The client sees a progress bar.
- **Timeline**: add attack events with time, source artifact and MITRE ATT&CK ID (links to attack.mitre.org).
- **Evidence**: log each item with SHA-256 hash, who collected it, when, where it is stored (chain of custody).
- **IOCs**: IPs, domains, hashes… with one-click copy and CSV export.
- **Notes & updates**: 🔒 *Internal* notes are team-only. 👁 *Update shared with client* appears in the client portal. Client messages appear here too.

What clients can see: summary, status, severity, timeline, evidence list, IOCs, and shared updates.
What clients can NOT see: internal notes, other clients, leads, users, and they cannot edit anything except sending messages.

> Do not upload actual evidence files (disk images, malware) to this site. The portal is for case tracking and metadata; keep evidence in your secured storage.

## 5. Host it for free (Netlify)

**Simple way (no GitHub):**
1. `npm run build` → creates the `dist` folder (your `.env` keys are built in).
2. https://app.netlify.com/drop → drag the **dist** folder onto the page.
3. Site configuration → **Change site name** → e.g. `dfir-rapid` → https://dfir-rapid.netlify.app
4. To update later: `npm run build`, then Netlify → **Deploys** → drag the new `dist` folder.

**Automatic way (GitHub):** upload the project to a GitHub repo (without `node_modules`, `dist`, `.env`) → Netlify → Add new project → Import from GitHub → build command `npm run build`, publish directory `dist` → add the two environment variables `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` → Deploy.

After hosting, in Supabase → **Authentication → URL Configuration**, set **Site URL** to your Netlify address.

## 6. Still to finish (content only you can decide)

| Where | What |
|---|---|
| `src/app/components/Footer.tsx`, `ContactSection.tsx` | Real email, phone, address, social links |
| `src/app/components/TestimonialsSection.tsx` | Placeholder testimonials — replace or remove before going public |
| Hero / CTA / Pricing sections | Make sure numbers (75%, ~5 hours, prices) match your real results |
| Privacy policy page | Needed since forms and accounts store personal data |
| `public/favicon.png` | Your logo |

Free-plan note: Supabase pauses a project after ~1 week without any activity — click **Restore** in the dashboard if that happens.

## Project structure

```
src/
  lib/db.ts                 database connection + website forms (leads)
  app/App.tsx               public site + routing to /#/portal
  app/components/*.tsx      public website sections (your Figma design)
  app/components/LeadModal.tsx, ContactSection.tsx   website forms
  portal/PortalApp.tsx      login, sidebar, role-based pages
  portal/Dashboard.tsx      team dashboard
  portal/CasesView.tsx      case list + new case
  portal/CaseDetail.tsx     overview, timeline, evidence, IOCs, notes
  portal/LeadsView.tsx      website leads inbox
  portal/UsersView.tsx      admin: names, companies, roles
  portal/api.ts             all portal database calls
supabase/schema.sql         tables, roles and security rules
```
