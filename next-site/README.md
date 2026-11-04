# SEO Outsourcing Philippines — Next.js Redesign

A complete, responsive Next.js App Router frontend for **SEO Outsourcing Philippines**, aligned to the existing [erwinmehehe/seooutsourcingph](https://github.com/erwinmehehe/seooutsourcingph) repository.

The **homepage H1 is exactly `SEO Outsourcing Philippines`**. The hero contains a working validation and submission flow, and mobile has both a sticky header CTA and a fixed bottom CTA. The principal design pass replaces the generic agency/SaaS look with a distinct **sop.** brand identity, an editorial homepage, a real-formatted sample work ticket, and agency-first copy across shared templates. See [`PRINCIPAL_REDESIGN.md`](PRINCIPAL_REDESIGN.md).

## 1. Install in the actual repository

Place the `next-site/` folder **next to** `standalone/`, `wordpress/`, `scripts/`, and `quality/` in the existing repo. The blog and legacy-page adapters intentionally read the already-authored HTML at `../standalone/site/` so 17 blog posts and the existing industry URLs keep their content in the new templates.

```
seooutsourcingph/
├── standalone/
│   └── site/                 # Existing content: keep it
├── quality/                  # Existing approvals: keep them
├── wordpress/                # Existing alternative: keep it
└── next-site/                # New design and Next.js application
```

Run:

```bash
cd next-site
cp .env.example .env.local
npm install
npm run lint:structure
npm run typecheck
npm run dev
```

Open http://localhost:3000. For a production build run `npm run build && npm start`.

**Note:** If `next-site/` is run outside the original repo, its two starter blog previews still appear, but the 17 existing blog posts, industry pages, and other legacy pages cannot be imported. For the complete content migration and route set, keep the folder adjacent to the original source as described above.

## 2. Templates and routes

| Layout | Route |
|---|---|
| Conversion homepage with hero form, sample SEO audit ticket, two buyer pathways, service tabs, sourced ranking observations and pricing comparison | `/` |
| Full service hub | `/services/` |
| Service details: deliverables, roadmap, tools and FAQ | `/services/[slug]/` |
| Evidence / case studies with niche and outcome filters | `/case-studies/` |
| Evidence detail with methodology and interactive reporting view | `/case-studies/[slug]/` |
| Blog library with featured posts, search and category filters | `/blog/` |
| Blog single with sticky TOC, author, callouts, tables, code blocks and related content | `/blog/[slug]/` |
| About, QA standards, company approach | `/about/` |
| Role-based SEO talent directory, with no fabricated people | `/talent/` |
| Recruitment and role application form | `/careers/` |
| Pricing and dedicated-vs-managed comparison | `/pricing/` |
| Consultation / lead form and optional real scheduling embed | `/contact/`, `/book-discovery-call/` |
| Execution process | `/how-it-works/` |
| Legacy industries, country pages, resources and legal content | Existing URLs imported from `standalone/site/` |

On `npm run dev` and `npm run build`, the script `scripts/copy-legacy-assets.mjs` also preserves the existing `/assets/` files and downloadable worksheets. The full legacy posts are rendered from existing source HTML via Cheerio, with scripts, forms, inline event handlers, unsafe URL schemes and iframes removed. The new templates provide their own consistent navigation and CTAs. The adapter is only for trusted repository-owned HTML, **not** arbitrary end-user HTML.

## 3. Conversion setup: a real lead pipeline is required

The form API endpoint is `/api/leads/`. Its modes are: `consultation`, `newsletter`, and `talent`. Submissions are validated with Zod and sent to your verified HTTPS CRM/automation webhook. The submission is **not** reported as successful when the webhook is unset or rejects the request.

1. Set `LEADS_WEBHOOK_URL` to your secure, server-to-server CRM / automation endpoint.
2. Optionally set `LEADS_WEBHOOK_BEARER_TOKEN` for webhook authorization.
3. Test all four modes: homepage hero, contact, footer newsletter, and careers.
4. Verify what arrives in the right inbox/CRM, including `service`, `plan`, `industry`, consent, source and timestamps.
5. Enable server/edge abuse rate limiting and monitoring in production, and follow actual privacy/retention policies. The simple honeypot and same-origin check alone are **not** sufficient protection for high-volume sites.
6. Never place a webhook secret in a `NEXT_PUBLIC_` variable.

The scheduling iframe renders **only** if `NEXT_PUBLIC_SCHEDULING_URL` is a verified HTTPS calendar event URL. Without it, the page explains that online booking is not connected and points to the form/email instead.

## 4. SEO and release safety

- Primary home H1 and keyword-relevant titles/descriptions for every major layout
- Server-rendered Next.js pages, canonical URLs, Open Graph images, breadcrumbs, Organization, Service and BlogPosting structured data
- Generated sitemap and robots configuration, semantic headings, internal links, accessible navigation
- Imported existing blog article bodies and industry URLs for organic-search continuity
- Plain SEO Outsourcing Philippines wordmark and favicon, optimized Geist fonts, clearly labelled sample work files, and no generic stock imagery
- Accessible focus rings, form labels, keyboard navigation and reduced-motion preference
- Editorial off-white / deep-charcoal typography, thin structured borders, and restrained burnt-red accents

**Critical:** Existing `quality/PRODUCTION_RELEASE_GATES.md` identifies unresolved approval requirements. This new app therefore defaults to `noindex,follow`, restrictive `robots.txt`, and an empty sitemap. Indexing becomes available **only when BOTH** these server variables are set:

```env
SITE_RELEASE_APPROVED=true
SITE_INDEXABLE=true
```

Do not enable until all source repository release gates are signed off: legal contracting identity, contact system, price confirmation, client outcome attribution, logo/testimonial rights, verified team bios, privacy review, indexed URL redirects, and crawl/mobile/form QA. No environment setting itself substitutes for the human approvals.

The visible Australian dental numbers are **dated ranking observations**, NOT claimed client wins, changes in traffic, leads, or revenue. The other case-study cards are clearly marked illustrative workflows. The interactive trend chart is marked as fictional demo data. Add real before/after graphs, authorized client logos, quotes and ROI only with evidence and written permission.

## 5. Deployment & migration

The existing repository has static and WordPress deployment alternatives. This `next-site/` app is a **third option**, not an automatic replacement. Do not deploy all three simultaneously or point production DNS to a new host without approval.

If using Vercel/Node:

- Project root directory: `next-site`
- Build: `npm run build`; run with `npm start` / a supported Next.js provider
- Keep `standalone/site` available in the repository checkout during build to import existing content; verify all known routes are prerendered
- Add server-only environment variables in the deployment dashboard, not the GitHub repo
- Before cutover, export the currently indexed URLs from GSC, crawl the live site, and build a route/redirect matrix
- Verify `robots.txt`, sitemap, canonical tags, metadata, newsletter/contact routing, mobile CTA, consent behavior, legal pages, schema and caching on the actual host
- Maintain rollback instructions to the current standalone/WordPress deployment

## 6. Visual / accessibility notes

- Editorial ink `#17271F` on warm canvas `#F5F4EC` has approx. 14.1:1 contrast.
- Primary evergreen `#175844` on warm canvas has approx. 7.6:1 contrast.
- Muted text `#43554B` on warm canvas has approx. 7.2:1 contrast.
- Interactive controls get visible focus outlines, accessible labels and state updates.
- Validate the live site with axe, Lighthouse, keyboard/screen-reader testing and actual mobile devices before claiming WCAG AAA conformance. Static palette contrast alone does not certify AAA.

## What is not automatically finished

A redesign implementation does not independently verify client ROI, staffing claims, production rate cards or legal documents. An authorized CRM recipient, real calendar provider, deployment target and formal release approvals are still required. The ZIP is source code for development and review, **not a live deployment**.

## 2026-11-04 editorial design revision

Read [`EDITORIAL_REDESIGN_V4.md`](./EDITORIAL_REDESIGN_V4.md) for the updated agency positioning, visual rules, responsive checks, and the required production approvals.
