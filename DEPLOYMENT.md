# Deployment

The live domain currently uses WordPress. Merging source into GitHub does not install a theme or configure production mail.

## WordPress

1. Back up the WordPress database, uploads, theme and plugin configuration. Keep a restore point and a URL inventory.
2. Build the homepage from `landing-page/` with `npm ci` and `npm run build`. The generated theme files are committed so installation does not require Node on the host.
3. Install `wordpress/sop-premium-agency/` and `wordpress/sop-proposal-form/` on a restricted test installation first. The theme renders the corrected homepage; its Get a Quote buttons use the WordPress contact form. The hero is the same as the standalone build.
4. Set `SOP_LEADS_EMAIL` to the verified receiving inbox in private WordPress configuration. Configure an authenticated SMTP provider. Submit a real request and confirm inbox receipt and reply handling. The plugin saves accepted requests as private `sop_inquiry` records and retries failed notifications up to three times. Only administrators can access these records. Retention defaults to 90 days and can be changed with `SOP_ENQUIRY_RETENTION_DAYS`.
5. Exclude `/contact/` and form-processing endpoints from full-page caches. Ensure `/contact/` contains `[sop_proposal_form]`. The theme also replaces the imported static form automatically. If importing the WXR file, import as drafts and select the reviewed pages deliberately. Do not replace or delete existing posts and archives in bulk.
6. Configure WordPress Address and Site Address for the real production URL. Verify Yoast/Rank Math/core sitemaps use the real domain. The theme removes temporary sitemap discovery links from virtual robots.txt; a physical robots.txt file must be corrected separately on the host. Purge the SEO plugin’s sitemap and page cache after changing the domain.
7. Imported pages remain protected unless `sop_release_status` is `APPROVED`. Review their content and permissions before changing that status. Existing unrelated WordPress content is not subject to that import guard.
8. Confirm production HTTPS, indexing, canonicals, booking availability, mobile/keyboard behaviour and analytics. The configured Calendly link is shared by all call CTAs.

WordPress retains existing content and URLs. `quality/redirects.json` is intended for a standalone migration; do not apply it automatically over existing WordPress posts.

## Standalone

1. Review `quality/LIVE_URL_MIGRATION_INVENTORY.csv`. Keep or map every existing URL. Twenty-one direct equivalents are supplied in `quality/redirects.json`; 48 other paths still need attention. Do not redirect unrelated articles or all archives to the homepage.
2. Complete the actual approvals in `quality/release-approvals.json`, select `STANDALONE`, and list the approved page URLs. Do not mark checks complete without the corresponding evidence.
3. Build a fresh release with `python scripts/build_release.py --out standalone/release/site`. The builder rejects missing signoffs, unresolved existing URLs, redirect chains and links to held pages. It generates production robots.txt, a sitemap, redirects and a release marker. Source files remain noindex.
4. Copy `standalone/.env.example` to `standalone/.env` privately and set real credentials. Never add it to Git. Production requires a strong form secret, secure cookies, the expected hostname, persistent storage and mail configuration.
5. From `standalone/deploy/`, run `docker compose build` and `docker compose up -d`. The Docker image copies `backend/` and the approved `release/site/`, not unreviewed source pages. The proxy waits for the application health check.
6. Verify `/api/health`, submit a real request, check its stored reference and actual inbox delivery, then test a container restart and database restore. A configured SMTP connection alone does not prove inbox receipt.

The included Python server is a reference application behind the provided HTTPS reverse proxy. Hosting capacity, patching, spam protection and operational security still need validation on the selected host.

## Recovery and operations

Use the same private environment variables as the running application:

- `python standalone/backend/serve.py --retry-notifications` retries saved requests whose notification failed. A nonzero exit indicates remaining failures; schedule and monitor this command on the host.
- `python standalone/backend/serve.py --backup-db /private/backups/new-backup.sqlite3` creates a consistent database backup. Use a new path outside the public web root; protect and encrypt backups off-host.
- `python standalone/backend/serve.py --export-leads /private/exports/enquiries.csv` exports administrator records. Treat exports as private data.

For WordPress, configure a reliable host cron for WP-Cron, monitor the SEO enquiries screen, and include the database in encrypted backups. Failed mail notifications do not delete saved requests.

## Measurement

Both implementations emit `quote_request_success` and `discovery_call_click` to `dataLayer`. Events contain no submitted names, email addresses, URLs or message text. No analytics provider, advertising pixel or consent assumption is added. Connect the actual analytics property and required consent behaviour on the production host, then verify events in its debugger.

## Rollback

Keep the prior theme, database and server configuration until the new deployment is verified. Restore the prior application and configuration if forms, routing or indexing fail. Preserve enquiries collected after the backup rather than overwriting the lead store during rollback.
