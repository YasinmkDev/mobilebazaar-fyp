"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import type { Phone } from "@/lib/types";
import { emiMonthly } from "@/lib/types";
import { formatPkr } from "@/lib/format";
import { useCart } from "@/lib/cart";
import { reviewsFor } from "@/lib/reviews";
import { phoneImage, imgFallback } from "@/lib/images";
import DeviceImage from "./DeviceImage";
import ProductCard from "./ProductCard";
import {
  Star, ShieldCheck, BadgeCheck, PackageOpen, RotateCcw, Truck, CreditCard,
  ShoppingCart, Check, MonitorSmartphone, Cpu, Camera, BatteryCharging,
  Monitor, RadioTower, BatteryFull, Zap,
} from "lucide-react";

const TENURES = [4, 6, 12] as const;
const GROUP_ICONS = [Monitor, Cpu, Camera, BatteryFull, RadioTower];

function deliveryWindow(): string {
  const fmt = (d: Date) => d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
  const a = new Date(Date.now() + 2 * 864e5);
  const b = new Date(Date.now() + 4 * 864e5);
  return `${fmt(a)} – ${fmt(b)}`;
}

/** Deterministic rating split for the summary bars (seeded catalogue data). */
function ratingSplit(rating: number): { stars: number; pct: number }[] {
  const five = Math.min(92, Math.max(45, Math.round(((rating - 3.4) / 1.6) * 100)));
  const rest = 100 - five;
  const four = Math.round(rest * 0.55);
  const three = Math.round(rest * 0.25);
  const two = Math.round(rest * 0.12);
  const one = Math.max(0, rest - four - three - two);
  return [
    { stars: 5, pct: five }, { stars: 4, pct: four }, { stars: 3, pct: three },
    { stars: 2, pct: two }, { stars: 1, pct: one },
  ];
}

