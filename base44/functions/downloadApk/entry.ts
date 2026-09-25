import { createClientFromRequest } from 'npm:@base44/sdk@0.8.49';

export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const records = await base44.entities.AppDistribution.list('-updated_date', 1);
    const url = records[0]?.apk_url;
    if (!url) return new Response('APK non disponible pour le moment.', { status: 404 });
    const target = new URL(url);
    if (target.protocol !== 'https:') return new Response('Adresse APK invalide.', { status: 503 });
    return new Response(null, { status: 302, headers: { Location: target.href, 'Cache-Control': 'no-store' } });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}