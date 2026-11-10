# Homepage source

`npm run build` generates the standalone homepage, the WordPress homepage assets/template and the portfolio page. Both implementations share `src/App.tsx`; the original hero block is fingerprinted in `tests/original-hero.sha256`.

After building, run `python scripts/sync_wordpress.py` from the repository root. `npx tsc --noEmit` checks types. Generated WordPress assets are committed for hosts without Node.

The standalone quote modal uses `/api/session` and `/api/inquiry`. WordPress supplies a `sop-quote-url` meta tag, so the same buttons open its native contact form and retain the selected plan. GitHub Pages does not provide an enquiry backend.

Portfolio positions come from the supplied PDF dated 9 November 2026. They are snapshots, not growth or revenue claims. The original hero remains labelled illustrative. No client responsibilities, team biographies, testimonials or delivery quantities are invented.

See the root README and DEPLOYMENT.md for release, migration and hosting requirements.
