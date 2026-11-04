import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
const base = process.cwd();
const required = [
  'app/page.tsx','app/layout.tsx','app/agency.css','components/agency-home.tsx',
  'app/[...slug]/page.tsx','app/api/leads/route.ts','app/sitemap.ts',
  'app/robots.ts','components/site.tsx','components/ui.tsx','components/pages.tsx',
  'lib/content.ts','lib/legacy.ts','public/brand-mark.svg'
];
let failed = false;
for (const path of required) { if (!existsSync(resolve(base,path))) { console.error('Missing:',path);failed=true; } }
if (failed) process.exit(1);
const home = readFileSync(resolve(base,'components/agency-home.tsx'),'utf8');
const homepage = readFileSync(resolve(base,'app/page.tsx'),'utf8');
const shell = readFileSync(resolve(base,'components/site.tsx'),'utf8');
const api = readFileSync(resolve(base,'app/api/leads/route.ts'),'utf8');
const css = readFileSync(resolve(base,'app/agency.css'),'utf8');
const layout = readFileSync(resolve(base,'app/layout.tsx'),'utf8');
for (const [label,ok] of [
  ['New agency homepage is served', homepage.includes('AgencyHome')],
  ['Exact target H1', home.includes('SEO Outsourcing<br/> Philippines')],
  ['Hero form', home.includes('<LeadForm mode="hero"')],
  ['Evidence attribution disclosure', home.includes('No lead or revenue impact is claimed')],
  ['Real sample downloadable', home.includes('technical_audit_issue_log.csv')],
  ['Mobile fixed CTA', shell.includes('mobile-bottom-cta') && css.includes('.mobile-bottom-cta')],
  ['Visible mobile header CTA', shell.includes('studio-header-cta')],
  ['New brand identity', shell.includes('studio-brand-name')],
  ['Global agency CSS included', layout.includes("import './agency.css'" )],
  ['Webhook gating', api.includes('LEADS_WEBHOOK_URL')],
  ['SEO safety gate', readFileSync(resolve(base,'app/robots.ts'),'utf8').includes('SITE_RELEASE_APPROVED')]
]) { if (!ok){ console.error('Missing requirement:',label);failed=true; } }
if (failed) process.exit(1);
console.log('Agency redesign structure, SEO and safety gate checks passed.');
