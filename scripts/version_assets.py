"""Version unbundled public CSS/JS URLs so deployments do not reuse stale assets."""
from pathlib import Path
import hashlib,re,sys
ROOT=Path(__file__).resolve().parents[1]
SITE=ROOT/'standalone/site'
def refresh(check=False):
    changed=[]
    def version(match):
        prefix, quote, path = match.groups()
        file=SITE/path.lstrip('/')
        if not file.is_file():return match[0]
        digest=hashlib.sha256(file.read_text(encoding='utf-8').encode()).hexdigest()[:12]
        return prefix+quote+path+'?v='+digest+quote
    pattern=r'(\b(?:src|href)=)([\"\x27])(/assets/[^\"\x27?]+\.(?:js|css))(?:\?[^\"\x27]*)?\2'
    for file in SITE.rglob('*.html'):
        if file==SITE/'index.html':continue
        source=file.read_text(encoding='utf-8');result=re.sub(pattern,version,source)
        if result!=source:
            changed.append(file)
            if not check:file.write_text(result,encoding='utf-8')
    return changed
if __name__=='__main__':
    changed=refresh('--check' in sys.argv)
    if changed and '--check' in sys.argv:raise SystemExit('Public asset versions need refreshing: run scripts/version_assets.py')
    print('Public asset URLs checked.' if not changed else 'Versioned public assets in '+str(len(changed))+' pages.')
