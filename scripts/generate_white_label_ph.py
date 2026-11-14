"""Build the Philippines agency landing page with the existing site shell."""
from pathlib import Path
from bs4 import BeautifulSoup
import json

ROOT = Path(__file__).resolve().parents[1]
SITE = ROOT / 'standalone/site'
soup = BeautifulSoup((SITE/'services/white-label-seo/index.html').read_text(encoding='utf-8'), 'html.parser')
url = 'https://seooutsourcingphilippines.com/white-label-seo-philippines/'
title = 'White Label SEO Philippines | Agency SEO Support'
description = 'White label SEO from the Philippines for agencies. Outsource technical SEO, content, local search and reporting with an agreed scope and review process.'
soup.title.string = title
soup.select_one('meta[name="description"]')['content'] = description
soup.select_one('link[rel="canonical"]')['href'] = url
for prop, value in [('og:title',title),('og:description',description),('og:url',url)]:
    soup.select_one(f'meta[property="{prop}"]')['content'] = value
schema = json.loads(soup.select_one('script[type="application/ld+json"]').string)
for node in schema['@graph']:
    if node['@type'] in ('WebPage','Service'):
        node.update(name='White Label SEO Philippines', description=description, url=url)
        if node['@type']=='WebPage':
            node.update({'@id':url+'#webpage','headline':'White Label SEO Philippines'})
    if node['@type']=='BreadcrumbList':
        node['itemListElement'] = [
            {'@type':'ListItem','position':1,'name':'Home','item':'https://seooutsourcingphilippines.com/'},
            {'@type':'ListItem','position':2,'name':'White Label SEO Philippines','item':url}]
soup.select_one('script[type="application/ld+json"]').string = json.dumps(schema, ensure_ascii=False)
main = '''<main id="main"><section class="page-hero"><div class="container">
<h1>White label SEO Philippines</h1><p>Outsource client SEO work to the Philippines while your agency manages the relationship. Get technical SEO, content, local search and reporting under your brand.</p>
<div class="btn-row"><a class="btn" href="/contact/?audience=agency&amp;service=white-label-seo">Get a Quote</a><a class="btn outline" href="https://calendly.com/discovery-call-with-erwin" target="_blank" rel="noopener noreferrer">Book a discovery call</a></div></div></section>
<section class="section"><div class="container editorial-layout"><article class="article">
<h2>SEO support for your client accounts</h2><p>Your agency may need help with a specific account, a backlog of technical fixes or regular content production. A white-label arrangement lets you assign that work without handing over the client relationship.</p><p>Send the websites, target markets and work you need covered. We quote for the agreed tasks and identify what requires your approval, developer support or client input before work begins.</p>
<h2>What you can outsource</h2><h3>Keyword research and page planning</h3><p>Research customer searches, review competing pages and map topics to existing or proposed URLs. The output identifies page intent and the gaps to address, rather than a list of keywords without a plan.</p>
<h3>Technical and on-page SEO</h3><p>Review crawling, indexing, internal links, page titles and content structure. Recommendations name the affected URLs and distinguish changes we can implement from work for your developer. Agreed implementation includes follow-up checks.</p>
<h3>Content and local search</h3><p>Request service-page briefs, article briefs, content updates or location-page recommendations. Business details and claims need client confirmation. Local search work can include Google Business Profile recommendations and checks for inconsistent business information.</p>
<h3>Reporting</h3><p>Receive a record of completed work, open issues and proposed next steps. Where access is provided, reporting can include Search Console and analytics data. Rankings are reported with their market and date; they are not a substitute for enquiries or sales data.</p>
<h2>Your brand, your review process</h2><p>Share the templates and task system your agency uses. Agree a contact person, review dates and who signs off changes. Client-facing files can use your branding; direct client communication happens only when requested.</p><p>Access requirements depend on the work. Use individual user accounts and grant only the permissions needed. Do not send passwords through the quote form.</p>
<h2>Choose a project or ongoing support</h2><p>A project suits a defined task such as a technical review or content plan. Monthly support suits a continuing queue of implementation, content and reporting work. The proposal specifies the tasks, review process and price for your accounts.</p><p>Review our <a href="/pricing/">published starting prices</a> or read the <a href="/services/white-label-seo/">white-label delivery process</a> before requesting a quote.</p>
<h2>Questions agencies ask</h2><div class="faq-list">
<details><summary>Can you work on accounts outside the Philippines?</summary><p>Yes. Share each client's target country, language and service area so the research and recommendations match that market.</p></details>
<details><summary>Do you contact our clients?</summary><p>Your agency remains the client contact unless you request a different arrangement. Client-facing communication and reporting are agreed in the scope.</p></details>
<details><summary>Can we start with one account?</summary><p>Yes. Send one website and the tasks you want covered. The quote will define the initial assignment and review process.</p></details>
<details><summary>Do you guarantee first-page rankings?</summary><p>No. Search results depend on competition, website conditions and search-engine changes. We agree the work and report what changes without promising a ranking position.</p></details></div></article>
<aside class="sidebar"><div class="side-box"><h3>Request an agency quote</h3><p>Include the client URLs, target markets, services needed and preferred delivery dates.</p><a class="btn" href="/contact/?audience=agency&amp;service=white-label-seo">Get a Quote</a></div><div class="side-box"><h3>Related services</h3><p><a href="/services/technical-seo/">Technical SEO</a></p><p><a href="/services/seo-content/">SEO content</a></p><p><a href="/services/local-seo/">Local SEO</a></p><p><a href="/results/">View our work</a></p></div></aside></div></section>
<section class="cta-band"><div class="container"><h2>Send us the accounts that need support.</h2><p>We will review the requirements and prepare a quote for your agency.</p><a class="btn" href="/contact/?audience=agency&amp;service=white-label-seo">Get a Quote</a></div></section></main>'''
soup.main.replace_with(BeautifulSoup(main, 'html.parser').main)
output = SITE/'white-label-seo-philippines/index.html'
output.parent.mkdir(exist_ok=True)
output.write_text(str(soup)+'\n', encoding='utf-8')
print('Built', output.relative_to(ROOT))
