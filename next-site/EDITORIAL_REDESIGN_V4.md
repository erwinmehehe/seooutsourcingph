# Editorial agency redesign — v4

## Why this version exists

The previous versions used AI-style visual shortcuts: oversized dark blocks, acidic green accents, faux product dashboards, fake short-brand wordmarks, symmetrical card layouts and highly stylized sales copy. Those were inappropriate for a specialist outsourcing agency.

This version deliberately moves to a quieter identity and a buyer-first structure. It is based on what an agency partner actually needs to evaluate: services, process, work-file quality, boundaries of responsibility, and verifiable evidence.

## What changed

- Removed the invented `sop.` studio identity. Public brand is the actual **SEO Outsourcing Philippines** name with a simple typographic mark.
- Replaced the dark/acid hero with an editorial off-white hero, near-black text and restrained burnt-red accents. No gradients or decorative animations.
- The homepage H1 text content is exactly `SEO Outsourcing Philippines`. Visual punctuation is CSS-generated and does not alter the accessible text.
- Kept an enquiry form in the hero, but made it an integrated document rather than a floating glass/UI card.
- Replaced decorative dashboards and 3-card grids with an illustrative, downloadable technical SEO issue record and services roster.
- Presented agency and in-house engagements as two substantive editorial columns, not generic feature cards.
- Preserved the existing three dated source-linked ranking observations while making the non-attribution/ROI distinction explicit.
- Replaced fictional single-case reporting graphs for hypothetical workflows with review checklists. No fabricated results or quotes.
- Reskinned headers, inner-page heroes, footer, favicon and OG sharing image to the same restrained identity.
- Maintained persistent header CTA and mobile bottom CTA; tested 1440, 1080, 768, 390 and 320px widths. Desktop/mobile static previews contain exactly one H1, no horizontal overflow, and the form starts at 497px on 390px viewport and 544px on 320px.

## Still required before publishing

1. Confirm real legal operator and team identifiers.
2. Obtain real deliverable screenshots/photos and written permission before using client logos, testimonials or performance results.
3. Configure/test the production form webhook and calendar.
4. Confirm pricing accuracy, legal policy, and launch/SEO migration approvals.
5. Install dependencies, run `npm run typecheck`, `npm run build`, and real-browser interactive/accessibility tests against the Next.js build.

Do not activate indexing or merge this design as a live release merely because static previews pass.
