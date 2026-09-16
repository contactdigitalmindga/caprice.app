import React,{useState,useEffect,useCallback}from'react';import{Image}from'@/components/ui/image';import{heroSlides as SLIDES}from'@/lib/caprice';

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

  </div>;
}