"""Launch regression checks. No production requests, mail or approvals are created."""
import hashlib, http.client, importlib.util, json, os, subprocess, sys, tempfile, threading, unittest
from pathlib import Path
from unittest.mock import patch
ROOT=Path(__file__).resolve().parents[1]
def load(name,path):
 spec=importlib.util.spec_from_file_location(name,path);module=importlib.util.module_from_spec(spec);sys.modules[name]=module;spec.loader.exec_module(module);return module
release=load('release_test_module',ROOT/'scripts/build_release.py')
class SourceTests(unittest.TestCase):
 def test_pages_quotes_and_legacy_paths(self):
  with tempfile.TemporaryDirectory() as temp:
   out=Path(temp)/'pages'
   subprocess.run([sys.executable,str(ROOT/'scripts/build_pages_preview.py'),'--out',str(out)],check=True,capture_output=True)
   homepage=(out/'index.html').read_text(encoding='utf-8')
   self.assertNotIn('Temporary site preview',homepage)
   self.assertIn('Organic search performance',homepage)
   contact=(out/'contact/index.html').read_text(encoding='utf-8')
   import re,csv
   form=re.search(r'<form\b[^>]*id="contact-form".*?</form>',contact,re.S).group()
   self.assertIn('action="https://formsubmit.co/info@seooutsourcingphilippines.com"',form)
   self.assertNotIn('novalidate',form);self.assertNotIn('disabled',form)
   self.assertIn('name="_honey"',form);self.assertNotIn('name="_captcha"',form)
   self.assertIn('https://erwinmehehe.github.io/seooutsourcingph/quote-request-sent/',form)
   self.assertTrue((out/'quote-request-sent/index.html').is_file())
   scripts=list((out/'assets').glob('pages-site-*.js'));self.assertEqual(len(scripts),1)
   self.assertIn('sop-static-form',scripts[0].read_text())
   redirects=json.loads((ROOT/'quality/redirects.json').read_text())
   with (ROOT/'quality/LIVE_URL_MIGRATION_INVENTORY.csv').open(encoding='utf-8',newline='') as f:
    for row in csv.DictReader(f):
     file=out/row['path'].lstrip('/')/'index.html';self.assertTrue(file.is_file(),row['path'])
     if row['path'] in redirects:self.assertIn('/seooutsourcingph/'+redirects[row['path']].lstrip('/'),file.read_text())
 def test_every_existing_url_is_retained_or_redirected(self):
  import csv
  redirects=json.loads((ROOT/'quality/redirects.json').read_text(encoding='utf-8'))
  with (ROOT/'quality/LIVE_URL_MIGRATION_INVENTORY.csv').open(encoding='utf-8',newline='') as file:
   rows=list(csv.DictReader(file))
  self.assertEqual(len(rows),76)
  for row in rows:
   self.assertNotEqual(row['action'],'review')
   target=redirects.get(row['path'],row['path'])
   self.assertNotIn(target,redirects)
   self.assertTrue((ROOT/'standalone/site'/target.lstrip('/')/'index.html').is_file(),target)
 def test_original_hero_is_unchanged(self):
  text=(ROOT/'landing-page/src/App.tsx').read_text(encoding='utf-8');a=text.index('        {/* HERO */}');b=text.index('        </section>',a)+len('        </section>')
  self.assertEqual(hashlib.sha256(text[a:b].encode()).hexdigest(),(ROOT/'tests/original-hero.sha256').read_text().strip())
 def test_public_copy_has_no_internal_notes(self):
  from html.parser import HTMLParser
  import re
  class Text(HTMLParser):
   def __init__(self):super().__init__();self.skip=0;self.parts=[]
   def handle_starttag(self,tag,attrs):
    if tag in ('script','style'):self.skip+=1
    if dict(attrs).get('class','').split(' ')[0]=='eyebrow':raise AssertionError('Eyebrow element remains')
   def handle_endtag(self,tag):
    if tag in ('script','style'):self.skip=max(0,self.skip-1)
   def handle_data(self,data):
    if not self.skip:self.parts.append(data)
  for page in (ROOT/'standalone/site').rglob('*.html'):
   parser=Text();parser.feed(page.read_text(encoding='utf-8'));text=' '.join(parser.parts)
   self.assertNotRegex(text,r'(?i)led\s+by\s+erwin|erwin\s+valles|draft policy|implementation package|must be reviewed by the site owner|production email delivery must|Online calendar booking is not connected yet|Inspect source dashboard|This guide turns that situation|No Australian branch office is claimed|ready for the next owner or implementation step')
 def test_staging_is_not_a_production_release(self):
  with tempfile.TemporaryDirectory() as temp:
   out=Path(temp)/'release';result=subprocess.run([sys.executable,str(ROOT/'scripts/build_release.py'),'--out',str(out)],capture_output=True)
   self.assertEqual(result.returncode,2);self.assertFalse(out.exists())
 def test_preview_builder_preserves_unrelated_output(self):
  with tempfile.TemporaryDirectory() as temp:
   sentinel=Path(temp)/'keep.txt';sentinel.write_text('keep')
   result=subprocess.run([sys.executable,str(ROOT/'scripts/build_pages_preview.py'),'--out',temp],capture_output=True)
   self.assertNotEqual(result.returncode,0);self.assertEqual(sentinel.read_text(),'keep')
 def test_wordpress_homepage_generated(self):
  root=(ROOT/'wordpress/sop-premium-agency/templates/homepage.html').read_text(encoding='utf-8')
  self.assertIn('Organic search performance',root);self.assertIn('Illustrative analytics',root);self.assertEqual(root.count('<h1'),1)
