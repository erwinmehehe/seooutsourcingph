import { ImageResponse } from 'next/og';
export const size={width:1200,height:630};
export const contentType='image/png';
export default function Image(){return new ImageResponse(
  <div style={{width:'100%',height:'100%',background:'#F8F7F2',color:'#202923',display:'flex',flexDirection:'column',padding:'55px 70px',fontFamily:'sans-serif'}}>
    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',borderBottom:'1px solid #BCC3B8',paddingBottom:26}}>
      <div style={{display:'flex',alignItems:'center',gap:14}}><span style={{width:7,height:45,background:'#B43F24'}}/><div style={{display:'flex',flexDirection:'column'}}><strong style={{fontSize:27,letterSpacing:-1}}>SEO Outsourcing</strong><span style={{fontSize:13,letterSpacing:2}}>PHILIPPINES</span></div></div>
      <span style={{fontSize:13,letterSpacing:1}}>SEO DELIVERY / WHITE-LABEL & DIRECT</span>
    </div>
    <div style={{display:'flex',flexDirection:'column',marginTop:83}}><div style={{fontSize:83,fontWeight:750,letterSpacing:-5,lineHeight:1.09}}>SEO Outsourcing</div><div style={{display:'flex',alignItems:'baseline'}}><span style={{fontSize:83,fontWeight:750,letterSpacing:-5,lineHeight:1.09}}>Philippines</span><span style={{fontSize:83,fontWeight:750,color:'#B43F24'}}>.</span></div></div>
    <p style={{fontSize:24,marginTop:25,color:'#405044'}}>The people behind the SEO work.</p>
    <div style={{marginTop:'auto',borderTop:'1px solid #BCC3B8',paddingTop:18,display:'flex',justifyContent:'space-between',fontSize:13,letterSpacing:1}}><span>TECHNICAL SEO / CONTENT / LOCAL SEARCH</span><span>SCOPED WORK. REVIEWABLE FILES.</span></div>
  </div>,size
);}
