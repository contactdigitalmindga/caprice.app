import React,{createContext,useContext,useEffect,useRef,useState} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
const C=createContext();
export const useCaprice=()=>useContext(C);
const PATHS={home:'/',menu:'/menu',cart:'/cart',checkout:'/checkout',track:'/track',reserve:'/reserve',orders:'/orders',reservations:'/reservations',favorites:'/favorites',profile:'/profile',about:'/about',admin:'/admin',addresses:'/account/addresses',payments:'/account/payments',notifications:'/account/notifications',help:'/account/help',terms:'/account/terms',privacy:'/account/privacy'};
const fromPath=p=>{if(!p||p==='/')return'home';const s=p.split('/')[1];return s==='account'?(p.split('/')[2]||'addresses'):s};const TAB_OF={home:'home',menu:'menu',detail:'menu',cart:'menu',checkout:'menu',favorites:'menu',track:'orders',reserve:'reserve',orders:'orders',profile:'profile',reservations:'profile',about:'profile',admin:'profile',addresses:'profile',payments:'profile',notifications:'profile',help:'profile',terms:'profile',privacy:'profile'};const TAB_BASES={home:'/',menu:'/menu',reserve:'/reserve',orders:'/orders',profile:'/profile'};
export default function AppContext({children}){
  const navigate=useNavigate(),location=useLocation();
  const screen=fromPath(location.pathname);
  const setScreen=id=>navigate(PATHS[id]||'/');const tab=TAB_OF[screen]||'home';const tabPaths=useRef({...TAB_BASES});useEffect(()=>{const t=TAB_OF[screen];if(t&&TAB_BASES[t]===location.pathname)tabPaths.current[t]=location.pathname},[screen,location.pathname]);const switchTab=id=>{if(id===tab){tabPaths.current[id]=TAB_BASES[id];navigate(TAB_BASES[id])}else navigate(tabPaths.current[id]||TAB_BASES[id]||'/')};
  const [products,setProducts]=useState([]),[cart,setCart]=useState([]),[fav,setFav]=useState([]),[selected,setSelected]=useState(null),[loading,setLoading]=useState(true),[user,setUser]=useState(null);
  useEffect(()=>{base44.entities.Product.list().then(setProducts).finally(()=>setLoading(false))},[]);
  useEffect(()=>{base44.auth.isAuthenticated().then(async(ok)=>{if(ok){try{setUser(await base44.auth.me())}catch{setUser(null)}}})},[]);
  const refreshUser=async()=>{try{setUser(await base44.auth.me())}catch{setUser(null)}};
  const refreshProducts=async()=>{const p=await base44.entities.Product.list();setProducts(p)};
  const logout=async()=>{await base44.auth.logout();setUser(null);setScreen('home')};
  const goLogin=()=>navigate('/login');
  const goRegister=()=>navigate('/register');
  const add=(p,q=1,opt='')=>setCart(x=>{const i=x.findIndex(v=>v.id===p.id&&v.opt===opt);return i<0?[...x,{...p,q,opt}]:x.map((v,n)=>n===i?{...v,q:v.q+q}:v)});
  const open=p=>{setSelected(p);navigate(`/detail/${p.id}`)};
  const toggle=p=>setFav(x=>x.some(v=>v.id===p.id)?x.filter(v=>v.id!==p.id):[...x,p]);
  return <C.Provider value={{screen,setScreen,switchTab,tab,products,setProducts,refreshProducts,cart,setCart,fav,toggle,selected,open,add,loading,user,refreshUser,logout,goLogin,goRegister}}>{children}</C.Provider>;
}