import React,{useRef,useState,useEffect}from'react';import{RefreshCw}from'lucide-react';
export default function PullToRefresh({onRefresh,children}){
  const[pull,setPull]=useState(0),[busy,setBusy]=useState(false);
  const startY=useRef(0),pulling=useRef(false),pullRef=useRef(0),cb=useRef(onRefresh);
  useEffect(()=>{cb.current=onRefresh});
  useEffect(()=>{pullRef.current=pull},[pull]);
  useEffect(()=>{
    const ts=e=>{if(window.scrollY<=0){startY.current=e.touches[0].clientY;pulling.current=true}};
    const tm=e=>{if(!pulling.current)return;const d=e.touches[0].clientY-startY.current;if(d>0)setPull(Math.min(d*.5,70))};
    const te=async()=>{if(!pulling.current)return;pulling.current=false;if(pullRef.current>45){setBusy(true);setPull(55);try{await cb.current()}catch{}setBusy(false)}setPull(0)};
    window.addEventListener('touchstart',ts,{passive:true});
    window.addEventListener('touchmove',tm,{passive:true});
    window.addEventListener('touchend',te);
    return()=>{window.removeEventListener('touchstart',ts);window.removeEventListener('touchmove',tm);window.removeEventListener('touchend',te)};
  },[]);
  return <><div className="ptr-indicator" style={{height:pull,opacity:Math.min(pull/50,1)}}><RefreshCw size={20} className={busy?'animate-spin':''}/></div>{children}</>;
}