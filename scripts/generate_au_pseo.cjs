#!/usr/bin/env node
// Curated Australian SEO outsourcing services.
// Reproducible build: node scripts/generate_au_pseo.cjs --check
// No location permutations, scraping, spun text or automatic index approvals.
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const data=JSON.parse(fs.readFileSync(path.join(root,'pseo/australia/pages.json'),'utf8'));
const template=fs.readFileSync(path.join(root,'standalone/site/services/white-label-seo/index.html'),'utf8').replace(/\r\n/g,'\n');
function renderPage(base, p, isHub=false, all=[]){
  const esc=s=>String(s??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
  const para=s=>`<p>${esc(s)}</p>`;
  const path=isHub?"/australia/":`/australia/${p.slug}/`;
  const url="https://seooutsourcingphilippines.com"+path;
  const title=isHub?"SEO Outsourcing for Australian Agencies | Specialist Delivery":p.title;
  const desc=isHub?"Specialist SEO outsourcing services for Australian agencies, from web design launch QA and technical audit handoffs to GBP, content briefs and Shopify.":p.meta;
  const h1=isHub?"SEO Outsourcing for Australian Agencies":p.h1;
  const pageBreadcrumbs=`<div class="container crumbs" aria-label="Breadcrumbs"><a href="/">Home</a><span aria-hidden="true">/</span><a href="/for-agencies/">For agencies</a><span aria-hidden="true">/</span>${isHub?"Australia":`<a href="/australia/">Australia</a><span aria-hidden="true">/</span>${esc(h1)}`}</div>`;
  const hero=`<section class="page-hero"><div class="container"><span class="eyebrow light">${esc(isHub?"Australian agency partnerships":p.eyebrow)}</span><h1>${esc(h1)}</h1><p>${esc(isHub?"SEO support for Australian agencies: website launch checks, technical reviews, local search, content briefs and Shopify SEO.":p.lead)}</p><div class="btn-row"><a class="btn" href="/contact/?audience=agency${isHub?"":`&amp;service=${encodeURIComponent(p.service)}`}">Get a Quote →</a><a class="btn ghost" href="/samples/">View sample deliverables</a></div></div></section>`;
  let main="";
  if(isHub){
    const cards=all.map((z,i)=>`<article class="card feature-card"><span class="num">Specialist service ${String(i+1).padStart(2,"0")}</span><h3>${esc(z.h1)}</h3><p>${esc(z.lead)}</p><p><a class="more" href="/australia/${z.slug}/">Read the scope and QA criteria →</a></p></article>`).join("");
    const mrows=all.map(z=>`<tr><td><a href="/australia/${z.slug}/">${esc(z.h1)}</a></td><td>${esc(z.audience)}</td><td>${esc(z.sections[1].title)}</td></tr>`).join("");
    main=`${pageBreadcrumbs}${hero}
<section class="section"><div class="container"><div class="section-head"><div><span class="eyebrow">Pick the actual bottleneck</span><h2>Five different reasons an Australian agency might outsource SEO work</h2></div><p>A launch audit, GBP verification and Shopify market check do not need the same inputs or reviewer. Select the scenario closest to your client's problem.</p></div><div class="grid three">${cards}</div></div></section>
<section class="section soft"><div class="container editorial-layout"><article class="article">
<h2>Remote SEO support for Australian agencies</h2><p>Outsource launch checks, technical reviews, local business information updates, content briefs and Shopify SEO. We work remotely with your team, using your task formats and approval process.</p>
<h2>Which service fits the client problem?</h2><div class="v8-decision"><table class="responsive-table"><thead><tr><th>Service</th><th>Best starting buyer</th><th>First acceptance question</th></tr></thead><tbody>${mrows}</tbody></table></div>
<h2>The minimum information to send for a useful proposal</h2><p>Start with the client website, the Australian market it serves, its current platform, the specific symptom or backlog, and the person who can approve changes. If the client uses WordPress, Shopify, an internal development team or an outside legal reviewer, say so. Those dependencies determine what can be delivered.</p><ul><li>Website URL and a few commercially important pages.</li><li>Agency delivery model and whether direct client contact is prohibited.</li><li>Existing audit findings, ticket format or publishing workflow.</li><li>Approved market facts, business-service areas and known compliance requirements.</li><li>Requested first handoff and what the reviewer will accept as complete.</li></ul>
<h2>How an Australian agency can assess a Philippines-based partner</h2><p>Request a narrowly scoped pilot before moving an entire client roster. Evaluate whether the team asked for the right facts, documented exceptions, respected publication access, and delivered evidence that another specialist can reproduce. Keep client ownership, pricing, and sign-off rules explicit. <a href="/about/">Meet the operating brand</a>, examine <a href="/samples/">sample issue records</a>, and read the <a href="/how-it-works/">handoff method</a>.</p>
<p>View <a href="/results/">our work</a> for recorded keyword positions and their snapshot date.</p>
<h2>What your quote covers</h2><p>Your quote lists the tasks, deliverables, fees and review dates. It also identifies any changes assigned to your developer and the access required before work starts.</p>
</article><aside class="sidebar"><div class="side-box"><h3>Start with one client site</h3><p>Tell us the platform, the exact handoff problem, the client market and who signs off. We can then discuss a contained pilot.</p><p><a href="/contact/?audience=agency">Get a Quote →</a></p></div><div class="side-box"><h3>Existing services</h3><p><a href="/services/white-label-seo/">White-label SEO</a></p><p><a href="/services/technical-seo/">Technical SEO</a></p><p><a href="/services/seo-content/">SEO content</a></p></div></aside></div></section>`;
  }else{
    const blocks=p.sections.map((s,i)=>{
      const pp=s.paras.map(para).join("");
      const bullets=(s.bullets&&s.bullets.length)?`<ul>${s.bullets.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>`:"";
      const table=s.table?`<div class="v8-decision"><table class="responsive-table"><thead><tr>${s.table.headers.map(h=>`<th scope="col">${esc(h)}</th>`).join("")}</tr></thead><tbody>${s.table.rows.map(row=>`<tr>${row.map(c=>`<td>${esc(c)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`:"";
      return `<section aria-labelledby="pseo-${i+1}"><h2 id="pseo-${i+1}">${esc(s.title)}</h2>${pp}${bullets}${table}</section>`;
    }).join("");
    const questions=p.faq.map((a,i)=>`<section aria-labelledby="pseo-faq-${i+1}"><h3 id="pseo-faq-${i+1}">${esc(a.q)}</h3>${para(a.a)}</section>`).join("");
    const refLinks=p.sources.map(x=>`<li><a href="${esc(x.url)}" rel="noopener noreferrer" target="_blank">${esc(x.label)}</a></li>`).join("");
    const related=p.related.map(x=>`<li><a href="${esc(x.href)}">${esc(x.label)}</a></li>`).join("");
    main=`${pageBreadcrumbs}${hero}
<section class="section"><div class="container editorial-layout"><article class="article">
${p.intro.map(para).join("")}
${blocks}
<section aria-labelledby="pseo-faqs"><h2 id="pseo-faqs">Questions agencies ask before delegating this work</h2>${questions}</section>
<section aria-labelledby="pseo-references"><h2 id="pseo-references">References and verification</h2><p>Sources for the platform requirements discussed on this page.</p><ul>${refLinks}</ul></section>
</article><aside class="sidebar"><div class="side-box"><h3>Get the working worksheet</h3><p>Use the task fields and examples to agree what evidence is required before a handoff is accepted.</p><a class="btn" download href="/assets/resources/${esc(p.resource)}">${esc(p.resourceTitle)} ↓</a></div><div class="side-box"><h3>Other useful pages</h3><ul>${related}</ul><p><a href="/australia/">All Australian agency services →</a></p></div><div class="side-box"><h3>Proof standard</h3><p>Examples describe the proposed work. Portfolio rankings are recorded separately with a snapshot date.</p><p><a href="/results/">See the ranking evidence →</a></p></div></aside></div></section>`;
  }
  const cta=`<section class="cta-band"><div class="container cta-inner"><div><h2>${esc(isHub?"Choose one SEO bottleneck for a controlled pilot.":"Make the first SEO handoff easy to verify.")}</h2><p>${esc(isHub?"Send one website, the market and the work you need completed. We will discuss an accountable first scope instead of an unlimited package.":"Send the site, affected pages and your agency’s approval rules. Start with a bounded work item and the evidence your reviewer needs.")}</p></div><a class="btn gold" href="/contact/?audience=agency${isHub?"":`&amp;service=${encodeURIComponent(p.service)}`}">Get a Quote →</a></div></section>`;
  const replacement=`<main id="main">${main}${cta}</main>`;
  let out=base.replace(/<main id="main">[\s\S]*?<\/main>/,replacement);
  if(out===base)throw Error("Could not replace main");
  const rep=(pattern,value,label)=>{const previous=out;out=out.replace(pattern,value);if(previous===out)throw Error("Cannot update "+label);};
  rep(/<title>[\s\S]*?<\/title>/,`<title>${esc(title)}</title>`,"title");
  rep(/<meta content="[^"]*" name="description"\/>/,`<meta content="${esc(desc)}" name="description"/>`,"meta");
  rep(/<link href="https:\/\/seooutsourcingphilippines\.com\/services\/white-label-seo\/" rel="canonical"\/>/,`<link href="${esc(url)}" rel="canonical"/>`,"canonical");
  rep(/<meta content="[^"]*" property="og:title"\/>/,`<meta content="${esc(title)}" property="og:title"/>`,"og title");
  rep(/<meta content="[^"]*" property="og:description"\/>/,`<meta content="${esc(desc)}" property="og:description"/>`,"og desc");
  rep(/<meta content="[^"]*" property="og:url"\/>/,`<meta content="${esc(url)}" property="og:url"/>`,"og url");
  const bread=[{ "@type":"ListItem",position:1,name:"Home",item:"https://seooutsourcingphilippines.com/"},{ "@type":"ListItem",position:2,name:"For agencies",item:"https://seooutsourcingphilippines.com/for-agencies/"}];
  if(!isHub)bread.push({"@type":"ListItem",position:3,name:"Australia",item:"https://seooutsourcingphilippines.com/australia/"});
  bread.push({"@type":"ListItem",position:bread.length+1,name:h1,item:url});
  const schema={
    "@context":"https://schema.org",
    "@graph":[
      {"@type":"Organization","@id":"https://seooutsourcingphilippines.com/#organization",name:"SEO Outsourcing Philippines",url:"https://seooutsourcingphilippines.com/",email:"info@seooutsourcingphilippines.com"},
      {"@type":"WebPage","@id":url+"#webpage",url,name:h1,description:desc,inLanguage:"en",publisher:{"@id":"https://seooutsourcingphilippines.com/#organization"}},
      {"@type":"BreadcrumbList",itemListElement:bread}
    ]
  };
  rep(/<script type="application\/ld\+json">[\s\S]*?<\/script>/,`<script type="application/ld+json">${JSON.stringify(schema)}</script>`,"schema");
  if(!out.includes('noindex,follow'))throw Error("Staging noindex missing");
  return out.replaceAll("First acceptance question", "Before you get started").replaceAll("Read the scope and QA criteria", "Explore this service").replace(/<span class="eyebrow(?: light)?">[\s\S]*?<\/span>/g, "").replace(/<span class="num">[\s\S]*?<\/span>/g, "");
}
function csvContent(rows){return rows.map(row=>row.map(cell=>{let v=String(cell);return /[",\n]/.test(v)?'"'+v.replace(/"/g,'""')+'"':v;}).join(",")).join("\n")+"\n";}
const items=[{path:'standalone/site/australia/index.html',content:renderPage(template,{},true,data.pages)}];
for(const p of data.pages){
  const words=p.intro.join(' ')+' '+p.sections.map(s=>s.paras.join(' ')+' '+(s.bullets||[]).join(' ')).join(' ')+' '+p.faq.map(q=>q.q+' '+q.a).join(' ');
  if(words.split(/\s+/).length<580)throw Error('Insufficient page-specific text: '+p.slug);
  if(p.sources.length<1 || p.faq.length<3 || p.sections.length<5 || p.editorApproved===true)throw Error('Editorial review gate failed: '+p.slug);
  items.push({path:'standalone/site/australia/'+p.slug+'/index.html',content:renderPage(template,p,false)});
  const csv=csvContent(p.csv);
  items.push({path:'standalone/site/assets/resources/'+p.resource,content:csv});
  items.push({path:'wordpress/sop-premium-agency/assets/resources/'+p.resource,content:csv});
}
const check=process.argv.includes('--check');
let failed=0;
for(const item of items){
  const filename=path.join(root,item.path);
  if(check){
    if(!fs.existsSync(filename)||fs.readFileSync(filename,'utf8').replace(/\r\n/g,'\n')!==item.content.replace(/\r\n/g,'\n')){console.error('Out of sync: '+item.path);failed++;}
  }else{
    fs.mkdirSync(path.dirname(filename),{recursive:true});
    fs.writeFileSync(filename,item.content,'utf8');
  }
}
if(failed)process.exit(1);
console.log((check?'Validated':'Generated')+' '+items.length+' files (six Australia SEO pages and paired resources)');