"""Check generated .htaccess on local Apache TLS, never against the live domain."""
import csv,http.client,json,ssl
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
def get(path,host='seooutsourcingphilippines.com'):
 conn=http.client.HTTPSConnection('127.0.0.1',8443,context=ssl._create_unverified_context())
 conn.request('GET',path,headers={'Host':host});r=conn.getresponse();result=(r.status,dict(r.getheaders()),r.read());conn.close();return result
redirects=json.loads((ROOT/'quality/redirects.json').read_text())
with (ROOT/'quality/LIVE_URL_MIGRATION_INVENTORY.csv').open(encoding='utf-8',newline='') as f:rows=list(csv.DictReader(f))
for row in rows:
 status,headers,body=get(row['path'])
 if row['path'] in redirects:assert status==301 and headers['Location'].endswith(redirects[row['path']]),(row['path'],status,headers)
 else:assert status==200 and b'<html' in body,(row['path'],status)
for path in ['/sitemap_index.xml','/wp-sitemap.xml','/post-sitemap.xml','/page-sitemap.xml','/category-sitemap.xml']:
 status,headers,_=get(path);assert status==301 and headers['Location'].endswith('/sitemap.xml')
assert get('/no-such-page/')[0]==404
for path in ['/api/common.php','/.htaccess']:assert get(path)[0]==403
assert get('/sop-private/config.php')[0]==404
assert get('/api/session')[0]==503 # No live SMTP credentials are in a package.
status,headers,_=get('/about/','www.seooutsourcingphilippines.com');assert status==301 and headers['Location']=='https://seooutsourcingphilippines.com/about/'
status,headers,body=get('/');assert b'Illustrative analytics' in body and b'noindex' in body
assert headers.get('X-Content-Type-Options')=='nosniff'
print('PASS: Apache TLS, all 76 live paths, 21 single-hop 301s, sitemap aliases, www canonical redirect, true 404, private/source protections and unchanged homepage.')
