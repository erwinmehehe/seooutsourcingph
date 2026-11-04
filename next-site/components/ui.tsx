'use client';

import { useEffect, useId, useMemo, useRef, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Check, ChevronDown, CircleCheck, Search, ExternalLink, LoaderCircle } from 'lucide-react';
import { services, evidence, type Evidence, type Service } from '@/lib/content';
import type { BlogPost, TocItem } from '@/lib/legacy';

export function ButtonLink({href,children,variant='primary',className=''}:{href:string;children:React.ReactNode;variant?:'primary'|'light'|'outline'|'plain';className?:string}){
  return <Link className={'button button-'+variant+' '+className} href={href}>{children}<ArrowUpRight size={17} aria-hidden="true"/></Link>;
}

export function LeadForm({mode='hero',source='website'}:{mode?:'hero'|'full'|'newsletter'|'talent';source?:string}){
  const formRef=useRef<HTMLFormElement>(null);
  const [sending,setSending]=useState(false);
  const [result,setResult]=useState<{ok:boolean;message:string}|null>(null);
  const isNewsletter=mode==='newsletter';
  const isTalent=mode==='talent';
  const controlId=useId().replace(/:/g,'');
  useEffect(()=>{
    if(typeof window==='undefined'||!formRef.current)return;
    const qs=new URLSearchParams(window.location.search);
    for(const key of ['service','plan','industry','audience']){
      const field=formRef.current.elements.namedItem(key);
      const value=qs.get(key);
      if(value&&field instanceof HTMLInputElement)field.value=value;
      if(value&&field instanceof HTMLSelectElement && [...field.options].some(o=>o.value===value))field.value=value;
    }
  },[]);
  async function submit(event:FormEvent<HTMLFormElement>){
    event.preventDefault();
    const form=event.currentTarget;
    if(!form.reportValidity()||sending)return;
    setSending(true);setResult(null);
    const values=Object.fromEntries(new FormData(form).entries());
    try{
      const response=await fetch('/api/leads/',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...values,kind:isNewsletter?'newsletter':isTalent?'talent':'consultation',source}),cache:'no-store'});
      const data=await response.json().catch(()=>({message:'Unable to process your request. Please email our team.'}));
      if(!response.ok)throw new Error(data.message||'Could not submit the form.');
      setResult({ok:true,message:'Thanks. Your request was received by the configured enquiry system.'});form.reset();
    }catch(error){setResult({ok:false,message:error instanceof Error?error.message:'Your message could not be delivered. Please email the team directly.'});}
    finally{setSending(false);}
  }
  return <form ref={formRef} onSubmit={submit} className={'lead-form '+(mode==='hero'?'lead-form-hero':'')} aria-label={isTalent?'Apply to join the talent network':isNewsletter?'Subscribe to SEO insights':'Request an SEO consultation'}>
    <div className="form-honeypot" aria-hidden="true"><label htmlFor={controlId+'-companysite'}>Leave this blank</label><input id={controlId+'-companysite'} name="companysite" tabIndex={-1} autoComplete="off"/></div>
    {mode==='hero'&&<div className="form-heading"><span className="eyebrow">START WITH A SPECIFIC WORKSTREAM</span><h2>Tell us what you need delivered.</h2><p>Share your website and bottleneck. We’ll discuss a reviewable scope.</p></div>}
    {isNewsletter ? <div className="newsletter-inline"><label className="sr-only" htmlFor={controlId+'-email'}>Email address</label><input id={controlId+'-email'} type="email" name="email" autoComplete="email" maxLength={254} placeholder="Work email address" required/><button className="button button-primary" type="submit" disabled={sending}>{sending?'Sending…':'Subscribe'}<ArrowRight size={16}/></button></div> :
    <div className="form-fields">
      <div className="form-pair"><div className="input-field"><label htmlFor={controlId+'-name'}>Full name <span>*</span></label><input id={controlId+'-name'} name="name" autoComplete="name" maxLength={120} required placeholder="Your name"/></div><div className="input-field"><label htmlFor={controlId+'-email'}>Work email <span>*</span></label><input id={controlId+'-email'} name="email" type="email" autoComplete="email" maxLength={254} required placeholder="you@company.com"/></div></div>
      {mode==='full'&&<div className="form-pair"><div className="input-field"><label htmlFor={controlId+'-company'}>Agency / company</label><input id={controlId+'-company'} name="company" autoComplete="organization" maxLength={160} placeholder="Company name"/></div><div className="input-field"><label htmlFor={controlId+'-audience'}>I'm enquiring for</label><select id={controlId+'-audience'} name="audience" defaultValue="agency"><option value="agency">An agency / client accounts</option><option value="business">My own business</option></select></div></div>}
      <div className="form-pair"><div className="input-field"><label htmlFor={controlId+'-website'}>{isTalent?'Portfolio or LinkedIn URL':'Website URL'}</label><input id={controlId+'-website'} name="website" type="url" maxLength={300} placeholder="https://example.com"/></div><div className="input-field"><label htmlFor={controlId+'-service'}>{isTalent?'Primary specialty':'What do you need help with?'}</label><select id={controlId+'-service'} name="service" defaultValue=""><option value="">Select a workstream</option>{services.map(s=><option key={s.slug} value={s.slug}>{s.title}</option>)}</select></div></div>
      {mode==='full'&&<div className="form-pair"><div className="input-field"><label htmlFor={controlId+'-plan'}>Support level</label><select id={controlId+'-plan'} name="plan" defaultValue=""><option value="">Not sure yet</option><option value="SEO Essential">SEO Essential</option><option value="SEO Growth">SEO Growth</option><option value="SEO Scale">SEO Scale</option><option value="Custom project / dedicated team">Custom project / dedicated team</option></select></div><div className="input-field"><label htmlFor={controlId+'-industry'}>Industry / market</label><input id={controlId+'-industry'} name="industry" maxLength={120} placeholder="e.g. SaaS, Australia"/></div></div>}
      {(mode==='full'||isTalent)&&<div className="input-field"><label htmlFor={controlId+'-message'}>{isTalent?'Experience, tools and availability':'Project details'}</label><textarea id={controlId+'-message'} name="message" rows={4} maxLength={3000} placeholder={isTalent?'Share your specialties and representative work. Do not include private client data.':'Tell us the market, challenges, and the work you want delivered.'}/></div>}
    </div>}
    <label className="consent"><input name="consent" type="checkbox" value="yes" required/><span>I agree to be contacted about this request and have reviewed the <Link href="/privacy-policy/">Privacy Policy</Link>.</span></label>
    {!isNewsletter&&<button className="button button-primary form-submit" disabled={sending} type="submit">{sending?<><LoaderCircle className="spin" size={16}/> Submitting…</>:<>{isTalent?'Send my application':'Request a clear SEO scope'}<ArrowRight size={17}/></>}</button>}
    {result&&<p className={'form-alert '+(result.ok?'success':'error')} role={result.ok?'status':'alert'}>{result.message} {!result.ok&&<a href="mailto:info@seooutsourcingphilippines.com">Email us instead</a>}</p>}
    {!isNewsletter&&<p className="form-footnote"><Check size={14} aria-hidden="true"/> A written scope is agreed before work starts.</p>}
  </form>;
}

