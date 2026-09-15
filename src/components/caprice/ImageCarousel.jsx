import React,{useState}from'react';import{ChevronLeft,ChevronRight}from'lucide-react';import{Image}from'@/components/ui/image';
export default function ImageCarousel({images,alt}){
  const[active,setActive]=useState(0);
  if(!images||images.length===0)return null;
  if(images.length===1)return <Image src={images[0]} alt={alt} className="h-full w-full"/>;
  const go=d=>setActive(a=>Math.max(0,Math.min(images.length-1,a+d)));
  const arrow={position:'absolute',top:'50%',transform:'translateY(-50%)',width:40,height:40,borderRadius:20,display:'grid',placeItems:'center',background:'rgba(255,255,255,.9)',color:'#211a15',boxShadow:'0 2px 10px rgba(0,0,0,.25)',zIndex:5,border:'none',cursor:'pointer'};
  return <><div style={{position:'relative',height:'100%',width:'100%',overflow:'hidden'}}><div style={{display:'flex',height:'100%',transition:'transform .3s ease',transform:`translateX(-${active*100}%)`}}>{images.map((s,i)=><div key={i} style={{minWidth:'100%',height:'100%'}}><Image src={s} alt={`${alt} ${i+1}`} className="h-full w-full"/></div>)}</div>{active>0&&<button style={{...arrow,left:12}} onClick={()=>go(-1)}><ChevronLeft size={20}/></button>}{active<images.length-1&&<button style={{...arrow,right:12}} onClick={()=>go(1)}><ChevronRight size={20}/></button>}</div><div className="img-dots">{images.map((_,i)=><i key={i} className={i===active?'active':''}/>)}</div></>;
}