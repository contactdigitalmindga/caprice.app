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
      return Response.json({ error: 'Référence de commande requise' }, { status: 400 });
    }
    // Public endpoint: use service role so employees / QR scans can read order info
    const orders = await base44.asServiceRole.entities.Order.filter({ reference });
    if (!orders || orders.length === 0) {
      return Response.json({ error: 'Commande introuvable' }, { status: 404 });
    }
    const order = orders[0];
    const items = await base44.asServiceRole.entities.OrderItem.filter({ order_id: order.id });
    return Response.json({
      reference: order.reference,
      qr_code: order.qr_code,
      status: order.status,
      customer_name: order.customer_name,
      phone: order.phone,
      fulfillment: order.fulfillment,
      address: order.address,
      total: order.total,
      subtotal: order.subtotal,
      delivery_fee: order.delivery_fee,
      payment_method: order.payment_method,
      scheduled_for: order.scheduled_for,
      created_date: order.created_date,
      items: items.map(it => ({
        product_name: it.product_name,
        quantity: it.quantity,
        unit_price: it.unit_price,
        options: it.options
      }))
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}