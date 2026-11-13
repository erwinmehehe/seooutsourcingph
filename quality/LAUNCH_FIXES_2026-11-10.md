# Repository launch fixes — 10 November 2026

The original hero source block is unchanged and protected by a regression fingerprint. Website publication settings and business signoffs remain unchanged.

## Implemented

- Matching generated homepages for standalone and WordPress, with WordPress quote buttons connected to the native proposal form.
- Shared branding, navigation, quote/call ordering and discovery-call route on the supporting pages. WordPress includes normal pages, posts, archives and a 404 template.
- Public copy cleanup: removed personal delivery-lead cards, eyebrows, editing instructions, policy-review notices, old dashboard controls and repeated procurement language. Kept factual qualifiers and technical examples.
- Dedicated portfolio page generated from the same supplied project/keyword data. No invented growth figures or responsibilities.
- Homepage metadata, organization/site structured data and a 1200×630 social image. Versioned public CSS/JS URLs to avoid stale deploys.
- Static contact forms use POST and remain disabled until a protected session is ready. Static previews route quote buttons to email/call options before collecting details.
- Persistent administrator-only WordPress enquiries, failed-email state, bounded notification retries and configurable retention. Form pages are excluded from caching.
- Standalone notification retry and consistent backup commands. Fixed a SQLite connection leak; added request timeouts and stricter origin comparison.
- Corrected Docker copy paths, production configuration and container health checks. Production requires an approved generated release.
- Clean staging robots/sitemap; production builder handles robots attribute order, resolves relative links, enforces required signoffs and validates migration mappings.
- Existing public sitemap inventory: 76 URLs, 7 matching standalone paths, 21 mapped equivalents, 48 needing retention or mapping for a standalone replacement. WordPress should retain its existing posts and archives.
- Regression, container and WordPress integration workflows. Preview builder refuses to delete unrelated output directories.

## Verified locally

React build and TypeScript; 8 Python regression/API tests; PHP syntax for all theme/plugin files; JavaScript syntax; 67 standalone pages and 67 WordPress drafts; Australian source-generation checks; static preview packaging; browser review of desktop/mobile pages and a saved synthetic quote request. The WordPress and Docker runtime smoke tests are configured in CI; no local Docker or production WordPress database was used.

## Host/business work still required

Install the chosen implementation on the production host, configure SMTP and prove inbox receipt, configure the real analytics property and consent behaviour, verify calendar availability, review business/policy/pricing/client permissions, test production performance and backups, and deliberately approve publication/indexing. Confirm WordPress site/sitemap settings use the real domain. Do not replace WordPress with standalone while migration paths remain unresolved.
