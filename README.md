# SEO Outsourcing Philippines

Website source for [seooutsourcingphilippines.com](https://seooutsourcingphilippines.com/).

**GitHub workflow: push directly to `main`. No staging branch is required.**

The prepared website archive contains 60 pages, ten new Australian industry pages plus an Australia industry hub, a WordPress theme and form plugin, optional standalone Python backend, and editorial QA files.

## Get the website into this repository

Download **SEO_Outsourcing_Philippines_Direct_Main_GitHub_60_Pages.zip** from the current ChatGPT conversation, extract it fully, then run the platform-specific uploader at the root of the extracted files:

- Windows: `UPLOAD_TO_GITHUB_MAIN_WINDOWS.ps1`
- macOS/Linux: `bash UPLOAD_TO_GITHUB_MAIN_MAC_LINUX.sh`

The uploader checks site structure, clones this repository, copies the source and pushes it directly to `origin/main`. See [IMPORT_TO_GITHUB.md](IMPORT_TO_GITHUB.md) for commands.

Expected folders after upload:

- `standalone/site/`: website HTML, CSS and assets
- `standalone/backend/`: standalone form API (optional deployment path)
- `wordpress/sop-premium-agency/`: WordPress theme
- `wordpress/sop-proposal-form/`: WordPress contact plugin
- `wordpress/wordpress-full-layout-DRAFT.xml`: WordPress draft content
- `quality/`: editorial gates, keyword maps and QA reports
- `scripts/check_site.py`: structural website tests

**GitHub is source control, not hosting.** Committing the files does not replace or deploy the live site unless a deployment workflow is separately configured.

**Content launch restrictions:** Website files intentionally include restrictive indexing settings and WordPress drafts. Publishing requires real business and client-evidence approvals, legal/privacy review, production form validation, and migration checks. Do not commit .env files, lead databases, WordPress secrets or private client content; this repository is public.
