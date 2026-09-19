import { adminRequest } from "../../shared/adminApi.ts";

export default async function(req: Request): Promise<Response> {
  try {
    const body = await req.json();
    const { reference_code, order_number } = body;
    if (!reference_code && !order_number) {
      return Response.json({ error: "reference_code or order_number is required" }, { status: 400 });
    }
    const q = reference_code ? { reference_code } : { order_number };
    const orders = await adminRequest(
      "/entities/Order?q=" + encodeURIComponent(JSON.stringify(q)),
    );
    return Response.json({ orders });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}