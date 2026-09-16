import React,{createContext,useContext,useEffect,useRef,useState} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
const C=createContext();
export const useCaprice=()=>useContext(C);
const preloadProducts=products=>products.flatMap(p=>[p.image_url,...(p.images||[])]).filter(Boolean).forEach(src=>{const image=new window.Image();image.src=src});
const PATHS={home:'/',menu:'/menu',cart:'/cart',checkout:'/checkout',track:'/track',reserve:'/reserve',orders:'/orders',reservations:'/reservations',favorites:'/favorites',profile:'/profile',about:'/about',admin:'/admin',addresses:'/account/addresses',payments:'/account/payments',notifications:'/account/notifications',help:'/account/help',faq:'/faq',terms:'/account/terms',privacy:'/account/privacy'};
const fromPath=p=>{if(!p||p==='/')return'home';const s=p.split('/')[1];return s==='account'?(p.split('/')[2]||'addresses'):s};const TAB_OF={home:'home',menu:'menu',detail:'menu',cart:'menu',checkout:'menu',favorites:'menu',track:'orders',reserve:'reserve',orders:'orders',profile:'profile',reservations:'profile',about:'profile',admin:'profile',addresses:'profile',payments:'profile',notifications:'profile',help:'profile',terms:'profile',privacy:'profile'};const TAB_BASES={home:'/',menu:'/menu',reserve:'/reserve',orders:'/orders',profile:'/profile'};
export default function AppContext({children}){
  const navigate=useNavigate(),location=useLocation();
  const screen=fromPath(location.pathname);
  const tab=TAB_OF[screen]||'home';const tabStacks=useRef({home:['/'],menu:['/menu'],reserve:['/reserve'],orders:['/orders'],profile:['/profile']});const setScreen=id=>{const p=PATHS[id]||'/';const t=TAB_OF[fromPath(p)]||'home';if(tabStacks.current[t][tabStacks.current[t].length-1]!==p)tabStacks.current[t]=[...tabStacks.current[t],p];navigate(p)};useEffect(()=>{const t=TAB_OF[screen];if(t){const s=tabStacks.current[t];if(s[s.length-1]!==location.pathname)tabStacks.current[t]=[...s.filter(x=>x!==location.pathname),location.pathname]}},[screen,location.pathname]);const switchTab=id=>{if(id===tab){tabStacks.current[id]=[TAB_BASES[id]];navigate(TAB_BASES[id])}else{const s=tabStacks.current[id];navigate(s[s.length-1]||TAB_BASES[id])}};
  const [products,setProducts]=useState([]),[cart,setCart]=useState([]),[fav,setFav]=useState([]),[selected,setSelected]=useState(null),[loading,setLoading]=useState(true),[user,setUser]=useState(null);
  useEffect(()=>{base44.entities.Product.list().then(p=>{setProducts(p);preloadProducts(p)}).finally(()=>setLoading(false))},[]);
  useEffect(()=>{base44.auth.isAuthenticated().then(async(ok)=>{if(ok){try{setUser(await base44.auth.me())}catch{setUser(null)}}})},[]);
  const refreshUser=async()=>{try{setUser(await base44.auth.me())}catch{setUser(null)}};
  const refreshProducts=async()=>{const p=await base44.entities.Product.list();setProducts(p);preloadProducts(p)};
  const logout=async()=>{await base44.auth.logout();setUser(null);setScreen('home')};
  const goLogin=()=>navigate('/login');
  const goRegister=()=>navigate('/register');
  const add=(p,q=1,opt='')=>setCart(x=>{const i=x.findIndex(v=>v.id===p.id&&v.opt===opt);return i<0?[...x,{...p,q,opt}]:x.map((v,n)=>n===i?{...v,q:v.q+q}:v)});
  const revertCart=prev=>setCart(prev);
  const open=p=>{setSelected(p);navigate(`/detail/${p.id}`)};
  const toggle=p=>setFav(x=>x.some(v=>v.id===p.id)?x.filter(v=>v.id!==p.id):[...x,p]);
  return <C.Provider value={{screen,setScreen,switchTab,tab,products,setProducts,refreshProducts,cart,setCart,revertCart,fav,toggle,selected,open,add,loading,user,refreshUser,logout,goLogin,goRegister}}>{children}</C.Provider>;
}