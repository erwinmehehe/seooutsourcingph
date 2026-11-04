export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://seooutsourcingphilippines.com';
export const CONTACT_EMAIL = 'info@seooutsourcingphilippines.com';
export const BRAND = 'SEO Outsourcing Philippines';
export const indexingApproved = process.env.SITE_INDEXABLE === 'true' && process.env.SITE_RELEASE_APPROVED === 'true';

export type Service = {
  slug: string;
  number: string;
  title: string;
  short: string;
  summary: string;
  keyword: string;
  deliverables: string[];
  process: string[];
  tools: string[];
  faqs: { question: string; answer: string }[];
};
const commonFAQ = [
  { question: 'Can this work be delivered white-label?', answer: 'Yes, when agreed in the proposal. We document responsibilities, approval steps, file ownership, and client-facing handoffs.' },
  { question: 'How are results reported?', answer: 'We distinguish the work completed from ranking observations and commercial outcomes. Reports use agreed sources such as Search Console, analytics, and approved work logs.' },
  { question: 'Do you guarantee rankings or leads?', answer: 'No. Search outcomes depend on many factors beyond any one provider. We agree measurable deliverables, validation steps, and reporting methods instead.' }
];
const makeService = (slug:string,number:string,title:string,short:string,summary:string,keyword:string,deliverables:string[],process:string[],tools:string[]):Service=>({
  slug,number,title,short,summary,keyword,deliverables,process,tools,faqs:commonFAQ
});
export const services:Service[] = [
  makeService('technical-seo','01','Technical SEO','Find, prioritize, and verify the fixes holding a site back.','Crawl diagnostics, indexation review, performance issues, JavaScript visibility and validation with a traceable issue queue.','technical SEO outsourcing Philippines',
    ['Site crawl and indexability inventory','Canonical, redirect, robots and sitemap audit','Core Web Vitals and rendering investigation','Prioritized issue register with affected URLs','Implementation guidance and post-change retest'],
    ['Baseline crawl and access review','Triaged findings and impact estimates','Approved remediation plan','Implementation and evidence capture','Retest and handoff'],
    ['Screaming Frog','Google Search Console','PageSpeed Insights','Lighthouse']),
  makeService('seo-audits','02','SEO Audits','Understand what is broken before buying more activity.','A decision-ready technical and content audit, annotated for business priority and engineering feasibility.','SEO audit services Philippines',
    ['Baseline benchmark and crawl','Technical, content and internal-link analysis','Priority-ranked backlog','Sample tickets with reproduction steps','Executive findings and QA checklist'],
    ['Set goals','Audit crawl and analytics','Validate issues','Prioritize recommendations','Review findings'],
    ['Search Console','Screaming Frog','GA4','Ahrefs']),
  makeService('semantic-keyword-mapping','03','Semantic Keyword Mapping','Map queries to intent, entities, and the right pages.','A search-intent architecture that reduces topic overlap and gives writers and developers clear targets.','keyword research outsourcing Philippines',
    ['Query and intent clustering','Page-to-keyword map','Cannibalization and gap analysis','Internal linking recommendations','Editorial topic briefs'],
    ['Define markets and audiences','Research demand and intent','Cluster and map queries','Review with the owner','Deliver briefs and priorities'],
    ['Google Search Console','Semrush','Ahrefs','Google Trends']),
  makeService('aeo','04','Answer Engine Optimization','Make useful answers discoverable across search and AI experiences.','Evidence-led answer architecture, entity clarity and content usefulness, without claims of guaranteed AI citations.','answer engine optimization Philippines',
    ['Question and topic opportunity map','Source and author transparency review','Question-answer content briefs','Internal citation and entity clarity recommendations','Search and AI visibility measurement plan'],
    ['Audit existing answers','Research audience questions','Map trustworthy sources','Improve pages','Review visibility indicators'],
    ['Google Search Console','Bing Webmaster Tools','Schema Validator','Manual AI search checks']),
  makeService('schema-entity-seo','05','Schema & Entity Architecture','Build structured data around what the site can actually substantiate.','JSON-LD audits and implementation plans grounded in visible page facts and Google guidance.','schema markup outsourcing Philippines',
    ['Entity and page-type inventory','JSON-LD architecture map','Schema validation and error fixes','Breadcrumb and organization markup','QA checklist for deployment'],
    ['Inventory page templates','Map entities and facts','Write markup','Validate against source content','Monitor enhancements'],
    ['Schema.org','Rich Results Test','Search Console','JSON-LD']),
  makeService('seo-content','06','Content Strategy & Production','Research, brief, edit, and optimize content with a real approval trail.','Content planning grounded in search intent, subject expertise, internal linking, and accurate claims.','SEO content outsourcing Philippines',
    ['Content gap and intent analysis','Editorial calendar and briefs','On-page optimization recommendations','Internal link plan','Content QA and revision tracker'],
    ['Research content gaps','Create editorial brief','Draft and expert review','Optimize and link','Publish with approval'],
    ['Search Console','Semrush','Google Docs','CMS']),
  makeService('local-seo','07','Local SEO','Put accurate location signals and service pages to work.','Google Business Profile and local landing-page workflows designed for real service areas and business details.','local SEO outsourcing Philippines',
    ['GBP completeness and category review','Location-page and on-page QA','Citation and NAP consistency checklist','Review-response workflow guidance','Local reporting and verification'],
    ['Validate business facts','Audit local footprint','Prioritize profiles and pages','Implement with owner approval','Monitor and document'],
    ['Google Business Profile','Google Search Console','Maps','Local citations']),
  makeService('on-page-seo','08','On-Page SEO','Turn research into pages that make sense to people and crawlers.','Intent-focused content hierarchy, internal links, metadata and page experience across priority URL groups.','on-page SEO services Philippines',
    ['Page-level search intent mapping','Title and meta description recommendations','Heading and body-copy optimization','Internal-link updates','Pre- and post-change QA'],
    ['Select page cohort','Review intent and competitors','Recommend changes','Implement with approval','Check and report'],
    ['Search Console','Screaming Frog','CMS','GA4']),
  makeService('seo-strategy','09','SEO Strategy','Build a roadmap you can resource, approve, and track.','An accountable plan connecting priorities, deliverables and measurement instead of a vague list of tactics.','SEO strategy outsourcing Philippines',
    ['Opportunity and competitor review','Keyword and page prioritization','Quarterly roadmap','Ownership and dependency register','Reporting scorecard'],
    ['Discovery and baseline','Opportunity model','Roadmap draft','Stakeholder alignment','Monthly reprioritization'],
    ['Search Console','GA4','Ahrefs','Looker Studio']),
  makeService('link-building','10','Link Building Support','Research relevant opportunities with a clear quality bar.','Editorial outreach research and link-quality reviews, with no promises of guaranteed placements or manipulative tactics.','link building services Philippines',
    ['Relevant publisher prospect research','Editorial fit and risk screening','Personalized outreach planning','Placement and destination QA','Acquisition reporting and review'],
    ['Set relevance rules','Build prospect list','Screen quality','Conduct approved outreach','Verify and report'],
    ['Ahrefs','Semrush','Publisher websites','Outreach tracker']),
  makeService('seo-reporting','11','SEO Reporting','Show what shipped, what changed, and what still needs attention.','Readable reporting that separates execution evidence, visibility metrics, and commercial measurement.','white label SEO reporting Philippines',
    ['GSC and GA4 measurement plan','Client-ready reporting templates','Work completed vs impact sections','Data source and date annotations','Monthly decision log'],
    ['Agree KPIs','Validate source access','Build reporting view','Review changes','Decide next priorities'],
    ['Search Console','GA4','Looker Studio','Spreadsheets']),
  makeService('white-label-seo','12','White-Label SEO','Reliable SEO execution behind your agency brand.','Dedicated or scoped workstreams with your approval rules, client boundaries, and review-ready handoffs.','white label SEO outsourcing Philippines',
    ['Agency SOP and tool alignment','Named task and reviewer ownership','Technical/content/local SEO production','White-label handoff artifacts','Weekly queue and escalation log'],
    ['Define your client boundary','Agree pilot and SOPs','Complete a paid sample','Approve quality bar','Scale the recurring queue'],
    ['Your project management tool','Search Console','Screaming Frog','Shared QA checklist']),
  makeService('multi-location-seo','13','Multi-Location SEO','Scale location coverage without duplicating thin pages.','Entity-correct local page plans, GBP governance, and measured rollout by market.','multi location SEO Philippines',
    ['Location and business entity register','Local page template QA','Service-area content requirements','GBP and NAP governance','Market-by-market tracking'],
    ['Validate locations','Cluster genuine demand','Build page architecture','Publish approved markets','Measure local queries'],
    ['Google Business Profile','Search Console','Maps','Site crawler'])
];

