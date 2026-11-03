# SEO Outsourcing Philippines

Source code for [SEOOutsourcingPhilippines.com](https://seooutsourcingphilippines.com/).

**66-page site, plus a standalone discovery-call request page, prepared for direct commits to `main`.** No staging branch is required.

> GitHub is source control, not hosting. Pushing to `main` does not change the live website unless a deployment integration is separately configured.

## Project structure

- `standalone/site/`: 67-page static frontend and assets, including a noindex discovery-call request page at `/book-discovery-call/`
- `standalone/backend/`: optional Python form processing API
- `standalone/deploy/`: example Docker/Caddy deployment configuration
- `wordpress/sop-premium-agency/`: WordPress theme
- `wordpress/sop-proposal-form/`: WordPress enquiry plugin
- `wordpress/wordpress-full-layout-DRAFT.xml`: WordPress draft export; discovery-call page is not yet mirrored
- `quality/`: page and Australia-sector editorial sign-offs
- `scripts/check_site.py`: automated content/SEO and internal-link QA

### Upload directly to GitHub main

Extract the whole ZIP and run **`UPLOAD_TO_GITHUB_MAIN_WINDOWS.ps1`** in PowerShell, or **`bash UPLOAD_TO_GITHUB_MAIN_MAC_LINUX.sh`** on macOS/Linux. See [`IMPORT_TO_GITHUB.md`](IMPORT_TO_GITHUB.md) for exact instructions.

### Choose one publishing platform

The `wordpress/` and `standalone/` folders are **alternatives**, not two sites to deploy simultaneously. See [`DEPLOYMENT.md`](DEPLOYMENT.md) before going live.

**Discovery calls:** The `/book-discovery-call/` page provides an email request only, not live appointment booking. Connect a verified scheduling URL before presenting it as an instant calendar reservation. The WordPress theme does not yet include this standalone-only page.\n\n**Not yet a cleared public launch:** The package intentionally includes `noindex`/restrictive robots settings and draft WordPress content. Verify the legal operator, real team and client proof rights, form delivery, privacy policies, indexed URL migration and Australian industry copy before publication. These do **not** prevent putting the source on GitHub.

**Security:** This is a public repository. Do not commit contact leads, WordPress credentials, `.env`, private client reports or production secrets.

## Australian programmatic SEO pilot

The `/australia/` hub and its five specialist workstream pages are built from `pseo/australia/pages.json`. They are substantive, original agency-procurement pages, **not automatic state/suburb permutations**.

- Generator: `node scripts/generate_au_pseo.cjs --check`
- Editorial/duplicate guard: `python3 scripts/au_pseo_quality.py`
- WordPress mirror: `wordpress/wordpress-full-layout-DRAFT.xml` (66 drafts total)
- Keyword and release register: `quality/AU_PSEO_KEYWORD_OPPORTUNITIES.csv`
- Review policy: `quality/AU_PSEO_EDITORIAL_AND_KEYWORD_GATE.md`

**Do not index these pages until Australian query demand and competition are validated, an accountable editor approves the specialist content, and the actual production form and legal/data handling are tested.** The present build keeps every new page `noindex`.
