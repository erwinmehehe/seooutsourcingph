import Link from 'next/link';
import { ArrowUpRight, ArrowRight, Download } from 'lucide-react';
import { services, evidence } from '@/lib/content';
import { LeadForm } from './ui';

/*
 * This is an intentionally editorial agency homepage, not a software product UI.
 * Claims here are limited to documented processes and clearly marked sample assets.
 */
const work = [
  {no:'01', title:'Technical SEO & audits', note:'Crawls, indexation checks, redirects, migrations and clear issue tickets.', url:'/services/technical-seo/', output:'Issue register / QA notes'},
  {no:'02', title:'Keyword & content planning', note:'Intent maps, content briefs, internal-link plans and editorial review.', url:'/services/semantic-keyword-mapping/', output:'Keyword map / content brief'},
  {no:'03', title:'Local SEO support', note:'Google Business Profile review, location pages and business data checks.', url:'/services/local-seo/', output:'GBP checklist / local page QA'},
  {no:'04', title:'Schema & answer search', note:'Structured data tied to real page facts and useful answer-focused content.', url:'/services/schema-entity-seo/', output:'JSON-LD plan / validation log'},
  {no:'05', title:'White-label production', note:'An extra pair of hands within your agency’s process, tools and approval chain.', url:'/services/white-label-seo/', output:'Task queue / review handoff'},
];
const observations=evidence.filter(x=>x.kind==='snapshot');

function SectionIntro({index,kicker,title,aside}:{index:string;kicker:string;title:string;aside?:string}){
  return <div className="studio-section-intro"><div className="studio-section-index"><span>{index}</span><span>{kicker}</span></div><h2>{title}</h2>{aside&&<p>{aside}</p>}</div>;
}

function WorkSheet(){return <div className="studio-sheet" aria-label="Illustrative technical SEO work log based on the site's downloadable example">
  <div className="studio-sheet-bar"><strong>WORK FILE / 001</strong><span>TECHNICAL SEO</span><span>EXAMPLE ONLY</span></div>
  <div className="studio-sheet-title"><div><span>Issue register · sample format</span><h3>One finding. One clear action.</h3></div><span className="studio-sheet-page">01 / 01</span></div>
  <div className="studio-sheet-field"><span>URL BEING REVIEWED</span><code>example.com/old-service/</code></div>
  <div className="studio-sheet-table" role="table" aria-label="Example SEO issue acceptance criteria">
    <div role="row"><span role="columnheader">THE ISSUE</span><p role="cell">An internal link points through a redirect chain.</p></div>
    <div role="row"><span role="columnheader">WHY IT MATTERS</span><p role="cell">Extra requests and an indirect route to the intended page.</p></div>
    <div role="row"><span role="columnheader">RECOMMENDED ACTION</span><p role="cell">Update the internal link to the approved final destination.</p></div>
    <div role="row"><span role="columnheader">HOW TO VERIFY</span><p role="cell">Re-crawl the source URL and confirm the target returns HTTP 200 directly.</p></div>
  </div>
  <div className="studio-sheet-foot"><span>Finding → action → retest → approval</span><a href="/assets/resources/technical_audit_issue_log.csv" download>Download sample CSV <Download size={15} aria-hidden="true"/></a></div>
</div>;}

