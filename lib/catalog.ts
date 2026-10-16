// Server-side catalogue — Sprint 4 data-layer swap.
// The storefront (Home / Shop / product pages) now reads the LIVE Supabase
// catalogue (phones + variants tables the owner created and seeded).
// If Supabase is unreachable or returns nothing, it falls back to the
// bundled seed in lib/products.ts so the store never renders empty —
// the fallback is logged on the server so the source is always known.
import type { Phone, Variant } from "./types";
import { PHONES } from "./products";

interface PhoneRow {
  id: string; slug: string; brand: string; model: string; tagline: string;
  rating: number | string; review_count: number; colours: string[]; hue: number;
  tags: string[]; pta_approved: boolean; warranty: string;
  specs: Phone["specs"]; is_active: boolean;
}
interface VariantRow {
  sku: string; phone_id: string; storage_gb: number; ram_gb: number;
  price_pkr: number; old_price_pkr: number | null; stock: number;
}

const URL_BASE = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function fetchTable<T>(table: string): Promise<T[] | null> {
  if (!URL_BASE || !KEY) return null;
  try {
    const res = await fetch(`${URL_BASE}/rest/v1/${table}?select=*`, {
      headers: { apikey: KEY, Authorization: `Bearer ${KEY}` },
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    const rows = (await res.json()) as T[];
    return Array.isArray(rows) && rows.length > 0 ? rows : null;
  } catch {
    return null;
  }
}

export async function getCatalogue(): Promise<Phone[]> {
  const [phoneRows, variantRows] = await Promise.all([
    fetchTable<PhoneRow>("phones"),
    fetchTable<VariantRow>("variants"),
  ]);
  if (!phoneRows || !variantRows) {
    console.info("[catalogue] source=local-fallback (Supabase unavailable or empty)");
    return PHONES;
  }
  const byPhone = new Map<string, Variant[]>();
  for (const v of variantRows) {
    const list = byPhone.get(v.phone_id) ?? [];
    list.push({
      sku: v.sku,
      storageGb: v.storage_gb,
      ramGb: v.ram_gb,
      pricePkr: v.price_pkr,
      oldPricePkr: v.old_price_pkr ?? undefined,
      stock: v.stock,
    });
    byPhone.set(v.phone_id, list);
  }
  const phones: Phone[] = phoneRows
    .filter((p) => p.is_active)
    .map((p) => ({
      id: p.id,
      slug: p.slug,
      brand: p.brand,
      model: p.model,
      tagline: p.tagline,
      rating: Number(p.rating),
      reviewCount: p.review_count,
      colours: p.colours,
      hue: p.hue,
      tags: p.tags,
      ptaApproved: p.pta_approved,
      warranty: p.warranty,
      specs: p.specs,
      variants: (byPhone.get(p.id) ?? []).sort((a, b) => a.storageGb - b.storageGb),
    }))
    .filter((p) => p.variants.length > 0);
  console.info(`[catalogue] source=supabase phones=${phones.length} variants=${variantRows.length}`);
  return phones.length > 0 ? phones : PHONES;
}

export async function getPhoneBySlug(slug: string): Promise<Phone | undefined> {
  const all = await getCatalogue();
  return all.find((p) => p.slug === slug);
}

export function brandsOf(phones: Phone[]): string[] {
  return [...new Set(phones.map((p) => p.brand))].sort();
}
