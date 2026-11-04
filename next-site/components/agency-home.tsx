import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Check, Download, FileCheck2, MoveUpRight } from 'lucide-react';
import { evidence, services, workflow } from '@/lib/content';
import { LeadForm, ServiceTabs, ButtonLink } from './ui';

const handoffStages = [
  {n:'01',label:'DIAGNOSE',title:'Find the issue',text:'Record the affected URL and a reproducible finding.'},
  {n:'02',label:'IMPLEMENT',title:'Make the change',text:'Assign a clear owner and agree the fix before publishing.'},
  {n:'03',label:'VERIFY',title:'Prove it works',text:'Re-test the page and attach the result for review.'}
];

const sourceSnapshots = evidence.filter(item => item.kind === 'snapshot');

const deliveryModels = [
  {n:'01',name:'A defined SEO project',fit:'A crawl, migration, site section, or research task',output:'A scoped output with milestones, review notes and an acceptance check',href:'/contact/?plan=Custom%20project%20%2F%20dedicated%20team#lead-form'},
  {n:'02',name:'A recurring delivery lane',fit:'Technical, content or local SEO work that needs a steady queue',output:'Priorities, completed work, blockers and an agreed review cadence',href:'/pricing/'},
  {n:'03',name:'White-label support',fit:'Agency clients whose brand, strategy and approvals stay with their team',output:'Work files and handoffs aligned to the agency’s existing process',href:'/for-agencies/'}
];

function IssueSheet() {
  return <div className="a-issue" aria-label="Illustrative technical SEO ticket format, not client work">
    <div className="a-issue-top"><span className="a-issue-brand">SOP<span className="a-period">.</span> / DELIVERY NOTES</span><span>FILE 001 — SAMPLE</span></div>
    <div className="a-issue-head"><div><span className="a-mono">TECHNICAL SEO / REPRODUCIBLE FINDING</span><h3>Redirect chain<br/>on a service URL.</h3></div><div className="a-issue-stamp">EXAMPLE<br/>ONLY</div></div>
    <div className="a-issue-target"><span>PAGE UNDER REVIEW</span><code>example.com/old-service/</code><span className="a-issue-priority">HIGH PRIORITY</span></div>
    <dl className="a-issue-detail"><div><dt>01 / ISSUE</dt><dd>An internal link passes through unnecessary redirects before reaching its final destination.</dd></div><div><dt>02 / RECOMMENDED FIX</dt><dd>Update the internal link to the approved destination. Keep external redirects where they are still needed.</dd></div><div><dt>03 / ACCEPTANCE CHECK</dt><dd>Re-crawl the source page. Verify a direct HTTP 200 response and record the result.</dd></div><div><dt>04 / APPROVAL</dt><dd>Implementation owner and reviewer are assigned in the actual work order.</dd></div></dl>
    <div className="a-issue-bottom"><div><FileCheck2 size={18} aria-hidden="true"/><span>Documented evidence. An explicit handoff.</span></div><a download href="/assets/resources/technical_audit_issue_log.csv">DOWNLOAD SAMPLE CSV <Download size={15} aria-hidden="true"/></a></div>
    <div className="a-issue-fineprint">Illustrative issue-ticket structure adapted from the repository’s sample audit log. No client performance is represented.</div>
  </div>;
}

function EditorialHeading({number,eyebrow,title,description}:{number:string;eyebrow:string;title:string;description?:string}){
  return <div className="a-section-head"><div className="a-index"><span>{number}</span><span className="a-mono">{eyebrow}</span></div><h2>{title}</h2>{description&&<p>{description}</p>}</div>;
}

