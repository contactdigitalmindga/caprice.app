import { adminRequest, createNotification, createActionHistory } from "../../shared/adminApi.ts";

export default async function(req: Request): Promise<Response> {
  try {
    const body = await req.json();
    const { customer_name, phone, date, time, party_size, space, preference } = body;

    if (!customer_name || !date || !time || !party_size || !space) {
      return Response.json({ error: "customer_name, date, time, party_size, space are required" }, { status: 400 });
    }

    const reservation = await adminRequest("/entities/Reservation", {
      method: "POST",
      body: JSON.stringify({
        customer_name,
        phone: phone || null,
        date,
        time,
        party_size,
        space,
        preference: preference || null,
        status: "en_attente",
        source: "en_ligne",
      }),
    });

    await createNotification({
      target_role: "restaurant",
      type: "new_reservation",
      message: `Nouvelle réservation en ligne — ${customer_name} · ${date} ${time} · ${party_size} pers.`,
    });

    return Response.json({ id: reservation.id });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}