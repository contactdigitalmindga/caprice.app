import { secrets } from "base44:runtime";

const ADMIN_BASE = "https://caprice-order-flow.base44.app/api";

export async function adminRequest(path: string, options: any = {}) {
  const token = secrets.get("ADMIN_APP_TOKEN");
  if (!token) throw new Error("ADMIN_APP_TOKEN not configured");
  const res = await fetch(`${ADMIN_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Admin API ${res.status}: ${body}`);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

export function genOrderNumber() {
  return `CAP-${Math.floor(Math.random() * 900000 + 100000)}`;
}

export function genReferenceCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export async function createNotification(n: {
  target_role: string;
  type: string;
  message: string;
  order_id?: string;
  order_number?: string;
}) {
  return adminRequest("/entities/Notification", {
    method: "POST",
    body: JSON.stringify({ ...n, read: false }),
  });
}

export async function createActionHistory(a: {
  order_id?: string;
  order_number?: string;
  action: string;
  from_status?: string;
  to_status?: string;
  user_name?: string;
  user_role?: string;
}) {
  return adminRequest("/entities/ActionHistory", {
    method: "POST",
    body: JSON.stringify(a),
  });
}