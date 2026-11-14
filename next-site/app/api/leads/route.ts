import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export const runtime='nodejs';
const requestSchema=z.object({
  kind:z.enum(['consultation','newsletter','talent']),
  source:z.string().max(100).default('website'),
  name:z.string().trim().max(120).optional().default(''),
  email:z.string().trim().email().max(254),
  company:z.string().trim().max(160).optional().default(''),
  website:z.union([z.string().url().max(300),z.literal('')]).optional().default(''),
  audience:z.enum(['agency','business']).optional(),
  service:z.string().trim().max(100).optional().default(''),
  industry:z.string().trim().max(120).optional().default(''),
  plan:z.string().trim().max(120).optional().default(''),
  message:z.string().trim().max(3000).optional().default(''),
  consent:z.literal('yes'),
  companysite:z.string().max(300).optional().default('')
});
function answer(status:number,message:string){return NextResponse.json({message},{status,headers:{'Cache-Control':'no-store'}});}
export async function POST(request:NextRequest){
  const origin=request.headers.get('origin');
  if(origin){
    try{if(new URL(origin).host!==request.nextUrl.host)return answer(403,'This form must be submitted from the website.');}
    catch{return answer(403,'Invalid request origin.');}
  }
  const size=Number(request.headers.get('content-length')||0);
  if(size>10000)return answer(413,'The message is too long.');
  let body:unknown;
  try{body=await request.json();}catch{return answer(400,'Please check the form and try again.');}
  const parsed=requestSchema.safeParse(body);
  if(!parsed.success)return answer(422,'Please check the required fields and privacy consent.');
  const data=parsed.data;
  if(data.companysite)return answer(200,'Request processed.'); // silent honeypot response, no notification
  if(data.kind!=='newsletter' && !data.name)return answer(422,'Please enter your name.');
  const endpoint=process.env.LEADS_WEBHOOK_URL;
  if(!endpoint)return answer(503,'The enquiry service has not been connected yet. Please email info@seooutsourcingphilippines.com directly.');
  try{
    const u=new URL(endpoint);
    if(u.protocol!=='https:')return answer(503,'The enquiry service is not configured securely. Please email us instead.');
    const headers:Record<string,string>={'Content-Type':'application/json','Accept':'application/json'};
    if(process.env.LEADS_WEBHOOK_BEARER_TOKEN)headers.Authorization='Bearer '+process.env.LEADS_WEBHOOK_BEARER_TOKEN;
    const upstream=await fetch(endpoint,{
      method:'POST',headers,
      body:JSON.stringify({kind:data.kind,source:data.source,name:data.name,email:data.email,company:data.company,website:data.website,audience:data.audience,service:data.service,industry:data.industry,plan:data.plan,message:data.message,consent:true,receivedAt:new Date().toISOString()}),
      cache:'no-store',signal:AbortSignal.timeout(8000)
    });
    if(!upstream.ok)throw new Error('Enquiry webhook rejected the request');
    return answer(200,'Your enquiry has been received.');
  }catch{
    return answer(502,'We could not deliver your request. Please email info@seooutsourcingphilippines.com directly.');
  }
}
