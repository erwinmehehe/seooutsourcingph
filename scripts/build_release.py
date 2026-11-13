#!/usr/bin/env python3
"""Fail-closed production release builder. Does not deploy to hosting."""
import argparse
try:
    from scripts.ga4_tag import inject_ga4
except ModuleNotFoundError:  # Direct CLI invocation from scripts/
    from ga4_tag import inject_ga4
import csv
import json
import re
import shutil
import sys
from pathlib import Path
from urllib.parse import urlsplit, urljoin, unquote
from xml.sax.saxutils import escape
from html.parser import HTMLParser

ROOT = Path(__file__).resolve().parent.parent
SITE = ROOT / "standalone/site"
MANIFEST = ROOT / "quality/release-approvals.json"
DOMAIN = "https://seooutsourcingphilippines.com"
REDIRECTS = ROOT / 'quality/redirects.json'
MIGRATION = ROOT / 'quality/LIVE_URL_MIGRATION_INVENTORY.csv'
REQUIRED_SIGNOFFS = (
    'legal_operator_verified', 'named_delivery_owner_confirmed',
    'ranking_and_image_permissions_verified', 'pricing_and_scope_approved',
    'privacy_and_terms_approved', 'live_form_inbox_test_passed',
    'security_and_backup_review_passed', 'analytics_and_consent_test_passed',
    'accessibility_mobile_review_passed', 'existing_url_redirects_reviewed',
    'australian_regulated_content_reviewed',
)

