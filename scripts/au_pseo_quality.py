#!/usr/bin/env python3
"""Editorial tripwire for curated Australian programmatic pages.

Not a guarantee of quality or search rankings. Human review remains required.
"""
from pathlib import Path
import json, re, sys
from urllib.parse import urlparse
from itertools import combinations

ROOT=Path(__file__).resolve().parent.parent
DATA=json.loads((ROOT/"pseo/australia/pages.json").read_text(encoding="utf-8"))
SITE=ROOT/"standalone/site"
errors=[]
pages=DATA.get("pages",[])
if len(pages)!=5:
    errors.append("Expected five curated workstreams; changes require a new editorial review.")
if DATA.get("editorSignoff") is not False or DATA.get("status")!="DRAFT_NO_INDEX":
    errors.append("New programmatic pages must remain on explicit editorial HOLD.")
if DATA.get("knownKD")!="UNVERIFIED_SEMRUSH_API_UNITS_UNAVAILABLE":
    errors.append("Do not invent keyword difficulty or demand data.")

def plain(page):
    words=page.get("intro", [])[:]
    for section in page.get("sections",[]):
        words.extend(section.get("paras",[]))
        words.extend(section.get("bullets",[]))
        for row in section.get("table",{}).get("rows",[]): words.extend(row)
    for faq in page.get("faq",[]):words.extend([faq.get("q",""),faq.get("a","")])
    return re.sub(r"\s+"," "," ".join(str(s) for s in words)).strip()

def grams(content,n=5):
    tokens=re.findall(r"[a-z0-9]+",content.lower())
    return set(tuple(tokens[i:i+n]) for i in range(max(0,len(tokens)-n+1)))

slugs=set();titles=set();keywords=set()
for p in pages:
    slug=p.get("slug","")
    if not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*",slug):errors.append("Invalid slug "+slug)
    if slug in slugs:errors.append("Duplicate slug "+slug)
    slugs.add(slug)
    if p.get("title") in titles:errors.append("Duplicate title: "+slug)
    titles.add(p.get("title"))
    if p.get("targetKeyword") in keywords:errors.append("Duplicate keyword: "+slug)
    keywords.add(p.get("targetKeyword"))
    if p.get("editorApproved") is True:errors.append("Programmatic content may not auto-approve: "+slug)
    text=plain(p);count=len(text.split())
    if count<750:errors.append(f"Substantial unique value missing for {slug}: {count} curated words")
    if len(p.get("sections",[]))<5:errors.append("Too few substantive sections: "+slug)
    if not any("worked" in s.get("title","").lower() for s in p.get("sections",[])):errors.append("No worked scenario: "+slug)
    if len(p.get("faq",[]))<3:errors.append("Fewer than three buyer-specific questions: "+slug)
    if not p.get("resource"):errors.append("No working buyer worksheet: "+slug)
    if not p.get("sources"):errors.append("No primary sources: "+slug)
    for source in p.get("sources",[]):
        if urlparse(source.get("url","")).scheme!="https":
            errors.append("Reference must be HTTPS: "+slug)
    static=SITE/"australia"/slug/"index.html"
    if not static.exists():
        errors.append("Generated page missing: "+slug);continue
    html=static.read_text(encoding="utf-8")
    if html.count("<h1")!=1 or 'noindex,follow' not in html:
        errors.append("Page H1 or index controls invalid: "+slug)
    if "/australia/"+slug+"/" not in html: errors.append("Canonical or path wrong: "+slug)
    for resource in [SITE/"assets/resources"/p["resource"],
                     ROOT/"wordpress/sop-premium-agency/assets/resources"/p["resource"]]:
        if not resource.exists():errors.append("Worksheet not found: "+str(resource))
for a,b in combinations(pages,2):
    g1,g2=grams(plain(a)),grams(plain(b))
    n=len(g1&g2);den=len(g1|g2)
    overlap=n/den if den else 1
    if overlap>0.13:
        errors.append(f"Excessive shared five-word sequences: {a['slug']} vs {b['slug']} ({overlap:.2%})")
print(f"Australian pSEO: {len(pages)} substantive pages, five matching worksheets, uniqueness and draft gates checked")
if errors:
    for issue in errors:print("ERROR:",issue)
    sys.exit(1)
print("PASS: machine-readable editorial checks, awaiting real search-demand and human sign-off")
