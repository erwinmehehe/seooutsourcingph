import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
const base = process.cwd();
const required = [
  'app/page.tsx','app/layout.tsx','app/[...slug]/page.tsx','app/api/leads/route.ts','app/sitemap.ts',
  'app/robots.ts','components/site.tsx','components/ui.tsx','components/pages.tsx', 'lib/content.ts', 'lib/legacy.ts'
];
let failed = false;
for (const path of required) { if (!existsSync(resolve(base,path))) { console.error('Missing:',path); failed=true; } }
const home = readFileSync(resolve(base,'components/pages.tsx'),'utf8');
const shell = readFileSync(resolve(base,'components/site.tsx'),'utf8');
const api = readFileSync(resolve(base,'app/api/leads/route.ts'),'utf8');
for (const [label,ok] of [
  ['Exact target H1', home.includes('SEO Outsourcing Philippines</h1>')],
  ['Hero form', home.includes('<LeadForm mode="hero"')],
  ['Mobile fixed CTA', shell.includes('mobile-bottom-cta')],
  ['Webhook gating', api.includes('LEADS_WEBHOOK_URL')],
  ['SEO safety gate', readFileSync(resolve(base,'app/robots.ts'),'utf8').includes('SITE_RELEASE_APPROVED')]
]) { if(!ok){ console.error('Missing requirement:',label);failed=true; } }
if(failed)process.exit(1);
console.log('Structure and safety gate checks passed.');
