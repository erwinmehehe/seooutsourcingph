import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Header, Footer } from '@/components/site';
import { BRAND, SITE_URL, indexingApproved } from '@/lib/content';
import { defaultDescription, organizationSchema } from '@/lib/seo';

export const metadata:Metadata = {
  metadataBase:new URL(SITE_URL),
  applicationName:BRAND,
  title:{default:'SEO Outsourcing Philippines | Technical & White-Label SEO',template:'%s | SEO Outsourcing Philippines'},
  description:defaultDescription,
  robots:indexingApproved?{index:true,follow:true}:{index:false,follow:true},
  icons:{icon:'/brand-mark.svg'},
  openGraph:{siteName:BRAND,type:'website',locale:'en_US',images:[{url:'/opengraph-image',width:1200,height:630,alt:BRAND}]},
  twitter:{card:'summary_large_image'}
};
export const viewport:Viewport={width:'device-width',initialScale:1,themeColor:'#F6F8F5'};
export default function RootLayout({children}:{children:React.ReactNode}){
  return <html lang="en"><body><a className="skip-link" href="#main">Skip to content</a><Header/>{children}<Footer/><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(organizationSchema).replace(/</g,'\\u003c')}}/></body></html>;
}
