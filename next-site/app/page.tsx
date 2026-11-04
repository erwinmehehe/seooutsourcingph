import type { Metadata } from 'next';
import AgencyHome from '@/components/agency-home';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title:'SEO Outsourcing Philippines | Technical & White-Label SEO',
  description:'SEO Outsourcing Philippines provides technical, local, content and white-label SEO production for agencies and in-house teams. See sample deliverables and request a scope.',
  pathname:'/',
  keywords:['SEO outsourcing Philippines','white label SEO Philippines','SEO outsourcing services Philippines','Philippines SEO specialists','technical SEO outsourcing']
});
export default function Page(){return <AgencyHome/>;}
