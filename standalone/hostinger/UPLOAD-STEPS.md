# Hostinger upload — SEO Outsourcing Philippines

This package runs on Hostinger Web Hosting with PHP 8.2+ and OpenSSL. No Node, Python, Docker or WordPress is required on the server. The original hero is unchanged. The 76 known live URLs are retained or redirected; the package contains 115 pages. No live credentials are bundled.

## 1. Back up before replacing anything

In hPanel, Websites → Dashboard for seooutsourcingphilippines.com → Backups. Download a full files backup AND the WordPress database backup. Keep both on your computer. Record your current PHP version. Also download the current public_html/.htaccess. Do not delete the database.

## 2. Prepare mail and PHP

In PHP Configuration select PHP 8.3 or a newer supported version, with OpenSSL enabled. In your email provider's setup screen copy the outgoing SMTP hostname, port, encryption type, username and password. These are mail credentials, not your Hostinger account password. The sender must be an address permitted by that account.

## 3. Upload to the correct folders

Extract the ZIP on your computer. In File Manager, open the domain directory that CONTAINS public_html. The final layout must be:

    domain directory/
      public_html/
        index.html
        .htaccess
        api/index.php
        assets/
        contact/index.html
        ...other site folders...
      sop-private/
        config.php
        maintenance.php
        publish.php
        pages.json
        vendor/

Move the old WordPress files from public_html into a dated backup folder OUTSIDE public_html after making your downloadable backups. Then upload the CONTENTS of the package's public_html into the real public_html, including .htaccess. Do not nest public_html inside public_html. Upload sop-private BESIDE public_html. Never put sop-private, the ZIP, backups or configuration files inside public_html. Do not merge the old WordPress .htaccess into the supplied one. No DNS change is needed if this domain already points to this Hostinger website.

If File Manager opens directly inside public_html, navigate up one level before creating sop-private. If the account prevents that, stop: do not move private settings into a public folder.

## 4. Configure the quote form

Edit sop-private/config.php with File Manager's editor:

- Keep the generated secret unchanged.
- Set recipient to the inbox where you want enquiries.
- Set smtp_host, smtp_username, smtp_password and smtp_from to actual provider values.
- Use smtp_port 465 with smtp_encryption ssl, or 587 with tls, as specified by your provider.
- Set enabled to true. Save. Do not share this file or commit it to Git.

Keep sop-private readable/writable only by your hosting account (directory 700, private files 600 where supported). Ensure HTTPS/Force HTTPS is enabled in hPanel and clear LiteSpeed/CDN cache. Exclude /api/* from all caching. The PHP session and API responses already send no-store headers.

## 5. Test before opening indexing

Open https://seooutsourcingphilippines.com/api/health — expected {"ok":true}. If it returns 503, check the private config and dependency folder. No settings or passwords are exposed by this endpoint.

Open the homepage and click Get a Quote. Submit a clearly marked test enquiry with an email you control. A successful request displays a reference number. Confirm the notification ARRIVES in the recipient inbox and Reply addresses the submitted email. Check spam too. A saved reference alone does not prove inbox delivery. The form stores requests privately before trying SMTP, so a mail failure will not lose a saved enquiry.

Test the contact-page form separately. Check discovery-call links, mobile navigation and all project selectors. Test /seo-case-studies/ → /results/, /technical-seo-outsourcing/ → /services/technical-seo/ and the other paths in REDIRECTS.json: each must be an HTTP 301 to its listed target. Check old article paths against URL-INVENTORY.csv. A nonexistent URL must return HTTP 404. Check www and HTTP redirect to https://seooutsourcingphilippines.com while preserving the path.

Try opening /sop-private/config.php and /api/common.php through a browser: neither may display credentials or source code. The actual private directory is outside the web root.

## 6. Schedule notification recovery and retention

In hPanel → Cron Jobs, create a PHP job every 10 minutes pointing to the FULL absolute path of sop-private/maintenance.php. Obtain the path from File Manager; do not copy an example account ID. This retries saved notifications up to five total attempts and removes enquiries older than 90 days. A nonzero exit reports pending/exhausted notifications. Check cron output and the hosting error log. Enquiry content and passwords are never written into these logs.

Enable Hostinger backups that cover BOTH public_html and sop-private. Download an extra private copy after the first successful form test and verify that it can be restored outside the live site. Restoring the website must not overwrite new enquiries collected since a backup.

## 7. Enable search indexing after the tests pass

Until this step, pages remain noindex deliberately. Review the published service/pricing terms, policies, testimonial permissions and ranking material before publication. Fictional mockup testimonials are excluded on the production domain.

In Cron Jobs, temporarily run a PHP job for the full path to sop-private/publish.php with argument --publish. If the PHP UI cannot accept arguments, use the Custom command type: the hosting PHP executable followed by the full private script path and --publish. Use the PHP executable path provided by hPanel, not a guessed server path. Run once, confirm output says "Indexing enabled for 115 pages", then remove this one-time job. Keep the maintenance job.

Verify page source contains index,follow; /robots.txt allows crawling and lists the real-domain /sitemap.xml; the sitemap contains 115 URLs and no temporary hostname. /sitemap_index.xml and /wp-sitemap.xml redirect to it. Submit /sitemap.xml to Search Console. No analytics provider has been silently installed; connect your existing measurement property separately if needed.

## Rollback

If a check fails, restore the backed-up public_html files and original .htaccess. Leave the old WordPress database intact. Keep sop-private and any new enquiries when rolling back. Do not overwrite the enquiry folder with an older backup. This ZIP has been tested locally, not against your private Hostinger SMTP account; the real-host inbox and redirect tests above are still required.
