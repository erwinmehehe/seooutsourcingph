import type { Metadata } from 'next';
import AgencyHome from '@/components/agency-home';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title:'SEO Outsourcing Philippines | White-Label SEO Delivery for Agencies',
  description:'SEO Outsourcing Philippines provides white-label technical SEO, keyword mapping, content and local search support. Inspect sample handoffs and request a defined SEO scope.',
  pathname:'/',
  keywords:['SEO outsourcing Philippines','white label SEO Philippines','SEO outsourcing services Philippines','Philippines SEO specialists','technical SEO outsourcing']
});
export default function Page(){return <AgencyHome/>;}
