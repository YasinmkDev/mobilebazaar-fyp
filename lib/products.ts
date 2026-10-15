import type { Phone } from "./types";

// Seed catalogue for Sprint 1 (local data layer).
// Sprint 2 swaps this module for Supabase queries with the same Phone type.
// Prices are PKR list prices captured during the Oct 2026 research pass;
// specs are transcribed reference specs (GSMArena cited in the FYP report).
// Visuals are CSS phone renders keyed by `hue` until manufacturer press
// images are self-hosted — no retailer images are hotlinked.

type Seed = [
  brand: string, model: string, tagline: string, rating: number, reviews: number,
  hue: number, tags: string[], display: string, hz: number, chipset: string,
  cam: number, selfie: number, battery: number, charge: number, fiveG: boolean,
  base: number, oldBase?: number
];

const SEEDS: Seed[] = [
  ["Infinix", "Smart 20", "Big screen, all-day battery, honest price", 4.9, 37, 152, ["budget"], "6.7\" HD+", 90, "Helio G81", 13, 8, 5000, 10, false, 39499, 42999],
  ["Tecno", "Spark Go 2", "The starter smartphone that just works", 4.5, 112, 210, ["budget"], "6.67\" HD+", 120, "Unisoc T7250", 13, 8, 5000, 15, false, 21499],
  ["Xiaomi", "Redmi A3", "Clean design, dependable everyday phone", 4.4, 98, 190, ["budget"], "6.71\" HD+", 90, "Helio G36", 8, 5, 5000, 10, false, 17450],
  ["Realme", "Note 60x", "Tough build for rough everyday use", 4.5, 76, 230, ["budget"], "6.74\" HD+", 90, "Unisoc T612", 32, 5, 5000, 10, false, 23999],
  ["Tecno", "Spark 40", "Slim, bright and surprisingly fast", 4.6, 64, 170, ["budget", "camera"], "6.67\" HD+", 120, "Helio G81", 50, 8, 5200, 45, false, 35999],
  ["Infinix", "Hot 60 Pro", "Gaming-ready power on a budget", 4.7, 143, 265, ["gaming", "budget"], "6.78\" AMOLED", 144, "Helio G200", 50, 13, 5160, 45, false, 61999, 66999],
  ["Tecno", "Camon 40 Pro", "Camera-first, portrait lovers' pick", 4.7, 89, 320, ["camera"], "6.78\" AMOLED", 120, "Helio G100", 50, 50, 5200, 45, false, 69999],
  ["Samsung", "Galaxy A16", "Samsung reliability, years of updates", 4.6, 210, 205, ["budget"], "6.7\" Super AMOLED", 90, "Helio G99", 50, 13, 5000, 25, false, 54999, 59999],
  ["Xiaomi", "Redmi Note 14", "The mid-range benchmark", 4.7, 320, 200, ["camera", "gaming"], "6.67\" AMOLED", 120, "Helio G99 Ultra", 108, 20, 5500, 33, false, 64999],
  ["Vivo", "V40 Lite", "Fast charging, feather-light feel", 4.5, 58, 280, ["camera"], "6.67\" AMOLED", 120, "Snapdragon 685", 50, 32, 5000, 80, false, 74999],
  ["Oppo", "Reno 13 F", "Portrait AI in a slim body", 4.6, 47, 300, ["camera"], "6.67\" AMOLED", 120, "Snapdragon 6 Gen 1", 50, 32, 5800, 45, true, 89999],
  ["Infinix", "Note 60 5G", "5G speed without the flagship bill", 4.7, 71, 240, ["gaming", "5g"], "6.78\" AMOLED", 144, "Dimensity 7300", 50, 13, 5200, 45, true, 94999],
  ["Tecno", "Camon 50 Pro", "Pro portraits, pro price-to-value", 4.7, 66, 330, ["camera"], "6.78\" AMOLED", 144, "Dimensity 7300", 50, 50, 5200, 45, true, 94999],
  ["Samsung", "Galaxy A36", "The balanced Samsung for most people", 4.7, 188, 215, ["camera", "5g"], "6.7\" Super AMOLED", 120, "Snapdragon 6 Gen 3", 50, 12, 5000, 45, true, 119999, 129999],
  ["Xiaomi", "Poco X7 Pro", "Flagship-grade gaming, mid-range price", 4.8, 240, 45, ["gaming", "5g"], "6.67\" AMOLED", 120, "Dimensity 8400 Ultra", 50, 20, 6000, 90, true, 124999],
  ["Samsung", "Galaxy A56", "Premium feel, long software support", 4.8, 176, 225, ["camera", "5g"], "6.7\" Super AMOLED", 120, "Exynos 1580", 50, 12, 5000, 45, true, 139999],
  ["Honor", "Magic 7 Lite", "Drop-tested toughness, huge battery", 4.6, 39, 160, ["battery"], "6.78\" AMOLED", 120, "Snapdragon 6 Gen 1", 108, 16, 6600, 66, true, 109999],
  ["Nothing", "Phone (3a) Pro", "Glyph lights, clean software, standout design", 4.7, 92, 0, ["camera", "5g"], "6.77\" AMOLED", 120, "Snapdragon 7s Gen 3", 50, 50, 5000, 50, true, 164999],
  ["Samsung", "Galaxy S26 FE", "Flagship essentials, friendlier price", 4.8, 134, 235, ["flagship", "camera"], "6.7\" AMOLED 2X", 120, "Exynos 2400e", 50, 12, 4700, 25, true, 249999, 269999],
  ["Xiaomi", "16T Pro", "Leica colour, flagship cameras", 4.8, 67, 20, ["flagship", "camera"], "6.83\" AMOLED", 144, "Dimensity 9400+", 50, 32, 5500, 120, true, 249999],
  ["Nothing", "Phone (3)", "The design statement of the year", 4.7, 54, 10, ["flagship"], "6.67\" AMOLED", 120, "Snapdragon 8s Gen 4", 50, 50, 5150, 65, true, 299999],
  ["Samsung", "Galaxy S26", "Compact flagship, Galaxy AI inside", 4.9, 201, 245, ["flagship", "camera"], "6.3\" AMOLED 2X", 120, "Snapdragon 8 Elite Gen 5", 50, 12, 4300, 25, true, 284799, 319999],
  ["Apple", "iPhone 17", "The iPhone most people should buy", 4.9, 310, 260, ["flagship", "camera"], "6.3\" Super Retina XDR", 120, "Apple A19", 48, 18, 3692, 20, true, 339999],
  ["Apple", "iPhone 17 Pro Max", "The ultimate camera phone", 4.9, 265, 30, ["flagship", "camera"], "6.9\" Super Retina XDR", 120, "Apple A19 Pro", 48, 18, 5088, 25, true, 474999],
];

