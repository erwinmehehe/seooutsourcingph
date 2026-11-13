#!/usr/bin/env python3
"""Build a safe, non-indexable GitHub Pages preview of the standalone website.

The production-ready source in standalone/site is never modified. GitHub Pages
serves project sites under /<repository>/, so root-relative site links need a
prefix. Quote requests use FormSubmit on Pages; the Hostinger source remains unchanged.
"""
from __future__ import annotations

import argparse
import os
import json
import hashlib
from pathlib import Path
import re
import shutil
from urllib.parse import urlsplit
from xml.sax.saxutils import escape

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
FORM_ENDPOINT = "https://formsubmit.co/info@seooutsourcingphilippines.com"


def static_form(match, base_path, public_origin):
    form = match.group(0)
    form = re.sub(r'action=["\'][^"\']*["\']', 'action="'+FORM_ENDPOINT+'"', form, count=1)
    form = re.sub(r'\snovalidate(?:=["\'][^"\']*["\'])?', '', form)
    form = re.sub(r'\sdisabled(?:=["\'][^"\']*["\'])?', '', form)
    form = form.replace('name="phone_confirm"', 'name="_honey"')
    hidden = ('<input type="hidden" name="_subject" value="SEO quote request"/>'
              '<input type="hidden" name="_template" value="table"/>'
              '<input type="hidden" name="_next" value="'+public_origin+base_path+'quote-request-sent/"/>')
    disclosure = ('<p class="small">Quote requests are processed by '
                  '<a href="https://formsubmit.co/privacy.pdf" target="_blank" rel="noopener noreferrer">FormSubmit</a> '
                  'and emailed to info@seooutsourcingphilippines.com. Do not include passwords or sensitive account information.</p>')
    return form.replace('</form>',hidden+disclosure+'</form>')



