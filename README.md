# SEO Outsourcing Philippines — Website

Repository for the planned **SEOOutsourcingPhilippines.com** website.

**Status: staging / launch review. Not deployed to the live domain.**

## Website package

The current project is a 60-page draft website, including:

- Homepage and company pages
- Commercial SEO outsourcing service pages
- Seven existing industry pages plus an Australia industry hub and ten Australian sector pages
- Blog/resources library
- WordPress theme, proposal-form plugin and draft-content import
- Standalone static site with a Python form backend, intended as an **alternative** deployment path

**Do not deploy both WordPress and the standalone server to the same public URL.** Select a single production platform first.

## Recommended repository structure

```
wordpress/
  sop-premium-agency/    # companion WordPress theme
  sop-proposal-form/     # proposal form plugin
  wordpress-full-layout-DRAFT.xml
standalone/
  site/                  # static pages and assets
  backend/               # optional Python service, not for WordPress
  deploy/
quality/
previews/
README.md
```

## Launch restrictions

1. **Preserve existing indexed URLs.** Audit current redirects and canonical URLs before any migration.
2. Staging documents contain `noindex`. Do not blindly remove it for unapproved pages.
3. Validate all legal policies against actual hosting, analytics and form data flows.
4. Do not publish illustrative team photographs, unauthorized client results, testimonials, or unsupported claims as fact.
5. Configure production proposal-form destination, sender reputation, consent, anti-spam, rate limiting and monitoring.
6. Test WordPress theme and plugin in a staging clone before production.
7. Run desktop, mobile, accessibility, performance, analytics and conversion tests before public launch.

## Adding the current website source

The initial 60-page build was prepared as a separate release archive in this ChatGPT conversation. Import its files into this repository, excluding runtime secrets, databases and staging logs. See the companion Git-ready package for a prearranged folder structure and import instructions.

Keep changes in a feature branch and review them before merging to `main`.

## Security

Never commit `.env` files, WordPress configuration, API keys, SMTP credentials, lead databases, user exports or client-confidential documents.
