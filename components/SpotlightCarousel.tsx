"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { lowestPrice, emiMonthly, type Phone } from "@/lib/types";
import { formatPkr } from "@/lib/format";
import { phoneImage, imgFallback } from "@/lib/images";
import DeviceImage from "./DeviceImage";
import { ArrowRight, ArrowLeft, Pause, Play, Check } from "lucide-react";

const DURATION = 6000; // ms per slide — enough to actually read the slide

/** Curated editorial per phone; anything unlisted gets an honest generated line. */
const EDITORIAL: Record<string, { headline: string; lede: string }> = {
  "samsung-galaxy-a56": {
    headline: "The one everyone asks about",
    lede: "Some phones sell because of ads. This one sells because owners keep recommending it — a big Super AMOLED screen, a camera that behaves at night, and Samsung's long update promise, at a price that does not need a loan.",
  },
  "apple-iphone-17": {
    headline: "The iPhone most people should buy",
    lede: "The A19 chip, a 48MP camera system and that unmistakably smooth iOS feel — without stepping up to Pro money. If your family is on iPhone, this is the one that makes sense.",
  },
  "xiaomi-poco-x7-pro": {
    headline: "Flagship speed, mid-range bill",
    lede: "A gaming-grade Dimensity chip, a 6,000 mAh battery and 90W charging that fills it while you have chai. PUBG and COD at high frame rates, at half the flagship price.",
  },
  "nothing-phone-3": {
    headline: "The design statement of the year",
    lede: "Glyph lights that glow for calls and timers, clean software with nothing you did not ask for, and a look nobody mistakes for anything else. For people who buy with their eyes first.",
  },
};

