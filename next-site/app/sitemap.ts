import type { MetadataRoute } from 'next';
import { services, evidence, indexingApproved } from '@/lib/content';
import { listLegacyRoutes } from '@/lib/legacy';
import { urlFor } from '@/lib/seo';
export default function sitemap():MetadataRoute.Sitemap{
  if(!indexingApproved)return [];
  const urls=['','services','case-studies','blog','about','talent','careers','pricing','contact','how-it-works',
    ...services.map(x=>'services/'+x.slug),...evidence.filter(x=>x.kind==='snapshot').map(x=>'case-studies/'+x.slug),...listLegacyRoutes()];
  return [...new Set(urls)].filter(x=>x!=='book-discovery-call').map(x=>({url:urlFor('/'+(x?x+'/':'')),changeFrequency:x.startsWith('blog/')?'monthly':'yearly' as const,priority:x===''?1:x.startsWith('services/')?0.7:0.5}));
}