class Links(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []
    def handle_starttag(self, tag, attributes):
        data = dict(attributes)
        if tag == "a" and data.get("href"):
            self.links.append(data["href"])

def url_for(file):
    relative = file.relative_to(SITE)
    return "/" if relative.as_posix() == "index.html" else "/" + relative.parent.as_posix() + "/"

def review():
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    pages = {url_for(f): f for f in SITE.rglob("index.html")}
    problems = []
    if manifest.get("release_status") != "APPROVED":
        problems.append("Release status is HOLD; no public build is authorized.")
    if manifest.get("production_platform") != "STANDALONE":
        problems.append("Production platform is not explicitly approved as STANDALONE.")
    for key in REQUIRED_SIGNOFFS:
        if manifest.get("signoffs", {}).get(key) is not True:
            problems.append("Missing human approval: " + key)
    approved = set(manifest.get("approved_urls") or [])
    if not approved:
        problems.append("No URL is approved for public indexing.")
    elif '/' not in approved:
        problems.append("The homepage must be included in a public release.")
    for url in approved:
        if url not in pages: problems.append("Approved URL missing from website: " + str(url))
    redirects = json.loads(REDIRECTS.read_text(encoding='utf-8')) if REDIRECTS.exists() else {}
    for source, target in redirects.items():
        if not source.startswith('/') or source.startswith('//') or not target.startswith('/') or target.startswith('//'):
            problems.append('Redirect paths must be same-site paths: ' + source)
        elif source == target or target in redirects:
            problems.append('Redirect loop or chain: ' + source)
        elif target not in approved:
            problems.append('Redirect target is not approved: ' + target)
    if MIGRATION.exists():
        with MIGRATION.open(encoding='utf-8', newline='') as file:
            for row in csv.DictReader(file):
                path = row['path']
                if path not in approved and path not in redirects:
                    problems.append('Existing URL needs content retention or an explicit redirect: ' + path)
    # Withheld pages cannot be referenced by the public release. Fix nav or obtain page sign-off.
    for url in approved & pages.keys():
        p = Links()
        p.feed(pages[url].read_text(encoding="utf-8"))
        for link in p.links:
            parts = urlsplit(link)
            if parts.netloc and parts.netloc not in ("seooutsourcingphilippines.com","www.seooutsourcingphilippines.com"): continue
            if not parts.path: continue
            dest = unquote(urlsplit(urljoin(DOMAIN + url, link)).path)
            if dest.startswith("/assets/"): continue
            if "." in dest.rsplit("/",1)[-1]: continue
            dest = dest if dest.endswith("/") else dest + "/"
            dest = redirects.get(dest, dest)
            if dest not in approved:
                problems.append(url + " links to held page " + dest)
    for path in SITE.rglob("*.html"):
        text = path.read_text(encoding="utf-8")
        if "hostingersite.com" in text:
            problems.append("Temporary hostname found: " + str(path.relative_to(SITE)))
    return pages, approved, list(dict.fromkeys(problems))

def enable_indexing(html, url):
    # Accept either attribute order and both staging noindex policies.
    pattern = r"<meta\b[^>]*>"
    found = []
    def replace(match):
        tag = match.group(0)
        if re.search(r"\bname\s*=\s*[\"']robots[\"']", tag, re.I):
            found.append(tag)
            return '<meta name="robots" content="index,follow,max-image-preview:large"/>'
        return tag
    result = re.sub(pattern, replace, html, flags=re.I)
    if len(found) != 1:
        raise RuntimeError("Expected one robots meta tag: " + url)
    return result


def main():
    ap = argparse.ArgumentParser(description="Review signoffs or build a standalone production directory; never deploys.")
    ap.add_argument("--audit", action="store_true", help="Report release blockers without changing files (returns success).")
    ap.add_argument("--out", type=Path, help="Output directory for an approved build.")
    args = ap.parse_args()
    if not args.audit and args.out is None:
        ap.error("Use --audit or provide --out.")
    pages, approved, problems = review()
    print("Release inspection:",len(pages),"site pages,",len(approved),"approved URLs.")
    if problems:
        for problem in problems[:70]: print("BLOCKED:",problem)
        if len(problems)>70: print("...more issues:",len(problems)-70)
        if args.audit: return 0
        return 2
    if args.audit:
        print("All release signoffs present. No files changed.")
        return 0
    out = args.out.resolve()
    if out == SITE.resolve() or out == ROOT.resolve() or SITE.resolve() in out.parents:
        print("BLOCKED: output must not overwrite project or source.")
        return 2
    if out.exists() and any(out.iterdir()):
        print("BLOCKED: output directory must be empty.")
        return 2
    out.mkdir(parents=True, exist_ok=True)
    shutil.copytree(SITE/"assets",out/"assets")
    for url in sorted(approved):
        source = pages[url]
        target = out/("index.html" if url=="/" else url.lstrip("/")+"index.html")
        target.parent.mkdir(parents=True,exist_ok=True)
        html = source.read_text(encoding="utf-8")
        html = enable_indexing(html, url)
        html = inject_ga4(html)
        if url == "/" and 'name="google-site-verification"' not in html:
            if "</head>" not in html:
                raise RuntimeError("Homepage head not found for Search Console verification")
            html = html.replace("</head>", '<meta name="google-site-verification" content="zjY_Lrg-eC1N8fPXARPBeYg2otuitmqG4l2jyAntTTo" /></head>', 1)
        target.write_text(html,encoding="utf-8")
    shutil.copy2(SITE/"404.html",out/"404.html")
    (out/"robots.txt").write_text("User-agent: *\nAllow: /\nSitemap: "+DOMAIN+"/sitemap.xml\n",encoding="utf-8")
    nodes="".join("<url><loc>"+escape(DOMAIN+url)+"</loc></url>" for url in sorted(approved))
    (out/"sitemap.xml").write_text('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+nodes+"</urlset>",encoding="utf-8")
    (out/".release-ready.json").write_text(json.dumps({"domain":DOMAIN,"approved_urls":sorted(approved)},indent=2),encoding="utf-8")
    # Preserve the former WordPress sitemap endpoint after a standalone migration.
    redirects = json.loads(REDIRECTS.read_text(encoding='utf-8')) if REDIRECTS.exists() else {}
    redirects['/sitemap_index.xml'] = '/sitemap.xml'
    (out/"redirects.json").write_text(json.dumps(redirects,indent=2),encoding="utf-8")
    print("Built approved public files at",out,":",len(approved),"pages. Deployment is a separate action.")
    return 0

if __name__ == "__main__":
    sys.exit(main())
