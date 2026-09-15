import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
import { secrets } from 'base44:runtime';

export default async function(req) {
  try {
    let body = {};
    try {
      body = await req.json();
    } catch {
      // allow empty body
    }
    const apiKey = body.api_key;
    if (!apiKey || apiKey !== secrets.get('EMPLOYEE_API_KEY')) {
      return Response.json({ error: 'Non autorisé — clé API invalide' }, { status: 401 });
    }
    const base44 = createClientFromRequest(req);
    const reservations = await base44.asServiceRole.entities.Reservation.list('-created_date', 200);
    return Response.json({
      reservations: reservations.map(r => ({
        id: r.id,
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
      }))
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}