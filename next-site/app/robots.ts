import type { MetadataRoute } from 'next';
import { SITE_URL, indexingApproved } from '@/lib/content';
export default function robots():MetadataRoute.Robots{
  // Preserve the repository's release gates. No automated publication approval.
  if(process.env.SITE_RELEASE_APPROVED!=='true'||process.env.SITE_INDEXABLE!=='true'||!indexingApproved)
    return {rules:{userAgent:'*',disallow:'/'}};
  return {rules:{userAgent:'*',allow:'/'},sitemap:SITE_URL+'/sitemap.xml'};
}
