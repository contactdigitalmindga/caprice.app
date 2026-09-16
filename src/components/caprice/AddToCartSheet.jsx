import React,{useState}from'react';
import{Sheet,SheetContent,SheetHeader,SheetTitle}from'@/components/ui/sheet';
import{fmt}from'@/lib/caprice';
import{useCaprice}from'./AppContext';
import RestaurantOptions,{requiresSide}from'./RestaurantOptions';

export default function AddToCartSheet({product}){
  const{add}=useCaprice(),[open,setOpen]=useState(false),[side,setSide]=useState(null),[extras,setExtras]=useState([]),[sauces,setSauces]=useState([]),[instructions,setInstructions]=useState('');
  const choices=[side,...extras,...sauces].filter(Boolean),extraTotal=choices.reduce((sum,v)=>sum+v.price,0),required=requiresSide(product);
  const confirm=()=>{const optionText=[...choices.map(v=>v.name),instructions.trim()&&`Instruction : ${instructions.trim()}`].filter(Boolean).join(', ');add({...product,price:product.price+extraTotal},1,optionText);setOpen(false);setSide(null);setExtras([]);setSauces([]);setInstructions('')};
  return <div onClick={e=>e.stopPropagation()}><button className="add" aria-label={`Configurer ${product.name}`} onClick={()=>setOpen(true)}>+</button><Sheet open={open} onOpenChange={setOpen}><SheetContent side="bottom" className="select-sheet max-h-[88vh] overflow-y-auto" onClick={e=>e.stopPropagation()}><SheetHeader><SheetTitle>Personnaliser {product.name}</SheetTitle></SheetHeader><RestaurantOptions product={product} side={side} setSide={setSide} extras={extras} setExtras={setExtras} sauces={sauces} setSauces={setSauces}/><h3 className="font-bold mt-5 mb-2">Instructions spéciales</h3><textarea className="w-full min-h-24 bg-background border rounded-2xl p-4" value={instructions} onChange={e=>setInstructions(e.target.value)} placeholder="Ex. sans oignons, cuisson à point…"/><button disabled={required&&!side} className="w-full mt-5 bg-primary text-primary-foreground py-4 rounded-2xl font-bold disabled:opacity-50" onClick={confirm}>{required&&!side?'Choisissez un accompagnement':`Ajouter — ${fmt(product.price+extraTotal)}`}</button></SheetContent></Sheet></div>;
}