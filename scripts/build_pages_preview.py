#!/usr/bin/env python3
"""Build a safe, non-indexable GitHub Pages preview of the standalone website.

The production-ready source in standalone/site is never modified. GitHub Pages
serves project sites under /<repository>/, so root-relative site links need a
prefix. The backend contact form is intentionally disabled in this static preview.
"""
from __future__ import annotations

import argparse
import os
import json
from pathlib import Path
import re
import shutil

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "standalone" / "site"
ROOT_ATTRIBUTE = re.compile(
    r'(?P<attr>\b(?:href|src|action|poster|data-src|data-href)\s*=\s*)(?P<quote>["\'])/(?!/)',
    flags=re.IGNORECASE,
)
CONTACT_FORM = re.compile(
    r'<form\b[^>]*\bid=["\']contact-form["\'][^>]*>.*?</form>',
    flags=re.IGNORECASE | re.DOTALL,
)
NOTICE = (
    '<aside role="note" aria-label="Temporary site preview" '
    'style="position:relative;z-index:1000;padding:9px 16px;'
    'background:#fff3d1;color:#192338;text-align:center;'
    'font:600 13px/1.5 system-ui,sans-serif">'
    'Website preview. '
    'For quotes, email info@seooutsourcingphilippines.com.</aside>'
)
FORM_NOTICE = (
    '<div role="note" style="padding:24px;border:1px solid #8c83bb;'
    'border-radius:12px;background:#11182c;color:#edf2ff">'
    '<h2>Request a quote</h2>'
    '<p>Quote submissions are unavailable in this preview. '
    'Email <a href="mailto:info@seooutsourcingphilippines.com">'
    'info@seooutsourcingphilippines.com</a> with your website and requirements, '
    'or <a href="https://calendly.com/discovery-call-with-erwin" target="_blank" '
    'rel="noopener noreferrer">book a discovery call</a>.</p></div>'
)



def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--out", required=True, type=Path,
                        help="New output directory for GitHub Pages artifact")
    parser.add_argument("--repo-name", default=os.getenv("GITHUB_REPOSITORY", "erwinmehehe/seooutsourcingph").split("/")[-1])
    args = parser.parse_args()

    dest = args.out.resolve()
    source = SOURCE.resolve()
    if dest == source or source in dest.parents or dest in source.parents:
        parser.error("Output directory must not replace or contain source")
    if not re.fullmatch(r"[A-Za-z0-9._-]+", args.repo_name):
        parser.error("Invalid repository name")

    base_path = "/" if args.repo_name.endswith(".github.io") else f"/{args.repo_name}/"
    marker = dest / '.sop-preview.json'
    if dest.exists() and any(dest.iterdir()):
        if not marker.is_file() or json.loads(marker.read_text(encoding='utf-8')).get('source') != str(source):
            parser.error('Output is not an owned preview directory; choose a new empty directory')
        shutil.rmtree(dest)
    shutil.copytree(source, dest, dirs_exist_ok=True)
    marker.write_text(json.dumps({'source':str(source)}),encoding='utf-8')

    changed = 0
    form_count = 0
    for file in dest.rglob("*.html"):
        page = file.read_text(encoding="utf-8")
        page = ROOT_ATTRIBUTE.sub(
            lambda match: match.group("attr") + match.group("quote") + base_path,
            page,
        )
        if file.name == "404.html" and file.parent == dest:
            for old, new in (
                ('href="assets/site.css"', f'href="{base_path}assets/site.css"'),
                ('href="services/index.html"', f'href="{base_path}services/"'),
                ('href="blog/index.html"', f'href="{base_path}blog/"'),
                ('href="index.html"', f'href="{base_path}"'),
            ):
                page = page.replace(old, new)

        if file == dest / "index.html":
            page = page.replace('</head>', '<meta name="sop-quote-url" content="'+base_path+'contact/"/></head>', 1)
        page, replaced = CONTACT_FORM.subn(FORM_NOTICE, page)
        if replaced:
            page = page.replace("Use the form or email us directly.", "Email us directly.")
        form_count += replaced
        if "name=\"robots\"" not in page and "name='robots'" not in page:
            page = re.sub(r"<head>", '<head><meta name="robots" content="noindex,nofollow">', page, count=1, flags=re.I)
        page = re.sub(r"<body(?:\s[^>]*)?>", lambda match: match.group(0) + NOTICE, page, count=1, flags=re.I)
        file.write_text(page, encoding="utf-8")
        changed += 1

    (dest / ".nojekyll").touch()
    if changed < 60:
        raise SystemExit(f"Unexpectedly found only {changed} HTML pages. Refusing to deploy.")
    if form_count != 1:
        raise SystemExit(f"Expected exactly one backend contact form; found {form_count}. Refusing to deploy.")
    assert (dest / "index.html").exists()
    assert (dest / "assets" / "site.css").exists()
    print(f"Built {changed} non-indexable HTML pages for {base_path}; disabled {form_count} contact form.")


if __name__ == "__main__":
    main()
