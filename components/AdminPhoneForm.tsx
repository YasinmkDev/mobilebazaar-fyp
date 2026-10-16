"use client";
import { useMemo, useRef, useState } from "react";
import type { Phone, Variant } from "@/lib/types";
import { PHONES } from "@/lib/products";
import { slugify, slugTaken } from "@/lib/admin";
import { fileToCompressedDataUrl, PLACEHOLDER_IMG } from "@/lib/images";
import { formatPkr } from "@/lib/format";
import {
  Plus, Trash2, X, ImagePlus, Star, Smartphone, ListChecks, Layers, CircleAlert,
} from "lucide-react";

const TAG_OPTIONS = ["budget", "flagship", "gaming", "camera", "battery", "5g"];
const BRAND_LIST = [...new Set(PHONES.map((p) => p.brand))].sort();

interface VariantRow { storage: string; ram: string; price: string; oldPrice: string; stock: string; }
interface Props { initial?: Phone | null; onSave: (phone: Phone) => void; onCancel: () => void; }

const num = (s: string) => Number(s);
const blankVariant = (): VariantRow => ({ storage: "128", ram: "8", price: "", oldPrice: "", stock: "10" });

function Switch({ checked, onChange, label }: { checked: boolean; onChange: (b: boolean) => void; label: string }) {
  return (
    <button type="button" role="switch" aria-checked={checked} className={"switch" + (checked ? " on" : "")}
      onClick={() => onChange(!checked)}>
      <span className="switch-knob" aria-hidden="true" />{label}
    </button>
  );
}