class ReleaseTests(unittest.TestCase):
 def test_robots_attribute_order_and_policy(self):
  for tag in ['<meta name="robots" content="noindex,nofollow"/>','<meta content="noindex,follow,max-image-preview:large" name="robots"/>']:
   result=release.enable_indexing('<head>'+tag+'</head>','/')
   self.assertIn('content="index,follow,max-image-preview:large"',result);self.assertNotIn('noindex',result)
  with self.assertRaises(RuntimeError):release.enable_indexing('<head></head>','/')
 def test_relative_links_and_missing_signoffs_block_release(self):
  with tempfile.TemporaryDirectory() as temp:
   base=Path(temp);site=base/'site';site.mkdir();(site/'index.html').write_text('<a href="about/">About</a>');(site/'about').mkdir();(site/'about/index.html').write_text('<h1>About</h1>')
   manifest=base/'approvals.json';manifest.write_text(json.dumps({'release_status':'APPROVED','production_platform':'STANDALONE','approved_urls':['/'],'signoffs':{}}))
   with patch.multiple(release,SITE=site,MANIFEST=manifest,REDIRECTS=base/'redirects.json',MIGRATION=base/'inventory.csv'):
    _,_,problems=release.review()
   self.assertTrue(any('held page /about/' in p for p in problems));self.assertTrue(any('Missing human approval' in p for p in problems))
class ApiTests(unittest.TestCase):
 @classmethod
 def setUpClass(cls):
  cls.temp=tempfile.TemporaryDirectory()
  with patch.dict(os.environ,{'SEO_LEADS_DATA_DIR':cls.temp.name,'SEO_FORM_ENABLED':'1','SEO_PRODUCTION':'0','SEO_COOKIE_SECURE':'0'}):
   cls.backend=load('server',ROOT/'standalone/backend/server.py');cls.serve=load('serve_test_module',ROOT/'standalone/backend/serve.py')
  cls.http=cls.serve.ThreadingHTTPServer(('127.0.0.1',0),cls.serve.SiteHandler);cls.thread=threading.Thread(target=cls.http.serve_forever,daemon=True);cls.thread.start()
 @classmethod
 def tearDownClass(cls):cls.http.shutdown();cls.http.server_close();cls.temp.cleanup()
 def request(self,method,path,data=None,headers=None):
  connection=http.client.HTTPConnection('127.0.0.1',self.http.server_port,timeout=10);body=json.dumps(data) if data is not None else None
  connection.request(method,path,body,headers or {});response=connection.getresponse();result=(response.status,dict(response.getheaders()),response.read());connection.close();return result
 def test_save_failure_recovery_and_request_guards(self):
  status,headers,raw=self.request('GET','/api/session');self.assertEqual(status,200)
  cookie=headers['Set-Cookie'].split(';')[0];token=json.loads(raw)['csrf_token']
  data={'csrf_token':token,'audience':'business','plan':'SEO Essential','name':'Local QA','email':'qa@example.com','website':'https://example.com','details':'Local test of quote request and recovery.','consent':True}
  headers={'Content-Type':'application/json','Cookie':cookie}
  bad={**headers,'Origin':'https://unrelated.example'}
  self.assertEqual(self.request('POST','/api/inquiry',data,bad)[0],403)
  self.assertEqual(self.request('POST','/api/inquiry',{**data,'consent':False},headers)[0],400)
  with patch.object(self.backend,'notify',return_value='send_failed'):
   status,_,raw=self.request('POST','/api/inquiry',data,headers)
  self.assertEqual(status,201);reference=json.loads(raw)['reference']
  with self.backend.db_connect() as db:self.assertEqual(db.execute('SELECT notification_status FROM inquiries WHERE reference=?',(reference,)).fetchone()[0],'send_failed')
  with patch.object(self.backend,'notify',return_value='smtp_accepted') as notify:
   self.assertEqual(self.backend.retry_notifications(),0);self.assertEqual(notify.call_count,1)
  with self.backend.db_connect() as db:self.assertEqual(db.execute('SELECT notification_status FROM inquiries WHERE reference=?',(reference,)).fetchone()[0],'smtp_accepted')
  backup=Path(self.temp.name)/'backup.sqlite3';self.backend.backup_database(backup)
  import sqlite3
  con=sqlite3.connect(backup)
  try:self.assertEqual(con.execute('SELECT reference FROM inquiries').fetchone()[0],reference)
  finally:con.close()
  with self.assertRaises(ValueError):self.backend.backup_database(backup)
  export=Path(self.temp.name)/'export.csv';self.backend.export_leads(export)
  with self.assertRaises(FileExistsError):self.backend.export_leads(export)
  self.assertEqual(self.request('GET','/.release-ready.json')[0],404)
  self.assertEqual(self.request('GET','/../backend/server.py')[0],404)
  self.assertEqual(self.request('GET','/assets/page-shell.css')[0],200)
  status,_,body=self.request('GET','/missing/deep/page/')
  self.assertEqual(status,404);self.assertIn(b'href="/services/"',body)
if __name__=='__main__':unittest.main()
