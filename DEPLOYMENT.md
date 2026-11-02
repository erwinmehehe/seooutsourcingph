# Deployment choices

No GitHub staging branch is needed. Work from `main` directly.

**The repo does not automatically deploy the website.** Choose exactly one platform:

**WordPress:** Use `wordpress/sop-premium-agency` (theme), `wordpress/sop-proposal-form` (plugin), and the 60-entry draft XML. Back up the existing site, preserve its indexed URLs, and approve the final homepage, legal pages, images, and contact delivery before publishing.

**Standalone:** Use `standalone/site`, `standalone/backend` and `standalone/deploy` together. Configure HTTPS, persistent private data, form notifications and backup/monitoring on your host. Do not expose credentials in GitHub.

**Pre-launch controls:** The prepared source uses `noindex` and a restrictive robots file intentionally. Remove restrictions only for URLs cleared for public launch. Verify client-result permissions, authentic team identity, Australian industry compliance, privacy and cookies, email/CRM submissions, Core Web Vitals, redirects, sitemap, schema and GA4/GSC.

This plan does not require a staging branch. A restricted hosting preview is optional, not a Git branch requirement.
