# SEO Outsourcing Philippines — WordPress agency build

## What this is

An **installable Blocksy child theme** plus an optional **client-permission-controlled case-study plugin**, designed for WordPress rather than the prior Next.js preview.

It is based on the **service-business information architecture** of the official Blocksy **Web Agency** starter site. It does **not** bundle Blocksy's copyrighted demo content, demo photography, paid Web Studio design, or the Onum paid theme. The Blocksy parent theme is installed separately from WordPress.org. You can import the official free Web Agency starter site on a fresh test site if you want its baseline editable Gutenberg content.

- Official starter: https://creativethemes.com/blocksy/starter-site/web-agency/
- Official importer: https://creativethemes.com/blocksy/docs/general/install-demo-contents/

### Included

- `sop-blocksy-agency.zip`: installable Blocksy **child theme**, all page layouts and front-end assets
- `sop-case-studies.zip`: optional, installable WordPress plugin with industry/outcome filters and client-permission gates
- `preview/`: renders of the actual PHP theme templates for visual QA (screenshots generated using minimal WP stubs, **not** a live WordPress instance)
- `docs/`: this guide, QA and URL migration guidance

## Installation: fresh STAGING WordPress site

1. Back up existing live WordPress database, files, plugins, themes and current URLs. **Do not run a demo importer on a populated live site.**
2. In the staging WP admin, **Appearance → Themes → Add New**, install and activate **Blocksy** (free). Install **Blocksy Companion** when offered.
3. Optional: **Blocksy → Starter Sites → Web Agency → Gutenberg → Import**. Follow the official wizard. This may create pages or demo media, so use an empty staging install; replace/delete all demonstration content and imagery before publishing.
4. Upload the supplied `sop-blocksy-agency.zip` using **Appearance → Themes → Add New → Upload Theme**, then activate it. The parent Blocksy theme must remain installed. This child theme supplies the custom homepage, menus, inner-page layouts, sticky CTA, accessibility styles and form.
5. Upload and activate `sop-case-studies.zip` in **Plugins → Add New → Upload Plugin** if case studies are needed. It starts empty, with approval controls; no fictional case studies are included.
6. Create pages as drafts using WordPress editor or the optional **WP-CLI only** helper `scripts/bootstrap-drafts.php` (see below). **No pages are created/published automatically when activating the theme**.
7. Review the full content, page hierarchy, mobile form, footer links, site identity, legal pages and launch blockers before turning any page live.

### WordPress page slugs

| Page | URL | Template behavior |
|---|---|---|
| Home | `/` | `front-page.php` once selected under Settings → Reading |
| Services | `/services/` | Services hub |
| Service detail | `/services/technical-seo/` and 12 others | Data-driven deliverables, roadmap, tools and FAQ |
| Our work | `/results/` | Source-labeled observations, permission-cleared case studies |
| Case studies | `/case-studies/` | **Plugin archive**, not a WordPress Page |
| Blog | `/blog/` | Posts index template (set under Settings → Reading) |
| Individual post | `/blog/post-slug/` | Standard single-post template with sticky TOC; configure post permalink base as needed |
| About | `/about/` | Agency profile, standards, evidence rules |
| Talent / recruiting | `/talent/` | Standards and genuine career enquiries only |
| Pricing | `/pricing/` | Draft tier comparison, buyer checklist |
| For agencies | `/for-agencies/` | White-label partner path |
| For businesses | `/for-businesses/` | Direct-business path |
| Contact | `/contact/` | Enquiry form and optional verified booking embed |
| Book Discovery Call | `/book-discovery-call/` | Same verified contact template; **no instant reservation unless configured** |

**Important:** Existing `blog/...` content is stored as draft WordPress pages in the previous import and must be carefully migrated to Posts (or retained as Pages) without changing URLs or duplicating canonicals. Do not set an existing Blog parent Page as the Posts index until nested URL conflict is resolved.

## Optional creation of drafts through WP-CLI

Run on backed-up staging after the theme is active:

```sh
wp eval-file wp-content/themes/sop-blocksy-agency/scripts/bootstrap-drafts.php
```

This creates missing pages **as drafts only** and skips existing pages. It does not import or modify the existing 66-page export.

## Production form configuration

The theme supplies a small, secure WordPress enquiry form in the homepage hero and a longer form on Contact.

It uses a nonce, honeypot, required consent checkbox, field allowlists, basic rate limiting, HTTP-safe same-site redirect, and `wp_mail()` delivery. No lead data is stored in the WordPress database by the theme.

In `wp-config.php`, set the **real verified receiving inbox**:

```php
define('SOP_LEADS_EMAIL', 'verified-recipient@yourdomain.example');
```

Replace the placeholder with the actual tested inbox. If unconfigured, the form is **disabled** and an email fallback is shown; it does not pretend to submit. Configure reliable SMTP and verify at least one real end-to-end lead on staging and after deployment. A successful `wp_mail()` response is not proof of final inbox delivery.

If available, provide only a verified HTTPS booking URL:

```php
define('SOP_BOOKING_URL', 'https://calendly.com/your-account/intro');
// Optional inline embed for a verified Calendly or Cal.com URL:
define('SOP_BOOKING_EMBED_URL', 'https://calendly.com/your-account/intro');
```

No calendar embed is rendered until configured.

## SEO, privacy, and launch approval

The homepage contains the exact H1 **SEO Outsourcing Philippines**. The site uses semantic HTML, links to important services, responsive layouts, WordPress's native routing, article templates, title-tag support and a limited Organization JSON-LD fallback when no SEO plugin is active.

**Noindex release gate:** The new theme intentionally sends `noindex,nofollow` until an authorized site owner explicitly adds to `wp-config.php`:

```php
define('SOP_AGENCY_RELEASE_APPROVED', true);
```

**DO NOT set this until the website is legally and operationally approved.** An SEO plugin should manage canonicals, metadata, Open Graph, Article markup, and XML sitemaps. Test the indexability and avoid duplicate schema/meta when Yoast, Rank Math or AIOSEO is enabled.

Case studies are draft-only until written client permission and verified performance evidence are confirmed; testimonials have an independent permission flag. The ranking snapshots in `/results/` are *observations* from the old source, **not** agency-attributed ROI.

**Outstanding approvals:** legal contracting party, verified team identity and photography, pricing, client results/quotes/attribution, updated privacy policy, contact delivery, redirect map and legacy published URL equivalence.

## Before publication

1. Test the actual **WordPress staging site** with Blocksy installed. This package was PHP-linted and HTML-screenshot tested but was **not** installed on an authenticated WordPress server in this environment.
2. Confirm every permalink, breadcrumb, 301, canonical, H1, index/noindex and sitemap URL against the currently indexed domain.
3. Test forms in the real SMTP and CRM workflow. Verify `service`, `audience`, industry and requested plan where applicable.
4. Replace all demo content and add only properly authorized case studies, logos, team photographs and business claims.
5. Run a WCAG accessibility review, keyboard and mobile testing on the actual WordPress installation, and a Lighthouse/real-web-vitals audit.
6. Back up and prepare rollback before enabling production routing.

**The GitHub source branch and theme ZIP do not deploy or modify the live website.**
