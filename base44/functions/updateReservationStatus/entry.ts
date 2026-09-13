import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
import { secrets } from 'base44:runtime';

const VALID_STATUSES = ['confirmee', 'terminee', 'annulee'];

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
    const reservations = await base44.asServiceRole.entities.Reservation.filter({ reference });
    if (!reservations || reservations.length === 0) {
      return Response.json({ error: 'Réservation introuvable' }, { status: 404 });
    }
    const r = reservations[0];
    await base44.asServiceRole.entities.Reservation.update(r.id, { status });
    return Response.json({ success: true, reference: r.reference, status });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}