"""Synchronise reviewed standalone page bodies into the WordPress draft import."""
from pathlib import Path
from urllib.parse import urlsplit
from xml.etree import ElementTree as ET
import re,sys
from version_assets import refresh
if refresh('--check' in sys.argv) and '--check' in sys.argv:raise SystemExit('Public asset versions are out of sync')
ROOT=Path(__file__).resolve().parents[1]
SOURCE=ROOT/'wordpress/wordpress-full-layout-DRAFT.xml'
SITE=ROOT/'standalone/site'
NS={'wp':'http://wordpress.org/export/1.2/','content':'http://purl.org/rss/1.0/modules/content/'}
for _, namespace in ET.iterparse(SOURCE,events=['start-ns']):
    ET.register_namespace(*namespace)
tree=ET.parse(SOURCE);channel=tree.getroot().find('channel')
items={urlsplit(item.findtext('link','')).path:item for item in channel.findall('item')}
# Include the now-connected discovery-call page in the WordPress alternative too.
path='/book-discovery-call/'
if path not in items:
    import copy
    item=copy.deepcopy(items['/about/'])
    item.find('link').text='https://seooutsourcingphilippines.com'+path
    if item.find('guid') is not None:item.find('guid').text='https://seooutsourcingphilippines.com'+path
    item.find('wp:post_name',NS).text='book-discovery-call'
    item.find('wp:post_id',NS).text=str(max(int(i.findtext('wp:post_id','0',NS)) for i in items.values())+1)
    channel.append(item);items[path]=item
for path,item in items.items():
    file=SITE/path.lstrip('/')/'index.html' if path!='/' else SITE/'index.html'
    html=file.read_text(encoding='utf-8')
    title=re.search(r'<title>(.*?)</title>',html,re.S)[1]
    import html as html_module
    title=html_module.unescape(title)
    heading=re.search(r'<h1\b[^>]*>(.*?)</h1>',html,re.S)
    item.find('title').text=html_module.unescape(re.sub(r'\s+',' ',re.sub('<[^>]*>',' ',heading[1])).strip()) if heading else title
    if path=='/':body=''
    else:
        body=re.search(r'<main\b[^>]*>(.*?)</main>',html,re.S)[1]
        if path=='/contact/':body=re.sub(r'<div class="form-wrap"[^>]*><form\b[\s\S]*?</form></div>','<div id="request-quote">[sop_proposal_form]</div>',body,count=1)
    item.find('content:encoded',NS).text=body
    description=re.search(r'<meta content="([^"]*)" name="description"',html)
    for meta in item.findall('wp:postmeta',NS):
        key=meta.findtext('wp:meta_key',namespaces=NS)
        if key=='_yoast_wpseo_title':meta.find('wp:meta_value',NS).text=title
        if key=='_yoast_wpseo_metadesc' and description:meta.find('wp:meta_value',NS).text=html_module.unescape(description[1])
    item.find('wp:status',NS).text='draft'
result=ET.tostring(tree.getroot(),encoding='unicode')
result='<?xml version="1.0" encoding="UTF-8"?>\n'+result+'\n'
if '--check' in sys.argv:
    if SOURCE.read_text(encoding='utf-8')!=result:raise SystemExit('WordPress draft import is out of sync; run scripts/sync_wordpress.py')
    print('WordPress draft import is in sync.')
else:
    SOURCE.write_text(result,encoding='utf-8')
    print('Synced',len(items),'WordPress drafts; publication status preserved.')