export default function AgencyHome(){
  return <main id="main" className="agency-page">
    <section className="a-hero" aria-labelledby="a-hero-title">
      <div className="container a-hero-inner">
        <div className="a-hero-copy">
          <div className="a-hero-kicker"><span className="a-cross">✳</span><span>THE SEO DELIVERY PARTNER</span><span className="a-hero-kicker-divider"/><span>BASED IN THE PHILIPPINES</span></div>
          <h1 id="a-hero-title">SEO Outsourcing <span>Philippines</span></h1>
          <p className="a-hero-lede">Your agency out front.<br/><strong>Our specialists on the work.</strong></p>
          <p className="a-hero-support">White-label technical SEO, content operations, keyword mapping and local search support for agencies and in-house teams. Defined tasks. Reviewable files. Your approval before publishing.</p>
          <div className="a-hero-actions"><Link className="a-hero-link" href="/samples/">See how a real handoff is structured <ArrowUpRight size={19}/></Link><Link className="a-hero-secondary" href="/for-agencies/">For agency partners <ArrowRight size={17}/></Link></div>
          <div className="a-hero-proof" aria-label="Delivery standards"><span><Check size={15}/> Scope in writing</span><span><Check size={15}/> QA checkpoints</span><span><Check size={15}/> Clear review ownership</span></div>
        </div>
        <div className="a-hero-form" id="hero-audit-form"><div className="a-form-ribbon"><span>THE WORK STARTS WITH A BRIEF</span><span>01 / REQUEST</span></div><LeadForm mode="hero" source="principal-agency-homepage"/><div className="a-form-bottom"><span className="a-mono">NO GUESSWORK ABOUT THE SCOPE</span><span className="a-form-bottom-mark">↗</span></div></div>
      </div>
      <div className="container a-hero-bottom"><span>YOUR STRATEGY</span><span>OUR DELIVERY CAPACITY</span><span>AGREED REVIEW & SIGN-OFF</span><span>PHILIPPINES → INTERNATIONAL TEAMS</span></div>
    </section>

    <section className="a-manifesto" aria-labelledby="a-manifesto-title">
      <div className="container a-manifesto-inner"><div className="a-manifesto-label"><span className="a-mono">AN SEO PRODUCTION PARTNER</span><span>NOT ANOTHER<br/>ACTIVITY REPORT.</span></div><h2 id="a-manifesto-title">We make the <em>work behind</em> the SEO strategy easier to delegate, review and ship.</h2><div className="a-manifesto-aside"><p>Most agencies don’t need another promise about rankings. They need technical fixes documented, content briefs prepared, local pages checked, and a reliable handoff their strategist can approve.</p><Link href="/how-it-works/">Our delivery approach <ArrowUpRight size={17}/></Link></div></div>
    </section>

    <section className="a-workbench" id="work-sample" aria-labelledby="a-workbench-title"><div className="container">
      <div className="a-workbench-heading"><div><span className="a-mono a-kicker">01 / THE WORK, NOT THE PITCH</span><h2 id="a-workbench-title">The difference is<br/><em>in the handoff.</em></h2></div><div><p>An SEO recommendation should be useful to the person implementing it and the person signing it off. Here is a sample of the ticket structure we use to explain that standard.</p><Link className="a-underline" href="/samples/">Inspect our sample deliverables <ArrowUpRight size={16}/></Link></div></div>
      <div className="a-workbench-grid"><div className="a-workbench-side"><div className="a-side-label"><span className="a-mono">THE ACCEPTANCE STANDARD</span><span>001 / 003</span></div>{handoffStages.map(step=><div className="a-work-stage" key={step.n}><span className="a-stage-number">{step.n}</span><div><span className="a-mono">{step.label}</span><h3>{step.title}</h3><p>{step.text}</p></div></div>)}<div className="a-sample-caveat"><span className="a-mono">ON PROOF</span><p>This sample demonstrates a workflow, not a client result. We do not invent traffic growth, conversion lifts or testimonials.</p></div></div><IssueSheet/></div>
    </div></section>

    <section className="a-capabilities" id="services" aria-labelledby="a-capabilities-title"><div className="container"><EditorialHeading number="02" eyebrow="OUR PRODUCTION CAPABILITIES" title="A specialist bench for the parts of SEO that take real time." description="Start with one workstream. Add capacity when your process and quality bar are established."/><ServiceTabs featured={[services[0],services[2],services[3],services[4],services[5],services[6]]}/><div className="a-service-link-row"><span className="a-mono">ALSO AVAILABLE / AUDITS · ON-PAGE · REPORTING · WHITE-LABEL</span><Link href="/services/">Explore all SEO services <ArrowUpRight size={16}/></Link></div></div></section>

    <section className="a-partners" id="who-we-help" aria-labelledby="a-partners-title"><div className="container"><div className="a-partners-intro"><span className="a-mono">03 / THE RIGHT WORKING RELATIONSHIP</span><h2 id="a-partners-title">A partner behind your agency. <em>Or beside your internal team.</em></h2></div><div className="a-partner-layout">
      <Link href="/for-agencies/" className="a-partner-panel a-partner-agency"><div className="a-partner-top"><span>01 / FOR AGENCIES</span><ArrowUpRight size={23}/></div><span className="a-partner-glyph" aria-hidden="true">A<span>↗</span></span><h3>Your brand.<br/>Our production.</h3><p>Technical SEO, content and local search delivery aligned to your SOPs, client boundaries and approvals.</p><div className="a-partner-bottom"><span>WHITE-LABEL DELIVERY</span><span>EXPLORE THE MODEL →</span></div></Link>
      <Link href="/for-businesses/" className="a-partner-panel a-partner-business"><div className="a-partner-top"><span>02 / FOR IN-HOUSE TEAMS</span><ArrowUpRight size={23}/></div><span className="a-partner-glyph" aria-hidden="true">B<span>↗</span></span><h3>Your priorities.<br/>More hands on deck.</h3><p>Practical execution support for site owners and marketing teams with an existing growth roadmap and a defined backlog.</p><div className="a-partner-bottom"><span>DEDICATED SEO SUPPORT</span><span>EXPLORE THE MODEL →</span></div></Link>
    </div></div></section>

    <section className="a-method" aria-labelledby="a-method-title"><div className="container a-method-grid"><div className="a-method-intro"><span className="a-mono">04 / THE OPERATING RHYTHM</span><h2 id="a-method-title">Make the SEO queue <em>visible.</em> Keep decisions with the right people.</h2><p>Clear responsibilities reduce rework. Every workstream starts with scope, continues through documented execution and ends with a reviewer who can say what passed.</p><ButtonLink href="/how-it-works/" variant="light">View the delivery process</ButtonLink></div><div className="a-method-steps">{workflow.map(step=><div className="a-method-step" key={step.n}><span>{step.n}</span><div><h3>{step.title}</h3><p>{step.text}</p></div><span className="a-method-tick" aria-hidden="true">↗</span></div>)}</div></div></section>

    <section className="a-evidence" id="evidence" aria-labelledby="a-evidence-title"><div className="container"><EditorialHeading number="05" eyebrow="EVIDENCE, NOT STORYTELLING" title="Numbers deserve a source, a date and an explanation." description="These published Australian dental ranking records are observations. Their relationship to the agency’s work, revenue or traffic growth has not been independently established."/>
      <div className="a-evidence-head"><span>OBSERVATION / LOCATION</span><span>TRACKED TOP 5</span><span>TRACKED TOP 10</span><span>SOURCE</span></div>
      <div className="a-evidence-list">{sourceSnapshots.map((item,i)=><div className="a-evidence-row" key={item.slug}><div className="a-evidence-name"><span className="a-mono">0{i+1} / 03 OCT 2026</span><h3>{item.title}</h3><p>{item.location}</p></div><div className="a-evidence-stat"><strong>{item.top5}</strong><small>tracked terms</small></div><div className="a-evidence-stat"><strong>{item.top10}</strong><small>tracked terms</small></div><div className="a-evidence-source"><a href={item.source} target="_blank" rel="noopener noreferrer">View source <ArrowUpRight size={16}/></a></div></div>)}</div>
      <div className="a-evidence-note"><span>PLEASE READ THE FOOTNOTE</span><p>Rankings reflect a recorded search setting at a point in time. They do not prove who produced the work or demonstrate increased traffic, leads or revenue. We keep those claims separate until attribution and permissions are verified.</p><Link href="/case-studies/">Explore the evidence library <ArrowUpRight size={17}/></Link></div>
    </div></section>

    <section className="a-engagement" aria-labelledby="a-engagement-title"><div className="container"><div className="a-engagement-head"><div><span className="a-mono">06 / HOW TO ENGAGE</span><h2 id="a-engagement-title">Buy a deliverable.<br/>Build a delivery lane.</h2></div><p>Different workloads call for different contracts. We quote the actual scope, capacity, review requirements and dependencies. Published starting prices are subject to confirmation.</p></div><div className="a-engagement-list">{deliveryModels.map(item=><Link key={item.n} href={item.href} className="a-engagement-row"><span className="a-engagement-n">{item.n}</span><div><h3>{item.name}</h3><p>{item.fit}</p></div><div className="a-engagement-output"><span>WHAT GETS DEFINED</span><p>{item.output}</p></div><ArrowUpRight className="a-engagement-arrow" size={23}/></Link>)}</div></div></section>

    <section className="a-outro"><div className="container a-outro-inner"><span className="a-mono">THE NEXT MOVE / AN AGREED FIRST WORKSTREAM</span><h2>Bring us the SEO backlog.<br/><em>We’ll talk about the work.</em></h2><p>Tell us the website, market and bottleneck. We can discuss a sensible pilot, required access and what the first accepted deliverable should look like.</p><div><ButtonLink href="/#hero-audit-form" variant="light">Request an SEO scope</ButtonLink><Link href="/samples/" className="a-outro-secondary">Review a work sample <ArrowUpRight size={17}/></Link></div></div><div className="container a-outro-bottom"><span>SEO OUTSOURCING PHILIPPINES</span><span>YOUR BRAND OUT FRONT. OUR SPECIALISTS ON THE WORK.</span><MoveUpRight size={22} aria-hidden="true"/></div></section>
  </main>;
}
