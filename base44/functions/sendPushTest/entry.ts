import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';
import { sendSubscriberPush } from '../../shared/sendSubscriberPush.ts';

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
    const stats = await sendSubscriberPush(base44, {
      title: `CAPRICE · Test ${sequence}/10`, content: messages[sequence - 1],
      dryRun: dry_run, subscribersOnly: true
    });
    return Response.json({ sequence, dry_run, ...stats, message: messages[sequence - 1] });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}