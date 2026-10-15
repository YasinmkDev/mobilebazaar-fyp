"use client";
import { useEffect, useMemo, useState } from "react";
import AdminShell from "@/components/AdminShell";
import AdminPhoneForm from "@/components/AdminPhoneForm";
import { PHONES } from "@/lib/products";
import { phoneImage, imgFallback } from "@/lib/images";
import type { Phone } from "@/lib/types";
import {
  loadOverrides, saveOverride, type VariantOverride,
  loadCustomPhones, upsertCustomPhone, deleteCustomPhone, phoneToSql, downloadTextFile,
} from "@/lib/admin";
import { formatPkr } from "@/lib/format";
import { Star, Check, Plus, Download, Pencil, Trash2, FileCode2, ImageDown } from "lucide-react";

interface Row { sku: string; slug: string; image?: string; phoneId: string; custom: boolean; name: string; label: string; price: number; stock: number; rating: number; }

function ProductsAdmin() {
  const [overrides, setOverrides] = useState<Record<string, VariantOverride>>({});
  const [customs, setCustoms] = useState<Phone[]>([]);
  const [query, setQuery] = useState("");
  const [savedSku, setSavedSku] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Phone | null>(null);
  const [notice, setNotice] = useState("");

  useEffect(() => { setOverrides(loadOverrides()); setCustoms(loadCustomPhones()); }, []);

  const catalogue = useMemo(() => [...PHONES, ...customs], [customs]);
  const customIds = useMemo(() => new Set(customs.map((p) => p.id)), [customs]);

  const rows: Row[] = useMemo(() =>
    catalogue.flatMap((p) => p.variants.map((v) => ({
      sku: v.sku, slug: p.slug, image: p.image, phoneId: p.id, custom: customIds.has(p.id),
      name: `${p.brand} ${p.model}`, label: `${v.storageGb}GB · ${v.ramGb}GB RAM`,
      price: overrides[v.sku]?.pricePkr ?? v.pricePkr,
      stock: overrides[v.sku]?.stock ?? v.stock,
      rating: p.rating,
    }))).filter((r) => (r.name + r.label).toLowerCase().includes(query.toLowerCase())),
  [catalogue, customIds, overrides, query]);

  const edit = (row: Row, field: "price" | "stock", value: number) => {
    if (Number.isNaN(value) || value < 0) return;
    const patch = field === "price" ? { pricePkr: Math.round(value) } : { stock: Math.floor(value) };
    saveOverride(row.sku, patch);
    setOverrides(loadOverrides());
    setSavedSku(row.sku);
  };

  const savePhone = (phone: Phone) => {
    upsertCustomPhone(phone);
    setCustoms(loadCustomPhones());
    setShowForm(false); setEditing(null);
    setNotice(editing
      ? `${phone.brand} ${phone.model} updated. Re-export its SQL if it is already published, so Supabase stays in sync.`
      : `${phone.brand} ${phone.model} added to the catalogue. It is live in this admin now — use its SQL button to publish it to the storefront.`);
  };

  const removePhone = (row: Row) => {
    const phone = customs.find((p) => p.id === row.phoneId);
    if (!phone) return;
    if (!window.confirm(`Remove ${phone.brand} ${phone.model} and all its variants from the catalogue? This cannot be undone (a published copy in Supabase is removed with a DELETE there).`)) return;
    deleteCustomPhone(phone.id);
    setCustoms(loadCustomPhones());
    setOverrides(loadOverrides());
    setNotice(`${phone.brand} ${phone.model} removed from the local catalogue.`);
  };

  const exportSql = (phone: Phone) =>
    downloadTextFile(`${phone.slug}.sql`, `-- MobileBazaar: publish ${phone.brand} ${phone.model}\n-- Run in Supabase → SQL Editor (after 001_initial_schema.sql).\n\n${phoneToSql(phone)}\n`);

  const exportAllSql = () =>
    downloadTextFile("mobilebazaar-new-devices.sql",
      `-- MobileBazaar: all admin-added devices (${customs.length})\n-- Run in Supabase → SQL Editor.\n\n` +
      customs.map(phoneToSql).join("\n\n") + "\n");

  const customPhoneOf = (row: Row) => customs.find((p) => p.id === row.phoneId);
  const seenCustom = new Set<string>();

  return (
    <>
      <div className="page-head">
        <div>
          <p className="kicker">Catalogue</p>
          <h1 className="admin-h1">Products & inventory</h1>
          <p className="sub" style={{ margin: 0 }}>{catalogue.length} phones · {catalogue.reduce((s, p) => s + p.variants.length, 0)} variants. Add devices, edit prices and stock — publishing to the live storefront is one SQL export away.</p>
        </div>
        <div className="page-head-actions">
          {customs.length > 0 && (
            <button type="button" className="btn btn-outline page-head-btn" onClick={exportAllSql}>
              <Download size={15} aria-hidden="true" /> Export all new ({customs.length}) as SQL
            </button>
          )}
          <button type="button" className="btn btn-primary page-head-btn" onClick={() => { setEditing(null); setShowForm((s) => !s); }}>
            <Plus size={16} aria-hidden="true" /> Add device
          </button>
        </div>
      </div>

      {notice && <p className="admin-notice" role="status">{notice}</p>}

      {showForm && (
        <AdminPhoneForm initial={editing}
          onSave={savePhone}
          onCancel={() => { setShowForm(false); setEditing(null); }} />
      )}

      <div className="shop-tools">
        <input type="search" placeholder="Filter products…" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Filter products" style={{ flex: 1, minWidth: 200 }} />
        <span className="chip">{rows.length} variants</span>
      </div>
      <div className="panel" style={{ overflowX: "auto", padding: 8 }}>
        <table className="admin-table">
          <thead><tr><th>Phone</th><th>Rating</th><th>Price (PKR)</th><th>Stock</th><th>Device</th><th aria-label="Saved indicator" /></tr></thead>
          <tbody>
            {rows.map((r) => {
              const firstOfPhone = r.custom && !seenCustom.has(r.phoneId);
              if (r.custom) seenCustom.add(r.phoneId);
              const cp = r.custom ? customPhoneOf(r) : undefined;
              return (
                <tr key={r.sku} className={r.stock <= 7 ? "low-row" : ""}>
                  <td>
                    <span className="prod-cell">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={r.image ?? phoneImage(r.slug)} onError={imgFallback} alt="" className="prod-thumb" />
                      <span><strong>{r.name}</strong><small>{r.label}</small></span>
                      {r.custom && <span className="new-chip">New</span>}
                    </span>
                  </td>
                  <td><span className="rating-cell"><Star size={13} fill="currentColor" aria-hidden="true" /> {r.rating.toFixed(1)}</span></td>
                  <td>
                    <input type="number" className="num-input" key={`p-${r.sku}-${r.price}`} defaultValue={r.price} min={0} step={100}
                      aria-label={`Price for ${r.name} ${r.label}`}
                      onBlur={(e) => edit(r, "price", Number(e.target.value))} />
                  </td>
                  <td>
                    <span className="stock-cell">
                      <button type="button" aria-label={`Decrease stock for ${r.name}`} onClick={() => edit(r, "stock", r.stock - 1)}>−</button>
                      <input type="number" className="num-input small" key={`s-${r.sku}-${r.stock}`} defaultValue={r.stock} min={0}
                        aria-label={`Stock for ${r.name} ${r.label}`}
                        onBlur={(e) => edit(r, "stock", Number(e.target.value))} />
                      <button type="button" aria-label={`Increase stock for ${r.name}`} onClick={() => edit(r, "stock", r.stock + 1)}>+</button>
                    </span>
                    {r.stock <= 7 && <span className="low-tag">Low</span>}
                  </td>
                  <td>
                    {r.custom && cp && firstOfPhone ? (
                      <span className="row-actions">
                        <button type="button" className="icon-act" title="Download SQL to publish this device" aria-label={`Download SQL for ${r.name}`} onClick={() => exportSql(cp)}><FileCode2 size={15} /></button>
                        {cp.image && (
                          <a className="icon-act" title={`Download the device photo as ${cp.slug}.jpg — place it in public/phones/ when publishing`} aria-label={`Download image for ${r.name}`}
                            href={cp.image} download={`${cp.slug}.jpg`}><ImageDown size={15} /></a>
                        )}
                        <button type="button" className="icon-act" title="Edit device" aria-label={`Edit ${r.name}`} onClick={() => { setEditing(cp); setShowForm(true); }}><Pencil size={15} /></button>
                        <button type="button" className="icon-act danger" title="Remove device" aria-label={`Remove ${r.name}`} onClick={() => removePhone(r)}><Trash2 size={15} /></button>
                      </span>
                    ) : r.custom ? null : <span className="tagline" style={{ fontSize: 12 }}>Built-in</span>}
                  </td>
                  <td>{savedSku === r.sku ? <span className="chip done-chip"><Check size={13} aria-hidden="true" /> Saved</span> : null}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="hint">Built-in devices ship with the seed catalogue (managed in Supabase / seed.sql). Devices you add here are stored on this device and appear across the admin instantly. To publish one: run its SQL export in Supabase → SQL Editor, and if it has a photo, use its image button to download <span className="mono">&lt;slug&gt;.jpg</span> into <span className="mono">public/phones/</span> — the phone is then fully live for customers within ~5 minutes. (In production, the photo uploads straight to Supabase Storage instead.)</p>
    </>
  );
}

export default function AdminProductsPage() {
  return <AdminShell><ProductsAdmin /></AdminShell>;
}
