import { createClientFromRequest } from 'npm:@base44/sdk@0.8.49';

export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });
    const records = await base44.entities.AppDistribution.list('-updated_date', 1);
    const link = records[0]?.download_url;
    if (!link) return Response.json({ error: 'Adresse non configurée' }, { status: 404 });
    const url = new URL(link);
    if (url.protocol !== 'https:' || url.pathname !== '/download' || url.search || url.hash) return Response.json({ error: 'Adresse invalide' }, { status: 400 });
    const input = await req.json();
    const format = input.format === 'svg' ? 'svg' : 'png';
    const source = `https://api.qrserver.com/v1/create-qr-code/?size=800x800&margin=20&format=${format}&data=${encodeURIComponent(link)}`;
    const result = await fetch(source);
    if (!result.ok) throw new Error('QR indisponible');
    const bytes = new Uint8Array(await result.arrayBuffer());
    let binary = '';
    for (let i = 0; i < bytes.length; i += 8192) binary += String.fromCharCode(...bytes.slice(i, i + 8192));
    return Response.json({ data_url: `data:${format === 'svg' ? 'image/svg+xml' : 'image/png'};base64,${btoa(binary)}` });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}