export default function AdminPhoneForm({ initial, onSave, onCancel }: Props) {
  const editing = Boolean(initial);
  const fileRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<string>(initial?.image ?? "");
  const [imageBusy, setImageBusy] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [brand, setBrand] = useState(initial?.brand ?? "");
  const [model, setModel] = useState(initial?.model ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(editing);
  const [tagline, setTagline] = useState(initial?.tagline ?? "");
  const [colours, setColours] = useState(initial ? initial.colours.join(", ") : "Black, Blue, Silver");
  const [hue, setHue] = useState(String(initial?.hue ?? 210));
  const [tags, setTags] = useState<string[]>(initial?.tags ?? ["budget"]);
  const [pta, setPta] = useState(initial?.ptaApproved ?? true);
  const [warranty, setWarranty] = useState(initial?.warranty ?? "");
  const [rating, setRating] = useState(String(initial?.rating ?? 4.5));
  const [reviews, setReviews] = useState(String(initial?.reviewCount ?? 12));
  const [display, setDisplay] = useState(initial?.specs.display ?? "6.7\" AMOLED");
  const [refreshHz, setRefreshHz] = useState(String(initial?.specs.refreshHz ?? 120));
  const [chipset, setChipset] = useState(initial?.specs.chipset ?? "");
  const [os, setOs] = useState(initial?.specs.os ?? "");
  const [mainCam, setMainCam] = useState(String(initial?.specs.mainCameraMp ?? 50));
  const [selfieCam, setSelfieCam] = useState(String(initial?.specs.selfieCameraMp ?? 16));
  const [battery, setBattery] = useState(String(initial?.specs.batteryMah ?? 5000));
  const [charging, setCharging] = useState(String(initial?.specs.chargingW ?? 25));
  const [fiveG, setFiveG] = useState(initial?.specs.fiveG ?? false);
  const [nfc, setNfc] = useState(initial?.specs.nfc ?? false);
  const [rows, setRows] = useState<VariantRow[]>(
    initial ? initial.variants.map((v) => ({
      storage: String(v.storageGb), ram: String(v.ramGb), price: String(v.pricePkr),
      oldPrice: v.oldPricePkr ? String(v.oldPricePkr) : "", stock: String(v.stock),
    })) : [blankVariant()],
  );
  const [errors, setErrors] = useState<string[]>([]);

  const effectiveSlug = useMemo(
    () => (slugTouched ? slug : slugify(`${brand} ${model}`)),
    [slug, slugTouched, brand, model]);
  const colourList = useMemo(() => colours.split(",").map((c) => c.trim()).filter(Boolean), [colours]);
  const previewPrice = useMemo(() => {
    const ps = rows.map((r) => num(r.price)).filter((p) => p > 0);
    return ps.length ? Math.min(...ps) : 0;
  }, [rows]);

  const takeFile = async (f: File | undefined) => {
    if (!f) return;
    if (!f.type.startsWith("image/")) { setErrors(["That file is not an image — choose a JPG or PNG photo of the phone."]); return; }
    setImageBusy(true);
    try { setImage(await fileToCompressedDataUrl(f)); }
    catch { setErrors(["The image could not be processed in this browser — try a different photo."]); }
    setImageBusy(false);
  };

  const toggleTag = (t: string) => setTags((xs) => (xs.includes(t) ? xs.filter((x) => x !== t) : [...xs, t]));
  const setRow = (i: number, patch: Partial<VariantRow>) =>
    setRows((rs) => rs.map((r, j) => (j === i ? { ...r, ...patch } : r)));

  const submit = () => {
    const errs: string[] = [];
    if (!brand.trim()) errs.push("Brand is required.");
    if (!model.trim()) errs.push("Model is required.");
    if (!tagline.trim()) errs.push("A one-line tagline is required — it sells the phone on every card.");
    if (!effectiveSlug) errs.push("Slug is required.");
    else if (slugTaken(effectiveSlug, initial?.id)) errs.push(`Slug "${effectiveSlug}" is already used by another phone — change the model name or the slug.`);
    if (colourList.length === 0) errs.push("Add at least one colour.");
    const ratingN = num(rating);
    if (Number.isNaN(ratingN) || ratingN < 0 || ratingN > 5) errs.push("Rating must be between 0 and 5.");
    if (!(num(refreshHz) > 0)) errs.push("Refresh rate must be a positive number.");
    if (!(num(battery) > 0)) errs.push("Battery capacity must be a positive number.");
    if (!chipset.trim()) errs.push("Chipset is required.");
    if (rows.length === 0) errs.push("Add at least one variant — a phone without a price cannot be sold.");
    const storages = rows.map((r) => num(r.storage));
    if (new Set(storages).size !== storages.length) errs.push("Two variants share the same storage — each storage size may appear once.");
    rows.forEach((r, i) => {
      const label = `Variant ${i + 1}`;
      if (!(num(r.storage) > 0)) errs.push(`${label}: storage must be a positive number.`);
      if (!(num(r.ram) > 0)) errs.push(`${label}: RAM must be a positive number.`);
      if (!(num(r.price) > 0)) errs.push(`${label}: price must be greater than zero.`);
      if (r.oldPrice && !(num(r.oldPrice) > num(r.price))) errs.push(`${label}: the old (strikethrough) price must be higher than the selling price.`);
      if (num(r.stock) < 0 || Number.isNaN(num(r.stock))) errs.push(`${label}: stock cannot be negative.`);
    });
    setErrors(errs);
    if (errs.length > 0) { window.scrollTo({ top: 0, behavior: "smooth" }); return; }

    const variants: Variant[] = rows.map((r) => ({
      sku: `${effectiveSlug}-${num(r.storage)}`,
      storageGb: num(r.storage), ramGb: num(r.ram), pricePkr: Math.round(num(r.price)),
      oldPricePkr: r.oldPrice ? Math.round(num(r.oldPrice)) : undefined,
      stock: Math.floor(num(r.stock)),
    }));
    onSave({
      id: initial?.id ?? `custom-${effectiveSlug}`,
      slug: effectiveSlug,
      brand: brand.trim(), model: model.trim(), tagline: tagline.trim(),
      rating: ratingN, reviewCount: Math.max(0, Math.floor(num(reviews) || 0)),
      colours: colourList, image: image || undefined,
      hue: Math.min(360, Math.max(0, num(hue) || 210)),
      tags, ptaApproved: pta,
      warranty: warranty.trim() || `${brand.trim()} Official Warranty`,
      specs: {
        display: display.trim(), refreshHz: num(refreshHz), chipset: chipset.trim(),
        mainCameraMp: num(mainCam) || 0, selfieCameraMp: num(selfieCam) || 0,
        batteryMah: num(battery), chargingW: num(charging) || 0,
        fiveG, nfc, os: os.trim() || (brand.trim() === "Apple" ? "iOS 26" : "Android 15"),
      },
      variants,
    });
  };

  return (
    <section className="device-form-v2" aria-labelledby="df-h">
      <div className="dfx-top">
        <div>
          <p className="kicker">Catalogue</p>
          <h2 id="df-h">{editing ? `Edit device — ${initial!.brand} ${initial!.model}` : "Add a new device"}</h2>
          <p className="sub" style={{ margin: 0 }}>Everything a customer sees on the card and the product page comes from this form.</p>
        </div>
        <button type="button" className="cmp-close" onClick={onCancel} aria-label="Close form"><X size={16} /></button>
      </div>

      {errors.length > 0 && (
        <div className="form-errors" role="alert">
          <b><CircleAlert size={15} aria-hidden="true" style={{ verticalAlign: -2, marginRight: 6 }} />Please fix {errors.length} {errors.length === 1 ? "thing" : "things"}:</b>
          <ul>{errors.map((e) => <li key={e}>{e}</li>)}</ul>
        </div>
      )}

      <div className="dfx-layout">
        <div className="dfx-main">
          <section className="dfx-card" aria-labelledby="dfx-img-h">
            <h3 id="dfx-img-h"><ImagePlus size={16} aria-hidden="true" /> Device image</h3>
            <div className={"dfx-upload" + (dragOver ? " drag" : "")}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setDragOver(false); takeFile(e.dataTransfer.files?.[0]); }}>
              {image ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={image} alt="Uploaded device" className="dfx-upload-preview" />
                  <div className="dfx-upload-actions">
                    <button type="button" className="btn btn-outline" onClick={() => fileRef.current?.click()}>Replace image</button>
                    <button type="button" className="btn btn-ghost" onClick={() => setImage("")}>Remove</button>
                  </div>
                  <p className="hint">Compressed automatically. For the live storefront, download it from the device row after saving (publishing step).</p>
                </>
              ) : (
                <>
                  <span className="dfx-upload-icon"><ImagePlus size={22} aria-hidden="true" /></span>
                  <p><b>Drop the phone's photo here</b> or</p>
                  <button type="button" className="btn btn-primary" onClick={() => fileRef.current?.click()} disabled={imageBusy}>
                    {imageBusy ? "Processing…" : "Browse image"}
                  </button>
                  <p className="hint">JPG or PNG, straight-on product shot on a plain background looks best. No image? A clean placeholder is used automatically.</p>
                </>
              )}
              <input ref={fileRef} type="file" accept="image/*" hidden aria-label="Upload device image"
                onChange={(e) => { takeFile(e.target.files?.[0]); e.target.value = ""; }} />
            </div>
          </section>

          <section className="dfx-card" aria-labelledby="dfx-basic-h">
            <h3 id="dfx-basic-h"><Smartphone size={16} aria-hidden="true" /> Basics</h3>
            <div className="df-grid">
              <label>Brand<input list="df-brands" value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="e.g. Samsung" />
                <datalist id="df-brands">{BRAND_LIST.map((b) => <option key={b} value={b} />)}</datalist></label>
              <label>Model<input value={model} onChange={(e) => setModel(e.target.value)} placeholder="e.g. Galaxy A57" /></label>
              <label>Page address (slug)<input value={effectiveSlug} onChange={(e) => { setSlugTouched(true); setSlug(slugify(e.target.value)); }} placeholder="auto from brand + model" /><span className="field-hint">/phones/{effectiveSlug || "…"}</span></label>
              <label>Tagline<input value={tagline} onChange={(e) => setTagline(e.target.value)} placeholder="One honest line that sells it" /></label>
              <label>Colours (comma separated)<input value={colours} onChange={(e) => setColours(e.target.value)} /></label>
              <label>Backdrop hue (0–360)<input type="number" min={0} max={360} value={hue} onChange={(e) => setHue(e.target.value)} /></label>
              <label>Rating (0–5)<input type="number" step="0.1" min={0} max={5} value={rating} onChange={(e) => setRating(e.target.value)} /></label>
              <label>Review count<input type="number" min={0} value={reviews} onChange={(e) => setReviews(e.target.value)} /></label>
              <label>Warranty<input value={warranty} onChange={(e) => setWarranty(e.target.value)} placeholder="Defaults to “Brand Official Warranty”" /></label>
            </div>
            <p className="option-label" style={{ marginTop: 14 }}>Collections</p>
            <div className="tag-pills">
              {TAG_OPTIONS.map((t) => (
                <button key={t} type="button" className={"tag-pill" + (tags.includes(t) ? " on" : "")} aria-pressed={tags.includes(t)} onClick={() => toggleTag(t)}>{t}</button>
              ))}
            </div>
            <div className="dfx-switches">
              <Switch checked={pta} onChange={setPta} label="PTA Approved" />
            </div>
          </section>

          <section className="dfx-card" aria-labelledby="dfx-spec-h">
            <h3 id="dfx-spec-h"><ListChecks size={16} aria-hidden="true" /> Specifications</h3>
            <div className="df-grid">
              <label>Display<input value={display} onChange={(e) => setDisplay(e.target.value)} /></label>
              <label>Refresh rate (Hz)<input type="number" value={refreshHz} onChange={(e) => setRefreshHz(e.target.value)} /></label>
              <label>Chipset<input value={chipset} onChange={(e) => setChipset(e.target.value)} placeholder="e.g. Dimensity 7400" /></label>
              <label>Operating system<input value={os} onChange={(e) => setOs(e.target.value)} placeholder="Android 15 / iOS 26" /></label>
              <label>Main camera (MP)<input type="number" value={mainCam} onChange={(e) => setMainCam(e.target.value)} /></label>
              <label>Selfie camera (MP)<input type="number" value={selfieCam} onChange={(e) => setSelfieCam(e.target.value)} /></label>
              <label>Battery (mAh)<input type="number" value={battery} onChange={(e) => setBattery(e.target.value)} /></label>
              <label>Fast charging (W)<input type="number" value={charging} onChange={(e) => setCharging(e.target.value)} /></label>
            </div>
            <div className="dfx-switches">
              <Switch checked={fiveG} onChange={setFiveG} label="5G" />
              <Switch checked={nfc} onChange={setNfc} label="NFC" />
            </div>
          </section>

          <section className="dfx-card" aria-labelledby="dfx-var-h">
            <h3 id="dfx-var-h"><Layers size={16} aria-hidden="true" /> Variants — what customers actually buy</h3>
            <div className="dfx-variants">
              {rows.map((r, i) => (
                <div key={i} className="dfx-vcard">
                  <p className="dfx-vhead2"><b>Variant {i + 1}</b><span className="mono">{effectiveSlug || "phone"}-{r.storage || "?"}</span>
                    <button type="button" className="df-vremove" disabled={rows.length === 1} onClick={() => setRows((rs) => rs.filter((_, j) => j !== i))} aria-label={`Remove variant ${i + 1}`}><Trash2 size={15} /></button></p>
                  <div className="dfx-vgrid">
                    <label>Storage (GB)<input type="number" value={r.storage} onChange={(e) => setRow(i, { storage: e.target.value })} /></label>
                    <label>RAM (GB)<input type="number" value={r.ram} onChange={(e) => setRow(i, { ram: e.target.value })} /></label>
                    <label>Price (PKR)<span className="rs-input"><span>Rs</span><input type="number" value={r.price} onChange={(e) => setRow(i, { price: e.target.value })} placeholder="149,999" /></span></label>
                    <label>Old price (optional)<span className="rs-input"><span>Rs</span><input type="number" value={r.oldPrice} onChange={(e) => setRow(i, { oldPrice: e.target.value })} placeholder="—" /></span></label>
                    <label>Stock<input type="number" value={r.stock} onChange={(e) => setRow(i, { stock: e.target.value })} /></label>
                  </div>
                </div>
              ))}
            </div>
            <button type="button" className="df-add-variant" onClick={() => setRows((rs) => [...rs, blankVariant()])}>
              <Plus size={15} aria-hidden="true" /> Add another variant
            </button>
          </section>
        </div>

        <aside className="dfx-side">
          <div className="dfx-preview">
            <p className="option-label">Live preview — store card</p>
            <div className="dfx-preview-card">
              <div className="dfx-preview-media" style={{ background: `linear-gradient(150deg, hsl(${num(hue) || 210} 55% 93%), hsl(${((num(hue) || 210) + 40) % 360} 45% 84%))` }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image || PLACEHOLDER_IMG} alt="" />
                {pta && <span className="badge badge-pta">PTA Approved</span>}
              </div>
              <div className="dfx-preview-body">
                <p className="brand-kicker">{brand || "Brand"}</p>
                <p className="dfx-preview-model">{model || "Model name"}</p>
                <p className="stars-inline"><Star size={13} fill="currentColor" aria-hidden="true" /> {(num(rating) || 0).toFixed(1)} <span className="tagline">({reviews || 0})</span></p>
                <p className="tagline dfx-preview-tag">{tagline || "Your tagline appears here."}</p>
                <p className="price dfx-preview-price">{previewPrice ? formatPkr(previewPrice) : "Rs —"}</p>
                <p className="emi-line">{previewPrice ? `EMI ${formatPkr(Math.round(previewPrice / 12))}/mo` : "EMI —"}</p>
                <span className="swatches-mini" aria-hidden="true">
                  {colourList.slice(0, 4).map((c, i) => (
                    <i key={c + i} style={{ background: `hsl(${((num(hue) || 210) + i * 45) % 360} 55% ${34 + i * 14}%)` }} title={c} />
                  ))}
                </span>
              </div>
            </div>
            <ul className="dfx-checklist">
              <li className={image ? "ok" : ""}>Device image {image ? "added" : "— placeholder will be used"}</li>
              <li className={previewPrice > 0 ? "ok" : ""}>{rows.length} variant{rows.length === 1 ? "" : "s"} priced</li>
              <li>After saving: SQL button publishes it to the live store{image ? ", image button downloads the photo as " + (effectiveSlug || "slug") + ".jpg" : ""}</li>
            </ul>
          </div>
        </aside>
      </div>

      <div className="dfx-actionbar">
        <button type="button" className="btn btn-primary" onClick={submit}>{editing ? "Save changes" : "Add device"}</button>
        <button type="button" className="btn btn-outline" onClick={onCancel}>Cancel</button>
        {errors.length > 0 && <span className="dfx-action-error">{errors.length} {errors.length === 1 ? "issue" : "issues"} to fix above</span>}
      </div>
    </section>
  );
}
