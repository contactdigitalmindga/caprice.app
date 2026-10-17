import React,{useState,lazy,Suspense}from'react';
import{Routes,Route,useLocation,Navigate}from'react-router-dom';
import Welcome from'@/pages/Welcome';
import ProtectedRoute from'@/components/ProtectedRoute';
import{motion,AnimatePresence}from'framer-motion';
import AppContext from'@/components/caprice/AppContext';
import BottomNav from'@/components/caprice/BottomNav';
import HomeScreen from'@/components/caprice/HomeScreen';
import MenuScreen from'@/components/caprice/MenuScreen';
import DetailScreen from'@/components/caprice/DetailScreen';
import CartScreen from'@/components/caprice/CartScreen';
import ReserveScreen from'@/components/caprice/ReserveScreen';
import{Favorites,Orders,Profile,About}from'@/components/caprice/LibraryScreens';
const CheckoutScreen=lazy(()=>import('@/components/caprice/CheckoutScreen'));
const TrackScreen=lazy(()=>import('@/components/caprice/TrackScreen'));
const AdminScreen=lazy(()=>import('@/components/caprice/AdminScreen'));
const ReservationsScreen=lazy(()=>import('@/components/caprice/ReservationsScreen'));
const AccountScreen=lazy(()=>import('@/components/caprice/AccountScreen'));
const FAQScreen=lazy(()=>import('@/components/caprice/FAQScreen'));
const NO_NAV=['detail','cart','checkout','track','admin','about','account','reservations','favorites'];
function Shell(){const location=useLocation();const seg=location.pathname.split('/')[1]||'home';const noNav=NO_NAV.includes(seg);return <div className="caprice-app"><AnimatePresence mode="wait"><motion.div key={location.pathname} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:.12}}><Suspense fallback={<div className="fixed inset-0 flex items-center justify-center"><div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div></div>}><Routes location={location}><Route path="/" element={<HomeScreen/>}/><Route path="/menu" element={<MenuScreen/>}/><Route path="/detail/:id" element={<DetailScreen/>}/><Route path="/cart" element={<CartScreen/>}/><Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/login?returnTo=%2Fcheckout" replace/>}/>}> <Route path="/checkout" element={<CheckoutScreen/>}/></Route><Route path="/track" element={<TrackScreen/>}/><Route path="/reserve" element={<ReserveScreen/>}/><Route path="/orders" element={<Orders/>}/><Route path="/reservations" element={<ReservationsScreen/>}/><Route path="/favorites" element={<Favorites/>}/><Route path="/profile" element={<Profile/>}/><Route path="/about" element={<About/>}/><Route path="/admin" element={<AdminScreen/>}/><Route path="/account/:type" element={<AccountScreen/>}/><Route path="/faq" element={<FAQScreen/>}/><Route path="*" element={<HomeScreen/>}/></Routes></Suspense></motion.div></AnimatePresence>{!noNav&&<BottomNav/>}</div>;}
function Intro(){const location=useLocation();const[welcome,setWelcome]=useState(()=>location.pathname==='/'&&!localStorage.getItem('caprice_onboarded')&&!new URLSearchParams(window.location.search).get('ref'));return welcome?<Welcome onExplore={()=>setWelcome(false)}/>:<Shell/>;}
export default function Caprice(){return <AppContext><Intro/></AppContext>}