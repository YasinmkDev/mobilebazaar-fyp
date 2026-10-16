import type { Order } from "./orders";
import type { Phone } from "./types";
import { PHONES } from "./products";

// Local-first admin auth for the FYP demo. In production this is replaced by
// Supabase Auth + a `profiles.role = 'admin'` check (see supabase/migrations/001_initial_schema.sql).
// The demo credentials are intentionally visible in the FYP documentation.
export const DEMO_ADMIN = { email: "admin@mobilebazaar.pk", password: "admin123" };
const SESSION_KEY = "mobilebazaar-admin-session-v1";

export function adminLoggedIn(): boolean {
  try { return localStorage.getItem(SESSION_KEY) === "1"; } catch { return false; }
}
export function adminLogin(email: string, password: string): boolean {
  const ok = email.trim().toLowerCase() === DEMO_ADMIN.email && password === DEMO_ADMIN.password;
  if (ok) { try { localStorage.setItem(SESSION_KEY, "1"); } catch { /* ignore */ } }
  return ok;
}
export function adminLogout() {
  try { localStorage.removeItem(SESSION_KEY); } catch { /* ignore */ }
}

// Product overrides (price/stock edits) — persisted locally in Sprint 3;
// in Supabase these become UPDATEs on the `variants` table.
export interface VariantOverride { pricePkr?: number; stock?: number; }
const OVERRIDE_KEY = "mobilebazaar-variant-overrides-v1";
export function loadOverrides(): Record<string, VariantOverride> {
  try {
    const raw = localStorage.getItem(OVERRIDE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, VariantOverride>) : {};
  } catch { return {}; }
}
export function saveOverride(sku: string, patch: VariantOverride) {
  try {
    const all = loadOverrides();
    all[sku] = { ...all[sku], ...patch };
    localStorage.setItem(OVERRIDE_KEY, JSON.stringify(all));
  } catch { /* ignore */ }
}

// ── Custom devices (Sprint 5) ─────────────────────────────────────────────
// The catalogue had Read + Update (price/stock overrides) but no Create or
// Delete — the classic CRUD-minus-two gap. Admin-added devices live here
// (local data layer, like the rest of the Sprint-3 admin) and go live on the
// storefront through the SQL export below, which produces INSERTs in exactly
// the format of supabase/seed.sql for the phones/variants tables.
const CUSTOM_KEY = "mobilebazaar-custom-phones-v1";

export function loadCustomPhones(): Phone[] {
  try {
    const raw = localStorage.getItem(CUSTOM_KEY);
    const list = raw ? (JSON.parse(raw) as Phone[]) : [];
    return Array.isArray(list) ? list : [];
  } catch { return []; }
}
function persistCustomPhones(list: Phone[]) {
  try { localStorage.setItem(CUSTOM_KEY, JSON.stringify(list)); } catch { /* ignore */ }
}
export function upsertCustomPhone(phone: Phone) {
  const list = loadCustomPhones();
  const i = list.findIndex((p) => p.id === phone.id);
  if (i >= 0) list[i] = phone; else list.push(phone);
  persistCustomPhones(list);
}
export function deleteCustomPhone(id: string) {
  const list = loadCustomPhones();
  const target = list.find((p) => p.id === id);
  persistCustomPhones(list.filter((p) => p.id !== id));
  if (target) {
    // Clean up any price/stock overrides belonging to the removed device.
    try {
      const all = loadOverrides();
      for (const v of target.variants) delete all[v.sku];
      localStorage.setItem(OVERRIDE_KEY, JSON.stringify(all));
    } catch { /* ignore */ }
  }
}
export function slugTaken(slug: string, exceptId?: string): boolean {
  if (PHONES.some((p) => p.slug === slug)) return true;
  return loadCustomPhones().some((p) => p.slug === slug && p.id !== exceptId);
}
export function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

/** SQL export — INSERT statements matching supabase/seed.sql exactly. */
export function phoneToSql(p: Phone): string {
  const q = (s: string) => `'${s.replace(/'/g, "''")}'`;
  const arr = (xs: string[]) => `'{${xs.join(",")}}'`;
  const specs = JSON.stringify(p.specs).replace(/'/g, "''");
  const head =
    `INSERT INTO public.phones (id, slug, brand, model, tagline, rating, review_count, colours, hue, tags, pta_approved, warranty, specs)\n` +
    `VALUES (${q(p.id)}, ${q(p.slug)}, ${q(p.brand)}, ${q(p.model)}, ${q(p.tagline)}, ${p.rating}, ${p.reviewCount},\n` +
    `  ${arr(p.colours)}, ${p.hue}, ${arr(p.tags)}, ${p.ptaApproved}, ${q(p.warranty)},\n` +
    `  '${specs}'::jsonb)\nON CONFLICT (id) DO NOTHING;`;
  const vars = p.variants.map((v) =>
    `INSERT INTO public.variants (sku, phone_id, storage_gb, ram_gb, price_pkr, old_price_pkr, stock)\n` +
    `VALUES (${q(v.sku)}, ${q(p.id)}, ${v.storageGb}, ${v.ramGb}, ${v.pricePkr}, ${v.oldPricePkr ?? "NULL"}, ${v.stock})\nON CONFLICT (sku) DO NOTHING;`);
  return [head, ...vars].join("\n");
}
export function downloadTextFile(filename: string, text: string) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

// Analytics helpers (pure — unit-testable, reused by the dashboard).
export function totalRevenue(orders: Order[]): number {
  return orders.reduce((s, o) => s + o.total, 0);
}
export function revenueByDay(orders: Order[], days = 7): { label: string; revenue: number; count: number }[] {
  const out: { label: string; revenue: number; count: number }[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - i);
    const same = orders.filter((o) => {
      const t = new Date(o.placedAt); t.setHours(0, 0, 0, 0);
      return t.getTime() === d.getTime();
    });
    out.push({ label: d.toLocaleDateString("en-PK", { weekday: "short" }), revenue: totalRevenue(same), count: same.length });
  }
  return out;
}
export function topPhones(orders: Order[], limit = 5): { name: string; units: number; revenue: number }[] {
  const map = new Map<string, { name: string; units: number; revenue: number }>();
  for (const o of orders) for (const i of o.items) {
    const cur = map.get(i.name) ?? { name: i.name, units: 0, revenue: 0 };
    cur.units += i.qty; cur.revenue += i.qty * i.pricePkr;
    map.set(i.name, cur);
  }
  return [...map.values()].sort((a, b) => b.units - a.units).slice(0, limit);
}
export function paymentMix(orders: Order[]): { method: string; count: number }[] {
  const map = new Map<string, number>();
  for (const o of orders) map.set(o.payment, (map.get(o.payment) ?? 0) + 1);
  return [...map.entries()].map(([method, count]) => ({ method, count }));
}