export default function AgencyHome(){return <main id="main" className="studio-home">
  <section className="studio-hero" aria-labelledby="studio-title">
    <div className="container studio-hero-top"><span className="studio-overline">PHILIPPINES-BASED SEO PRODUCTION</span><span className="studio-edition">FOR AGENCIES & IN-HOUSE TEAMS / 2026</span></div>
    <div className="container studio-hero-grid">
      <div className="studio-hero-copy">
        <h1 id="studio-title">SEO Outsourcing<br/> Philippines</h1>
        <div className="studio-hero-deck"><span className="studio-short-rule" aria-hidden="true"/><p>Good SEO strategy needs people who can <em>get the work done.</em></p></div>
        <p className="studio-hero-desc">Technical SEO, keyword research, content and local search support for agencies and in-house teams. Scoped tasks. Reviewable files. Your approval before publishing.</p>
        <div className="studio-hero-links"><Link href="/samples/">See a work sample <ArrowUpRight size={17}/></Link><Link href="/how-it-works/">How we work <ArrowRight size={17}/></Link></div>
        <div className="studio-hero-meta"><span>White-label or direct</span><span>Project or ongoing support</span><span>Review before publishing</span></div>
      </div>
      <aside className="studio-enquiry" id="hero-audit-form" aria-label="Request an SEO project scope">
        <div className="studio-enquiry-eyebrow"><span>START A CONVERSATION</span><span>01 / ENQUIRY</span></div>
        <LeadForm mode="hero" source="studio-home-brief"/>
      </aside>
    </div>
    <div className="container studio-hero-caption"><span>We work behind your deliverables, not in front of your clients.</span><span>SCROLL TO SEE THE WORK ↓</span></div>
  </section>

  <section className="studio-approach" aria-labelledby="studio-approach-title"><div className="container studio-approach-grid">
    <div className="studio-side-label">WHAT YOU ARE HIRING / NOT A PLATFORM</div>
    <div><h2 id="studio-approach-title">We are here for the <em>work between the strategy and the results.</em></h2><p>A crawl that turns into fixable tickets. A content plan your writers can use. Location pages checked before launch. Work that your SEO lead can understand, approve and report on.</p></div>
  </div></section>

  <section className="studio-work" id="work-sample" aria-labelledby="studio-work-title"><div className="container">
    <SectionIntro index="01" kicker="INSIDE AN SEO HANDOFF" title="See the standard, not another sales promise." aside="A finished task should leave a trail: what we found, what changed, who checks it, and how we know it is complete."/>
    <div className="studio-work-grid"><div className="studio-work-story"><span className="studio-orange-label">EXAMPLE DELIVERABLE</span><h3 id="studio-work-title">Useful to your strategist. Clear to your developer.</h3><p>This sample shows the structure of a technical SEO issue log. It is deliberately a sample, not a claimed client win.</p><ol><li><span>01</span>Reproduce the issue.</li><li><span>02</span>Assign a fix and owner.</li><li><span>03</span>Retest before sign-off.</li></ol><Link href="/samples/">Explore sample work <ArrowUpRight size={17}/></Link></div><WorkSheet/></div>
  </div></section>

  <section className="studio-services" aria-labelledby="studio-services-title"><div className="container">
    <SectionIntro index="02" kicker="WHAT WE HANDLE" title="The work your team needs finished." aside="Start with a technical task, a content queue or a local SEO backlog. Expand only when the workflow is working."/>
    <div className="studio-service-list">{work.map(item=><Link href={item.url} key={item.no} className="studio-service-row"><span className="studio-row-no">{item.no}</span><div className="studio-row-title"><h3>{item.title}</h3><p>{item.note}</p></div><span className="studio-row-output">{item.output}</span><ArrowUpRight size={22} aria-hidden="true"/></Link>)}</div>
    <div className="studio-service-end"><span>Prefer a full service list?</span><Link href="/services/">View every SEO service <ArrowUpRight size={16}/></Link></div>
  </div></section>

  <section className="studio-audience" aria-labelledby="studio-audience-title"><div className="container">
    <div className="studio-audience-intro"><span className="studio-section-index">03 / WHO WE SUPPORT</span><h2 id="studio-audience-title">An extension of your team. <em>Not a replacement for your judgement.</em></h2></div>
    <div className="studio-audience-grid"><div><span>FOR SEO & MARKETING AGENCIES</span><h3>More delivery capacity.<br/>Your name on the work.</h3><p>We work to the brief, tools and standards you set. You retain your client relationship, strategy and final sign-off.</p><Link href="/for-agencies/">Explore white-label support <ArrowUpRight size={17}/></Link></div><div><span>FOR IN-HOUSE MARKETING TEAMS</span><h3>Your roadmap.<br/>An extra set of hands.</h3><p>Get technical, content and local search tasks moving without building a separate department for every specialty.</p><Link href="/for-businesses/">Explore direct SEO support <ArrowUpRight size={17}/></Link></div></div>
  </div></section>

  <section className="studio-evidence" aria-labelledby="studio-evidence-title"><div className="container">
    <SectionIntro index="04" kicker="WHAT THE NUMBERS ACTUALLY SAY" title="Evidence needs context." aside="These are dated ranking observations linked from the existing site, not before-and-after case studies. We do not claim they prove traffic, revenue or our attribution."/>
    <div className="studio-observation-list"><div className="studio-observation-head"><span>OBSERVED SEARCH MARKET</span><span>TOP 5 TERMS</span><span>TOP 10 TERMS</span><span>ORIGINAL SOURCE</span></div>{observations.map(item=><div className="studio-observation" key={item.slug}><div><strong>{item.title}</strong><small>{item.location} · 3 October 2026</small></div><span>{item.top5}</span><span>{item.top10}</span><a href={item.source} rel="noopener noreferrer" target="_blank">SE Ranking <ArrowUpRight size={16}/></a></div>)}</div>
    <p className="studio-evidence-disclaimer">Search positions depend on time, location and device. These figures have not been independently verified as SEO Outsourcing Philippines client outcomes. No lead or revenue impact is claimed.</p>
    <Link className="studio-evidence-link" href="/case-studies/">Review the evidence library <ArrowUpRight size={17}/></Link>
  </div></section>

  <section className="studio-process" aria-labelledby="studio-process-title"><div className="container studio-process-grid"><div><span className="studio-section-index">05 / HOW ENGAGEMENTS START</span><h2 id="studio-process-title">Start small.<br/><em>See how we work.</em></h2><p>A practical first task will tell you more than a large retainer proposal. Define a job, agree the review standard, then decide whether to build a recurring workstream.</p><Link href="/pricing/">Engagement models & pricing <ArrowUpRight size={16}/></Link></div><ol><li><span>01</span><div><strong>Show us the site and backlog</strong><p>Share the work you cannot get to, your market and current constraints.</p></div></li><li><span>02</span><div><strong>Agree on a first deliverable</strong><p>Confirm output, access, responsibilities, deadline and acceptance criteria.</p></div></li><li><span>03</span><div><strong>Review the finished work</strong><p>Get the files and evidence your team needs to approve or revise.</p></div></li></ol></div></section>

  <section className="studio-outro"><div className="container studio-outro-inner"><span>HAVE A PROJECT IN MIND?</span><h2>Tell us what needs doing.</h2><p>A useful first conversation starts with one site, one bottleneck and a clear outcome for the work itself.</p><div><Link href="/#hero-audit-form">Send a project brief <ArrowUpRight size={18}/></Link><Link href="/contact/">Other ways to reach us <ArrowRight size={18}/></Link></div></div></section>
</main>;}
