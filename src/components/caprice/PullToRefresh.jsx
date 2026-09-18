import React,{useRef,useEffect}from'react';import{RefreshCw}from'lucide-react';
export default function PullToRefresh({onRefresh,children}){
  const ref=useRef(null),startY=useRef(0),pulling=useRef(false),pull=useRef(0),busy=useRef(false),cb=useRef(onRefresh);
  useEffect(()=>{cb.current=onRefresh});
  useEffect(()=>{
    const ts=e=>{if(window.scrollY<=0){startY.current=e.touches[0].clientY;pulling.current=true}};
    const tm=e=>{if(!pulling.current)return;const d=e.touches[0].clientY-startY.current;if(d>0&&ref.current){pull.current=Math.min(d*.5,70);ref.current.style.height=pull.current+'px';ref.current.style.opacity=Math.min(pull.current/50,1)}};
    const te=async()=>{if(!pulling.current)return;pulling.current=false;if(pull.current>45&&!busy.current){busy.current=true;if(ref.current){ref.current.style.height='55px';ref.current.querySelector('svg')?.classList.add('animate-spin')}try{await cb.current()}catch{}busy.current=false;if(ref.current)ref.current.querySelector('svg')?.classList.remove('animate-spin')}if(ref.current){ref.current.style.height='0';ref.current.style.opacity='0'}pull.current=0};
    window.addEventListener('touchstart',ts,{passive:true});
    window.addEventListener('touchmove',tm,{passive:true});
    window.addEventListener('touchend',te);
    return()=>{window.removeEventListener('touchstart',ts);window.removeEventListener('touchmove',tm);window.removeEventListener('touchend',te)};
  },[]);
  return <><div ref={ref} className="ptr-indicator" style={{height:0,opacity:0,overflow:'hidden'}}><RefreshCw size={20}/></div>{children}</>;
}