import type { Metadata } from 'next';
import { HomePage } from '@/components/pages';
import { buildMetadata, defaultDescription } from '@/lib/seo';
export const metadata:Metadata=buildMetadata({title:'SEO Outsourcing Philippines | White-Label & Technical SEO',description:defaultDescription,pathname:'/',keywords:['white label SEO Philippines','outsource SEO to the Philippines','dedicated SEO team Philippines','SEO outsourcing services Philippines']});
export default function Page(){return <HomePage/>;}