function toPhone(s: Seed, i: number): Phone {
  const [brand, model, tagline, rating, reviews, hue, tags, display, hz, chipset, cam, selfie, battery, charge, fiveG, base, oldBase] = s;
  const slug = (brand + "-" + model).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const variants = [
    { sku: slug + "-128", storageGb: 128, ramGb: base < 30000 ? 4 : 8, pricePkr: base, oldPricePkr: oldBase, stock: 12 },
    { sku: slug + "-256", storageGb: 256, ramGb: base < 30000 ? 6 : 12, pricePkr: Math.round(base * 1.12 / 100) * 100 - 1, stock: 7 },
  ];
  if (base < 25000) {
    variants[0] = { sku: slug + "-64", storageGb: 64, ramGb: 4, pricePkr: base, oldPricePkr: oldBase, stock: 15 };
    variants[1] = { sku: slug + "-128", storageGb: 128, ramGb: 4, pricePkr: Math.round(base * 1.15 / 100) * 100 - 1, stock: 9 };
  }
  return {
    id: "ph-" + (i + 1), slug, brand, model, tagline, rating, reviewCount: reviews,
    colours: ["Black", "Blue", "Silver"], hue, tags, ptaApproved: true,
    warranty: brand + " Official Warranty",
    specs: { display, refreshHz: hz, chipset, mainCameraMp: cam, selfieCameraMp: selfie, batteryMah: battery, chargingW: charge, fiveG, nfc: base > 40000, os: brand === "Apple" ? "iOS 26" : "Android 15" },
    variants,
  };
}

export const PHONES: Phone[] = SEEDS.map(toPhone);
export const BRANDS: string[] = [...new Set(PHONES.map((p) => p.brand))].sort();
