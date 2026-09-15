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
    const orders = await base44.asServiceRole.entities.Order.list('-created_date', 200);
    return Response.json({
      orders: orders.map(o => ({
        id: o.id,
        reference: o.reference,
        qr_code: o.qr_code,
        status: o.status,
        customer_name: o.customer_name,
        phone: o.phone,
        fulfillment: o.fulfillment,
        address: o.address,
        total: o.total,
        subtotal: o.subtotal,
        delivery_fee: o.delivery_fee,
        payment_method: o.payment_method,
        scheduled_for: o.scheduled_for,
        created_date: o.created_date
      }))
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}