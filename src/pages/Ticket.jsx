import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Clock, MapPin, Calendar, Users, Utensils, Truck, ShoppingBag, X, Check } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { fmt } from '@/lib/caprice';

const FULFILLMENT = { sur_place: 'Sur place', livraison: 'Livraison', emporter: 'À emporter' };
const STATUS = { confirmee: 'Confirmée', preparation: 'En préparation', en_route: 'En route', livree: 'Livrée', terminee: 'Terminée', annulee: 'Annulée' };

export default function Ticket() {
  const [searchParams] = useSearchParams();
  const ref = searchParams.get('ref');
  const type = searchParams.get('type') || 'order';
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    const load = async () => {
      if (!ref) { setErr('Référence manquante'); setLoading(false); return; }
      try {
        const fn = type === 'reservation' ? 'getReservationStatus' : 'getOrderStatus';
        const res = await base44.functions.invoke(fn, { reference: ref });
        if (res.data && res.data.reference) setData(res.data);
        else setErr(res.data?.error || 'Introuvable');
      } catch { setErr('Erreur de chargement'); }
      finally { setLoading(false); }
    };
    load();
  }, [ref, type]);

  const isRes = type === 'reservation';
  const reference = data?.reference || ref || '';
  const ticketUrl = `https://caprice-app.base44.app/ticket?ref=${reference}${isRes ? '&type=reservation' : ''}`;
  const qr = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=8&data=${encodeURIComponent(ticketUrl)}`;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--caprice-bg)' }}>
      <div className="w-10 h-10 border-4 rounded-full animate-spin" style={{ borderColor: 'var(--caprice-border)', borderTopColor: 'var(--caprice-accent)' }} />
    </div>
  );

  if (err) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3" style={{ background: 'var(--caprice-bg)', color: 'var(--caprice-fg)', fontFamily: 'Georgia, serif' }}>
      <X size={48} color="var(--caprice-accent)" />
      <h1 style={{ fontSize: 24 }}>{err}</h1>
      <p style={{ color: 'var(--caprice-muted-fg)', fontSize: 14 }}>Référence: {ref}</p>
    </div>
  );

  const Icon = isRes ? Calendar : (data?.fulfillment === 'sur_place' ? Utensils : data?.fulfillment === 'livraison' ? Truck : ShoppingBag);

  return (
    <div className="min-h-screen flex justify-center" style={{ background: 'var(--caprice-bg)', padding: '20px', fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}>
      <div style={{ width: '100%', maxWidth: 420, background: 'var(--caprice-card)', borderRadius: 24, overflow: 'hidden', boxShadow: '0 10px 40px rgba(76,54,34,0.12)', marginTop: 20, marginBottom: 20 }}>
        {/* Header */}
        <div style={{ background: 'var(--caprice-fg)', color: 'var(--caprice-card)', padding: '28px 24px', textAlign: 'center' }}>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: 28, letterSpacing: '0.05em' }}>CAPRICE</div>
          <div style={{ fontSize: 11, letterSpacing: '0.3em', color: 'var(--caprice-accent-light)', marginTop: 4 }}>{isRes ? 'RÉSERVATION' : 'COMMANDE'}</div>
        </div>

        {/* Reference + Status */}
        <div style={{ padding: '24px', borderBottom: '1px dashed var(--caprice-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--caprice-muted-fg)', letterSpacing: '0.1em' }}>RÉFÉRENCE</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--caprice-fg)', marginTop: 2 }}>#{reference}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: 'var(--caprice-muted-fg)', letterSpacing: '0.1em' }}>STATUT</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: data?.status === 'annulee' ? 'var(--caprice-btn-fg)' : 'var(--caprice-accent)', marginTop: 2 }}>{STATUS[data?.status] || data?.status}</div>
          </div>
        </div>

        {/* QR Code */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px', borderBottom: '1px dashed var(--caprice-border)' }}>
          <img src={qr} alt={`QR ${reference}`} style={{ width: 160, height: 160, borderRadius: 12 }} />
          <div style={{ fontSize: 11, color: 'var(--caprice-muted-fg)', marginTop: 10, textAlign: 'center' }}>Scannez pour vérifier ce ticket</div>
        </div>

        {isRes ? (
          <div style={{ padding: '24px' }}>
            <div style={{ display: 'grid', gap: 16 }}>
              <Row icon={<Calendar size={18} color="var(--caprice-accent)" />} label="Date" value={data?.date} />
              <Row icon={<Clock size={18} color="var(--caprice-accent)" />} label="Heure" value={data?.time} />
              <Row icon={<Users size={18} color="var(--caprice-accent)" />} label="Personnes" value={`${data?.guests} couverts`} />
              {data?.table_preference && <Row icon={<MapPin size={18} color="var(--caprice-accent)" />} label="Table" value={data.table_preference} />}
            </div>
            {data?.comment && (
              <div style={{ marginTop: 16, padding: 16, background: 'var(--caprice-bg)', borderRadius: 14 }}>
                <div style={{ fontSize: 11, color: 'var(--caprice-muted-fg)', marginBottom: 4 }}>Note</div>
                <div style={{ fontSize: 14, color: 'var(--caprice-fg)' }}>{data.comment}</div>
              </div>
            )}
            <CustomerCard name={data?.customer_name} phone={data?.phone} />
          </div>
        ) : (
          <div style={{ padding: '24px' }}>
            <Row icon={<Icon size={18} color="var(--caprice-accent)" />} label="Mode" value={FULFILLMENT[data?.fulfillment] || data?.fulfillment} />
            {data?.scheduled_for && <div style={{ marginTop: 16 }}><Row icon={<Clock size={18} color="var(--caprice-accent)" />} label="Programmé pour" value={data.scheduled_for} /></div>}

            <div style={{ fontSize: 12, color: 'var(--caprice-fg)', letterSpacing: '0.15em', fontWeight: 700, margin: '24px 0 14px' }}>ARTICLES</div>
            <div style={{ display: 'grid', gap: 10 }}>
              {data?.items?.length ? data.items.map((v, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, padding: '14px 16px', background: 'var(--caprice-bg)', borderRadius: 14, border: '1px solid var(--caprice-border)' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--caprice-fg)' }}>{v.quantity} × {v.product_name}</div>
                    {v.options?.length > 0 && <div style={{ fontSize: 13, color: 'var(--caprice-muted-fg)', marginTop: 4, fontWeight: 500 }}>{v.options.join(', ')}</div>}
                  </div>
                  <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--caprice-fg)', whiteSpace: 'nowrap' }}>{fmt((v.unit_price || 0) * (v.quantity || 1))}</div>
                </div>
              )) : <div style={{ fontSize: 14, color: 'var(--caprice-muted-fg)', padding: '14px', background: 'var(--caprice-bg)', borderRadius: 14 }}>Aucun article</div>}
            </div>

            <div style={{ marginTop: 20, paddingTop: 18, borderTop: '2px solid var(--caprice-fg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 20, fontWeight: 800, color: 'var(--caprice-fg)' }}>Total</span>
              <span style={{ fontSize: 24, fontWeight: 800, color: 'var(--caprice-fg)' }}>{fmt(data?.total || 0)}</span>
            </div>

            <CustomerCard name={data?.customer_name} phone={data?.phone} address={data?.address} />
          </div>
        )}

        {/* Footer */}
        <div style={{ padding: '20px 24px', background: 'var(--caprice-bg)', textAlign: 'center' }}>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: 14, color: 'var(--caprice-accent)' }}>CAPRICE</div>
          <div style={{ fontSize: 11, color: 'var(--caprice-muted-fg)', marginTop: 4 }}>Libreville, Gabon · Bon appétit</div>
        </div>
      </div>
    </div>
  );
}

function Row({ icon, label, value }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--caprice-bg)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>{icon}</div>
      <div><div style={{ fontSize: 11, color: 'var(--caprice-muted-fg)' }}>{label}</div><div style={{ fontSize: 15, fontWeight: 600, color: 'var(--caprice-fg)', marginTop: 2 }}>{value}</div></div>
    </div>
  );
}

function CustomerCard({ name, phone, address }) {
  return (
    <div style={{ marginTop: 20, padding: 18, background: 'var(--caprice-fg)', borderRadius: 14, color: 'var(--caprice-card)' }}>
      <div style={{ fontSize: 11, color: 'var(--caprice-accent-light)', letterSpacing: '0.1em', fontWeight: 700 }}>CLIENT</div>
      <div style={{ fontSize: 18, fontWeight: 800, marginTop: 4, color: 'var(--caprice-card)' }}>{name}</div>
      <div style={{ fontSize: 15, color: 'var(--caprice-btn)', marginTop: 4, fontWeight: 600 }}>{phone}</div>
      {address && <div style={{ fontSize: 14, color: 'var(--caprice-overlay)', marginTop: 6 }}>{address}</div>}
    </div>
  );
}