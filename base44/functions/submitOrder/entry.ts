import { adminRequest, genOrderNumber, genReferenceCode, createNotification, createActionHistory } from "../../shared/adminApi.ts";

export default async function(req: Request): Promise<Response> {
  try {
    const body = await req.json();
    const {
      items = [],
      order_type,
      customer_name,
      customer_phone,
      customer_address,
      total,
      notes,
      table_number,
    } = body;

    if (!order_type || total == null) {
      return Response.json({ error: "order_type and total are required" }, { status: 400 });
    }

    const order_number = genOrderNumber();
    const reference_code = genReferenceCode();

    const order = await adminRequest("/entities/Order", {
      method: "POST",
      body: JSON.stringify({
        order_number,
        status: "nouvelle",
        order_type,
        origin: "en_ligne",
        reference_code,
        table_number: table_number || null,
        customer_name: customer_name || null,
        customer_phone: customer_phone || null,
        customer_address: customer_address || null,
        items,
        total,
        notes: notes || null,
        sent_to_kitchen_at: null,
      }),
    });

    await createNotification({
      target_role: "restaurant",
      type: "new_order",
      message: `Nouvelle commande en ligne ${order_number}`,
      order_id: order.id,
      order_number,
    });

    await createActionHistory({
      order_id: order.id,
      order_number,
      action: "Commande en ligne créée",
      to_status: "nouvelle",
      user_role: "client",
    });

    return Response.json({ id: order.id, order_number, reference_code });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}