export function ServiceTabs({featured=services.slice(0,6)}:{featured?:Service[]}){
  const [active,setActive]=useState(featured[0]?.slug||'');
  const reduce=useReducedMotion();
  const chosen=featured.find(s=>s.slug===active)||featured[0];
  return <div className="service-tabs">
    <div role="tablist" aria-label="SEO capabilities" className="tab-list">{featured.map((s,i)=><button key={s.slug} role="tab" id={'tab-'+s.slug} aria-selected={chosen.slug===s.slug} aria-controls="service-panel" tabIndex={chosen.slug===s.slug?0:-1} className={chosen.slug===s.slug?'tab active':'tab'} onClick={()=>setActive(s.slug)} onKeyDown={e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();const next=featured[(i+(e.key==='ArrowRight'?1:-1)+featured.length)%featured.length];setActive(next.slug);document.getElementById('tab-'+next.slug)?.focus();}}}><span>{s.number}</span>{s.title}<ArrowUpRight size={16}/></button>)}</div>
    <AnimatePresence mode="wait"><motion.div key={chosen.slug} id="service-panel" role="tabpanel" aria-labelledby={'tab-'+chosen.slug} initial={reduce?false:{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={reduce?{}:{opacity:0,y:-6}} transition={{duration:0.18}} className="tab-panel">
      <p className="eyebrow">CURRENT CAPABILITY / {chosen.number}</p><h3>{chosen.title}</h3><p>{chosen.summary}</p>
      <div className="thin-rule"/><div className="panel-checklist">{chosen.deliverables.slice(0,4).map(item=><span key={item}><CircleCheck size={16}/>{item}</span>)}</div>
      <Link href={'/services/'+chosen.slug+'/'} className="text-link">Explore {chosen.title} <ArrowUpRight size={18}/></Link>
    </motion.div></AnimatePresence>
  </div>;
}

export function FAQ({items}:{items:{question:string;answer:string}[]}){
  return <div className="faq-list">{items.map((x,i)=><details key={x.question} className="faq-item" open={i===0}><summary>{x.question}<ChevronDown aria-hidden="true" size={20}/></summary><p>{x.answer}</p></details>)}</div>;
}

export function MetricBars({top5,top10}:{top5:number;top10:number}){
  const max=Math.max(top10,1);
  return <div className="metric-bars" role="group" aria-label={'Ranking observation: '+top5+' tracked keywords in the top five, '+top10+' in the top ten'}>
    <div><span>Top 5 positions</span><strong>{top5}</strong><div className="bar-track"><div style={{width:Math.max(2,100*top5/max)+'%'}}/></div></div>
    <div><span>Top 10 positions</span><strong>{top10}</strong><div className="bar-track"><div style={{width:'100%'}}/></div></div>
    <p className="microcopy">One dated snapshot. Not a before/after traffic result.</p>
  </div>;
}

export function DemoChart({compact=false}:{compact?:boolean}){
  const [mode,setMode]=useState<'visibility'|'tasks'>('visibility');
  const values=mode==='visibility'?[34,39,36,49,45,56,54,62,69,65,78,87]:[12,18,28,27,41,53,61,72,78,86,91,96];
  const pts=values.map((v,i)=>(i*32)+','+(112-v)).join(' ');
  const baseline=values.map((v,i)=>(i*32)+','+(112-Math.round(v*.55))).join(' ');
  const first=pts.split(' ')[0];const last=pts.split(' ').at(-1);
  return <div className={'demo-chart '+(compact?'compact':'')}>
    <div className="chart-top"><div><span className="eyebrow">REPORTING UI PREVIEW</span><h3>{mode==='visibility'?'Visibility trajectory':'Tasks accepted'}</h3></div><div className="chart-switch" role="group" aria-label="Demo chart metric"><button aria-pressed={mode==='visibility'} onClick={()=>setMode('visibility')}>Visibility</button><button aria-pressed={mode==='tasks'} onClick={()=>setMode('tasks')}>Execution</button></div></div>
    <div className="chart-svg"><svg viewBox="0 0 370 126" role="img" aria-label={'Illustrative '+mode+' trend; fictional values for layout demonstration only'} preserveAspectRatio="none"><title>Demonstration chart, not client performance</title><path d="M0 29H370 M0 59H370 M0 89H370 M0 119H370" stroke="#D9E5DD" strokeWidth="1" fill="none"/><polygon points={'0,119 '+pts+' 352,119'} fill="#DCEFE4"/><polyline points={baseline} stroke="#6D8474" strokeWidth="2" strokeDasharray="5 5" fill="none"/><polyline points={pts} stroke="#09694D" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/><circle cx={first.split(',')[0]} cy={first.split(',')[1]} r="3" fill="#09694D"/><circle cx={last?.split(',')[0]} cy={last?.split(',')[1]} r="4" fill="#09694D"/></svg></div>
    <div className="chart-bottom"><span>Week 01</span><span>Week 12</span></div><div className="chart-legend"><span><i className="chart-legend-baseline"/>Before (demo)</span><span><i className="chart-legend-after"/>After (demo)</span></div><p className="microcopy">Fictional before/after series for design demonstration only. Not real client traffic, leads or ROI.</p>
  </div>;
}

export function EvidenceFilters({items=evidence}:{items?:Evidence[]}){
  const [niche,setNiche]=useState('All');
  const [outcome,setOutcome]=useState('All outcomes');
  const visible=useMemo(()=>items.filter(x=>(niche==='All'||x.niche===niche)&&(outcome==='All outcomes'||x.outcome===outcome)),[items,niche,outcome]);
  return <div><div className="filter-controls"><div role="group" aria-label="Filter by industry" className="filter-pills">{['All','B2B SaaS','Legal','E-commerce','Local Services'].map(n=><button key={n} type="button" className={niche===n?'filter-pill selected':'filter-pill'} aria-pressed={niche===n} onClick={()=>setNiche(n)}>{n}</button>)}</div><label className="select-filter">Outcome <select value={outcome} onChange={e=>setOutcome(e.target.value)}><option>All outcomes</option><option>Visibility</option><option>Technical Execution</option><option>Content Architecture</option></select></label></div>
    <div className="evidence-grid">{visible.map((item,i)=><Link href={'/case-studies/'+item.slug+'/'} key={item.slug} className="evidence-card">
      <div className="card-header-line"><span>{String(i+1).padStart(2,'0')} / {item.niche}</span><ArrowUpRight size={17}/></div><div className="case-graphic">{item.kind==='snapshot'&&item.top5!==undefined&&item.top10!==undefined?<MetricBars top5={item.top5} top10={item.top10}/>:<div className="framework-diagram"><span>DISCOVER</span><span>PRIORITIZE</span><span>VERIFY</span></div>}</div>
      <span className="eyebrow">{item.label}</span><h3>{item.title}</h3><p>{item.description}</p><span className="card-link">Review evidence and process <ArrowRight size={16}/></span>
    </Link>)}</div>
    {visible.length===0&&<div className="empty-state"><h3>No published evidence in this filter yet.</h3><p>We only add case studies and outcome claims when source records and permissions are available. Choose another filter to inspect the current library.</p><button onClick={()=>{setNiche('All');setOutcome('All outcomes');}} className="button button-outline">Clear filters</button></div>}
  </div>;
}

export function BlogExplorer({posts}:{posts:BlogPost[]}){
  const [query,setQuery]=useState('');const [category,setCategory]=useState('All');
  const categories=['All',...Array.from(new Set(posts.map(x=>x.category)))];
  const visible=posts.filter(x=>(category==='All'||x.category===category)&&((x.title+' '+x.excerpt).toLowerCase().includes(query.toLowerCase())));
  return <div><div className="blog-tools"><div className="search-field"><Search size={18} aria-hidden="true"/><label className="sr-only" htmlFor="blog-search">Search articles</label><input id="blog-search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search guides and checklists…"/></div><div className="filter-pills" role="group" aria-label="Article category">{categories.map(cat=><button type="button" key={cat} aria-pressed={category===cat} className={'filter-pill '+(category===cat?'selected':'')} onClick={()=>setCategory(cat)}>{cat}</button>)}</div></div>
    <div className="article-list">{visible.map((p,i)=><Link href={'/blog/'+p.slug+'/'} className="article-row" key={p.slug}><div className="article-index">{String(i+1).padStart(2,'0')}</div><div><span className="eyebrow">{p.category} · {p.minutes} MIN READ</span><h3>{p.title}</h3><p>{p.excerpt}</p></div><ArrowUpRight size={21} aria-hidden="true"/></Link>)}</div>
    {!visible.length&&<div className="empty-state"><h3>No matching articles.</h3><p>Try a different search or category.</p></div>}
  </div>;
}

export function TableOfContents({items}:{items:TocItem[]}){
  const [active,setActive]=useState('');
  useEffect(()=>{
    if(typeof IntersectionObserver==='undefined')return;
    const obs=new IntersectionObserver(entries=>{for(const e of entries){if(e.isIntersecting)setActive(e.target.id);}}, {rootMargin:'-12% 0px -70% 0px'});
    items.forEach(x=>{const el=document.getElementById(x.id);if(el)obs.observe(el);});
    return ()=>obs.disconnect();
  },[items]);
  if(!items.length)return null;
  return <nav className="toc" aria-label="On this page"><h3>ON THIS PAGE</h3>{items.map(x=><a key={x.id} className={(active===x.id?'active ':'')+(x.depth===3?'toc-sub':'')} href={'#'+x.id}>{x.title}</a>)}</nav>;
}

export function BookingPanel(){
  const url=process.env.NEXT_PUBLIC_SCHEDULING_URL;
  const valid=!!url&&/^https:\/\//.test(url);
  if(!valid)return <div className="booking-empty"><span className="eyebrow">SCHEDULING</span><h3>Start with a consultation request.</h3><p>Calendar availability is not connected yet. Use the form and the team can follow up through the verified contact channel.</p><a className="text-link" href="mailto:info@seooutsourcingphilippines.com">Email us directly <ArrowUpRight size={18}/></a></div>;
  return <div className="booking-embed"><iframe src={url} title="Book an SEO consultation" loading="lazy" referrerPolicy="strict-origin-when-cross-origin" allow="payment 'none'"/><p>Prefer a separate booking window? <a href={url} target="_blank" rel="noopener noreferrer">Open the calendar <ExternalLink size={14} aria-hidden="true"/></a></p></div>;
}
