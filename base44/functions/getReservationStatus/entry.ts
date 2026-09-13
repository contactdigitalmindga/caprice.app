import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    let body = {};
    try {
      body = await req.json();
    } catch {
      // allow empty body
    }
    const reference = body.reference;
    if (!reference) {
      return Response.json({ error: 'Référence de réservation requise' }, { status: 400 });
    }
    // Public endpoint: use service role so employees / QR scans can read reservation info
    const reservations = await base44.asServiceRole.entities.Reservation.filter({ reference });
    if (!reservations || reservations.length === 0) {
      return Response.json({ error: 'Réservation introuvable' }, { status: 404 });
    }
    const r = reservations[0];
    return Response.json({
      reference: r.reference,
      qr_code: r.qr_code,
      status: r.status,
      customer_name: r.customer_name,
      phone: r.phone,
      date: r.date,
      time: r.time,
      guests: r.guests,
      table_preference: r.table_preference,
      comment: r.comment,
      created_date: r.created_date
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}