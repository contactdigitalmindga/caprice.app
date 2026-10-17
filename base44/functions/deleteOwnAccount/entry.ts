import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';

export default async function(req: Request): Promise<Response> {
  try {
    if (req.method !== 'POST') return Response.json({ error: 'Méthode non autorisée.' }, { status: 405 });
    const base44 = createClientFromRequest(req);
    if (!await base44.auth.isAuthenticated()) return Response.json({ error: 'Connexion requise.' }, { status: 401 });
    const user = await base44.auth.me();
    if (!user?.id) return Response.json({ error: 'Connexion requise.' }, { status: 401 });
    const input = await req.json();
    if (input.confirm !== true) return Response.json({ error: 'Confirmation requise.' }, { status: 400 });
    // The caller cannot choose a user ID: only their authenticated account is deleted.
    await base44.asServiceRole.entities.User.delete(user.id);
    return Response.json({ deleted: true });
  } catch (error) {
    const status = error.status === 401 || error.status === 403 ? 401 : 500;
    return Response.json({ error: status === 401 ? 'Connexion requise.' : 'Suppression impossible. Veuillez réessayer.' }, { status });
  }
}