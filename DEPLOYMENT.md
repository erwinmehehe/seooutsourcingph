# Deployment plan — SEO Outsourcing Philippines

**Current status: PRE-LAUNCH.** This repository does not deploy or replace the production website automatically.

## Decision 1: select one production platform

### Option A: Existing WordPress hosting (recommended if the live site is already WordPress)
1. Clone the live site into private staging.
2. Import the 60 **draft** pages/posts from `wordpress/wordpress-full-layout-DRAFT.xml`.
3. Install the matching `wordpress/sop-premium-agency/` theme and `wordpress/sop-proposal-form/` plugin on staging.
4. Configure and test mail delivery, spam protection, GDPR/privacy notices, analytics, and backups.
5. Compare existing indexed URLs with the new permalink map; prepare redirects only where necessary.
6. Review content, legal policies, actual team identities, client proof permissions, mobile layouts and accessible navigation.
7. Publish only approved content, then selectively lift `noindex` and submit the correct production sitemap.

### Option B: Standalone site
- Deploy `standalone/site/` using the `standalone/backend/` Python app and `standalone/deploy/` configuration.
- Do not deploy the static `site/` folder alone if the contact form depends on the backend.
- Configure HTTPS, persistent secure lead storage, email/CRM, alerts, backups, request limits and correct host headers.
- Verify all URL redirects and page canonical behavior on staging before pointing DNS.

## Do not do these things
- Do not overwrite the current public homepage without checking the live URL inventory and backups.
- Do not remove `noindex` globally.
- Do not put `.env`, lead databases, WordPress administrator secrets, real customer records, or private reports in GitHub. **This repository is public.**
- Do not claim Australian offices, reviews, or project outcomes without proof.
- Do not publish draft legal policies or regulated-industry copy before qualified review.

## Go-live checks
- [ ] Confirm hosting approach and branch-to-deploy mapping
- [ ] Verify all approved pages and indexed URL redirects
- [ ] Confirm legal operator and contact details
- [ ] Obtain authentic team imagery and content approvals
- [ ] Secure permission to use tracked rankings and redacted case studies
- [ ] Verify privacy/cookie/terms against real form, analytics and hosting
- [ ] Test live contact submission, email/CRM receipt, spam and data deletion
- [ ] Browser test desktop, tablet, mobile and keyboard navigation
- [ ] Verify Core Web Vitals and security headers
- [ ] Validate robots, sitemap, canonicals and structured data
- [ ] Confirm Search Console and GA4 conversion measurement
- [ ] Approve staged release of Australian industry pages
