import { ImageResponse } from 'next/og';
export const size={width:1200,height:630};
export const contentType='image/png';
export default function Image(){
  return new ImageResponse(<div style={{background:'#F6F8F5',width:'100%',height:'100%',display:'flex',flexDirection:'column',padding:72,justifyContent:'space-between',color:'#17201C',fontFamily:'sans-serif'}}><div style={{display:'flex',alignItems:'center',gap:20,fontSize:30,fontWeight:800}}><div style={{display:'flex',justifyContent:'center',alignItems:'center',width:72,height:72,borderRadius:18,background:'#075A43',color:'white',fontSize:50}}>↗</div>SEO Outsourcing Philippines</div><div style={{fontSize:84,fontWeight:800,letterSpacing:-4,lineHeight:1.06,maxWidth:1050}}>SEO work you<br/>can inspect.</div><div style={{display:'flex',justifyContent:'space-between',fontSize:25,borderTop:'2px solid #D9E3DC',paddingTop:20}}><span>PHILIPPINES-BASED SEO DELIVERY</span><span>DEFINED SCOPE · REVIEWABLE QA</span></div></div>,size);
}
