import React,{useState,useEffect,useCallback}from'react';import{Image}from'@/components/ui/image';

const SLIDES=[
  'https://media.base44.com/images/public/6a980008224694e817562d88/3a0e8976c_caf69028-5e23-4744-ba70-d2ffecc25954.jpeg',
  'https://media.base44.com/images/public/6a980008224694e817562d88/fedb1cfaf_090501d0-6bab-4f9d-aa2a-22349eda0572.jpeg',
  'https://media.base44.com/images/public/6a980008224694e817562d88/bd0f59773_2758ed08-8560-440d-93d5-9ddc5bd6a45b.jpeg',
  'https://media.base44.com/images/public/6a980008224694e817562d88/e4464f349_6243cd82-74d7-4311-972c-1f5ee09cf5e7.jpeg'
];

export default function HeroCarousel(){
  const[active,setActive]=useState(0);
  const go=useCallback(d=>setActive(a=>(a+d+SLIDES.length)%SLIDES.length),[]);
  useEffect(()=>{
    const t=setInterval(()=>setActive(a=>(a+1)%SLIDES.length),3000);
    return()=>clearInterval(t);
  },[]);
  return <div className="absolute inset-0 overflow-hidden">
    {SLIDES.map((s,i)=>(
      <div key={i} className="absolute inset-0 transition-opacity duration-1000 ease-in-out" style={{opacity:i===active?1:0}}>
        <Image src={s} alt={`Ambiance Caprice ${i+1}`} loading={i===0?'eager':'lazy'} className="h-full w-full object-cover"/>
      </div>
    ))}
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 z-[2]">
      {SLIDES.map((_,i)=>(
        <button key={i} aria-label={`Image ${i+1}`} onClick={()=>setActive(i)} className="h-1.5 rounded-full transition-all duration-500" style={{width:i===active?24:6,background:i===active?'rgba(255,255,255,.95)':'rgba(255,255,255,.5)'}}/>
      ))}
    </div>
  </div>;
}