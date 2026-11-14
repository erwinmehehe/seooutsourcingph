import type { Metadata } from 'next';
import { BRAND, SITE_URL, indexingApproved } from './content';

type SeoArgs = { title:string; description:string; pathname:string; type?:'website'|'article'; keywords?:string[] };
export const defaultDescription='SEO Outsourcing Philippines for agencies and in-house teams. Technical SEO, local SEO, content and white-label delivery with clear scopes and reviewable QA.';
export function urlFor(pathname:string){return new URL(pathname.startsWith('/')?pathname:'/'+pathname,SITE_URL).toString();}
export function buildMetadata({title,description,pathname,type='website',keywords=[]}:SeoArgs):Metadata{
  const fullTitle=title.includes(BRAND)?title:title+' | '+BRAND;
  return {
    title:{absolute:fullTitle},
    description,
    keywords: ['SEO outsourcing Philippines', 'SEO services Philippines', ...keywords],
    alternates:{canonical:urlFor(pathname)},
    robots:indexingApproved?{index:true,follow:true}:{index:false,follow:true},
    openGraph:{type,title:fullTitle,description,url:urlFor(pathname),siteName:BRAND,locale:'en_US',images:[{url:urlFor('/opengraph-image'),width:1200,height:630,alt:BRAND}]},
    twitter:{card:'summary_large_image',title:fullTitle,description}
  };
}
export const organizationSchema = {
  '@context':'https://schema.org',
  '@type':'Organization',
  '@id':SITE_URL+'/#organization',name:BRAND,url:SITE_URL+'/',email:'info@seooutsourcingphilippines.com',
  description:'Philippines-based SEO delivery supporting agencies and businesses with scoped, reviewable work.'
};
export function breadcrumbsSchema(items:{name:string;path:string}[]){
  return {'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:items.map((x,i)=>({'@type':'ListItem',position:i+1,name:x.name,item:urlFor(x.path)}))};
}
