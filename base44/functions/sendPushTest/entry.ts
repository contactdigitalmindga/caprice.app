import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';

const messages = [
  'Une envie gourmande ? Découvrez la carte et commandez chez Caprice.',
  'Offrez-vous une pause savoureuse avec les spécialités de Caprice.',
  'Votre prochain repas exquis vous attend chez Caprice.',
  'Du goût, de la générosité et du plaisir : explorez notre menu.',
  'Envie de vous faire plaisir ? Retrouvez vos plats préférés chez Caprice.',
  'Partagez un délicieux moment autour des saveurs de Caprice.',
  'Et si votre prochaine pause avait le goût de Caprice ?',
  'Un repas gourmand en perspective ? Découvrez nos spécialités.',
  'Faites voyager vos papilles avec la carte de Caprice.',
  'Dernière notification de test. À bientôt pour un moment gourmand chez Caprice.'
];

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const admin = await base44.auth.me();
    if (!admin) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (admin.role !== 'admin' || admin.id !== '6a980008224694e817562d89') return Response.json({ error: 'Forbidden' }, { status: 403 });
    const { sequence, dry_run = false } = await req.json();
    if (!Number.isInteger(sequence) || sequence < 1 || sequence > 10 || typeof dry_run !== 'boolean') return Response.json({ error: 'Invalid test parameters' }, { status: 400 });
    let offset = 0, eligible = 0, sent = 0, failed = 0;
    do {
      const users = await base44.asServiceRole.entities.User.filter({ push_notifications_enabled: true }, '-created_date', 100, offset);
      eligible += users.length;
      if (!dry_run) {
        for (let i = 0; i < users.length; i += 6) {
          const results = await Promise.allSettled(users.slice(i, i + 6).map(user => base44.asServiceRole.integrations.Core.SendPushNotification({
            user_id: user.id,
            title: `CAPRICE · Test ${sequence}/10`,
            content: messages[sequence - 1],
            action_label: 'Découvrir le menu',
            action_url: 'https://caprice-app.base44.app/menu'
          })));
          for (const result of results) {
            if (result.status === 'fulfilled') sent++;
            else { failed++; console.error('Push test failed:', String(result.reason?.message || result.reason)); }
          }
        }
      }
      if (users.length < 100) break;
      offset += users.length;
    } while (true);
    return Response.json({ sequence, dry_run, eligible, sent, failed, message: messages[sequence - 1] });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}