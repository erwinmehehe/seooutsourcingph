import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import './agency.css';
import { Header, Footer } from '@/components/site';
import { BRAND, SITE_URL, indexingApproved } from '@/lib/content';
import { defaultDescription, organizationSchema } from '@/lib/seo';

const geist = Geist({subsets:['latin'],variable:'--font-geist',display:'swap'});
const geistMono = Geist_Mono({subsets:['latin'],variable:'--font-geist-mono',display:'swap'});

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
export const viewport:Viewport={width:'device-width',initialScale:1,themeColor:'#143327'};
export default function RootLayout({children}:{children:React.ReactNode}){
  return <html lang="en"><body className={`${geist.variable} ${geistMono.variable}`}><a className="skip-link" href="#main">Skip to content</a><Header/>{children}<Footer/><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(organizationSchema).replace(/</g,'\\u003c')}}/></body></html>;
}
