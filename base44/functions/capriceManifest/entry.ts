export default async function(req: Request): Promise<Response> {
  try {
    const icon = 'https://media.base44.com/images/public/6a980008224694e817562d88/f5eaea17c_generated_image.png';
    return new Response(JSON.stringify({
      name: 'CAPRICE', short_name: 'CAPRICE', lang: 'fr',
      start_url: '/', scope: '/', display: 'standalone',
      background_color: '#f7f2e9', theme_color: '#211a15',
      icons: [{ src: icon, sizes: '512x512', type: 'image/png', purpose: 'any maskable' }]
    }), { headers: { 'Content-Type': 'application/manifest+json; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}