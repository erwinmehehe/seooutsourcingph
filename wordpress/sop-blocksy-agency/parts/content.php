<?php
if (!defined('ABSPATH')) exit;

/** Service descriptions only. Claims and quotas must be approved by the site owner. */
function sop_agency_services(): array {
    return [
        'technical-seo' => ['title'=>'Technical SEO','focus'=>'Fix the issues holding pages back.','description'=>'Crawl diagnosis, indexing and canonical reviews, internal-link QA, structured data validation, migration checks, and developer-ready tickets.','scope'=>['Indexability and crawl diagnostics','Technical issue log with affected URLs','Priority, owner and acceptance criteria','Post-implementation QA and retest'],'tools'=>['Google Search Console','Screaming Frog','PageSpeed Insights','GA4'],'faqs'=>[['What does the audit include?','The scope records the site sections reviewed, technical issues found, affected URLs and the agreed verification method.'],['Do you implement fixes?','Implementation can be included when the agreed permissions and developer resources allow it. Otherwise, tickets are handed to the site owner.']]],
        'white-label-seo' => ['title'=>'White-label SEO','focus'=>'Production support behind your client relationship.','description'=>'SEO workstreams delivered to your brief with agreed naming, review and confidentiality requirements.','scope'=>['Agency-defined scope and acceptance criteria','Technical, on-page or content task queue','Named delivery owner and review cadence','Client-ready, white-label handoff files'],'tools'=>['Asana / ClickUp','Google Search Console','GA4','Screaming Frog'],'faqs'=>[['Who manages the end client?','Your agency retains the relationship and controls final strategy, approvals and publication.'],['Can you use our SOPs?','Yes, agreed procedures and access requirements are built into the first-project brief.']]],
        'local-seo' => ['title'=>'Local SEO','focus'=>'Improve local search foundations.','description'=>'Google Business Profile QA, location page structure, local intent mapping, and citation consistency for real operating locations.','scope'=>['GBP field and category review','Local landing-page QA','Citation inconsistency log','Monthly local search evidence'],'tools'=>['Google Business Profile','Google Search Console','GA4'],'faqs'=>[['Are local rankings guaranteed?','No. Local results vary by proximity, query, relevance and competition. Work is reported against agreed measurements.']]],
        'on-page-seo' => ['title'=>'On-page SEO','focus'=>'Make every important page clearer.','description'=>'Search intent alignment, titles, headings, internal links and content structure for pages that matter commercially.','scope'=>['Keyword-to-page intent map','Title and heading recommendations','Internal linking and cannibalisation review','Before/after content QA'],'tools'=>['Google Search Console','Screaming Frog','Google Sheets'],'faqs'=>[['Can you edit pages directly?','With approval and appropriate CMS access, yes. The scope specifies whether the work includes implementation.']]],
        'seo-content' => ['title'=>'SEO Content','focus'=>'Briefs and optimization tied to search intent.','description'=>'Research-led editorial plans, SEO briefs, page upgrades and internal links with accountable factual review.','scope'=>['Content opportunity map','Source-led SEO briefs','Editor and approval handoff','On-page and internal-link QA'],'tools'=>['Google Search Console','Google Docs','GA4'],'faqs'=>[['Do you publish content?','Publication is only included when agreed; client approval is required for regulated or specialist factual claims.']]],
        'seo-audits' => ['title'=>'SEO Audits','focus'=>'Prioritized findings, not an exported error list.','description'=>'Technical and content audits that turn detected issues into reproducible tickets, priorities and implementation checks.','scope'=>['Baseline and crawl coverage','Severity and opportunity assessment','Developer-ready issue register','Recommended next-sprint roadmap'],'tools'=>['Screaming Frog','Google Search Console','PageSpeed Insights'],'faqs'=>[['Will I receive a PDF?','The handoff can include a summary and a structured task log. File formats are agreed before work starts.']]],
        'seo-strategy' => ['title'=>'Keyword Research & Strategy','focus'=>'A useful SEO roadmap, not a keyword dump.','description'=>'Commercial intent analysis, keyword grouping, information architecture and a sequenced production plan.','scope'=>['Search intent and competitor research','Keyword cluster and page assignment','Priority roadmap','Measure-and-review framework'],'tools'=>['Google Search Console','SEMrush','Google Sheets'],'faqs'=>[['How are priorities decided?','We consider relevance, site capability, existing search demand, and the business objective.']]],
        'link-building' => ['title'=>'Link Building Support','focus'=>'A reviewable outreach process.','description'=>'Prospecting, relevance review and outreach administration within an agreed quality and compliance framework.','scope'=>['Publisher relevance checks','Prospect and outreach log','Placement QA','Monthly approval list'],'tools'=>['Ahrefs','Google Sheets'],'faqs'=>[['Do you guarantee placements?','No. Publication and editorial decisions belong to independent publishers.']]],
        'seo-reporting' => ['title'=>'SEO Reporting','focus'=>'Reports that support decisions.','description'=>'Source-linked organic search reporting, task summaries, changes shipped, blockers and next actions.','scope'=>['Search Console baseline and comparisons','GA4 engagement or conversion metrics','Completed work and blocked tasks','Decisions for the next sprint'],'tools'=>['Google Search Console','GA4','Looker Studio'],'faqs'=>[['Do reports prove ROI?','Not automatically. Revenue attribution depends on available CRM and analytics evidence.']]],
        'multi-location-seo' => ['title'=>'Multi-location SEO','focus'=>'Keep location signals consistent.','description'=>'Location architecture, GBP governance, service-area content QA, and operationally accurate local landing pages.','scope'=>['Location facts source-of-truth','Location page template and QA','GBP and citation consistency','Local measurement plan'],'tools'=>['Google Business Profile','Google Search Console','Google Sheets'],'faqs'=>[['Can you create pages for every suburb?','We recommend pages only where there is a genuine service and distinct user value; mass near-duplicate pages are not a strategy.']]],
        'answer-engine-optimization' => ['title'=>'Answer Engine Optimization','focus'=>'Make useful answers clear to people and search systems.','description'=>'Answer-first page structure, topic coverage and source clarity for traditional and AI-assisted search experiences.','scope'=>['Question and entity coverage map','Answer-focused content QA','Citation and source review','Search-feature monitoring'],'tools'=>['Google Search Console','Schema validators','GA4'],'faqs'=>[['Can you promise AI citations?','No. Inclusion in AI-generated answers cannot be guaranteed.']]],
        'schema-entity-seo' => ['title'=>'Schema & Entity SEO','focus'=>'Give search engines consistent, factual signals.','description'=>'Structured data mapping, validation, disambiguation and information architecture without unsupported schema claims.','scope'=>['Schema eligibility review','Entity and organization consistency','JSON-LD implementation guide','Rich result validation and retest'],'tools'=>['Google Rich Results Test','Schema.org','Google Search Console'],'faqs'=>[['Will schema guarantee rich results?','No. Valid markup is not a promise of a rich result.']]],
        'semantic-keyword-mapping' => ['title'=>'Semantic Keyword Mapping','focus'=>'Group queries into the right pages.','description'=>'Intent-led topic clusters, content gap analysis, cannibalisation checks and keyword-to-URL decisions.','scope'=>['Query and intent clustering','Existing page inventory','Keyword-to-URL map','Page prioritization brief'],'tools'=>['SEMrush','Google Search Console','Google Sheets'],'faqs'=>[['Do you create one page per keyword?','No. We group related intent and avoid unnecessary overlapping pages.']]],
    ];
}