export default function ProductDetail({ phone, similar }: { phone: Phone; similar: Phone[] }) {
  const { add } = useCart();
  const [variantIdx, setVariantIdx] = useState(0);
  const [colour, setColour] = useState(0);
  const [tenure, setTenure] = useState<number>(12);
  const [added, setAdded] = useState(false);
  const v = phone.variants[variantIdx];
  const reviews = useMemo(() => reviewsFor(phone.id, phone.rating), [phone]);
  const split = useMemo(() => ratingSplit(phone.rating), [phone.rating]);

  const off = v.oldPricePkr ? Math.round((1 - v.pricePkr / v.oldPricePkr) * 100) : 0;
  const monthly = Math.ceil(v.pricePkr / tenure);
  const freeDelivery = v.pricePkr >= 50000;
  const lowStock = v.stock > 0 && v.stock <= 7;

  const specGroups: [string, [string, string][]][] = [
    ["Display", [["Type & size", phone.specs.display], ["Refresh rate", phone.specs.refreshHz + " Hz"]]],
    ["Performance", [["Chipset", phone.specs.chipset], ["RAM / Storage", `${v.ramGb}GB / ${v.storageGb}GB`], ["OS", phone.specs.os]]],
    ["Camera", [["Main camera", phone.specs.mainCameraMp + " MP"], ["Selfie camera", phone.specs.selfieCameraMp + " MP"]]],
    ["Battery", [["Capacity", phone.specs.batteryMah + " mAh"], ["Fast charging", phone.specs.chargingW + "W"]]],
    ["Network & Comms", [["Network", phone.specs.fiveG ? "5G / 4G LTE" : "4G LTE"], ["NFC", phone.specs.nfc ? "Yes" : "No"], ["PTA status", phone.ptaApproved ? "PTA Approved" : "Non-PTA"]]],
  ];

  const keyStats = [
    { Icon: MonitorSmartphone, label: "Display", value: phone.specs.display, sub: `${phone.specs.refreshHz} Hz refresh` },
    { Icon: Cpu, label: "Chipset", value: phone.specs.chipset, sub: phone.specs.os },
    { Icon: Camera, label: "Camera", value: `${phone.specs.mainCameraMp} MP main`, sub: `${phone.specs.selfieCameraMp} MP selfie` },
    { Icon: BatteryCharging, label: "Battery", value: `${phone.specs.batteryMah.toLocaleString()} mAh`, sub: `${phone.specs.chargingW}W fast charging` },
  ];

  const highlights = [
    { Icon: Camera, title: "The camera story", text: `A ${phone.specs.mainCameraMp}MP main camera with a ${phone.specs.selfieCameraMp}MP front camera — the setup owners actually use, for daylight detail and night portraits alike.` },
    { Icon: BatteryFull, title: "The battery story", text: `${phone.specs.batteryMah.toLocaleString()} mAh is a full day and then some for most people — and ${phone.specs.chargingW}W charging means a short top-up, not an overnight wait.` },
    { Icon: Zap, title: "The speed story", text: `${phone.specs.chipset} behind a ${phone.specs.refreshHz}Hz ${phone.specs.display} screen. Scrolling, gaming and everyday apps all feel a class above the price.` },
  ];

  const addToCart = () => { add(v.sku); setAdded(true); };

  return (
    <div className="pdp">
      <div className="wrap">
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link> › <Link href="/shop">Phones</Link> › <span aria-current="page">{phone.brand} {phone.model}</span>
        </nav>
      </div>

      <div className="pdp-subnav">
        <div className="wrap">
          <span className="mono" style={{ fontWeight: 700 }}>{phone.brand} {phone.model}</span>
          <a href="#overview">Overview</a>
          <a href="#highlights">Highlights</a>
          <a href="#specs">Specs</a>
          <a href="#reviews">Reviews</a>
          <a href="#similar">Similar</a>
          <span className="subnav-buy">
            <span className="price">{formatPkr(v.pricePkr)}</span>
            <button type="button" className="btn btn-primary subnav-add" onClick={addToCart}>{added ? "Added" : "Add to Cart"}</button>
          </span>
        </div>
      </div>

      <div className="wrap">
        <div className="pdp-top" id="overview">
          <div className="pdp-gallery">
            <div className="pdp-stage" style={{ background: `linear-gradient(155deg, hsl(${phone.hue} 55% 94%), hsl(${(phone.hue + 40) % 360} 45% 85%))` }}>
              <DeviceImage key={colour} src={phone.image ?? phoneImage(phone.slug)} eager
                alt={`${phone.brand} ${phone.model} in ${phone.colours[colour]}`} imgClassName="device-img-lg pdp-device" className="pdp-dimg" />
              <div className="badge-row">
                {off > 0 && <span className="badge badge-off">Sale −{off}%</span>}
                {phone.ptaApproved && <span className="badge badge-pta">PTA Approved</span>}
              </div>
              <div className="stage-chips" aria-hidden="true">
                <span>{phone.specs.refreshHz} Hz</span>
                <span>{phone.specs.mainCameraMp} MP</span>
                <span>{phone.specs.batteryMah.toLocaleString()} mAh</span>
                {phone.specs.fiveG && <span>5G</span>}
              </div>
            </div>
            <p className="stage-caption">Shown in <b>{phone.colours[colour]}</b> · Official {phone.brand} imagery · {phone.warranty}</p>
          </div>

          <div className="pdp-buy">
            <p className="brand-kicker">{phone.brand}</p>
            <h1>{phone.model}</h1>
            <p className="pdp-rating">
              <span className="stars-inline">{Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={15} fill={i < Math.round(phone.rating) ? "currentColor" : "none"} aria-hidden="true" />
              ))}</span>
              <b>{phone.rating.toFixed(1)}</b>
              <a href="#reviews">{phone.reviewCount} buyer reviews</a>
            </p>
            <p className="tagline-lg">{phone.tagline}</p>

            <div className="price-block">
              <span className="price price-now big-price">{formatPkr(v.pricePkr)}</span>
              {v.oldPricePkr && <span className="price-old">{formatPkr(v.oldPricePkr)}</span>}
              {off > 0 && <span className="save-pill">Save {formatPkr((v.oldPricePkr ?? 0) - v.pricePkr)} ({off}%)</span>}
            </div>
            <p className="emi-line">or <b>{formatPkr(monthly)}/month</b> × {tenure} — pick a plan below</p>

            <div className="option-block">
              <p className="option-label">Storage & RAM</p>
              <div className="variant-cards" role="group" aria-label="Storage and RAM variants">
                {phone.variants.map((variant, i) => (
                  <button key={variant.sku} type="button" className="variant-card" aria-pressed={i === variantIdx}
                    disabled={variant.stock === 0} onClick={() => setVariantIdx(i)}>
                    <span className="vc-top"><b>{variant.storageGb}GB</b><span>{variant.ramGb}GB RAM</span>{i === variantIdx && <Check size={15} aria-hidden="true" />}</span>
                    <span className="price vc-price">{formatPkr(variant.pricePkr)}</span>
                    <span className="vc-stock">{variant.stock === 0 ? "Sold out" : variant.stock <= 7 ? `Only ${variant.stock} left` : "In stock"}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="option-block">
              <p className="option-label">Colour — <b>{phone.colours[colour]}</b></p>
              <div className="swatch-row" role="group" aria-label="Colour options">
                {phone.colours.map((c, i) => (
                  <button key={c} type="button" className="swatch-btn" aria-pressed={colour === i} aria-label={c}
                    onClick={() => setColour(i)} style={{ background: `hsl(${(phone.hue + i * 45) % 360} 55% ${30 + i * 16}%)` }} />
                ))}
              </div>
            </div>

            <p className="stock-line">
              <span className={"stock-dot " + (lowStock ? "low" : "ok")} aria-hidden="true" />
              {v.stock === 0 ? "Sold out — check a similar phone below" : lowStock ? `Selling fast — only ${v.stock} left at this price` : "In stock — ships within 24 hours"}
            </p>
            <p className="delivery-line"><Truck size={16} aria-hidden="true" /> Order today, get it <b>{deliveryWindow()}</b> · {freeDelivery ? "FREE delivery" : `delivery ${formatPkr(350)} · free over ${formatPkr(50000)}`}</p>

            <div className="emi-box">
              <div className="emi-head">
                <span className="emi-title"><CreditCard size={17} aria-hidden="true" /> Pay monthly</span>
                <div className="tenure-row" role="group" aria-label="Installment tenure">
                  {TENURES.map((t) => (
                    <button key={t} type="button" className="variant-btn" aria-pressed={tenure === t} onClick={() => setTenure(t)}>{t} mo</button>
                  ))}
                </div>
              </div>
              <p className="emi-big"><span className="price">{formatPkr(monthly)}</span>/month × {tenure}</p>
              <p className="emi-note">Estimate on 0% markup bank plans — final plan confirmed at checkout. Prefer cash? COD is free.</p>
            </div>

            <div className="pdp-actions">
              <button type="button" className="btn btn-primary" onClick={addToCart}>
                {added ? <><Check size={18} aria-hidden="true" /> Added to cart</> : <><ShoppingCart size={18} aria-hidden="true" /> Add to Cart</>}
              </button>
              <Link className="btn btn-green" href="/cart" onClick={() => add(v.sku)}>Buy Now</Link>
            </div>

            <ul className="trust-rows">
              <li><ShieldCheck size={17} aria-hidden="true" /> PTA Approved — verify the IMEI by SMS to 8484</li>
              <li><BadgeCheck size={17} aria-hidden="true" /> {phone.warranty}, sealed in the box</li>
              <li><PackageOpen size={17} aria-hidden="true" /> Cash on Delivery — open the parcel before you pay</li>
              <li><RotateCcw size={17} aria-hidden="true" /> 7-day easy replacement if anything is wrong</li>
            </ul>
            {!freeDelivery && (
              <div className="free-del-progress" aria-hidden="true">
                <span style={{ width: `${Math.min(100, Math.round((v.pricePkr / 50000) * 100))}%` }} />
              </div>
            )}
            <p className="sticky-note">{freeDelivery ? "This phone ships free — no delivery charges at checkout." : `Add ${formatPkr(50000 - v.pricePkr)} more to unlock free delivery.`}</p>
          </div>
        </div>

        <section className="key-stats" aria-label="Key specifications">
          {keyStats.map(({ Icon, label, value, sub }) => (
            <div key={label} className="key-stat">
              <span className="icon-chip"><Icon size={20} aria-hidden="true" /></span>
              <div><span className="ks-label">{label}</span><b>{value}</b><span className="ks-sub">{sub}</span></div>
            </div>
          ))}
        </section>

        <section className="section" id="highlights" aria-labelledby="hl-h">
          <p className="kicker" style={{ color: "var(--signal)" }}>Why this phone</p>
          <h2 id="hl-h">The story in three parts</h2>
          <p className="sub">Not a spec dump — what the numbers actually mean for your day.</p>
          <div className="stories">
            {highlights.map(({ Icon, title, text }) => (
              <article key={title} className="story-card">
                <span className="icon-chip"><Icon size={20} aria-hidden="true" /></span>
                <h3 style={{ margin: 0, fontSize: 17, letterSpacing: "-0.02em" }}>{title}</h3>
                <p style={{ margin: 0, color: "var(--muted)", fontSize: 14.5, lineHeight: 1.6 }}>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section" id="specs" aria-labelledby="specs-h">
          <h2 id="specs-h">Full specifications</h2>
          <p className="sub">Grouped the way GSMArena groups them — no jargon walls, no missing rows.</p>
          {specGroups.map(([group, rows], gi) => {
            const GIcon = GROUP_ICONS[gi] ?? Monitor;
            return (
              <table key={group} className="spec-table" aria-label={group}>
                <caption><GIcon size={15} aria-hidden="true" style={{ verticalAlign: -2, marginRight: 7 }} />{group}</caption>
                <tbody>
                  {rows.map(([k, val]) => (
                    <tr key={k}><th scope="row">{k}</th><td>{val}</td></tr>
                  ))}
                </tbody>
              </table>
            );
          })}
        </section>

        <section className="section" id="reviews" aria-labelledby="rev-h">
          <h2 id="rev-h">What buyers say</h2>
          <div className="reviews-summary">
            <div className="rs-score">
              <span className="rs-num">{phone.rating.toFixed(1)}</span>
              <span className="stars-inline">{Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={16} fill={i < Math.round(phone.rating) ? "currentColor" : "none"} aria-hidden="true" />
              ))}</span>
              <span className="tagline">{phone.reviewCount} buyer reviews</span>
            </div>
            <div className="rs-bars">
              {split.map((s) => (
                <div key={s.stars} className="rs-row">
                  <span>{s.stars}★</span>
                  <span className="rs-bar"><i style={{ width: `${s.pct}%` }} /></span>
                  <span className="rs-pct">{s.pct}%</span>
                </div>
              ))}
            </div>
            <p className="rs-note">Reviews come from verified MobileBazaar orders. We publish the good and the bad — a phone earns its rating here.</p>
          </div>
          <div className="grid">
            {reviews.map((r, i) => (
              <article key={i} className="review-card">
                <div className="review-head">
                  <span className="avatar" aria-hidden="true">{r.author.charAt(0)}</span>
                  <div>
                    <p className="review-author">{r.author}{r.verified && <span className="verified"><BadgeCheck size={13} aria-hidden="true" /> Verified</span>}</p>
                    <p className="stars-inline small">{Array.from({ length: 5 }).map((_, s) => (
                      <Star key={s} size={13} fill={s < r.rating ? "currentColor" : "none"} aria-hidden="true" />
                    ))} <span className="tagline">{r.date}</span></p>
                  </div>
                </div>
                <h3>{r.title}</h3>
                <p>{r.body}</p>
              </article>
            ))}
          </div>
        </section>

        {similar.length > 0 && (
          <section className="section" id="similar" aria-labelledby="sim-h">
            <h2 id="sim-h">Similar phones to consider</h2>
            <p className="sub">Same league, honest alternatives — compare before you decide.</p>
            <div className="rail">
              {similar.map((p) => <ProductCard key={p.id} phone={p} />)}
            </div>
          </section>
        )}
      </div>

      <div className="mobile-buybar" role="region" aria-label="Quick buy">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={phoneImage(phone.slug)} alt="" onError={imgFallback} />
        <div className="mbb-info">
          <span className="price">{formatPkr(v.pricePkr)}</span>
          <span className="emi-line">EMI {formatPkr(monthly)}/mo · COD</span>
        </div>
        <button type="button" className="btn btn-primary" onClick={addToCart}>{added ? "Added" : "Add to Cart"}</button>
      </div>
    </div>
  );
}