def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--out", required=True, type=Path,
                        help="New output directory for GitHub Pages artifact")
    parser.add_argument("--repo-name", default=os.getenv("GITHUB_REPOSITORY", "erwinmehehe/seooutsourcingph").split("/")[-1])
    parser.add_argument('--public-url', help='Actual URL supplied by actions/configure-pages')
    args = parser.parse_args()

    dest = args.out.resolve()
    source = SOURCE.resolve()
    if dest == source or source in dest.parents or dest in source.parents:
        parser.error("Output directory must not replace or contain source")
    if not re.fullmatch(r"[A-Za-z0-9._-]+", args.repo_name):
        parser.error("Invalid repository name")

    base_path = "/" if args.repo_name.endswith(".github.io") else f"/{args.repo_name}/"
    public_origin = "https://" + os.getenv("GITHUB_REPOSITORY", "erwinmehehe/seooutsourcingph").split("/")[0] + ".github.io"
    custom_domain = False
    if args.public_url:
        parts = urlsplit(args.public_url)
        allowed = {urlsplit(public_origin).hostname, 'seooutsourcingphilippines.com'}
        if parts.scheme != 'https' or parts.hostname not in allowed or parts.username or parts.password or parts.query or parts.fragment:
            parser.error('Unexpected Pages public URL')
        public_origin = 'https://' + parts.netloc
        base_path = parts.path.rstrip('/') + '/'
        custom_domain = parts.hostname == 'seooutsourcingphilippines.com'
        if custom_domain and base_path != '/': parser.error('Custom domain must use the domain root')
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
        # Saved WordPress articles use absolute internal links. Keep navigation
        # inside this Pages project without changing canonical/schema metadata.
        page = re.sub(
            r'(<a\b[^>]*\bhref\s*=\s*["\x27])https?://(?:www\.)?seooutsourcingphilippines\.com/',
            lambda match: match.group(1) + base_path, page, flags=re.I,
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
        page, replaced = CONTACT_FORM.subn(lambda m: static_form(m, base_path, public_origin), page)
        if replaced:
            page = page.replace("</head>", '<meta name="sop-static-form" content="formsubmit"/></head>', 1)
        if file == dest / 'privacy-policy/index.html':
            page = page.replace('<h2>Service providers</h2>', '<h2>Quote form processing</h2><p>On this GitHub Pages website, FormSubmit processes quote requests and emails them to us. Its documentation states that submission records are retained for 30 days. Its spam protection may require a CAPTCHA. <a href="https://formsubmit.co/privacy.pdf" target="_blank" rel="noopener noreferrer">Read FormSubmit’s privacy policy</a>.</p><h2>Service providers</h2>')
        form_count += replaced
        if "name=\"robots\"" not in page and "name='robots'" not in page:
            page = re.sub(r"<head>", '<head><meta name="robots" content="noindex,nofollow">', page, count=1, flags=re.I)
        if custom_domain and file.name != '404.html':
            page = re.sub(r'<meta\b[^>]*>', lambda m: '<meta name="robots" content="index,follow,max-image-preview:large"/>' if re.search(r'\bname=["\x27]robots["\x27]',m[0],re.I) else m[0],page,flags=re.I)
        file.write_text(page, encoding="utf-8")
        changed += 1

    # Keep existing navigation JS, but let the hosted form submit natively with validation.
    js = dest / "assets/site.js"
    script = js.read_text(encoding="utf-8")
    assert script.count("if (contact) {") == 1
    script = script.replace("if (contact) {", "if (contact && !document.querySelector('meta[name=\"sop-static-form\"]')) {")
    script += '''
if (document.querySelector('meta[name="sop-static-form"]')) {
 const form=document.querySelector('#contact-form');
 if(form){
  const params=new URLSearchParams(location.search);
  for(const key of ['audience','plan','service','industry']){
   const field=form.elements.namedItem(key), value=params.get(key);
   if(field && value && [...field.options].some(o=>o.value===value))field.value=value;
  }
 }
}
'''
    asset_name = 'pages-site-' + hashlib.sha256(script.encode()).hexdigest()[:12] + '.js'
    (dest / 'assets' / asset_name).write_text(script, encoding='utf-8')
    for file in dest.rglob('*.html'):
        html = file.read_text(encoding='utf-8')
        html = re.sub(r'assets/site\.js(?:\?[^"\x27]*)?', 'assets/'+asset_name, html)
        file.write_text(html, encoding='utf-8')
    contact = (dest / "contact/index.html").read_text(encoding="utf-8")
    thankyou = re.sub(r'<main\b.*?</main>', '<main id="main"><section class="page-hero"><div class="container"><h1>Thank you for your enquiry.</h1><p>Your quote request has been submitted. We’ll review your requirements and reply by email.</p><a class="btn" href="'+base_path+'">Back to home</a></div></section></main>', contact, count=1, flags=re.S)
    thankyou = thankyou.replace('Contact SEO Outsourcing Philippines | SEO Outsourcing Philippines','Quote request submitted | SEO Outsourcing Philippines')
    thankyou = re.sub(r'<meta\b[^>]*>', lambda m: '<meta name="robots" content="noindex,nofollow"/>' if re.search(r'\bname=["\x27]robots["\x27]',m[0],re.I) else m[0],thankyou,flags=re.I)
    thankyou = re.sub(r'<link\b[^>]*rel="canonical"[^>]*>', '<link rel="canonical" href="'+public_origin+base_path+'quote-request-sent/"/>', thankyou)
    target = dest / "quote-request-sent/index.html"; target.parent.mkdir(); target.write_text(thankyou, encoding="utf-8")
    # Pages cannot issue HTTP 301s; these compatibility pages forward old paths immediately.
    redirects = json.loads((ROOT / "quality/redirects.json").read_text(encoding="utf-8"))
    for source_path, target_path in redirects.items():
        target_url = base_path + target_path.lstrip("/")
        alias = dest / source_path.lstrip("/") / "index.html"
        alias.parent.mkdir(parents=True, exist_ok=True)
        alias.write_text('<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex,follow"><link rel="canonical" href="'+public_origin+target_url+'"><meta http-equiv="refresh" content="0;url='+target_url+'"><title>Page moved</title></head><body><a href="'+target_url+'">Continue to this page</a><script>location.replace('+json.dumps(target_url)+'+location.search+location.hash)</script></body></html>', encoding="utf-8")
    (dest / ".nojekyll").touch()
    if custom_domain:
        (dest/'CNAME').write_text('seooutsourcingphilippines.com\n')
        (dest/'robots.txt').write_text('User-agent: *\nAllow: /\nSitemap: '+public_origin+'/sitemap.xml\n')
        paths=['/' if p.parent==source else '/'+p.parent.relative_to(source).as_posix()+'/' for p in source.rglob('index.html')]
        sitemap='<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+''.join('<url><loc>'+escape(public_origin+p)+'</loc></url>' for p in sorted(paths))+'</urlset>'
        for name in ['sitemap.xml','sitemap_index.xml','wp-sitemap.xml','post-sitemap.xml','page-sitemap.xml','category-sitemap.xml']:
            (dest/name).write_text(sitemap,encoding='utf-8')
    if changed < 60:
        raise SystemExit(f"Unexpectedly found only {changed} HTML pages. Refusing to deploy.")
    if form_count != 1:
        raise SystemExit(f"Expected exactly one backend contact form; found {form_count}. Refusing to deploy.")
    assert (dest / "index.html").exists()
    assert (dest / "assets" / "site.css").exists()
    print(f"Built {changed} non-indexable HTML pages for {base_path}; connected {form_count} FormSubmit quote form; preserved {len(redirects)} old paths.")


if __name__ == "__main__":
    main()
