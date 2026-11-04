# Principal UI/UX redesign: SEO Outsourcing Philippines

**Status:** Design and Next.js source implemented on the existing draft pull request. Not deployed, production approved, or described as a verified conversion lift.

## Design thesis

Stop looking like a generic SaaS dashboard. Make the business look like a specialist agency production partner. Buyers should understand what work is done, who approves it, and what they receive at handoff.

### Visual identity

- Brand shorthand: **sop.**, paired with the full SEO Outsourcing Philippines name. The mark is a project-designed wordmark, not a claim of a formally registered logo.
- Color: deep evergreen `#143327`, warm paper `#F5F4EC`, dark type `#17271F`, selective pale citron `#E2EFA3`. No gradients, floating shapes, fabricated photos, illustrations, or client logos.
- Type: optimized `Geist` and `Geist Mono` via Next.js `next/font`, with system fallbacks; oversized editorial headings and small, accessible editorial indices.
- Layout: deliberate asymmetry, ruled tables, strong typographic hierarchy, and one tangible SEO work sample. Sharp borders and no generic icon-top three-card grids.

### Homepage order

1. **Agency masthead:** H1 exact text `SEO Outsourcing Philippines`, clear promise, direct agency relevance, and a prominent, four-field hero brief form.
2. **Operating thesis:** why the production model is useful beyond reporting tools.
3. **Work proof artifact:** a readable technical SEO issue ticket adapted from `standalone/site/assets/resources/technical_audit_issue_log.csv`. Conspicuously labeled as illustrative, not client work.
4. **Capabilities:** interactive existing service tabs and precise production deliverables.
5. **Who it is for:** white-label agency partners vs. in-house teams, with distinct approval models.
6. **Operating rhythm:** scoping, baseline, execution, re-test.
7. **Evidence:** actual existing dated Australian keyword snapshots, clearly labeled as observations rather than agency-attributed results. Links to the repository's existing source dashboard URLs.
8. **Engagements:** project, ongoing delivery lane, and white-label support. No unapproved prices or fabricated savings on the homepage.
9. **Closing editorial CTA:** request a specific SEO scope.

### Shared template improvements

- New agency wordmark, compact top navigation, visible sticky desktop and mobile header CTA, and fixed bottom mobile CTA.
- A redesigned two-column editorial PageHero used by the service hub, service details, evidence library, About, pricing, and other core pages.
- A large agency-style footer with real contact email, useful resource links, and conversion CTA.
- Updated SVG favicon and editorial Open Graph card to match the homepage.
- Existing SEO routes, canonical metadata, article content adapter, sitemap and gated `noindex` state are unchanged.

## Integrity and launch protections

The repository's existing `quality/PRODUCTION_RELEASE_GATES.md` is still authoritative. No client results, revenue growth, testimonial, person, legal identity, or price is invented to fill a design gap. Rankings are expressly labeled as dated observations. The hero form is backed by the existing `/api/leads/` endpoint, which rejects success when no verified HTTPS CRM webhook is configured.

**Indexing is not enabled:** `SITE_RELEASE_APPROVED=true` and `SITE_INDEXABLE=true` must both be explicitly set after all approval requirements are met.

## What has been checked in the authoring environment

- Required file and release-safeguard structure checks: pass.
- TypeScript/TSX *syntax transpilation* of changed components and pages: pass. This is not a full module-aware typecheck.
- CSS PostCSS parsing: pass.
- Static, source-derived browser previews: home at desktop 1440/1100, tablet 768, mobile 390 and 320; services and About at 1440, 390 and 320. No horizontal overflow and a single H1 per page in these previews.
- Mobile fixed bottom CTA visibility and hero form presence in the static layouts: pass.
- Small-text color contrast improved toward WCAG AAA; a static computed-color scan of the new homepage found no foreground/background failures among visible text after refinements. **This is not a WCAG AAA compliance certification.** Interactive keyboard/screen-reader, font-loading, and route-level audits remain necessary.

## Outstanding pre-launch tests

- Install dependencies and run `npm run typecheck` and `npm run build` in a network-enabled environment. The authoring container could not install npm packages; `next/font` downloads optimized fonts at build time.
- Test the actual rendered React navigation, tabs, filters, form validation and loading/error/success states with Playwright/axe and keyboard navigation.
- Verify webhook and consent handling against real CRM and email delivery.
- Test site-wide Core Web Vitals, actual phone/tablet hardware, and compare production URL exports before a DNS or hosting cutover.
- Obtain written approval for business identity, team names/photos, pricing, client attribution, and privacy/legal language.

## Source organization

- `components/agency-home.tsx`: new homepage.
- `app/agency.css`: new agency design system and responsive styles, applied after `globals.css`.
- `components/site.tsx`: agency header, footer, editorial inner-page hero.
- `components/ui.tsx`: existing lead form, rewritten hero prompt.
- `lib/content.ts`: clearer navigation language.
- `app/page.tsx`: SEO-targeted metadata and route.
- `app/layout.tsx`, `app/opengraph-image.tsx`, `public/brand-mark.svg`: new font and identity assets.
- `scripts/check-structure.mjs`: now validates the actual new homepage, rather than an unused legacy homepage component.

**Do not merge the draft PR until a real Next.js build and live integrations pass.**
