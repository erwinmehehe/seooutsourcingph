"""Remove reviewed boilerplate without changing factual claims, prices or result data."""
import re
from html import unescape

def strip_cta_decoration(html):
    """Remove CTA arrows and the small labels above page headings."""
    html = re.sub(r'<div\b[^>]*class="[^"]*\bcrumbs\b[^"]*"[^>]*>.*?</div>', '', html, flags=re.S)
    html = re.sub(r'<(span|p)\b[^>]*class="[^"]*\b(?:eyebrow|kicker|overline)\b[^"]*"[^>]*>.*?</\1>', '', html, flags=re.S)
    arrows = r'[→↗↖↘↙←➡➜➝➞➔↪⟶]'
    def cta(match):
        block = re.sub(r'<span\b[^>]*>\s*'+arrows+r'\s*</span>', '', match[0], flags=re.S)
        block = re.sub(arrows+r'|&(?:rarr|nearr);|&#(?:8594|8599);', '', block)
        return re.sub(r'\s+(</(?:a|button)>)', r'\1', block)
    return re.sub(r'<(a|button)\b[^>]*>.*?</\1>', cta, html, flags=re.S)

BOILERPLATE = (
 r'^A concise .+ record covering the decision, supporting evidence, owner and next action\.$',
 r'^The .+ work is specific, evidence-backed and ready for the next owner or implementation step\.$',
 r'^Treat .+ as a review failure, not a minor exception\. Define what good looks like for this point, require supporting evidence, and correct the process if the same issue appears again\.$',
 r'^Start with .+\. Establish the baseline, access, owners and acceptance criteria before increasing production volume\.$',
 r'^Implement .+\. Review early outputs closely and turn repeated corrections into better briefs, templates or automated checks\.$',
 r'^Validate .+\. Compare the new evidence with the baseline, then expand only the work that is producing reliable quality or commercial progress\.$',
 r'^Use this table as an acceptance checklist\. Each row should leave behind evidence that another reviewer can inspect\.$',
 r'^End each (?:reporting cycle|review) with an? (?:operational )?decision.+Separate (?:delivery-team output|completed SEO work) from items blocked by .+\.$',
 r'^A scoped engagement should leave you with written deliverables and approval responsibilities, not just a promise of more traffic\.$',
 r'^See how our .+ workflow can support implementation after the recommendations in this guide\.$',
)

def clean(html):
    # Several restored guides contain rows whose cells merely repeat the topic.
    # Remove the row rather than replacing it with invented deliverables or proof.
    def row(match):
        text=unescape(re.sub('<[^>]+>',' ',match[0]))
        if ('ready for the next owner or implementation step' in text
            or re.search(r'A concise .+ record covering the decision, supporting evidence, owner and next action',text)):
            return ''
        return match[0]
    html=re.sub(r'<tr\b[^>]*>.*?</tr>',row,html,flags=re.S)
    html=re.sub(r'<table\b[^>]*>\s*(?:<thead>.*?</thead>\s*)?<tbody>\s*</tbody>\s*</table>','',html,flags=re.S)
    html=re.sub(r'<div class="(?:responsive-table|table-scroll|matrix-scroll)">\s*</div>','',html)
    def paragraph(match):
        text=unescape(re.sub('<[^>]+>','',match[0])).strip()
        if any(re.fullmatch(pattern,text,re.S) for pattern in BOILERPLATE):return ''
        paragraph=match[0]
        paragraph=re.sub(r' This guide turns that situation into .*?(?=</p>)','',paragraph,flags=re.S)
        paragraph=re.sub(r' This guide focuses on .*?with practical checks for deciding what to do next\.','',paragraph,flags=re.S)
        paragraph=paragraph.replace('Based in the Philippines; remote support for Australian businesses. No Australian branch office is claimed.','Philippines-based SEO support for Australian businesses.')
        paragraph=paragraph.replace('Primary-source note: ','')
        return paragraph
    html=re.sub(r'<p\b[^>]*>.*?</p>',paragraph,html,flags=re.S)
    # A removed filler paragraph must not leave an empty numbered subsection.
    html=re.sub(r'<h3\b[^>]*>[^<]*</h3>\s*(?=<h[23]\b|</(?:section|article|div)>)','',html)
    html=re.sub(r'<h2\b[^>]*id="ninety-day-plan"[^>]*>.*?</h2>\s*(?=<h2\b|</(?:section|article|div)>)','',html,flags=re.S)
    html=re.sub(r'<h2\b[^>]*>[^<]*</h2>\s*(?=<h2\b)','',html)
    return strip_cta_decoration(html)
