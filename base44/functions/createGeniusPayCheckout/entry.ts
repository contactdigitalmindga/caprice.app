import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
import { secrets } from 'base44:runtime';

export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const { order_id } = await req.json();
    if (!order_id) return Response.json({ error: 'Commande requise' }, { status: 400 });

    const order = await base44.asServiceRole.entities.Order.get(order_id);
    if (!order) return Response.json({ error: 'Commande introuvable' }, { status: 404 });

    const response = await fetch('https://geniuspay.ci/api/v1/merchant/payments', {
      method: 'POST',
      headers: {
        'X-API-Key': secrets.get('GENIUSPAY_API_KEY'),
        'X-API-Secret': secrets.get('GENIUSPAY_API_SECRET'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: order.total,
        currency: 'XOF',
        description: `Commande CAPRICE ${order.reference}`,
        customer: {
          name: order.customer_name,
          phone: order.phone,
          country: 'GA',
        },
        success_url: 'https://caprice-app.base44.app/track?payment=success',
        error_url: 'https://caprice-app.base44.app/orders?payment=failed',
        metadata: {
          order_id: order.id,
          order_reference: order.reference,
        },
      }),
    });

    const result = await response.json();
    if (!response.ok || !result.success) {
      return Response.json({ error: result?.error?.message || 'Paiement indisponible' }, { status: 502 });
    }

    await base44.asServiceRole.entities.Payment.create({
      order_id: order.id,
      method: 'GeniusPay',
      amount: order.total,
      status: 'en_attente',
      transaction_reference: result.data.reference,
    });

    return Response.json({
      checkout_url: result.data.checkout_url || result.data.payment_url,
      reference: result.data.reference,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}