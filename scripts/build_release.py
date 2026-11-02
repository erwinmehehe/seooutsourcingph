#!/usr/bin/env python3
"""Fail-closed production release builder. Does not deploy to hosting."""
import argparse
import json
import re
import shutil
import sys
from pathlib import Path
from urllib.parse import urlsplit
from xml.sax.saxutils import escape
from html.parser import HTMLParser

ROOT = Path(__file__).resolve().parent.parent
SITE = ROOT / "standalone/site"
MANIFEST = ROOT / "quality/release-approvals.json"
DOMAIN = "https://seooutsourcingphilippines.com"

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
    for key, value in manifest.get("signoffs", {}).items():
        if value is not True: problems.append("Missing human approval: " + key)
    approved = set(manifest.get("approved_urls") or [])
    if not approved:
        problems.append("No URL is approved for public indexing.")
    for url in approved:
        if url not in pages: problems.append("Approved URL missing from website: " + str(url))
    # Withheld pages cannot be referenced by the public release. Fix nav or obtain page sign-off.
    for url in approved & pages.keys():
        p = Links()
        p.feed(pages[url].read_text(encoding="utf-8"))
        for link in p.links:
            parts = urlsplit(link)
            if parts.netloc and parts.netloc not in ("seooutsourcingphilippines.com","www.seooutsourcingphilippines.com"): continue
            dest = parts.path
            if not dest or dest.startswith("/assets/") or "." in dest.rsplit("/",1)[-1]: continue
            dest = dest if dest.endswith("/") else dest + "/"
            if dest not in approved:
                problems.append(url + " links to held page " + dest)
    return pages, approved, list(dict.fromkeys(problems))

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
        html,n = re.subn(r'<meta content="noindex,follow,max-image-preview:large" name="robots"/>',
                         '<meta content="index,follow,max-image-preview:large" name="robots"/>',html,count=1)
        if n!=1:
            raise RuntimeError("Expected one staging robots meta tag: "+url)
        target.write_text(html,encoding="utf-8")
    shutil.copy2(SITE/"404.html",out/"404.html")
    (out/"robots.txt").write_text("User-agent: *\nAllow: /\nSitemap: "+DOMAIN+"/sitemap.xml\n",encoding="utf-8")
    nodes="".join("<url><loc>"+escape(DOMAIN+url)+"</loc></url>" for url in sorted(approved))
    (out/"sitemap.xml").write_text('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+nodes+"</urlset>",encoding="utf-8")
    print("Built approved public files at",out,":",len(approved),"pages. Deployment is a separate action.")
    return 0

if __name__ == "__main__":
    sys.exit(main())