function sop_agency_steps(): array {
    return [
        ['01','Scope','Define the audience, sites, access, outputs and exclusions.'],
        ['02','Prioritize','Agree the first task queue and accountable reviewers.'],
        ['03','Produce','Complete the technical or editorial work with source evidence.'],
        ['04','Verify','Retest, report blockers, and sign off the handoff.'],
    ];
}
function sop_agency_service_href(string $slug): string {
    return sop_agency_link('/services/' . $slug . '/');
}
function sop_agency_service_rows(array $slugs): void {
    $catalog = sop_agency_services();
    echo '<div class="sop-service-rows">';
    $i = 1;
    foreach ($slugs as $slug) {
        if (!isset($catalog[$slug])) continue;
        $s=$catalog[$slug];
        echo '<a class="sop-service-row" href="'.sop_agency_service_href($slug).'">';
        echo '<span class="sop-service-index">'.esc_html(str_pad((string)$i, 2, '0', STR_PAD_LEFT)).'</span>';
        echo '<span class="sop-service-main"><strong>'.esc_html($s['title']).'</strong><small>'.esc_html($s['focus']).'</small></span>';
        echo '<span class="sop-service-arrow" aria-hidden="true">↗</span></a>';
        $i++;
    }
    echo '</div>';
}
function sop_agency_breadcrumbs(array $items): void {
    echo '<nav class="sop-breadcrumb" aria-label="Breadcrumb"><a href="'.sop_agency_link('/').'">Home</a>';
    foreach ($items as $item) echo '<span aria-hidden="true">/</span><span>'.esc_html($item).'</span>';
    echo '</nav>';
}
function sop_agency_section_cta(string $title, string $copy=''): void {
    echo '<section class="sop-callout"><div class="sop-wrap"><div><p class="sop-eyebrow">Next step</p><h2>'.esc_html($title).'</h2>';
    if ($copy) echo '<p>'.esc_html($copy).'</p>';
    echo '</div><div>';
    sop_agency_cta('Request an SEO scope');
    echo '</div></div></section>';
}
function sop_agency_work_sample(): void {
    echo '<div class="sop-work-example"><div class="sop-work-header"><div><span class="sop-dossier-dot" aria-hidden="true"></span>EXAMPLE / TECHNICAL SEO TICKET</div><span>Illustration — not client work</span></div>';
    echo '<div class="sop-work-body"><div class="sop-work-title"><div><small>ISSUE #001 · CANONICAL / REDIRECTS</small><h3>Internal links pass through a redirect chain</h3></div><span class="sop-priority">High priority</span></div>';
    echo '<dl class="sop-work-fields"><div><dt>Finding</dt><dd>An internal link targets an old service URL that redirects twice.</dd></div><div><dt>Evidence</dt><dd>Source URL, response sequence, final target and crawl date.</dd></div><div><dt>Recommended fix</dt><dd>Update internal links to point to the approved 200-status page.</dd></div><div><dt>Acceptance check</dt><dd>Re-crawl the source page and attach the verified direct response.</dd></div></dl></div>';
    echo '<div class="sop-work-footer"><span>Example structure based on the repository’s technical issue-log worksheet.</span><a href="'.esc_url(get_stylesheet_directory_uri().'/assets/technical-issue-log.csv').'" download>Download sample CSV <span aria-hidden="true">↗</span></a></div></div>';
}
