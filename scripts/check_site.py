#!/usr/bin/env python3
"""Read-only SEO Outsourcing Philippines source checks."""
from pathlib import Path
from html.parser import HTMLParser
from collections import Counter
from urllib.parse import urlsplit,unquote
from xml.etree import ElementTree as ET
import sys, re, json

ROOT=Path(__file__).resolve().parent.parent
SITE=ROOT/'standalone'/'site'
XML=ROOT/'wordpress'/'wordpress-full-layout-DRAFT.xml'
class AuditParser(HTMLParser):
 def __init__(self):
  super().__init__(); self.titles=0; self.h1=0; self.canonicals=[]; self.links=[]; self.images=[]
 def handle_starttag(self, tag, attrs):
  a=dict(attrs)
  if tag=='title': self.titles+=1
  if tag=='h1': self.h1+=1
  if tag=='link' and a.get('rel')=='canonical': self.canonicals.append(a.get('href',''))
  if tag=='a' and a.get('href'): self.links.append(a['href'])
  if tag in ('img','script') and a.get('src'): self.images.append(a['src'])

errors=[]
pages=sorted(SITE.rglob('index.html')) if SITE.is_dir() else []
# All standalone pages also have a WordPress draft; the theme renders the homepage.
if len(pages)!=116: errors.append(f'Expected 116 HTML index pages, found {len(pages)}')
if not (SITE/'book-discovery-call'/'index.html').exists():
 errors.append('Missing standalone discovery call page')
canons=[]
for f in pages:
 p=AuditParser()
 try: p.feed(f.read_text(encoding='utf-8'))
 except Exception as exc:
  errors.append(f'{f}: unparsable: {exc}'); continue
 if p.titles!=1: errors.append(f'{f}: expected 1 title, got {p.titles}')
 if p.h1!=1: errors.append(f'{f}: expected 1 H1, got {p.h1}')
 if len(p.canonicals)!=1: errors.append(f'{f}: expected 1 canonical, got {len(p.canonicals)}')
 else:
  u=p.canonicals[0]
  if not u.startswith('https://seooutsourcingphilippines.com/'):
   errors.append(f'{f}: unexpected canonical {u}')
  canons.append(u)
 for url in p.links+p.images:
  if url.startswith(('mailto:','tel:','data:','javascript:','#')):continue
  try: purl=urlsplit(url)
  except ValueError: continue
  if purl.netloc and purl.netloc not in ('seooutsourcingphilippines.com','www.seooutsourcingphilippines.com'):continue
  path=unquote(purl.path)
  if not path or path=='/':continue
  path=json.loads((ROOT/'quality/redirects.json').read_text(encoding='utf-8')).get(path,path)
  destination=(SITE/path.lstrip('/'))
  if not (destination.is_file() or (destination/'index.html').is_file()):
   errors.append(f'{f.relative_to(SITE)}: missing internal target {url}')
if len(canons)!=len(set(canons)):errors.append(f'Duplicate canonical URLs: {len(canons)-len(set(canons))}')
if not XML.exists(): errors.append('Missing WordPress draft import')
else:
 try:
  tree=ET.parse(XML)
  ns={'wp':'http://wordpress.org/export/1.2/'}
  items=tree.findall('.//item')
  if len(items)!=67:errors.append(f'Expected 67 WordPress draft records, found {len(items)}')
  for item in items:
   if item.findtext('wp:status',namespaces=ns)!='draft':
    errors.append('A WordPress import record is not draft')
 except Exception as exc:errors.append(f'WordPress XML parse error: {exc}')
for fname in ('.env','wp-config.php','leads.sqlite','leads.db'):
 if any(f.name==fname for f in ROOT.rglob('*') if f.is_file()):errors.append(f'Found forbidden file name: {fname}')
print(f'Checked {len(pages)} HTML pages, {len(canons)} canonical URLs, WordPress import and local links')
if errors:
 for e in errors[:80]:print('ERROR:',e)
 print(f'Failed: {len(errors)} errors');sys.exit(1)
print('PASS: structure and content files validated')
