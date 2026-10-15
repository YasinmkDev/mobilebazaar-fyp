import Link from "next/link";
import { getCatalogue, brandsOf } from "@/lib/catalog";
import { lowestPrice, emiMonthly } from "@/lib/types";
import { formatPkr } from "@/lib/format";
import { phoneImage } from "@/lib/images";
import ProductCard from "@/components/ProductCard";
import SpotlightCarousel from "@/components/SpotlightCarousel";
import {
  ShieldCheck, PackageOpen, CreditCard, MousePointerClick, PackageCheck,
  Truck, Banknote, ArrowRight, Star,
} from "lucide-react";

const MARQUEE = ["PTA Approved", "Cash on Delivery", "Official Warranty", "Open Parcel", "7-Day Returns", "EMI Plans", "Free Delivery over Rs 50,000"];

const JOURNEY = [
  { Icon: MousePointerClick, title: "You pick, in minutes", text: "Filter by budget, compare up to three phones side by side, and check out as a guest. No account, no card, no fuss." },
  { Icon: PackageCheck, title: "We verify, then pack", text: "Every unit is checked against its IMEI and sealed with its official warranty card before it leaves our shelf." },
  { Icon: Truck, title: "The rider brings it to you", text: "Track your order step by step — placed, confirmed, packed, shipped — until it is at your door, usually in 2–4 days." },
  { Icon: Banknote, title: "Open it. Then pay.", text: "Inspect the phone in front of the rider. Only when you are satisfied does the cash change hands. That is the deal." },
];

const STORIES = [
  { quote: "I compared three phones at midnight, ordered the A56, and paid cash at my gate two days later. The IMEI checked out on 8484 before I paid a rupee.", name: "Ahmed Raza", city: "Swat", bought: "Galaxy A56" },
  { quote: "First flagship I ever bought myself. The EMI breakdown was honest — the same number at checkout as on the product page. No surprises.", name: "Fatima Noor", city: "Lahore", bought: "iPhone 17" },
  { quote: "Bought a phone for my father in another city. Open-parcel delivery meant he could check it himself before paying. That trust is rare.", name: "Rashid Khan", city: "Karachi", bought: "Redmi Note 14" },
];

