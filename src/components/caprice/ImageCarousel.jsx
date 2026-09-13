import React,{useState,useRef}from'react';import{Image}from'@/components/ui/image';
export default function ImageCarousel({images,alt}){
  const[active,setActive]=useState(0);const ref=useRef(null);
  if(!images||images.length===0)return null;
  if(images.length===1)return <Image src={images[0]} alt={alt} className="h-full w-full"/>;
  const onScroll=()=>{const el=ref.current;if(!el)return;setActive(Math.round(el.scrollLeft/el.clientWidth))};
  return <><div ref={ref} onScroll={onScroll} className="img-carousel">{images.map((s,i)=><div key={i} style={{minWidth:'100%',height:'100%'}}><Image src={s} alt={`${alt} ${i+1}`} className="h-full w-full"/></div>)}</div><div className="img-dots">{images.map((_,i)=><i key={i} className={i===active?'active':''}/>)}</div></>;
}