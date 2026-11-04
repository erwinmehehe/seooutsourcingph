# SEO Outsourcing Philippines — URL and content migration cautions

This redesign **does not** replace the existing 66-page static or WordPress draft content in production. It keeps important paths available when corresponding WordPress pages are published. Final URL migration must be based on the site's actual live/indexed URLs, not only the repository tree.

## Priority paths to preserve

- `/` (target exact H1: SEO Outsourcing Philippines)
- `/services/`
- `/services/technical-seo/`, `/services/white-label-seo/`, `/services/local-seo/`, `/services/seo-audits/`, `/services/on-page-seo/`, `/services/seo-content/`, `/services/seo-strategy/`, `/services/seo-reporting/`, `/services/link-building/`, `/services/multi-location-seo/`
- `/for-agencies/`, `/for-businesses/`, `/pricing/`, `/about/`, `/contact/`, `/book-discovery-call/`
- `/results/`, `/samples/`, `/how-it-works/`
- `/blog/` and all existing 17 `/blog/{slug}/` article paths
- `/industries/` and existing sector and Australia-specific nested URLs
- `/privacy-policy/`, `/terms-of-service/`, `/cookie-policy/`

Additional new service slugs (`answer-engine-optimization`, `schema-entity-seo`, `semantic-keyword-mapping`) are included in the theme catalog but need actual WordPress pages before links should be exposed in an indexed sitemap. Create them as drafts, review the content, then approve and publish.

## Migration sequence

1. Export real live URLs from GSC, sitemap and a crawl; separately export draft WordPress URLs.
2. Back up the complete WordPress database and media library. Maintain a rollback theme.
3. On staging, install Blocksy and this child theme. Import only approved content; do not import demo starter content to the live domain.
4. Check any conflict between `/blog/` as a WordPress Posts page versus a parent Page for nested legacy blog Pages. Keep article URLs unchanged with proper post permalink rules or an explicit redirect plan.
5. Verify existing imported `_sop_full_layout=1` pages remain inaccessible unless explicitly `sop_release_status=APPROVED`. The new theme retains the previous release guard.
6. Map old pages to new pages 1:1, approve all redirects, and verify canonical and internal links.
7. Confirm that unapproved Australian regulated-industry content stays draft and noindex.
8. Complete live lead testing, privacy review and brand identity approval before enabling indexing.

## Do not claim

- Dated SE Ranking keyword counts prove SEO Outsourcing Philippines caused rankings or qualified leads.
- The site has a specific number of team members, customers, years in operation, awards or revenues without verification.
- The published $700/$1,000/$1,500 proposed prices are contractually available until authorized by the owner.
