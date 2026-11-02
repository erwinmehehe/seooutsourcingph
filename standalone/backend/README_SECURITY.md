# Operational security checklist

This Python server is a reference implementation and local QA backend, **not** an audited production platform. It serves the `site/` directory and stores requests in a SQLite database under `SEO_LEADS_DATA_DIR` outside the web root. A missing SMTP_HOST does not block storage but does block notifications.

Before using in production: select a production-approved application server / reverse proxy, require HTTPS and secure cookies, configure environment variables privately, authenticate admin exports, monitor failures, add deployment-level spam/rate controls and backups, test actual inbox delivery, and review retention, data-subject rights, consent and cross-border processing with counsel. Never expose `backend/`, `.env` or the SQLite file as static assets. Do not point the public website at this preview server until reviewed.
