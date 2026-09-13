import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
import { secrets } from 'base44:runtime';

const VALID_STATUSES = ['confirmee', 'preparation', 'en_route', 'livree', 'annulee'];

export default async function(req) {
  try {
    let body = {};
    try {
      body = await req.json();
    } catch {
      // allow empty body
    }
    // Validate employee API key
    const apiKey = body.api_key;
    if (!apiKey || apiKey !== secrets.get('EMPLOYEE_API_KEY')) {
      return Response.json({ error: 'Non autorisé — clé API invalide' }, { status: 401 });
    }
    const reference = body.reference;
    const status = body.status;
    if (!reference || !status) {
      return Response.json({ error: 'Référence et statut requis' }, { status: 400 });
    }
    if (!VALID_STATUSES.includes(status)) {
      return Response.json({ error: 'Statut invalide. Valeurs acceptées: ' + VALID_STATUSES.join(', ') }, { status: 400 });
    }
    const base44 = createClientFromRequest(req);
    const orders = await base44.asServiceRole.entities.Order.filter({ reference });
    if (!orders || orders.length === 0) {
      return Response.json({ error: 'Commande introuvable' }, { status: 404 });
    }
    const order = orders[0];
    await base44.asServiceRole.entities.Order.update(order.id, { status });
    return Response.json({ success: true, reference: order.reference, status });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}