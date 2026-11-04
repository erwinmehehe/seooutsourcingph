import { ImageResponse } from 'next/og';
export const size={width:1200,height:630};
export const contentType='image/png';
export default function Image(){
  return new ImageResponse(
    <div style={{width:'100%',height:'100%',background:'#143327',color:'#F2F4E9',display:'flex',flexDirection:'column',padding:'48px 62px',fontFamily:'sans-serif'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',paddingBottom:30,borderBottom:'2px solid #5B8065'}}>
        <div style={{display:'flex',alignItems:'center',gap:18}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'center',width:86,height:74,background:'#E2EFA3',color:'#143327',fontSize:32,fontWeight:900,letterSpacing:-2}}>sop.</div>
          <div style={{display:'flex',flexDirection:'column',gap:3}}><span style={{fontSize:25,fontWeight:800}}>SEO Outsourcing</span><span style={{fontSize:14,letterSpacing:3,color:'#D2E4D0'}}>PHILIPPINES</span></div>
        </div><div style={{fontSize:15,letterSpacing:2,color:'#E2EFA3'}}>SEO DELIVERY STUDIO / PH</div>
      </div>
      <div style={{display:'flex',flexDirection:'column',marginTop:58}}><div style={{fontSize:76,fontWeight:850,letterSpacing:-4,lineHeight:1.07}}>Your agency out front.</div><div style={{fontSize:76,fontWeight:850,letterSpacing:-4,lineHeight:1.07,color:'#E2EFA3'}}>Our specialists on the work.</div></div>
      <div style={{marginTop:'auto',display:'flex',justifyContent:'space-between',paddingTop:20,borderTop:'2px solid #5B8065',fontSize:16,letterSpacing:1,color:'#DBE9D8'}}><span>TECHNICAL SEO / CONTENT / LOCAL SEARCH</span><span>DEFINED SCOPE. REVIEWABLE HANDOFF.</span></div>
    </div>,size
  );
}
