#!/usr/bin/env python3
"""Create an upload archive; private settings and mail dependencies stay outside public_html."""
import argparse, csv, hashlib, json, re, secrets, shutil, zipfile
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]

def build(out):
    if out.exists(): raise SystemExit('Choose a new output directory; existing files are never overwritten.')
    src=ROOT/'standalone/hostinger'
    if not (src/'vendor/autoload.php').is_file(): raise SystemExit('Run composer install --no-dev in standalone/hostinger first.')
    # Verify the locked hero before packaging.
    text=(ROOT/'landing-page/src/App.tsx').read_text(encoding='utf-8')
    start=text.index('        {/* HERO */}');end=text.index('        </section>',start)+len('        </section>')
    assert hashlib.sha256(text[start:end].encode()).hexdigest()==(ROOT/'tests/original-hero.sha256').read_text().strip()
    redirects=json.loads((ROOT/'quality/redirects.json').read_text())
    site=ROOT/'standalone/site'
    with (ROOT/'quality/LIVE_URL_MIGRATION_INVENTORY.csv').open(encoding='utf-8',newline='') as f: rows=list(csv.DictReader(f))
    for row in rows:
        target=redirects.get(row['path'],row['path'])
        assert target not in redirects and (site/target.lstrip('/')/'index.html').is_file(),row['path']
    public=out/'public_html';private=out/'sop-private'
    shutil.copytree(site,public);private.mkdir()
    shutil.copytree(src/'api',public/'api')
    shutil.copytree(src/'vendor',private/'vendor')
    shutil.copy2(src/'maintenance.php',private/'maintenance.php')
    shutil.copy2(src/'publish.php',private/'publish.php')
    config=(src/'config.example.php').read_text().replace('REPLACE_WITH_64_RANDOM_HEX_CHARACTERS',secrets.token_hex(32))
    (private/'config.php').write_text(config,encoding='utf-8')
    (private/'.htaccess').write_text('Require all denied\n')
    rules=['Options -Indexes','DirectoryIndex index.html','ErrorDocument 404 /404.html',
      '<FilesMatch "^(\\.|composer\\.|config\\.|common\\.php|.*\\.(?:sqlite3?|db|log|bak|env))">','Require all denied','</FilesMatch>',
      '<IfModule mod_headers.c>','Header always set X-Content-Type-Options "nosniff"',
      'Header always set Referrer-Policy "strict-origin-when-cross-origin"',
      'Header always set X-Frame-Options "SAMEORIGIN"','</IfModule>',
      'RewriteEngine On','RewriteCond %{HTTPS} !=on [OR]',
      'RewriteCond %{HTTP_HOST} !^seooutsourcingphilippines\\.com$ [NC]',
      'RewriteRule ^ https://seooutsourcingphilippines.com%{REQUEST_URI} [R=301,L,NE]']
    for source,target in redirects.items():
        rules.append('RewriteRule ^'+re.escape(source.strip('/'))+'/?$ '+target+' [R=301,L,NE]')
    rules += ['RewriteRule ^(?:sitemap_index|wp-sitemap|post-sitemap|page-sitemap|category-sitemap)\\.xml$ /sitemap.xml [R=301,L]',
      'RewriteRule ^api/(?:session|inquiry|health)/?$ api/index.php [END]',
      'RewriteRule ^api/(?!index\\.php$) - [F,END]',
      'RewriteCond %{REQUEST_FILENAME} -f [OR]','RewriteCond %{REQUEST_FILENAME} -d','RewriteRule ^ - [END]']
    (public/'.htaccess').write_text('\n'.join(rules)+'\n')
    # Preview artifacts must never be uploaded as source production pages.
    for page in public.rglob('*.html'):
        assert 'Temporary site preview' not in page.read_text(encoding='utf-8')
    shutil.copy2(ROOT/'quality/LIVE_URL_MIGRATION_INVENTORY.csv',out/'URL-INVENTORY.csv')
    shutil.copy2(ROOT/'quality/redirects.json',out/'REDIRECTS.json')
    shutil.copy2(src/'UPLOAD-STEPS.md',out/'UPLOAD-STEPS.md')
    pages=sorted('/' if p.parent==public else '/'+p.parent.relative_to(public).as_posix()+'/' for p in public.rglob('index.html'))
    (private/'pages.json').write_text(json.dumps(pages,indent=2))
    report={'original_hero_sha256':hashlib.sha256(text[start:end].encode()).hexdigest(),'pages':len(pages),'inventoried_urls':len(rows),'redirects':len(redirects),'indexing':'Held until publish.php --publish is run by the owner','mail':'Requires actual SMTP settings and inbox test'}
    (out/'PACKAGE-CHECKS.json').write_text(json.dumps(report,indent=2))
    archive=out.with_suffix('.zip')
    with zipfile.ZipFile(archive,'w',zipfile.ZIP_DEFLATED) as z:
        for file in out.rglob('*'):
            if file.is_file():z.write(file,file.relative_to(out).as_posix())
    print(json.dumps(report,indent=2));print('Archive:',archive)

if __name__=='__main__':
    ap=argparse.ArgumentParser();ap.add_argument('--out',type=Path,required=True);build(ap.parse_args().out.resolve())
