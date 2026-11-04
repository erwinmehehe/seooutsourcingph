import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { services, evidence, indexingApproved } from '@/lib/content';
import { getBlogPost, getBlogPosts, getLegacyPage, listLegacyRoutes } from '@/lib/legacy';
import { buildMetadata } from '@/lib/seo';
import { ServicesPage, ServiceDetailPage, CaseStudiesPage, CaseStudyDetailPage, BlogPage, BlogPostPage, AboutPage, TalentPage, CareersPage, PricingPage, ContactPage, HowItWorksPage, LegacyPage } from '@/components/pages';

type Props = {params:Promise<{slug:string[]}>};
const info:Record<string,{title:string;description:string}>={
  services:{title:'SEO Outsourcing Services Philippines',description:'Explore technical SEO, local SEO, AEO, structured data, content strategy and white-label SEO outsourcing services in the Philippines.'},
  'case-studies':{title:'SEO Case Studies & Evidence Library',description:'Inspect source-linked search visibility observations and transparent execution playbooks. No invented traffic or ROI claims.'},
  blog:{title:'SEO Outsourcing Philippines Blog & Guides',description:'Research-backed SEO outsourcing guides, practical checklists, vendor evaluation and technical SEO advice.'},
  about:{title:'About Our Philippines-Based SEO Delivery Team',description:'Discover the scope, quality-control process, and practical standards behind SEO Outsourcing Philippines.'},
  talent:{title:'Philippines SEO Talent & Specialist Directory',description:'Explore SEO specialist roles and evaluation standards for technical, local, content and reporting workstreams.'},
  careers:{title:'Join the SEO Outsourcing Philippines Talent Network',description:'Share your SEO experience and representative work for consideration in our Philippines-based delivery network.'},
  pricing:{title:'SEO Outsourcing Philippines Pricing & Delivery Models',description:'Compare SEO outsourcing rates, dedicated delivery and agency retainer models by scope, approvals and QA.'},
  contact:{title:'Contact SEO Outsourcing Philippines | Request an SEO Plan',description:'Request a technical SEO, white-label or content outsourcing scope. Share your website and get a reviewable plan.'},
  'book-discovery-call':{title:'Book an SEO Discovery Consultation',description:'Request a consultation for your SEO outsourcing needs, with clear scope and accountable delivery.'},
  'how-it-works':{title:'How SEO Outsourcing Philippines Works',description:'A practical four-step process for scoping, delivering and validating outsourced SEO work.'}
};
function makePath(slug:string[]){return '/'+slug.join('/')+'/';}
export async function generateStaticParams(){
  const paths=[...Object.keys(info),'results',...services.map(x=>'services/'+x.slug),...evidence.map(x=>'case-studies/'+x.slug),...getBlogPosts().map(x=>'blog/'+x.slug),...listLegacyRoutes()];
  return [...new Set(paths)].map(x=>({slug:x.split('/')}));
}
export async function generateMetadata({params}:Props):Promise<Metadata>{
  const {slug}=await params;const key=slug.join('/');
  if(info[key])return buildMetadata({...info[key],pathname:makePath(slug)});
  if(key==='results')return buildMetadata({...info['case-studies'],pathname:'/case-studies/'});
  if(slug[0]==='services'&&slug.length===2){const s=services.find(x=>x.slug===slug[1]);if(s)return buildMetadata({title:s.title+' Outsourcing Philippines',description:s.summary,pathname:makePath(slug),keywords:[s.keyword]});}
  if(slug[0]==='case-studies'&&slug.length===2){const item=evidence.find(x=>x.slug===slug[1]);if(item)return buildMetadata({title:item.title+' | Evidence & Methods',description:item.description,pathname:makePath(slug)});}
  if(slug[0]==='blog'&&slug.length===2){const p=getBlogPost(slug[1]);if(p)return buildMetadata({title:p.title,description:p.description,pathname:makePath(slug),type:'article'});}
  const legacy=getLegacyPage(key);
  if(legacy)return buildMetadata({title:legacy.title,description:legacy.description,pathname:makePath(slug)});
  return {title:'Page not found',robots:{index:false,follow:false}};
}
export default async function Page({params}:Props){
  const {slug}=await params;const key=slug.join('/');
  switch(key){
    case 'services':return <ServicesPage/>;
    case 'case-studies':case 'results':return <CaseStudiesPage/>;
    case 'blog':return <BlogPage/>;
    case 'about':return <AboutPage/>;
    case 'talent':return <TalentPage/>;
    case 'careers':return <CareersPage/>;
    case 'pricing':return <PricingPage/>;
    case 'contact':case 'book-discovery-call':return <ContactPage/>;
    case 'how-it-works':return <HowItWorksPage/>;
  }
  if(slug[0]==='services'&&slug.length===2){const s=services.find(x=>x.slug===slug[1]);if(s)return <ServiceDetailPage service={s}/>;}
  if(slug[0]==='case-studies'&&slug.length===2){const item=evidence.find(x=>x.slug===slug[1]);if(item)return <CaseStudyDetailPage item={item}/>;}
  if(slug[0]==='blog'&&slug.length===2){const post=getBlogPost(slug[1]);if(post)return <BlogPostPage post={post} slug={slug[1]}/>;}
  const legacy=getLegacyPage(key);if(legacy)return <LegacyPage route={key} page={legacy}/>;
  notFound();
}
