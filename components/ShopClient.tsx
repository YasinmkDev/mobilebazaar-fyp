"use client";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { lowestPrice, type Phone } from "@/lib/types";
import { formatPkr, PRICE_BUCKETS } from "@/lib/format";
import ProductCard from "./ProductCard";
import { SlidersHorizontal, X, GitCompareArrows } from "lucide-react";
import { phoneImage, imgFallback } from "@/lib/images";
import CompareView from "./CompareView";

type Sort = "popular" | "price-asc" | "price-desc" | "rating";

export default function ShopClient({ phones, brands: allBrands }: { phones: Phone[]; brands: string[] }) {
  const PHONES = phones;
  const BRANDS = allBrands;
  const params = useSearchParams();
  const [query, setQuery] = useState(params.get("q") ?? "");
  const [brands, setBrands] = useState<string[]>(params.get("brand") ? [params.get("brand")!] : []);
  const [bucket, setBucket] = useState<string>(params.get("bucket") ?? "");
  const [fiveGOnly, setFiveGOnly] = useState(false);
  const [minRam, setMinRam] = useState(0);
  const [sort, setSort] = useState<Sort>("popular");
  const [compare, setCompare] = useState<Phone[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);

  const toggleBrand = (b: string) =>
    setBrands((prev) => (prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]));

  const toggleCompare = (phone: Phone) =>
    setCompare((prev) => {
      if (prev.some((p) => p.id === phone.id)) return prev.filter((p) => p.id !== phone.id);
      if (prev.length >= 3) return prev; // UX rule: max 3, tray explains why
      return [...prev, phone];
    });

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = PHONES.filter((p) => {
      if (q && !(`${p.brand} ${p.model} ${p.tagline} ${p.tags.join(" ")}`.toLowerCase().includes(q))) return false;
      if (brands.length && !brands.includes(p.brand)) return false;
      if (bucket) {
        const b = PRICE_BUCKETS.find((x) => x.id === bucket);
        if (b && !b.test(lowestPrice(p))) return false;
      }
      if (fiveGOnly && !p.specs.fiveG) return false;
      if (minRam && Math.max(...p.variants.map((v) => v.ramGb)) < minRam) return false;
      return true;
    });
    list = [...list].sort((a, b) =>
      sort === "price-asc" ? lowestPrice(a) - lowestPrice(b)
      : sort === "price-desc" ? lowestPrice(b) - lowestPrice(a)
      : sort === "rating" ? b.rating - a.rating
      : b.reviewCount - a.reviewCount);
    return list;
  }, [query, brands, bucket, fiveGOnly, minRam, sort]);

  const clearAll = () => { setQuery(""); setBrands([]); setBucket(""); setFiveGOnly(false); setMinRam(0); };

  return (
    <div className="wrap shop-layout">
      <button type="button" className="filters-toggle" aria-expanded={showFilters} onClick={() => setShowFilters((s) => !s)}>
        {showFilters ? <><X size={17} aria-hidden="true" /> Close filters</> : <><SlidersHorizontal size={17} aria-hidden="true" /> Filters</>}
      </button>
      {showFilters && <div className="filters-backdrop" onClick={() => setShowFilters(false)} aria-hidden="true" />}
      <aside className={showFilters ? "filters open" : "filters"} aria-label="Filters">
        <h3 style={{ marginTop: 0 }}>Price (PKR)</h3>
        <label><input type="radio" name="bucket" checked={bucket === ""} onChange={() => setBucket("")} /> All prices</label>
        {PRICE_BUCKETS.map((b) => (
          <label key={b.id}><input type="radio" name="bucket" checked={bucket === b.id} onChange={() => setBucket(b.id)} /> {b.label}</label>
        ))}
        <h3>Brand</h3>
        {BRANDS.map((b) => (
          <label key={b}><input type="checkbox" checked={brands.includes(b)} onChange={() => toggleBrand(b)} /> {b}</label>
        ))}
        <h3>Features</h3>
        <label><input type="checkbox" checked={fiveGOnly} onChange={(e) => setFiveGOnly(e.target.checked)} /> 5G only</label>
        <label>Min RAM
          <select aria-label="Minimum RAM" value={minRam} onChange={(e) => setMinRam(Number(e.target.value))} style={{ marginLeft: 8 }}>
            <option value={0}>Any</option><option value={6}>6GB+</option><option value={8}>8GB+</option><option value={12}>12GB</option>
          </select>
        </label>
        {(brands.length > 0 || bucket || fiveGOnly || minRam > 0 || query) && (
          <button type="button" className="btn btn-green" style={{ marginTop: 14, width: "100%" }} onClick={clearAll}>Clear all filters</button>
        )}
      </aside>

      <div>
        <div className="shop-tools">
          <input type="search" placeholder="Search within phones…" value={query}
            onChange={(e) => setQuery(e.target.value)} aria-label="Search phones" style={{ flex: 1, minWidth: 200 }} />
          <label>Sort
            <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} aria-label="Sort results" style={{ marginLeft: 8 }}>
              <option value="popular">Most popular</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
              <option value="rating">Highest rated</option>
            </select>
          </label>
          <span className="chip" role="status">{results.length} phones found</span>
        </div>

        {results.length === 0 ? (
          <div className="empty">
            <h3>No phones match — let’s loosen one filter</h3>
            <p>Try removing the price range or one brand. Good phones are hiding just outside these filters.</p>
            <button type="button" className="btn btn-primary" onClick={clearAll}>Clear all filters</button>
          </div>
        ) : (
          <div className="grid">
            {results.map((p) => (
              <ProductCard key={p.id} phone={p} onCompare={toggleCompare}
                compared={compare.some((c) => c.id === p.id)} />
            ))}
          </div>
        )}

        {compare.length > 0 && (
          <div className="compare-tray" role="region" aria-label="Compare tray">
            <div className="tray-slots">
              {[0, 1, 2].map((i) => {
                const p = compare[i];
                return p ? (
                  <span key={p.id} className="tray-slot filled">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={phoneImage(p.slug)} alt="" onError={imgFallback} />
                    <span className="tray-slot-name">{p.brand} {p.model}</span>
                    <button type="button" onClick={() => toggleCompare(p)} aria-label={`Remove ${p.brand} ${p.model} from comparison`}><X size={13} /></button>
                  </span>
                ) : (
                  <span key={i} className="tray-slot empty">Add a phone</span>
                );
              })}
            </div>
            <div className="tray-actions">
              {compare.length < 2 && <span className="tray-hint">Pick one more to compare</span>}
              <button type="button" className="tray-clear" onClick={() => setCompare([])}>Clear</button>
              <button type="button" className="btn btn-primary tray-compare-btn" disabled={compare.length < 2} onClick={() => setCompareOpen(true)}>
                <GitCompareArrows size={16} aria-hidden="true" /> Compare now
              </button>
            </div>
          </div>
        )}
        {compareOpen && compare.length >= 2 && (
          <CompareView phones={compare} onRemove={toggleCompare} onClose={() => setCompareOpen(false)} />
        )}
      </div>
    </div>
  );
}
