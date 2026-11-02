# Australia programmatic SEO: editorial and demand validation

**Current status:** Five curated specialist pages plus a distinct Australia agency hub are committed on `main` as **draft / noindex**. This is not a live publishing approval. No Australian office is claimed.

## Why the pilot is narrow

Search results for generic white-label SEO in Australia feature established agencies. Pages that only substitute Sydney, Melbourne, Brisbane, Perth or Adelaide would be near-duplicates and could run afoul of Google's doorway/scaled-content guidance.

The five pilot pages instead cover different buying decisions:
1. SEO launch QA for Australian web design agencies
2. White-label technical audit handoffs
3. Google Business Profile verification and review integrity
4. Evidence-led Australian SEO content briefs
5. Shopify SEO technical and Markets handoffs for e-commerce agencies

Each page contains a different worked example, acceptance table or decision framework, expert reference links and a usable CSV worksheet. Main-page editorial content is around 799–981 words per page, excluding the common navigation and footer.

## Competition and demand caveat

**No validated keyword difficulty or Australian monthly search volume is available.** Semrush returned `no_api_units` for the connected corporate account. Its owner must allocate API units before Semrush keyword metrics can be retrieved. Never label the keywords low KD on that basis.

A manual SERP scan found providers targeting broad white-label SEO and some niche services. That is enough to prioritise differentiated pages for testing, **not** enough to promise low competition, search demand or rankings.

Before considering any page for indexing:
- Use an Australian keyword database or a properly collected regional SERP sample to record intent, approximate volume, KD and competing page quality.
- Inspect Australia-specific Search Console queries and existing clicks/impressions to reduce cannibalisation.
- Check for exact overlapping intent with existing `/services/` and `/industries/` URLs; consolidate if buyers would not need two distinct pages.
- Obtain editorial confirmation from someone who actually delivers the relevant service, including actual examples and scope exclusions.
- Confirm the worksheet and CTA work after hosting deployment.
- Keep `noindex` until human approval; do not mass-release automatically.

## Programme expansion rule

**Do not create automatic `{service} × {city} × {industry}` variations.** Add a page only when:
- A measurable query cluster and distinct buyer decision exist.
- The page can offer unique expert information not present on its parent.
- Its service is genuinely available and its client evidence is authorized.
- It includes a concrete workflow, failure mode, acceptance test and primary-source reference.
- It has a real owner who can keep it accurate after release.

Use `node scripts/generate_au_pseo.cjs --check` to verify committed pages against the curated JSON source. Use `python3 scripts/au_pseo_quality.py` to check the editorial tripwires. The machine tests are not proof of E-E-A-T and cannot authorize publication.

## Primary reference sources

- Google spam policies: https://developers.google.com/search/docs/essentials/spam-policies
- Google people-first content: https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Google Business Profile representation: https://support.google.com/business/answer/3038177
- Google migration guidance: https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes
- Australian Competition and Consumer Commission: https://www.accc.gov.au/consumers/advertising-and-promotions/false-or-misleading-claims
- Australian Health Practitioner Regulation Agency: https://ahpra.gov.au/Publications/Advertising-resources/Legislation-guidelines/Summary-of-advertising-obligations.aspx
- Shopify Markets international SEO: https://help.shopify.com/en/manual/markets/seo