export default function SpotlightCarousel({ phones }: { phones: Phone[] }) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [held, setHeld] = useState(false);
  const [cycle, setCycle] = useState(0);
  const touchX = useRef<number | null>(null);
  const count = phones.length;

  const go = useCallback((i: number) => {
    setIndex(((i % count) + count) % count);
    setCycle((c) => c + 1);
  }, [count]);

  // Autoplay is OFF for reduced-motion users until they press play.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setPlaying(false);
  }, []);

  useEffect(() => {
    if (!playing || held || count < 2) return;
    const t = setTimeout(() => go(index + 1), DURATION);
    return () => clearTimeout(t);
  }, [playing, held, index, cycle, count, go]);

  if (count === 0) return null;
  const phone = phones[index];
  const ed = EDITORIAL[phone.slug] ?? {
    headline: phone.tagline,
    lede: `${phone.brand} ${phone.model} — a ${phone.specs.display} screen, ${phone.specs.mainCameraMp}MP camera and ${phone.specs.batteryMah.toLocaleString()} mAh battery, PTA approved with ${phone.warranty.toLowerCase()}.`,
  };
  const price = lowestPrice(phone);
  const points = [
    `${phone.specs.chipset} — smooth for years, not months`,
    `${phone.specs.mainCameraMp}MP main camera · ${phone.specs.batteryMah.toLocaleString()} mAh · ${phone.specs.chargingW}W charging`,
    `PTA approved · ${phone.warranty}`,
  ];
  const animating = playing && !held;

  return (
    <section className="spot-carousel" data-reveal aria-roledescription="carousel" aria-label="Spotlight phones"
      onMouseEnter={() => setHeld(true)} onMouseLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)} onBlur={() => setHeld(false)}
      onTouchStart={(e) => { touchX.current = e.touches[0].clientX; setHeld(true); }}
      onTouchEnd={(e) => {
        const dx = touchX.current === null ? 0 : e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 42) go(index + (dx < 0 ? 1 : -1));
        touchX.current = null; setHeld(false);
      }}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(index + 1);
        if (e.key === "ArrowLeft") go(index - 1);
      }}>
      <div className="spot-bg" key={"bg" + index} aria-hidden="true"
        style={{ background: `linear-gradient(155deg, hsl(${phone.hue} 60% 93%), hsl(${(phone.hue + 45) % 360} 42% 84%))` }} />
      <div className="wrap spot-inner">
        <div className="spot-toprow">
          <p className="kicker" style={{ color: "var(--signal)" }}>Spotlight — phones worth your attention</p>
          <span className="spot-counter" aria-hidden="true">{String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}</span>
        </div>

        <div className="spot-grid" key={index}>
          <div className="spot-media">
            <DeviceImage src={phone.image ?? phoneImage(phone.slug)} eager imgClassName="spot-device"
              alt={`${phone.brand} ${phone.model}`} className="spot-dimg" />
            <div className="stage-chips spot-chips" aria-hidden="true">
              <span>{phone.specs.refreshHz} Hz</span>
              <span>{phone.specs.mainCameraMp} MP</span>
              <span>{phone.specs.batteryMah.toLocaleString()} mAh</span>
              {phone.specs.fiveG && <span>5G</span>}
            </div>
          </div>
          <div className="spot-copy">
            <p className="brand-kicker spot-anim" style={{ animationDelay: ".02s" }}>{phone.brand}</p>
            <h2 className="spot-anim" style={{ animationDelay: ".07s" }}>{phone.model}: {ed.headline}</h2>
            <p className="spot-lede spot-anim" style={{ animationDelay: ".13s" }}>{ed.lede}</p>
            <ul className="spot-points spot-anim" style={{ animationDelay: ".19s" }}>
              {points.map((pt) => <li key={pt}><Check size={15} aria-hidden="true" />{pt}</li>)}
            </ul>
            <p className="price-line spot-anim" style={{ animationDelay: ".25s" }}>
              <span className="price price-now">{formatPkr(price)}</span>
              <span className="emi-line">or <b>{formatPkr(emiMonthly(price))}/mo</b> × 12</span>
            </p>
            <div className="cta-row spot-anim" style={{ animationDelay: ".31s" }}>
              <Link className="btn btn-primary" href={`/phones/${phone.slug}`}>See the full story <ArrowRight size={17} aria-hidden="true" /></Link>
              <Link className="btn btn-outline" href="/shop">Compare it in the shop</Link>
            </div>
          </div>
        </div>

        <div className="spot-controls">
          <div className="spot-segments" role="tablist" aria-label="Choose spotlight phone">
            {phones.map((p, i) => (
              <button key={p.id} type="button" role="tab" aria-selected={i === index}
                className={"spot-seg" + (i === index ? " current" : i < index ? " done" : "")}
                aria-label={`${p.brand} ${p.model}`} onClick={() => go(i)}>
                <span className="spot-seg-track">
                  {i === index && (
                    <span key={cycle} className="spot-seg-fill"
                      style={{ animationDuration: `${DURATION}ms`, animationPlayState: animating ? "running" : "paused" }} />
                  )}
                  {i < index && <span className="spot-seg-fill full" />}
                </span>
                <span className="spot-seg-name">{p.model}</span>
              </button>
            ))}
          </div>
          <div className="spot-arrows">
            <button type="button" className="spot-arrow" aria-label="Previous phone" onClick={() => go(index - 1)}><ArrowLeft size={17} /></button>
            <button type="button" className="spot-arrow" aria-label={playing ? "Pause autoplay" : "Play autoplay"} onClick={() => setPlaying((p) => !p)}>
              {playing ? <Pause size={16} /> : <Play size={16} />}
            </button>
            <button type="button" className="spot-arrow" aria-label="Next phone" onClick={() => go(index + 1)}><ArrowRight size={17} /></button>
          </div>
        </div>
      </div>
      {/* Preload the other slides' images so transitions never flash empty */}
      <div aria-hidden="true" style={{ display: "none" }}>
        {phones.map((p) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={p.id} src={phoneImage(p.slug)} alt="" />
        ))}
      </div>
    </section>
  );
}
