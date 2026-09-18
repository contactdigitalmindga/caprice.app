import React,{useState,useEffect}from'react';import{MapPin,Plus,Trash2,Navigation,Loader2}from'lucide-react';import{base44}from'@/api/base44Client';import{toast}from'@/components/ui/use-toast';
export default function AddressesScreen(){
  const[addresses,setAddresses]=useState([]),[loading,setLoading]=useState(true),[adding,setAdding]=useState(false),[form,setForm]=useState({label:'',address:'',instructions:''}),[saving,setSaving]=useState(false);
  const load=()=>base44.entities.Address.list('-created_date').then(setAddresses).finally(()=>setLoading(false));
  useEffect(()=>{load()},[]);
  const openMaps=()=>window.open('https://www.google.com/maps/search/?api=1&query=Libreville+Gabon','_blank');
  const useLocation=()=>{
    if(!navigator.geolocation)return toast({title:'Erreur',description:'Géolocalisation non disponible.',variant:'destructive'});
    navigator.geolocation.getCurrentPosition(p=>{window.open(`https://www.google.com/maps/search/?api=1&query=${p.coords.latitude},${p.coords.longitude}`,'_blank')},()=>toast({title:'Erreur',description:'Position indisponible.',variant:'destructive'}));
  };
  const save=async()=>{
    if(!form.label||!form.address)return toast({title:'Champs requis',description:'Veuillez renseigner un nom et une adresse.',variant:'destructive'});
    setSaving(true);
    try{const a=await base44.entities.Address.create({...form,zone:'Libreville'});setAddresses(x=>[a,...x]);setForm({label:'',address:'',instructions:''});setAdding(false);toast({title:'Adresse enregistrée'})}catch{toast({title:'Erreur',description:'Échec de l\'enregistrement.',variant:'destructive'})}
    setSaving(false);
  };
  const del=async id=>{setAddresses(x=>x.filter(a=>a.id!==id));try{await base44.entities.Address.delete(id)}catch{load()}};
  if(loading)return <div style={{display:'flex',justifyContent:'center',padding:40}}><Loader2 className="animate-spin" style={{color:'var(--caprice-accent)'}}/></div>;
  return <div>
    {addresses.map(a=><article key={a.id} className="admin-row"><div><b>{a.label}</b><small>{a.address}</small>{a.instructions&&<small>{a.instructions}</small>}</div><button aria-label="Supprimer l'adresse" onClick={()=>del(a.id)}><Trash2 size={18}/></button></article>)}
    {!addresses.length&&!adding&&<div className="empty" style={{padding:'40px 20px'}}><MapPin/><h2>Aucune adresse</h2><p>Ajoutez une adresse de livraison à Libreville.</p></div>}
    {adding?<div className="form" style={{marginTop:16}}>
      <input placeholder="Nom (maison, bureau...)" value={form.label} onChange={e=>setForm({...form,label:e.target.value})}/>
      <input placeholder="Adresse à Libreville" value={form.address} onChange={e=>setForm({...form,address:e.target.value})}/>
      <input placeholder="Instructions de livraison (optionnel)" value={form.instructions} onChange={e=>setForm({...form,instructions:e.target.value})}/>
      <div style={{display:'flex',gap:8}}>
        <button type="button" className="outline" style={{flex:1}} onClick={openMaps}><MapPin size={16}/> Google Maps</button>
        <button type="button" className="outline" style={{flex:1}} onClick={useLocation}><Navigation size={16}/> Ma position</button>
      </div>
      <button onClick={save} disabled={saving}>{saving?'Enregistrement...':'Enregistrer l\'adresse'}</button>
      <button className="outline" onClick={()=>setAdding(false)}>Annuler</button>
    </div>:<button className="outline" style={{marginTop:16}} onClick={()=>setAdding(true)}><Plus size={18}/> Ajouter une adresse</button>}
  </div>;
}