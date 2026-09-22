import React,{useEffect,useState}from'react';import{useSearchParams,useNavigate}from'react-router-dom';import{Check,Clock3,Headphones,MapPin,CalendarDays,Users,X}from'lucide-react';import{fmt}from'@/lib/caprice';import{base44}from'@/api/base44Client';import BackArrow from'./BackArrow';
const STEPS=['Commande confirmée','Préparation en cours','En route','Livrée'];const STATUS_STEP={confirmee:0,preparation:1,en_route:2,livree:3};
export default function TrackScreen(){
  const[searchParams]=useSearchParams();const navigate=useNavigate();
  const ref=searchParams.get('ref');const type=searchParams.get('type')||'order';
  const[o,setO]=useState(null),[loading,setLoading]=useState(true),[err,setErr]=useState(null);
  useEffect(()=>{const load=async()=>{
    if(ref){try{
      const fn=type==='reservation'?'getReservationStatus':'getOrderStatus';
      const res=await base44.functions.invoke(fn,{reference:ref});
      if(res.data&&res.data.reference){setO(res.data)}else{setErr(res.data?.error||(type==='reservation'?'Réservation introuvable':'Commande introuvable'))}
    }catch{setErr(type==='reservation'?'Réservation introuvable':'Commande introuvable')}finally{setLoading(false)}}
    else{const local=JSON.parse(localStorage.getItem('lastOrder')||'null');if(local)setO(local);else setErr('Aucune commande à suivre');setLoading(false)}
  };load()},[ref,type]);
  const isRes=type==='reservation';
  const reference=o?.reference||ref||'';
  const trackUrl=`https://caprice-app.base44.app/ticket?ref=${reference}${isRes?'&type=reservation':''}`;
  const qrData=o?.qr_code||trackUrl;
  const qr=qrData?`https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=8&data=${encodeURIComponent(qrData)}`:'';
  const currentStep=STATUS_STEP[o?.status]??0;
  const cancelled=o?.status==='annulee';
  const norm=v=>({name:v.product_name||v.name,qty:v.quantity||v.q||1,price:v.unit_price||v.price||0});
  if(loading)return <main className="screen"><div className="title-row"><BackArrow to="home"/><h1>Suivi</h1><span/></div><div className="empty"><div className="w-8 h-8 rounded-full animate-spin" style={{border:'4px solid var(--caprice-border)',borderTopColor:'var(--caprice-accent)'}}/></div></main>;
  if(err)return <main className="screen"><div className="title-row"><BackArrow to="home"/><h1>Suivi</h1><span/></div><div className="empty"><X/><h2>{err}</h2></div></main>;
  if(isRes)return <main className="screen"><div className="title-row"><BackArrow to="home"/><h1>Suivi de ma réservation</h1><span/></div>
    <div className="track-head"><div><small>RÉSERVATION</small><h2>#{reference}</h2></div><span><CalendarDays/>{o?.date}</span></div>
    <div className="qr-box"><img src={qr} alt={`QR ${reference}`} className="w-44 h-44"/><small>Scannez ce QR code pour afficher votre réservation #{reference}</small></div>
    <div className="summary"><h3>Détails de la réservation</h3>
      <p><span>Date</span><b>{o?.date}</b></p>
      <p><span>Heure</span><b>{o?.time}</b></p>
      <p><span>Personnes</span><b>{o?.guests}</b></p>
      <p><span>Table</span><b>{o?.table_preference||'—'}</b></p>
      {o?.comment&&<p><span>Note</span><b>{o.comment}</b></p>}
      <p><span>Statut</span><b style={{textTransform:'capitalize'}}>{o?.status}</b></p>
    </div>
    <button className="outline" onClick={()=>navigate('/faq')}><Headphones/> Besoin d'aide ?</button>
  </main>;
  return <main className="screen"><div className="title-row"><BackArrow to="home"/><h1>Suivi de ma commande</h1><span/></div>
    <div className="track-head"><div><small>COMMANDE</small><h2>#{reference}</h2></div><span><Clock3/>{o?.fulfillment==='livraison'?'25–35 min':'15–20 min'}</span></div>
    <div className="qr-box"><img src={qr} alt={`QR ${reference}`} className="w-44 h-44"/><small>Scannez ce QR code en caisse pour récupérer votre commande #{reference}</small></div>
    <div className="map"><MapPin/><b>Votre commande est à Libreville</b><small>Le suivi du livreur apparaîtra ici</small></div>
    <div className="timeline">{STEPS.map((v,i)=>{const done=!cancelled&&i<=currentStep;return <div key={i} className={done?'done':''}><i>{done&&i<currentStep?<Check size={14}/>:i+1}</i><span><b>{v}</b><small>{i===1&&done?'Notre chef prépare vos plats':' '}</small></span></div>})}</div>
    {cancelled&&<div className="empty"><X/><h2>Commande annulée</h2></div>}
    <div className="summary"><h3>Détails de la commande</h3>{o?.items?.map((v,i)=>{const it=norm(v);return <p key={i}><span>{it.qty} × {it.name}</span><b>{fmt(it.price*it.qty)}</b></p>})}<p className="total"><span>Total</span><b>{fmt(o?.total||0)}</b></p></div>
    <button className="outline" onClick={()=>navigate('/faq')}><Headphones/> Besoin d'aide ?</button>
  </main>;
}