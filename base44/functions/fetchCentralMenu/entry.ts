import { adminRequest } from "../../shared/adminApi.ts";

export default async function(req: Request): Promise<Response> {
  try {
    const items = await adminRequest(
      "/entities/MenuItem?q=" + encodeURIComponent(JSON.stringify({ available: true })),
    );
    return Response.json({ items });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}