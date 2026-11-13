import { build as viteBuild } from 'vite';
import { build as bundle } from 'esbuild';
import { renderToString } from 'react-dom/server';
import React from 'react';
import { readFile, writeFile, mkdir, copyFile, rm } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
await viteBuild();
const temp=path.resolve('.render.mjs');
const escape = value => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
try {
 await bundle({entryPoints:['src/App.tsx'],bundle:true,platform:'node',format:'esm',outfile:temp,external:['react','react-dom/server'],loader:{'.png':'dataurl','.svg':'dataurl','.webp':'dataurl'},jsx:'automatic'});
 const {default:App,WORK,LOGOS}=await import(pathToFileURL(temp).href+'?t='+Date.now());
 const markup=renderToString(React.createElement(App));
 let html=(await readFile('dist/index.html','utf8')).replace(/\r\n?/g,'\n');
 html=html.replace('<div id="root"></div>',()=>'<div id="root">'+markup+'</div>');
 await writeFile('dist/index.html',html);
 const target=path.resolve('../standalone/site');
 await mkdir(target,{recursive:true});
 await writeFile(path.join(target,'index.html'),html);
 await copyFile('public/favicon.svg',path.join(target,'assets/favicon.svg'));
 // WordPress uses the same rendered homepage and bundle, with its own wp_head/footer hooks.
 const theme=path.resolve('../wordpress/sop-premium-agency');
 await mkdir(path.join(theme,'templates'),{recursive:true});
 const styles=[...html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/g)].map(m=>m[1]).join('\n');
 const scripts=[...html.matchAll(/<script\b[^>]*type="module"[^>]*>([\s\S]*?)<\/script>/g)].map(m=>m[1]).join('\n');
 if(!styles || !scripts)throw new Error('Homepage assets were not found in the built HTML');
 await writeFile(path.join(theme,'assets/homepage.css'),styles);
 await writeFile(path.join(theme,'assets/homepage.js'),scripts);
 await writeFile(path.join(theme,'templates/homepage.html'),'<div id="root">'+markup+'</div>');
 for(const file of ['favicon.svg','og-image.png','page-shell.css','inner-pages.css','measurement.js','site.js'])await copyFile(path.join(target,'assets',file),path.join(theme,'assets',file));
 // Reuse the supplied portfolio data on the dedicated results route.
 const records=WORK.map(w=>`<article class="portfolio-record work-card" data-topic="${escape(w.sector)}"><div class="work-logo">${LOGOS[w.asset]?`<img src="${escape(LOGOS[w.asset])}" alt="${escape(w.name)}" loading="lazy"/>`:`<span class="wordmark">${escape(w.name)}</span>`}</div><div class="work-card-body"><h2>${escape(w.name)}</h2><p class="work-meta">${escape(w.tag)} · ${escape(w.place)}</p><div class="work-highlight"><span>${escape(w.query)}</span><strong>#${escape(w.position)}</strong></div><details><summary>View keyword positions</summary><table><caption class="sr-only">${escape(w.name)} keyword positions</caption><thead><tr><th scope="col">Search term</th><th scope="col">Position</th></tr></thead><tbody>${w.keywords.map(([q,n])=>`<tr><td>${escape(q)}</td><td>#${escape(n)}</td></tr>`).join('')}</tbody></table></details></div></article>`).join('');
 const filters=['All','Healthcare','Lifestyle','Professional services','Trades','Retail'].map(x=>`<button type="button" data-filter="${x}" aria-pressed="${x==='All'}">${x}</button>`).join('');
 const body=`<main id="main" class="inner-design"><section class="work-opening container"><h1>Our work</h1><a class="btn" href="/contact/">Get a Quote ↗</a></section><section class="container"><div class="work-toolbar" role="group" aria-label="Filter projects by sector">${filters}</div><div class="portfolio-records work-grid">${records}</div><p class="work-note">Rankings recorded 9 November 2026. Google Australia or US, as applicable. Positions may change.</p></section><section class="inner-close container"><h2>Discuss your website with us.</h2><a class="btn" href="/contact/">Get a Quote ↗</a></section></main>`;
 let results=await readFile(path.join(target,'results/index.html'),'utf8');
 results=results.replace(/<main\b[^>]*>[\s\S]*?<\/main>/,()=>body).replace(/<title>[\s\S]*?<\/title>/,'<title>SEO Portfolio | SEO Outsourcing Philippines</title>');
 results=results.replace(/<meta content="[^"]*" name="description"\/>/,'<meta content="Explore SEO portfolio projects and recorded keyword positions for businesses in Australia and the United States." name="description"/>');
 results=results.replace(/<meta content="[^"]*" property="og:title"\/>/,'<meta content="SEO Portfolio | SEO Outsourcing Philippines" property="og:title"/>').replace(/<meta content="[^"]*" property="og:description"\/>/,'<meta content="SEO portfolio projects and recorded keyword positions." property="og:description"/>');
 results=results.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/,'<script type="application/ld+json">'+JSON.stringify({'@context':'https://schema.org','@type':'CollectionPage',name:'Our work',url:'https://seooutsourcingphilippines.com/results/'})+'</script>');
 await writeFile(path.join(target,'results/index.html'),results);
 console.log('Built standalone and WordPress homepages; refreshed portfolio page.');
} finally {await rm(temp,{force:true})}
