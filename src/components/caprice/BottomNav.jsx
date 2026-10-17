import React,{useState,useEffect}from'react';
import{motion}from'framer-motion';
import{Home,UtensilsCrossed,CalendarDays,ReceiptText,UserRound}from'lucide-react';
import{useCaprice}from'@/components/caprice/AppContext';
import '@/components/caprice/knife-nav.css';
const n=[['home','Accueil',Home],['menu','Menu',UtensilsCrossed],['reserve','Réserver',CalendarDays],['orders','Commandes',ReceiptText],['profile','Profil',UserRound]];
const knife='https://base44.app/api/apps/6a980008224694e817562d88/files/mp/public/6a980008224694e817562d88/98b82de10_caprice-knife-navigation.png';
export default function BottomNav(){
  const{tab,switchTab}=useCaprice();
  const[visible,setVisible]=useState(true);
  useEffect(()=>{
    let lastY=window.scrollY,ticking=false;
    const onScroll=()=>{if(ticking)return;ticking=true;requestAnimationFrame(()=>{const y=window.scrollY;if(y<10)setVisible(true);else if(y>lastY+5)setVisible(false);else if(y<lastY-5)setVisible(true);lastY=y;ticking=false})};
    window.addEventListener('scroll',onScroll,{passive:true});
    return()=>window.removeEventListener('scroll',onScroll);
  },[]);
  return <motion.nav aria-label="Navigation principale" className="knife-nav-dock" animate={{y:visible?0:'130%'}} transition={{type:'spring',stiffness:500,damping:32}}>
    <div className="knife-nav-surface">
      <img src={knife} alt="" width="1130" height="190" decoding="async"/>
      <button className="knife-nav-logo" aria-label="Accueil CAPRICE" onClick={()=>switchTab('home')}/>
      <div className="knife-nav-links">{n.map(([id,label,Icon])=><button key={id} className="knife-nav-link" aria-label={label} aria-current={tab===id?'page':undefined} onClick={()=>switchTab(id)}>
        {tab===id&&<span className="knife-nav-selection"/>}
        <Icon aria-hidden="true"/><span>{label}</span>
      </button>)}</div>
    </div>
  </motion.nav>;
}