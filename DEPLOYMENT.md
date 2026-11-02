# Production deployment guide (direct main branch)

The repository's primary branch is **`main`**. No staging branch is required. GitHub will contain source code; the live website is unchanged until hosting is configured and a release is approved.

## Option A: WordPress (when the live domain uses WordPress)

1. Back up the existing site, database, media, plugin configuration and permalink list.
2. Choose a maintenance window and rollback plan. You can use a temporary restricted preview on your host without creating a GitHub staging branch.
3. Install `wordpress/sop-premium-agency/` as a theme and `wordpress/sop-proposal-form/` as a plugin.
4. Import `wordpress/wordpress-full-layout-DRAFT.xml` as **drafts**. Assign the reviewed homepage and navigation without duplicating existing URLs.
5. Confirm the real contact email/CRM, WordPress mail and reply/consent settings. Test an inquiry end-to-end.
6. Verify legal/privacy pages, real company and team identity, authorized results and case-study images. Review all Australian regulated-industry content.
7. Confirm preservation of currently indexed URLs, redirects, SEO-plugin canonicals, sitemap, structured data and Analytics/Search Console.
8. Publish only approved pages and deliberately change their indexability. Do not globally lift `noindex`.

## Option B: Standalone

1. Deploy `standalone/site/` + `standalone/backend/` + `standalone/deploy/` together.
2. Populate secrets from examples **outside GitHub**. Do not use the static files alone if the contact form requires the API.
3. Configure HTTPS, request validation, SMTP/CRM notifications, secure persistent database storage, backups, monitoring and abuse protection.
4. Retain the default restrictive `robots.txt` and `noindex` until a reviewed sitemap and publication list are approved.
5. Test live site, including end-to-end forms, mobile accessibility, keyboard navigation, performance, metadata, redirects and analytics before announcing launch.

## Important

- GitHub Actions runs structural checks when the website source changes on main. It does **not** deploy to the public domain.
- Do not publish inaccurate legal policies, false staff identities or unsupported client claims.
- Preserve existing URLs and their search equity rather than replacing the live homepage without migration review.
