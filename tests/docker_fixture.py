"""Create a disposable Docker fixture without approving or packaging production pages."""
import shutil,sys
from pathlib import Path
root=Path(__file__).resolve().parents[1]
target=Path(sys.argv[1]).resolve()
if target.exists():raise SystemExit('Fixture output must be a new directory')
target.mkdir(parents=True)
shutil.copy2(root/'standalone/Dockerfile',target/'Dockerfile')
shutil.copytree(root/'standalone/backend',target/'backend',ignore=shutil.ignore_patterns('private','__pycache__','*.pyc'))
site=target/'release/site';site.mkdir(parents=True)
(site/'index.html').write_text('<!doctype html><title>Container QA</title><h1>Container QA</h1>')
