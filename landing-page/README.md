# Homepage design

Editable React source for the standalone homepage. Other routes and the WordPress theme retain their existing implementations.

Run `npm ci`, then `npm run build` in this directory. The build prerenders the complete page into `../standalone/site/index.html`, with CSS, JavaScript, fonts and logos embedded. Content remains readable without JavaScript. `npx tsc --noEmit` checks types.

Preview the generated page and existing enquiry API with `python standalone/backend/serve.py --port 5181` from the repository root. Enable submissions locally with `SEO_FORM_ENABLED=1`; keep the lead database outside source control. Production form activation, SMTP and hosting settings remain controlled by the existing backend configuration. GitHub Pages provides a static preview and cannot receive submissions.

The quote dialog uses the same-origin `/api/session` and `/api/inquiry` endpoints. It reports success only after the API returns a saved reference, retains entries after an error and offers direct email. The fixed bottom CTA contains only the discovery call.

Portfolio keyword positions come from the supplied Erwin Valles SEO Portfolio PDF, dated 9 November 2026. They are snapshots, not before/after traffic or revenue claims. The restored hero chart is labelled illustrative and is not client data. No project responsibilities, growth figures or delivery quantities have been invented. Pacific Seed Bank uses a text fallback because its logo was unavailable.

The homepage remains noindex pending the repository’s release process. The existing WordPress export has not been updated to mirror this standalone design.
