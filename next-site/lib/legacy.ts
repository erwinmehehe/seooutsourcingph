import 'server-only';
import fs from 'node:fs';
import path from 'node:path';
import { load } from 'cheerio';

export type TocItem = { id: string; title: string; depth: number };
export type BlogPost = {slug:string;title:string;excerpt:string;category:string;minutes:number};
export type ImportedPage = {title:string;description:string;html:string;toc:TocItem[];minutes:number};

function legacyRoot(): string | null {
  const candidates = [
    path.resolve(process.cwd(),'../standalone/site'),
    path.resolve(process.cwd(),'standalone/site'),
    path.resolve(process.cwd(),'../../standalone/site')
  ];
  return candidates.find(p=>fs.existsSync(path.join(p,'blog/index.html'))) || null;
}
function source(route:string):string | null {
  const root=legacyRoot();
  if(!root || !/^[a-z0-9/-]+$/.test(route) || route.includes('..'))return null;
  const file=path.resolve(root,route,'index.html');
  if(!file.startsWith(root+path.sep))return null;
  try {return fs.readFileSync(file,'utf8');}catch{return null;}
}
function cleanMarkup(html:string){
  const $=load('<section id="import-root">'+html+'</section>');
  $('#import-root').find('script,style,iframe,object,embed,form,svg,video').remove();
  $('#import-root').find('*').each((_,el)=>{
    if(el.type!=='tag')return;
    const attribs=(el as typeof el & {attribs:Record<string,string>}).attribs;
    for(const key of Object.keys(attribs||{})){
      const value=attribs[key];
      if(key.toLowerCase().startsWith('on') || key==='style' || key==='srcdoc')$(el).removeAttr(key);
      if(['href','src'].includes(key) && /^\s*(javascript:|data:)/i.test(value))$(el).removeAttr(key);
    }
    if($(el).is('a[target="_blank"]'))$(el).attr('rel','noopener noreferrer');
  });
  const toc:TocItem[]=[];
  $('#import-root').find('h2,h3').each((i,el)=>{
    const heading=$(el);
    let id=heading.attr('id');
    if(!id){id=(heading.text().toLowerCase().replace(/[^a-z0-9\s-]/g,'').trim().replace(/\s+/g,'-')||'section')+'-'+i;heading.attr('id',id);}
    toc.push({id,title:heading.text().trim(),depth:el.tagName==='h3'?3:2});
  });
  return {html:$('#import-root').html()||'',toc};
}
export function getBlogPosts():BlogPost[]{
  const html=source('blog');
  if(!html){
    return [
      {slug:'seo-outsourcing-philippines-guide',title:'SEO Outsourcing in the Philippines: A Practical Buyer Guide',excerpt:'How to scope SEO support and review work before outsourcing.',category:'Outsourcing Strategy',minutes:8},
      {slug:'technical-seo-audit-checklist',title:'What Should an Agency Technical SEO Audit Include?',excerpt:'A checklist for reviewable technical SEO deliverables.',category:'Technical SEO',minutes:7}
    ];
  }
  const $=load(html);
  const posts:BlogPost[]=[];
  $('main article[data-topic]').each((_,el)=>{
    const card=$(el);
    const href=card.find('a[href^="/blog/"]').last().attr('href')||'';
    const slug=href.split('/').filter(Boolean).pop()||'';
    if(!slug || posts.some(p=>p.slug===slug))return;
    const doc=source('blog/'+slug);
    let minutes=7;
    if(doc){const $$=load(doc);const count=$$('main article.article').text().trim().split(/\s+/).length;minutes=Math.max(3,Math.ceil(count/220));}
    posts.push({slug,title:card.find('h3').first().text().trim(),excerpt:card.find('p').first().text().trim(),category:card.attr('data-topic')||'SEO Strategy',minutes});
  });
  return posts;
}
export function getBlogPost(slug:string):ImportedPage|null{
  const html=source('blog/'+slug);
  if(!html)return null;
  const $=load(html);
  const article=$('main article.article').first();
  if(!article.length)return null;
  const content=cleanMarkup(article.html()||'');
  return {
    title:$('main h1').first().text().trim(),
    description:$('meta[name="description"]').attr('content')||article.find('p').first().text().slice(0,160),
    html:content.html,toc:content.toc,minutes:Math.max(3,Math.ceil(article.text().split(/\s+/).length/220))
  };
}
export function getLegacyPage(route:string):ImportedPage|null{
  const html=source(route);
  if(!html)return null;
  const $=load(html);
  const title=$('main h1').first().text().trim()||$('title').text().trim();
  const description=$('meta[name="description"]').attr('content')||'';
  const primary=$('main article.article').first();
  let contentHTML='';
  if(primary.length){contentHTML=primary.html()||'';}
  else{
    const main=$('main').first().clone();
    main.find('.page-hero,.crumbs,.cta-band,.form-wrap,#contact-form,form').remove();
    contentHTML=main.html()||'';
  }
  const content=cleanMarkup(contentHTML);
  return {title,description,html:content.html,toc:content.toc,minutes:Math.max(2,Math.ceil($(contentHTML).text().split(/\s+/).length/220))};
}
export function listLegacyRoutes():string[]{
  const root=legacyRoot();
  if(!root)return [];
  const results:string[]=[];
  const walk=(dir:string,relative='')=>{
    for(const ent of fs.readdirSync(dir,{withFileTypes:true})){
      if(!ent.isDirectory()||ent.name==='assets')continue;
      const slug=path.posix.join(relative,ent.name);
      if(fs.existsSync(path.join(dir,ent.name,'index.html')))results.push(slug);
      if(slug.split('/').length<=5)walk(path.join(dir,ent.name),slug);
    }
  };
  walk(root);
  return results;
}
