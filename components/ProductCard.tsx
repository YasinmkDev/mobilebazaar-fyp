"use client";
import { useState } from "react";
import Link from "next/link";
import type { Phone } from "@/lib/types";
import { useCart } from "@/lib/cart";
import { emiMonthly } from "@/lib/types";
import { formatPkr } from "@/lib/format";
import { phoneImage } from "@/lib/images";
import DeviceImage from "./DeviceImage";

interface Props {
  phone: Phone;
  onCompare?: (phone: Phone) => void;
  compared?: boolean;
}

export default function ProductCard({ phone, onCompare, compared }: Props) {
  const { add } = useCart();
  const [variantIdx, setVariantIdx] = useState(0);
  const [added, setAdded] = useState(false);
  const v = phone.variants[variantIdx];
  const off = v.oldPricePkr ? Math.round((1 - v.pricePkr / v.oldPricePkr) * 100) : 0;

  return (
    <article className="card" data-reveal aria-label={`${phone.brand} ${phone.model}`}>
      <div className="phone-visual">
        <DeviceImage src={phone.image ?? phoneImage(phone.slug)} alt={`${phone.brand} ${phone.model}`} imgClassName="device-img" />
        <div className="badge-row">
          {off > 0 && <span className="badge badge-off">Sale −{off}%</span>}
          {phone.ptaApproved && <span className="badge badge-pta">PTA Approved</span>}
        </div>
      </div>

      <p className="brand-kicker">{phone.brand}</p>
      <h3><Link href={`/phones/${phone.slug}`}>{phone.model}</Link></h3>
      <p className="tagline">{phone.tagline}</p>
      <div className="colour-dots" aria-label={`Colours: ${phone.colours.join(", ")}`}>
        {phone.colours.map((c, i) => (
          <i key={c} title={c} style={{ background: `hsl(${(phone.hue + i * 45) % 360} 45% ${28 + i * 18}%)` }} />
        ))}
        <span className="tagline">{phone.colours.join(" · ")}</span>
      </div>

      <ul className="spec-chips" aria-label="Key specs">
        <li>{v.ramGb}GB RAM</li>
        <li>{v.storageGb}GB</li>
        <li>{phone.specs.mainCameraMp}MP camera</li>
        <li>{phone.specs.batteryMah} mAh</li>
        {phone.specs.fiveG && <li>5G</li>}
      </ul>

      <div className="variant-row" role="group" aria-label="Storage and RAM variants">
        {phone.variants.map((variant, i) => (
          <button key={variant.sku} type="button" className="variant-btn"
            aria-pressed={i === variantIdx} disabled={variant.stock === 0}
            onClick={() => setVariantIdx(i)}>
            {variant.storageGb}GB · {variant.ramGb}GB RAM{variant.stock === 0 ? " — Sold out" : ""}
          </button>
        ))}
      </div>

      <div className="price-line">
        <span className="price price-now">{formatPkr(v.pricePkr)}</span>
        {v.oldPricePkr && <span className="price-old">{formatPkr(v.oldPricePkr)}</span>}
      </div>
      <p className="stars" aria-label={`Rated ${phone.rating} out of 5 from ${phone.reviewCount} reviews`}>
        <span className="star-glyph">★</span> {phone.rating.toFixed(1)} <span>({phone.reviewCount} reviews)</span>
      </p>
      <p className="emi-line">EMI from <b>{formatPkr(emiMonthly(v.pricePkr))}/mo</b> · COD available</p>
      <p className="tagline">{v.stock <= 7 ? `Only ${v.stock} left in stock` : "In stock"} · {phone.warranty}</p>

      <div className="card-actions">
        <button type="button" className="btn btn-primary"
          onClick={() => { add(v.sku); setAdded(true); }} aria-live="polite">
          {added ? `Added ✓ — ${formatPkr(v.pricePkr)}` : "Add to Cart"}
        </button>
        {onCompare && (
          <button type="button" className="btn btn-compare" aria-pressed={!!compared}
            onClick={() => onCompare(phone)} title="Add to compare (max 3)">
            ⇄
          </button>
        )}
      </div>
    </article>
  );
}
