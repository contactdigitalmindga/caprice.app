import { adminRequest } from "../../shared/adminApi.ts";

export default async function(req: Request): Promise<Response> {
  try {
    const body = await req.json();
    const { phone, date } = body;
    if (!phone) {
      return Response.json({ error: "phone is required" }, { status: 400 });
    }
    const q: any = { phone };
    if (date) q.date = date;
    const reservations = await adminRequest(
      "/entities/Reservation?q=" + encodeURIComponent(JSON.stringify(q)),
    );
    return Response.json({ reservations });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}