# Release gates and real-world trust evidence

The site files are an improved **pre-production release candidate**, not verified business credentials or an authorized case-study library.

## Operational blockers

1. **Business identity:** Verify the real contracting operator, publicly reachable contact address, named delivery owner, and the right to use any company photo or logo.
2. **Evidence permission:** The SE Ranking dashboards demonstrate tracked observations. They do not establish which agency did the SEO or what leads/revenue resulted. Obtain written authorization and records before any attribution claim.
3. **Pricing:** Obtain sign-off that the USD 700 / 1,000 / 1,500 starting prices and plan scopes can actually be offered.
4. **Legal:** Review Privacy Policy, Cookies and Terms against actual hosting, analytics, retention and contact implementation.
5. **Conversion:** Submit a lead for `/contact/?industry=plumbers`, `/contact/?industry=law-firms`, `/contact/?industry=ndis-providers`, and `/contact/?plan=SEO+Growth`. Confirm the industry/service/plan arrive unchanged in the intended inbox. A local API test is not enough.
6. **Australian content:** Obtain appropriate reviewer sign-off for clinical, legal, tax, NDIS and solar claims and verify current source links.
7. **Technical:** Validate mobile and keyboard navigation, cookie consent and analytics, redirects, email delivery, security headers, rate limits, and recovery on the actual host.

## Choose exactly one production platform

- **WordPress**: the import stays in **draft**. Newly imported pages with `_sop_full_layout=1` should not be published until `sop_release_status=APPROVED`. The theme blocks unapproved imported content from public display even if a draft is accidentally published.
- **Standalone**: `python3 scripts/build_release.py --audit` reports what is missing. `--out /path/to/empty/dist` creates a restricted production bundle only if the release manifest and URL approvals are complete; it will not deploy. The output will contain *only* reviewed and linked approved pages, and a matching sitemap/robots file.

Never remove staging `noindex` site-wide as a shortcut. Do not create imaginary testimonials, client permissions, Australian offices or employee biographies to satisfy the approval checklist.

## Confirmed technical changes in this iteration

- Industry-specific enquiry routing for 17 industry pages and both form implementations
- WordPress form disabled when a verified recipient address is not configured
- Ten distinct Australian-sector buyer tests replace generic related-service cards
- Homepage, About, Results, Samples and Pricing have stronger evidence and acceptance standards
- Staging and release guards prevent an incomplete launch from being confused with a live site

Human sign-off remains required. Do not set status to APPROVED automatically or on the basis of a passing CI job.
