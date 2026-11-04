# Agency credibility refinement — November 4, 2026

This iteration updates the existing draft Next.js redesign. It is **not a new public launch** and does not modify `standalone/`, `wordpress/`, or approval statuses.

## What changed

- **Keyword-focused H1 remains exact:** `SEO Outsourcing Philippines`.
- **More specific hero:** White-label SEO for agencies and scoped specialist SEO for in-house teams. No invented ROI, volume, team size or logos.
- **Lead form above the fold on mobile:** At 390px the hero form starts around 322px from viewport top in a static CSS preview. The header CTA and persistent bottom CTA point to the home form, or to the contact form on other routes. The mobile bar hides while a form control is focused so it does not obscure an input.
- **Real sample format instead of a fabricated delivery OS:** The homepage and How It Works use a technical SEO ticket adapted from the repository's sample issue log (`standalone/site/assets/resources/technical_audit_issue_log.csv`). All sample content is clearly labeled illustrative and downloadable.
- **Buyer-specific pathways:** Agencies get a white-label delivery path; in-house teams get a dedicated workstream path. Both link to existing informational pages.
- **No fake growth chart on the homepage:** The lower 'reporting experience' demo has been replaced with a practical implementation/acceptance handoff, a CSV download and a pilot scope worksheet.
- **SEO metadata refined:** Updated home title, description, terms and internal links with the phrase SEO Outsourcing Philippines.
- **Responsive improvements:** Refined hero content order, compact form arrangement, tablet balance, 320px compact header label and single-column 320px form fields.

## Static visual QA

Representative static first-fold and layout mockups were checked at 1440px, 800px, 390px and 320px viewport widths. There was **no horizontal overflow** in the final static preview. The exact homepage H1 appeared once. This is **not** a full Next.js/browser integration test.

## Pending before merging or deploying

1. Run `npm install`, `npm run typecheck`, `npm run build` in a network-enabled environment. The package registry was unavailable during this iteration.
2. Run desktop/mobile browser QA on the **running Next.js app**, including every major page, keyboard/screen-reader accessibility, and actual form behavior.
3. Verify webhook, newsletter, talent applications and calendar integration end-to-end.
4. Secure approvals for business identity, pricing, authorized case studies, legal/privacy content, SEO indexing and URL migration under `quality/PRODUCTION_RELEASE_GATES.md`.
5. Only add real client testimonials, logos, organic traffic change, lead counts and attributable ROI after evidence and permission.

## How to review

```sh
cd next-site
cp .env.example .env.local
npm install
npm run lint:structure
npm run typecheck
npm run build
npm run dev
```

The `main` branch is unchanged until the draft pull request is reviewed and merged. Keep `SITE_RELEASE_APPROVED` and `SITE_INDEXABLE` disabled until all release gates pass.