export default async function HomePage() {
  const PHONES = await getCatalogue();
  const BRANDS = brandsOf(PHONES);
  const under50k = PHONES.filter((p) => lowestPrice(p) < 50000).slice(0, 8);
  const flagships = PHONES.filter((p) => p.tags.includes("flagship"));
  const gaming = PHONES.filter((p) => p.tags.includes("gaming")).slice(0, 4);
  const SPOT_SLUGS = ["samsung-galaxy-a56", "apple-iphone-17", "xiaomi-poco-x7-pro", "nothing-phone-3"];
  const spotSlides = SPOT_SLUGS
    .map((s) => PHONES.find((p) => p.slug === s))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));
  const brandCount = (b: string) => PHONES.filter((p) => p.brand === b).length;

  return (
    <>
      <section className="hero">
        <div className="wrap">
          <div>
            <p className="kicker">PTA Approved · Official Warranty · COD</p>
            <h1>Phones,<br />without the<br /><span className="accent">guesswork.</span></h1>
            <p>Every phone here is PTA approved with official Pakistan warranty, priced honestly in PKR — and you pay cash when it is in your hands.</p>
            <div className="cta-row">
              <Link className="btn btn-primary" href="/shop">Shop all phones</Link>
              <Link className="btn btn-ghost" href="/shop?bucket=u30">Under Rs 30,000</Link>
            </div>
            <div className="hero-stats">
              <span><b>{PHONES.length} phones</b>curated, not dumped</span>
              <span><b>8484</b>verify any IMEI by SMS</span>
              <span><b>Rs 0</b>delivery over Rs 50,000</span>
            </div>
          </div>
          <div className="hero-phone" aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="hero-device" src="/phones/apple-iphone-17.jpg" alt="" />
          </div>
        </div>
      </section>

      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {[...MARQUEE, ...MARQUEE].map((m, i) => <span key={i}>{m} •</span>)}
        </div>
      </div>

      <section className="section wrap" data-reveal aria-labelledby="brands-h">
        <p className="kicker" style={{ color: "var(--signal)" }}>Chapter 01 — The names you trust</p>
        <h2 id="brands-h">Shop by brand</h2>
        <p className="sub">Nine brands, every one PTA approved with official warranty.</p>
        <div className="tiles">
          {BRANDS.map((b) => (
            <Link key={b} className="tile" href={`/shop?brand=${encodeURIComponent(b)}`}>
              <span className="t-name">{b}</span>
              <span className="t-count">{brandCount(b)} phones →</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section wrap" data-reveal aria-labelledby="lists-h">
        <h2 id="lists-h">Popular lists</h2>
        <p className="sub">The way Pakistan actually shops — by budget and by need, not by catalogue order.</p>
        <div className="list-hub">
          <Link className="hub-chip" href="/shop?bucket=u30">Best under Rs 30,000</Link>
          <Link className="hub-chip" href="/shop?bucket=30-50">Best Rs 30–50,000</Link>
          <Link className="hub-chip" href="/shop">Best camera phones</Link>
          <Link className="hub-chip" href="/shop">Best gaming phones</Link>
          <Link className="hub-chip" href="/shop">Best 5G phones</Link>
          <Link className="hub-chip" href="/shop">Flagships</Link>
        </div>
      </section>

      <section className="section wrap" data-reveal aria-labelledby="u50-h">
        <p className="kicker" style={{ color: "var(--signal)" }}>Chapter 02 — Proof it doesn&apos;t take a fortune</p>
        <h2 id="u50-h">Best under Rs 50,000</h2>
        <p className="sub">The student-budget hall of fame — real phones, real prices, nothing padded.</p>
        <div className="rail">
          {under50k.map((p) => <ProductCard key={p.id} phone={p} />)}
        </div>
      </section>

      <SpotlightCarousel phones={spotSlides.length >= 2 ? spotSlides : PHONES.slice(0, 4)} />

      <section className="section wrap" data-reveal aria-labelledby="journey-h">
        <p className="kicker" style={{ color: "var(--signal)" }}>Chapter 03 — How buying here works</p>
        <h2 id="journey-h">From cart to your hand</h2>
        <p className="sub">Four steps, no leaps of faith. This is the whole journey before you spend a rupee.</p>
        <ol className="journey">
          {JOURNEY.map(({ Icon, title, text }, i) => (
            <li key={title} className="journey-step">
              <span className="journey-num">{String(i + 1).padStart(2, "0")}</span>
              <span className="icon-chip"><Icon size={21} aria-hidden="true" /></span>
              <h3>{title}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="wrap" data-reveal aria-labelledby="why-h">
        <div className="bento" style={{ marginTop: 34 }}>
          <div className="b-tile big">
            <span className="icon-chip chip-on-dark"><ShieldCheck size={21} aria-hidden="true" /></span>
            <h3 id="why-h">The MobileBazaar Promise</h3>
            <p>PTA approved, factory sealed, official warranty — and if the IMEI does not verify on 8484, you do not pay. That is the whole policy, in one sentence.</p>
          </div>
          <div className="b-tile">
            <span className="icon-chip"><PackageOpen size={21} aria-hidden="true" /></span>
            <h3>Open parcel delivery</h3>
            <p>Check the phone in front of the rider before a single rupee changes hands.</p>
          </div>
          <div className="b-tile">
            <span className="icon-chip"><CreditCard size={21} aria-hidden="true" /></span>
            <h3>EMI, honestly labelled</h3>
            <p>Monthly figures are estimates shown upfront — no markup surprises at checkout.</p>
          </div>
        </div>
      </section>

      <section className="room-dark" data-reveal aria-labelledby="flag-h">
        <div className="wrap">
          <p className="kicker" style={{ color: "#ff6b70" }}>Chapter 04 — The top shelf</p>
          <h2 id="flag-h">Flagships, without the fear</h2>
          <p className="sub" id="compare-note">A flagship is a serious decision. Add any phone to Compare on the Shop page and see specs side by side, best values highlighted.</p>
          <div className="grid">
            {flagships.map((p) => <ProductCard key={p.id} phone={p} />)}
          </div>
        </div>
      </section>

      <section className="section wrap" data-reveal aria-labelledby="stories-h">
        <p className="kicker" style={{ color: "var(--signal)" }}>Chapter 05 — People like you</p>
        <h2 id="stories-h">Bought, delivered, paid at the door</h2>
        <p className="sub">The pattern is always the same — because the process is always the same.</p>
        <div className="stories">
          {STORIES.map((s) => (
            <figure key={s.name} className="story-card">
              <p className="story-stars" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={15} fill="currentColor" aria-hidden="true" />)}
              </p>
              <blockquote>“{s.quote}”</blockquote>
              <figcaption>
                <b>{s.name}</b> · {s.city}
                <span className="story-bought">Bought: {s.bought}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="section wrap" data-reveal aria-labelledby="game-h">
        <h2 id="game-h">Built for gaming</h2>
        <p className="sub">High-refresh screens and chipsets that hold their frame rate when the zone closes in.</p>
        <div className="grid">
          {gaming.map((p) => <ProductCard key={p.id} phone={p} />)}
        </div>
      </section>

      <section className="cta-band" data-reveal aria-labelledby="cta-h">
        <div className="wrap">
          <p className="kicker" style={{ color: "#ff6b70" }}>Your move</p>
          <h2 id="cta-h">Still deciding? Put three side by side.</h2>
          <p>Comparing is free, delivery over Rs 50,000 is free, and paying is something you only do with the phone in your hand.</p>
          <div className="cta-row" style={{ justifyContent: "center" }}>
            <Link className="btn btn-primary" href="/shop">Start comparing <ArrowRight size={17} aria-hidden="true" /></Link>
            <Link className="btn btn-ghost" href="/track">Track an order</Link>
          </div>
        </div>
      </section>
    </>
  );
}
