import React,{createContext,useContext,useEffect,useRef,useState} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { toast } from '@/components/ui/use-toast';
import { hero, heroSlides } from '@/lib/caprice';
import preloadImages from '@/components/caprice/preloadImages';
import { preloadProfilePhoto } from '@/components/caprice/profilePhotoCache';
const C=createContext();
export const useCaprice=()=>useContext(C);
const productImages=products=>products.flatMap(p=>[p.image_url,...(p.images||[])]);
const preloadProducts=products=>preloadImages(productImages(products));
const PATHS={home:'/',menu:'/menu',cart:'/cart',checkout:'/checkout',track:'/track',reserve:'/reserve',orders:'/orders',reservations:'/reservations',favorites:'/favorites',profile:'/profile',about:'/about',admin:'/admin',addresses:'/account/addresses',payments:'/account/payments',notifications:'/account/notifications',help:'/account/help',faq:'/faq',terms:'/account/terms',privacy:'/account/privacy'};
const fromPath=p=>{if(!p||p==='/')return'home';const s=p.split('/')[1];return s==='account'?(p.split('/')[2]||'addresses'):s};const TAB_OF={home:'home',menu:'menu',detail:'menu',favorites:'menu',track:'orders',reserve:'reserve',orders:'orders',profile:'profile',reservations:'profile',about:'profile',admin:'profile',addresses:'profile',payments:'profile',notifications:'profile',help:'profile',terms:'profile',privacy:'profile',faq:'profile'};const TAB_BASES={home:'/',menu:'/menu',reserve:'/reserve',orders:'/orders',profile:'/profile'};
export default function AppContext({children}){
  const navigate=useNavigate(),location=useLocation();
  const screen=fromPath(location.pathname);
  const tab=TAB_OF[screen]||'home';
  const tabStacks=useRef({home:[],menu:[],reserve:[],orders:[],profile:[]});
  const saveTabPath=(id,path)=>{
    const stack=tabStacks.current[id];
    const index=stack.lastIndexOf(path);
    tabStacks.current[id]=index<0?[...stack,path]:stack.slice(0,index+1);
  };
  useEffect(()=>{saveTabPath(tab,location.pathname)},[tab,location.pathname]);
  const setScreen=id=>navigate(PATHS[id]||'/');
  const switchTab=id=>{
    if(!TAB_BASES[id])return;
    if(id===tab){tabStacks.current[id]=[];navigate(TAB_BASES[id]);return;}
    saveTabPath(tab,location.pathname);
    const stack=tabStacks.current[id];
    navigate(stack[stack.length-1]||TAB_BASES[id]);
  };
  const [products,setProducts]=useState([]),[cart,setCart]=useState(()=>{try{return JSON.parse(sessionStorage.getItem('caprice_auth_cart')||'[]')}catch{return[]}}),[fav,setFav]=useState([]),[selected,setSelected]=useState(null),[loading,setLoading]=useState(true),[imagesReady,setImagesReady]=useState(false),[user,setUser]=useState(null),[loadingFav,setLoadingFav]=useState(null);
  const [imageProgress,setImageProgress]=useState(0),[startupError,setStartupError]=useState(''),[userLoading,setUserLoading]=useState(true);
  const prepareApp=async()=>{
    setLoading(true);setImagesReady(false);setStartupError('');
    try{
      const p=await base44.entities.Product.list();
      setProducts(p);
      await preloadImages([hero,...heroSlides,...productImages(p)],setImageProgress);
      setImagesReady(true);
    }catch{setStartupError('Le menu n’a pas pu être chargé. Vérifiez votre connexion et réessayez.');}
    finally{setLoading(false);}
  };
  useEffect(()=>{prepareApp()},[]);
  useEffect(()=>{base44.auth.isAuthenticated().then(async(ok)=>{if(ok){try{const current=await base44.auth.me();await preloadProfilePhoto(current.profile_photo).catch(()=>null);setUser(current)}catch{setUser(null)}}}).finally(()=>setUserLoading(false))},[]);
  const[favoritePage,setFavoritePage]=useState({next_cursor:null,has_more:false});
  const loadFavorites=async(cursor)=>{
    if(!user)return;
    const page=await base44.entities.Favorite.filter({created_by_id:user.id},{sort:'-created_date',limit:50,...(cursor?{cursor}:{})});
    const items=page.items.map(f=>({...f,id:f.product_id,name:f.product_name}));
    setFav(previous=>cursor?[...previous,...items]:items);
    setFavoritePage({next_cursor:page.next_cursor,has_more:page.has_more});
  };
  useEffect(()=>{if(user)loadFavorites()},[user?.id]);
  const refreshUser=async()=>{const current=await base44.auth.me();await preloadProfilePhoto(current.profile_photo).catch(()=>null);setUser(current);return current};
  const refreshProducts=async()=>{const p=await base44.entities.Product.list();setProducts(p);preloadProducts(p)};
  const logout=async()=>{await base44.auth.logout();setUser(null);setScreen('home')};
  useEffect(()=>{sessionStorage.setItem('caprice_auth_cart',JSON.stringify(cart))},[cart]);
  const goLogin=()=>navigate('/login');
  const goRegister=()=>navigate('/register');
  const add=(p,q=1,opt='')=>setCart(x=>{const i=x.findIndex(v=>v.id===p.id&&v.opt===opt);return i<0?[...x,{...p,q,opt}]:x.map((v,n)=>n===i?{...v,q:v.q+q}:v)});
  const revertCart=prev=>setCart(prev);
  const open=p=>{setSelected(p);navigate(`/detail/${p.id}`)};
  const toggle=p=>setFav(x=>x.some(v=>v.id===p.id)?x.filter(v=>v.id!==p.id):[...x,p]);
  const toggleFavOptimistic=async p=>{const wasFav=fav.some(v=>v.id===p.id);setFav(x=>wasFav?x.filter(v=>v.id!==p.id):[...x,p]);setLoadingFav(p.id);if(user){try{if(wasFav){const r=await base44.entities.Favorite.filter({product_id:p.id});if(r.length)await base44.entities.Favorite.delete(r[0].id)}else{await base44.entities.Favorite.create({product_id:p.id,product_name:p.name,image_url:p.image_url,price:p.price})}}catch{setFav(x=>wasFav?[...x,p]:x.filter(v=>v.id!==p.id));toast({title:'Erreur',description:'Impossible de mettre à jour vos favoris.',variant:'destructive'})}}setLoadingFav(null)};
  return <C.Provider value={{screen,setScreen,switchTab,tab,products,setProducts,refreshProducts,cart,setCart,revertCart,fav,loadFavorites,favoritePage,toggle,toggleFavOptimistic,loadingFav,selected,open,add,loading,imagesReady,imageProgress,startupError,prepareApp,userLoading,user,refreshUser,logout,goLogin,goRegister}}>{children}</C.Provider>;
}