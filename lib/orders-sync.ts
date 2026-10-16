// Mirrors each placed order into Supabase (orders + order_items) so the
// business record lives in the database, not only in the customer's
// browser. Guest INSERT is allowed by the Sprint 3 RLS policies; guest
// SELECT is intentionally not granted, so customer tracking keeps using
// the local record on the customer's own device (same behaviour as
// before), while the owner sees every order in Supabase.
import { getSupabase } from "./supabase";
import type { Order } from "./orders";

export async function recordOrderInSupabase(order: Order): Promise<void> {
  const sb = getSupabase();
  if (!sb) return;
  try {
    const { error } = await sb.from("orders").insert({
      id: order.id,
      placed_at: order.placedAt,
      customer_name: order.customer.name,
      customer_phone: order.customer.phone,
      customer_city: order.customer.city,
      customer_address: order.customer.address,
      customer_email: order.customer.email ?? null,
      customer_note: order.customer.note ?? null,
      payment: order.payment,
      subtotal: order.subtotal,
      delivery: order.delivery,
      total: order.total,
      status_index: order.statusIndex,
    });
    if (error) return; // local record is still the customer's receipt
    await sb.from("order_items").insert(
      order.items.map((i) => ({
        order_id: order.id,
        sku: i.sku,
        name: i.name,
        variant_label: i.variantLabel,
        price_pkr: i.pricePkr,
        qty: i.qty,
      }))
    );
  } catch {
    // Never block checkout on a sync failure.
  }
}
