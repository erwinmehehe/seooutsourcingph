# SEO Outsourcing Philippines

Source code for [SEOOutsourcingPhilippines.com](https://seooutsourcingphilippines.com/).

**66-page website source, prepared for direct commits to `main`.** No staging branch is required.

> GitHub is source control, not hosting. Pushing to `main` does not change the live website unless a deployment integration is separately configured.

## Project structure

- `standalone/site/`: 66-page static frontend and its assets
- `standalone/backend/`: optional Python form processing API
- `standalone/deploy/`: example Docker/Caddy deployment configuration
- `wordpress/sop-premium-agency/`: WordPress theme
- `wordpress/sop-proposal-form/`: WordPress enquiry plugin
- `wordpress/wordpress-full-layout-DRAFT.xml`: 60 WordPress draft records
- `quality/`: page and Australia-sector editorial sign-offs
- `scripts/check_site.py`: automated content/SEO and internal-link QA

### Upload directly to GitHub main

Extract the whole ZIP and run **`UPLOAD_TO_GITHUB_MAIN_WINDOWS.ps1`** in PowerShell, or **`bash UPLOAD_TO_GITHUB_MAIN_MAC_LINUX.sh`** on macOS/Linux. See [`IMPORT_TO_GITHUB.md`](IMPORT_TO_GITHUB.md) for exact instructions.

### Choose one publishing platform

The `wordpress/` and `standalone/` folders are **alternatives**, not two sites to deploy simultaneously. See [`DEPLOYMENT.md`](DEPLOYMENT.md) before going live.

**Not yet a cleared public launch:** The package intentionally includes `noindex`/restrictive robots settings and draft WordPress content. Verify the legal operator, real team and client proof rights, form delivery, privacy policies, indexed URL migration and Australian industry copy before publication. These do **not** prevent putting the source on GitHub.

**Security:** This is a public repository. Do not commit contact leads, WordPress credentials, `.env`, private client reports or production secrets.