export type Evidence = {
  slug: string;
  label: string;
  niche: 'Local Services'|'B2B SaaS'|'Legal'|'E-commerce';
  outcome: 'Visibility'|'Technical Execution'|'Content Architecture';
  kind: 'snapshot'|'playbook';
  title: string;
  description: string;
  location?: string;
  top5?: number;
  top10?: number;
  source?: string;
  testimonial?: { quote:string; author:string; role:string; approved:boolean };
  challenge:string;
  strategy:string[];
  execution:string[];
};
export const evidence:Evidence[] = [
  {
    slug:'brisbane-dental-visibility',label:'Dated ranking observation',niche:'Local Services',outcome:'Visibility',kind:'snapshot',
    title:'Dental search visibility in Brisbane',location:'Newstead, Brisbane · 03 Oct 2026',
    description:'A source-linked ranking snapshot for an Australian dental search market. This does not establish provider attribution or lead growth.',top5:20,top10:29,
    source:'https://online.seranking.com/guest.html?continue=admin.site.rankings.site_id-10506458.html%3Fref%3Dicon_in_project_list_clicked&hash=5fbae252&hv=0&sections%5B0%5D=rankings&site_id=10506458',
    challenge:'Interpreting tracked dental rankings without mistaking them for organic traffic, revenue or causal impact.',
    strategy:['Verify search location, device and tracked query set.','Separate keyword visibility from business outcomes.','Request authorized work records before claiming provider contribution.'],
    execution:['Snapshot records 20 tracked keywords in the top five and 29 in the top ten.','No validated before/after analytics or provider attribution supplied.','Source dashboard is linked for inspection, but access may depend on its owner.']
  },
  {
    slug:'sydney-dental-visibility',label:'Dated ranking observation',niche:'Local Services',outcome:'Visibility',kind:'snapshot',
    title:'Dental search visibility in Sydney',location:'Darlinghurst, Sydney · 03 Oct 2026',
    description:'Tracked query positions at one point in time, not a validated client success or change-versus-baseline claim.',top5:33,top10:35,
    source:'https://online.seranking.com/guest.html?continue=admin.site.rankings.site_id-10582307.html%3Fref%3Dicon_in_project_list_clicked&hash=90ee39c7&hv=0&sections%5B0%5D=rankings&site_id=10582307',
    challenge:'Distinguishing ranking observations from growth and outcomes.',
    strategy:['Check what the keyword set represents.','Verify reporting dates and market settings.','Use implementation tickets before attributing results.'],
    execution:['Snapshot records 33 tracked keywords in the top five and 35 in the top ten.','No independently verified lead, traffic or revenue comparison is included.']
  },
  {
    slug:'kiama-periodontist-visibility',label:'Dated ranking observation',niche:'Local Services',outcome:'Visibility',kind:'snapshot',
    title:'Periodontist visibility on the NSW South Coast',location:'Kiama / Wollongong · 03 Oct 2026',
    description:'A dated, linked keyword position record for a specialized local healthcare market.',top5:19,top10:21,
    source:'https://online.seranking.com/guest.html?continue=admin.site.rankings.site_id-10547855.html%3Fref%3Dicon_in_project_list_clicked&hash=7c757b4e&hv=0&sections%5B0%5D=rankings&site_id=10547855',
    challenge:'Communicating niche search visibility accurately.',
    strategy:['Confirm tracked service intent.','Use precise dates and source links.','Avoid inferring consultation volume from rankings.'],
    execution:['Snapshot records 19 tracked keywords in the top five and 21 in the top ten.','Before/after performance and attributable provider work remain unverified.']
  },
  {
    slug:'saas-indexation-workflow',label:'Illustrative workflow · not client work',niche:'B2B SaaS',outcome:'Technical Execution',kind:'playbook',
    title:'B2B SaaS indexation workflow',description:'A demonstration of the QA documentation a technical SEO engagement should produce.',
    challenge:'A hypothetical SaaS site has indexable parameter pages and unclear canonical ownership.',
    strategy:['Inventory templates and canonical targets.','Prioritize high-value crawl paths.','Create engineering tickets with rollback notes.'],
    execution:['Record baseline crawl evidence.','Deploy only owner-approved fixes.','Retest status, canonicals and indexability.']
  },
  {
    slug:'legal-service-page-architecture',label:'Illustrative workflow · not client work',niche:'Legal',outcome:'Content Architecture',kind:'playbook',
    title:'Legal service-page architecture',description:'Example content governance for a regulated, multi-practice service website.',
    challenge:'A hypothetical law firm needs helpful location and practice information without inaccurate legal claims.',
    strategy:['Map client questions to practice pages.','Define subject-matter reviewer and source standards.','Prioritize factual local relevance.'],
    execution:['Create the page and intent map.','Prepare lawyer-reviewed briefs.','Apply publication and compliance QA.']
  },
  {
    slug:'ecommerce-faceted-navigation',label:'Illustrative workflow · not client work',niche:'E-commerce',outcome:'Technical Execution',kind:'playbook',
    title:'E-commerce faceted-navigation QA',description:'A sample crawl-control and product taxonomy investigation for a growing online catalog.',
    challenge:'A hypothetical store generates large combinations of filter URLs and inconsistent product canonicals.',
    strategy:['Classify valuable search facets.','Agree indexable URL policy.','Align technical fixes with merchandising priorities.'],
    execution:['Export crawl inventory.','Implement robots, canonical, or navigation changes as approved.','Re-crawl and document exceptions.']
  }
];
export const workflow = [
  { n:'01', title:'Scope the work',text:'Define the site, market, goals, constraints and owner of each approval.' },
  { n:'02', title:'Validate the baseline',text:'Review access, crawls and sources before making recommendations.' },
  { n:'03', title:'Ship in reviewable batches',text:'Each ticket includes context, owner, acceptance criteria and evidence.' },
  { n:'04', title:'Retest and report',text:'Distinguish completed work from observed change and business outcomes.' }
];
export const pricing = [
  {name:'Essential', price:'$700', subtitle:'One focused SEO delivery lane', lines:['Priority task queue','Technical and on-page support','QA and implementation guidance','Monthly reporting']},
  {name:'Growth', price:'$1,000', subtitle:'A broader recurring SEO queue', lines:['Content briefs and on-page work','Technical and local support','Internal linking and review','Expanded delivery coordination']},
  {name:'Scale', price:'$1,500', subtitle:'Coordinated multi-workstream support', lines:['Multi-page or multi-market queue','White-label handoffs if scoped','Review and escalation planning','Reporting cadence by agreement']}
];
export const navLinks = [
  {label:'Services',href:'/services/'},{label:'Case studies',href:'/case-studies/'},{label:'Pricing',href:'/pricing/'},
  {label:'Insights',href:'/blog/'},{label:'About',href:'/about/'}
];
