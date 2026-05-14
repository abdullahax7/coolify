# Property Trader — Production Deploy Runbook

Run these commands **on your local machine**. Claude Code cannot run them inside its sandbox.

---

## 1. Install dependencies

```powershell
cd "C:\Users\shani\Downloads\Property Antigaravityt (2)\Property Antigaravityt"
npm install
```

This will install `sharp` (new) and drop `vercel` from runtime deps. Sharp builds a native binary on first install; first run may take ~30 seconds.

If you see Sharp build errors on Windows, run:
```powershell
npm install --include=optional sharp
npm rebuild sharp
```

---

## 2. Verify with type-check + build

```powershell
npm run typecheck
npm run lint
npm run build
```

Goals:
- `typecheck` → no errors
- `lint` → no errors
- `build` → completes with no warnings

If anything fails, copy the error to me before deploying.

---

## 3. Apply the database migration

The migration is at `supabase/migrations/20260512_soft_delete_and_audit.sql`. It is **idempotent** and **additive only** — it does not drop or rename any existing column, so it's safe to run on a live DB.

### Option A — via Supabase CLI (preferred)

```powershell
npx supabase link --project-ref <YOUR_PROJECT_REF>
npx supabase db push
```

### Option B — paste into the Supabase SQL Editor

1. Open https://supabase.com/dashboard → your project → **SQL Editor** → **New query**
2. Paste the full contents of `supabase/migrations/20260512_soft_delete_and_audit.sql`
3. Run

Expected results:
- 9 tables gain a `deleted_at` column
- `admin_audit_log` table is created
- ~20 new indexes are created
- 3 helper functions are created: `purge_soft_deleted`, `soft_delete_row`, `restore_row`
- `ANALYZE` runs on all touched tables

You can verify with:
```sql
select table_name, column_name
from information_schema.columns
where column_name = 'deleted_at' and table_schema = 'public';
```

Should return 9 rows.

---

## 4. Confirm env vars are set in Vercel

Required in Vercel → Settings → Environment Variables:

| Name | Scope |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY` | Production, Preview (NEVER expose to browser) |
| `NEXT_PUBLIC_SQUARE_APP_ID` | Production, Preview |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | Production, Preview, Development |
| `RECAPTCHA_SECRET_KEY` | Production, Preview |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` | Production |

Check current values with:
```powershell
npx vercel env ls
```

Pull them into a local `.env.local` for testing:
```powershell
npx vercel env pull .env.local
```

---

## 5. Deploy

```powershell
git add -A
git status                           # review what's changing
git commit -m "Production hardening: SEO, soft-delete, Sharp, security headers"
git push
```

If your project is linked to Vercel, the push triggers a deploy. Otherwise:

```powershell
npx vercel --prod
```

---

## 6. Post-deploy smoke tests

Run these from your machine after deploy completes:

```powershell
# Health endpoint
curl https://property-trader1.co.uk/api/health

# Sitemap
curl -I https://property-trader1.co.uk/sitemap.xml

# Robots
curl https://property-trader1.co.uk/robots.txt

# Security headers
curl -I https://property-trader1.co.uk/ | findstr /i "strict-transport x-frame x-content referrer"
```

Health endpoint should return:
```json
{ "ok": true, "checks": { "database": { "ok": true }, "storage": { "ok": true } } }
```

Then in the browser:
- [ ] Homepage loads, hero image renders
- [ ] Header dropdowns work (Tools menu)
- [ ] Sign in / register work
- [ ] Property listing page loads
- [ ] Click into a property — detail page loads, image gallery works
- [ ] View page source on a property — JSON-LD `RealEstateListing` is present
- [ ] Footer all legal links resolve (no 404s)
- [ ] `pt-console` accessible to admin only
- [ ] Upload a JPEG in admin — file is converted to WebP in Supabase storage
- [ ] Delete a property in admin — it disappears from public view, appears in trash (after migration)
- [ ] `admin_audit_log` has a new row

---

## 7. Optional: SEO submission

After the production deploy:

1. **Google Search Console** → submit `https://property-trader1.co.uk/sitemap.xml`
2. **Bing Webmaster Tools** → submit the same
3. Re-validate structured data: https://search.google.com/test/rich-results

---

## What was changed (summary)

### New files
- `src/lib/audit.ts` — admin audit log helper
- `src/lib/image-pipeline.ts` — Sharp WebP pipeline
- `src/app/not-found.tsx` — branded 404 page
- `src/app/error.tsx` — runtime error page
- `src/app/global-error.tsx` — root error fallback
- `src/app/api/health/route.ts` — `/api/health` endpoint
- `supabase/migrations/20260512_soft_delete_and_audit.sql` — soft delete, indexes, audit log

### Modified
- `next.config.ts` — security headers, AVIF/WebP, asset caching
- `tsconfig.json` — stricter checks
- `package.json` — sharp added, devDeps tidied
- `src/app/layout.tsx` — Organization + WebSite + SearchAction JSON-LD
- `src/app/sitemap.ts` — direct Supabase query, full legal & blog routes
- `src/app/robots.ts` — UK-targeted, AI-bot blocked
- `src/app/properties/[id]/page.tsx` — rich SEO metadata + JSON-LD
- `src/app/api/properties/custom/route.ts` — soft-delete-aware, audit-logged
- `src/app/api/properties/custom/[id]/route.ts` — soft-delete, restore, audit
- `src/app/api/storage/upload/route.ts` — WebP pipeline integration
- `src/app/register/page.tsx` — fixed broken Terms/Privacy links
- Various: removed dev `console.log` calls leaking customer data

### Deleted (zero-reference confirmed)
- `cleanup.bat`, `cleanup.ps1` (stale dev scripts)
- `documents structure/` (HTML reference docs)
- `public/cash_buyer_bg.png`, `cash_buyer_deal_hero.png`, `cash_buyer_hero.png`
- `public/logo.jpg` (duplicate of `/images/logo.jpg`)
- `public/images/prop_2.png`, `agent-illustration.png`, `england_flag.png`,
  `wales_flag.png`, `hero_bg.png`, `hero_luxury.png`, `service-placeholder.png`
- `public/forms/RHW18-form.docx`
- `src/app/pt-console/components/WalesWizardModal.tsx` (stub)
- `src/components/common/ViewingModal.tsx` + its CSS (orphan)
- `src/app/properties/[id]/property_detail.module.css` (underscore duplicate)
- `src/app/contact/page.tsx.bak` (backup file)
- `src/app/landlord-application/`, `src/app/landlord-services-application/` (empty)
