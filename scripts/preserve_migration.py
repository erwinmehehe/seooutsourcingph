"""Generate retained standalone articles and category archives from the saved public source."""
from pathlib import Path
import json,re,html,sys
from editorial_cleanup import clean
ROOT=Path(__file__).resolve().parents[1]
SITE=ROOT/'standalone/site'
records=json.loads((ROOT/'migration/preserved-content.json').read_text(encoding='utf-8'))
template=(SITE/'blog/on-page-seo-checklist/index.html').read_text(encoding='utf-8')
changed=[]
for record in records:
 title=html.escape(record['title']);url='https://seooutsourcingphilippines.com'+record['path']
 main='<main id="main"><section class="page-hero"><div class="container"><h1>'+title+'</h1></div></section><section class="section"><article class="container policy-copy">'+clean(record['content'])+'</article></section></main>'
 page=re.sub(r'<main\b[^>]*>.*?</main>',lambda _:main,template,flags=re.S)
 page=re.sub(r'<title>.*?</title>',lambda _:'<title>'+title+' | SEO Outsourcing Philippines</title>',page,flags=re.S)
 page=re.sub(r'<link[^>]*rel="canonical"[^>]*>',lambda _:'<link href="'+url+'" rel="canonical"/>',page)
 for field,value in [('og:title',record['title']),('og:url',url),('og:description',record['title'])]:
  page=re.sub(r'<meta content="[^"]*" property="'+field+r'"/>',lambda _:'<meta content="'+html.escape(value,quote=True)+'" property="'+field+'"/>',page)
 page=re.sub(r'<meta content="[^"]*" name="description"/>',lambda _:'<meta content="'+title+' — SEO Outsourcing Philippines." name="description"/>',page)
 page=re.sub(r'<script type="application/ld\+json">.*?</script>',lambda _:'<script type="application/ld+json">'+json.dumps({'@context':'https://schema.org','@type':'CollectionPage' if '/category/' in record['path'] else 'Article','headline':record['title'],'url':url})+'</script>',page,flags=re.S)
 file=SITE/record['path'].lstrip('/')/'index.html'
 if not file.exists() or file.read_text(encoding='utf-8')!=page:
  changed.append(record['path'])
  if '--check' not in sys.argv:file.parent.mkdir(parents=True,exist_ok=True);file.write_text(page,encoding='utf-8')
if '--check' in sys.argv and changed:raise SystemExit('Retained content is out of sync: '+str(changed))
print('Validated' if '--check' in sys.argv else 'Generated',len(records),'retained URLs.')
