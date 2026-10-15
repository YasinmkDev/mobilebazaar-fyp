"use client";
import { Fragment, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { lowestPrice, emiMonthly, type Phone } from "@/lib/types";
import { formatPkr } from "@/lib/format";
import { phoneImage, imgFallback } from "@/lib/images";
import { useCart } from "@/lib/cart";
import { X, Trophy, Star, ShoppingCart, GitCompareArrows } from "lucide-react";

interface Props {
  phones: Phone[];
  onRemove: (phone: Phone) => void;
  onClose: () => void;
}

interface Row {
  label: string;
  values: string[];
  /** index of winning phone, or -1 */
  best: number;
  /** 0..1 fill per phone for the bar meter */
  meter?: number[];
}
interface Group { title: string; rows: Row[] }

const idxMax = (xs: number[]) => xs.indexOf(Math.max(...xs));
const idxMin = (xs: number[]) => xs.indexOf(Math.min(...xs));
const meterOf = (xs: number[]) => { const m = Math.max(...xs); return xs.map((x) => (m ? x / m : 0)); };

export default function CompareView({ phones, onRemove, onClose }: Props) {
  const { add } = useCart();
  const [diffOnly, setDiffOnly] = useState(false);
  const [addedSku, setAddedSku] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [onClose]);

  const groups = useMemo<Group[]>(() => {
    const prices = phones.map(lowestPrice);
    const cams = phones.map((p) => p.specs.mainCameraMp);
    const selfies = phones.map((p) => p.specs.selfieCameraMp);
    const bats = phones.map((p) => p.specs.batteryMah);
    const chgs = phones.map((p) => p.specs.chargingW);
    const hzs = phones.map((p) => p.specs.refreshHz);
    const rams = phones.map((p) => Math.max(...p.variants.map((v) => v.ramGb)));
    const ratings = phones.map((p) => p.rating);
    const fiveG = phones.map((p) => (p.specs.fiveG ? 1 : 0));
    const nfc = phones.map((p) => (p.specs.nfc ? 1 : 0));
    const uniq = (xs: number[]) => new Set(xs).size > 1;

    const G: Group[] = [
      { title: "Price & storage", rows: [
        { label: "Price (from)", values: prices.map(formatPkr), best: idxMin(prices) },
        { label: "EMI (×12)", values: prices.map((p) => formatPkr(emiMonthly(p)) + "/mo"), best: idxMin(prices) },
        { label: "Storage options", values: phones.map((p) => p.variants.map((v) => v.storageGb + "GB").join(" · ")), best: -1 },
        { label: "RAM (top variant)", values: rams.map((r) => r + "GB"), best: uniq(rams) ? idxMax(rams) : -1, meter: meterOf(rams) },
      ]},
      { title: "Display", rows: [
        { label: "Display", values: phones.map((p) => p.specs.display), best: -1 },
        { label: "Refresh rate", values: hzs.map((h) => h + " Hz"), best: uniq(hzs) ? idxMax(hzs) : -1, meter: meterOf(hzs) },
      ]},
      { title: "Performance", rows: [
        { label: "Chipset", values: phones.map((p) => p.specs.chipset), best: -1 },
        { label: "Operating system", values: phones.map((p) => p.specs.os), best: -1 },
      ]},
      { title: "Camera", rows: [
        { label: "Main camera", values: cams.map((c) => c + " MP"), best: uniq(cams) ? idxMax(cams) : -1, meter: meterOf(cams) },
        { label: "Selfie camera", values: selfies.map((c) => c + " MP"), best: uniq(selfies) ? idxMax(selfies) : -1, meter: meterOf(selfies) },
      ]},
      { title: "Battery", rows: [
        { label: "Battery", values: bats.map((b) => b.toLocaleString() + " mAh"), best: uniq(bats) ? idxMax(bats) : -1, meter: meterOf(bats) },
        { label: "Fast charging", values: chgs.map((c) => c + "W"), best: uniq(chgs) ? idxMax(chgs) : -1, meter: meterOf(chgs) },
      ]},
      { title: "Network & extras", rows: [
        { label: "Network", values: phones.map((p) => (p.specs.fiveG ? "5G" : "4G LTE")), best: uniq(fiveG) ? idxMax(fiveG) : -1 },
        { label: "NFC", values: phones.map((p) => (p.specs.nfc ? "Yes" : "No")), best: uniq(nfc) ? idxMax(nfc) : -1 },
        { label: "Buyer rating", values: ratings.map((r, i) => `${r.toFixed(1)} (${phones[i].reviewCount} reviews)`), best: uniq(ratings) ? idxMax(ratings) : -1 },
        { label: "Warranty", values: phones.map((p) => p.warranty), best: -1 },
      ]},
    ];
    if (!diffOnly) return G;
    return G.map((g) => ({ ...g, rows: g.rows.filter((r) => new Set(r.values).size > 1) })).filter((g) => g.rows.length > 0);
  }, [phones, diffOnly]);

  const verdicts = useMemo(() => {
    if (phones.length < 2) return [];
    const V: { label: string; phone: Phone }[] = [
      { label: "Lowest price", phone: phones[idxMin(phones.map(lowestPrice))] },
      { label: "Best camera", phone: phones[idxMax(phones.map((p) => p.specs.mainCameraMp))] },
      { label: "Biggest battery", phone: phones[idxMax(phones.map((p) => p.specs.batteryMah))] },
      { label: "Top rated", phone: phones[idxMax(phones.map((p) => p.rating))] },
    ];
    return V;
  }, [phones]);

  return (
    <div className="cmp-overlay" role="dialog" aria-modal="true" aria-label="Compare phones">
      <div className="cmp-backdrop" onClick={onClose} />
      <div className="cmp-panel">
        <header className="cmp-head">
          <h2><GitCompareArrows size={21} aria-hidden="true" /> Compare phones <span className="chip">{phones.length} of 3</span></h2>
          <div className="cmp-head-actions">
            <button type="button" className={"cmp-diff-toggle" + (diffOnly ? " on" : "")} aria-pressed={diffOnly} onClick={() => setDiffOnly((d) => !d)}>
              Differences only
            </button>
            <button type="button" className="cmp-close" onClick={onClose} aria-label="Close comparison"><X size={19} /></button>
          </div>
        </header>

        {verdicts.length > 0 && (
          <div className="cmp-verdicts" aria-label="Verdicts">
            {verdicts.map((v) => (
              <div key={v.label} className="cmp-verdict">
                <Trophy size={15} aria-hidden="true" />
                <span>{v.label}</span>
                <b>{v.phone.brand} {v.phone.model}</b>
              </div>
            ))}
          </div>
        )}

        <div className="cmp-scroll">
          <table className="cmp-table">
            <thead>
              <tr>
                <th className="cmp-corner"><span className="tagline">Tap a phone to view it,<br />or add it straight to cart.</span></th>
                {phones.map((p) => {
                  const cheapest = lowestPrice(p);
                  const sku = p.variants.reduce((a, b) => (a.pricePkr <= b.pricePkr ? a : b)).sku;
                  return (
                    <th key={p.id} className="cmp-phone-head">
                      <button type="button" className="cmp-remove" onClick={() => onRemove(p)} aria-label={`Remove ${p.brand} ${p.model} from comparison`}><X size={14} /></button>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={phoneImage(p.slug)} alt="" className="cmp-thumb" onError={imgFallback} />
                      <span className="brand-kicker">{p.brand}</span>
                      <Link href={`/phones/${p.slug}`} className="cmp-model">{p.model}</Link>
                      <span className="price cmp-price">{formatPkr(cheapest)}</span>
                      <span className="emi-line">EMI {formatPkr(emiMonthly(cheapest))}/mo</span>
                      <span className="cmp-rating"><Star size={13} fill="currentColor" aria-hidden="true" /> {p.rating.toFixed(1)} <span>({p.reviewCount})</span></span>
                      <button type="button" className="btn btn-primary cmp-add" onClick={() => { add(sku); setAddedSku(sku); }}>
                        <ShoppingCart size={15} aria-hidden="true" /> {addedSku === sku ? "Added" : "Add to Cart"}
                      </button>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {groups.map((g) => (
                <Fragment key={g.title}>
                  <tr className="cmp-group-row"><td colSpan={phones.length + 1}>{g.title}</td></tr>
                  {g.rows.map((r) => (
                    <tr key={g.title + r.label}>
                      <th scope="row" className="cmp-row-label">{r.label}</th>
                      {r.values.map((val, i) => (
                        <td key={i} className={r.best === i ? "cmp-best" : ""}>
                          <span className="cmp-val">{val}{r.best === i && <span className="cmp-best-pill">Best</span>}</span>
                          {r.meter && <span className="cmp-meter"><i style={{ width: `${Math.round(r.meter[i] * 100)}%` }} /></span>}
                        </td>
                      ))}
                    </tr>
                  ))}
                </Fragment>
              ))}
              {groups.length === 0 && (
                <tr><td colSpan={phones.length + 1} className="cmp-identical">These phones are identical on every spec we track — pick on price and colour.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <p className="cmp-footnote">Prices are the lowest variant per phone. “Best” marks the strongest value in that row — for price, lower wins.</p>
      </div>
    </div>
  );
}
