#!/usr/bin/env python3
"""Editorial and conversion-source guards; not a substitute for human review."""
from pathlib import Path
import re
import json
import sys
ROOT=Path(__file__).resolve().parent.parent
SITE=ROOT/"standalone/site"
WXR=(ROOT/"wordpress/wordpress-full-layout-DRAFT.xml").read_text(encoding="utf-8")
PLUGIN=(ROOT/"wordpress/sop-proposal-form/sop-proposal-form.php").read_text(encoding="utf-8")
CONTACT=(SITE/"contact/index.html").read_text(encoding="utf-8")
INDUSTRIES=["dental","healthcare","ecommerce","saas","home-services","hospitality","multi-location",
            "law-firms","plumbers","electricians","hvac","pest-control","builders-roofing",
            "real-estate","accountants","ndis-providers","solar-installers"]
AU=INDUSTRIES[7:]
errors=[]
for industry in INDUSTRIES:
    relative=("australia/" if industry in AU else "")+industry
    html=(SITE/"industries"/relative/"index.html").read_text(encoding="utf-8")
    expected="/contact/?industry="+industry
    if expected not in html: errors.append(industry+": missing industry-specific lead route")
    if expected not in WXR: errors.append(industry+": WordPress export not synchronized")
    if "/contact/?service="+industry in html: errors.append(industry+": old misclassified service link")
for industry in AU:
    html=(SITE/"industries/australia"/industry/"index.html").read_text(encoding="utf-8")
    if 'id="buyer-test-'+industry+'"' not in html: errors.append(industry+": tailored buyer test missing")
    if "Explore the work behind this sector" in html: errors.append(industry+": generic related-services block remains")
if 'id="industry" name="industry"' not in CONTACT:
    errors.append("Static contact form has no industry field")
if 'name="industry"' not in PLUGIN or "$valid_industries" not in PLUGIN or "'service','industry','details'" not in PLUGIN:
    errors.append("WordPress plugin industry routing incomplete")
home=(SITE/"index.html").read_text(encoding="utf-8")
if "and starting." in home or "Explore real ranking snapshots and starting." in home:
    errors.append("Homepage structured data contains truncated description")
if not (SITE/"robots.txt").read_text(encoding="utf-8").find("Disallow: /")>=0:
    errors.append("Staging robots must block crawling")
pages=list(SITE.rglob("index.html"))
if len(pages)!=60: errors.append("Expected 60 pages; got "+str(len(pages)))
for file in pages:
    if 'content="noindex,follow,max-image-preview:large" name="robots"' not in file.read_text(encoding="utf-8"):
        errors.append(str(file.relative_to(SITE))+": unapproved page lost noindex")
manifest=json.loads((ROOT/"quality/release-approvals.json").read_text(encoding="utf-8"))
if manifest.get("release_status")=="HOLD" and manifest.get("approved_urls"):
    errors.append("Manifest marks URLs approved while entire release is held")
if errors:
    for issue in errors: print("ERROR:",issue)
    sys.exit(1)
print("PASS: industry attribution, source originality checkpoints, structured data and release locks")
