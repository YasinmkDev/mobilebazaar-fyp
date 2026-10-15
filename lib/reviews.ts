export interface Review { author: string; rating: number; date: string; title: string; body: string; verified: boolean; }

// Deterministic sample reviews per phone (Sprint 2 seed content).
// Sprint 3 replaces these with moderated user reviews from the database.
const POOL: Omit<Review, "author" | "date">[] = [
  { rating: 5, title: "Exactly as described — PTA approved", body: "Checked the IMEI on 8484 before paying the rider, it was compliant. Sealed pack, official warranty card inside.", verified: true },
  { rating: 5, title: "Battery easily lasts my whole day", body: "Heavy use — calls, WhatsApp, some PUBG — and I still end the day above 20%. Charging is quick too.", verified: true },
  { rating: 4, title: "Great value, delivery took 3 days", body: "Phone itself is excellent for the price. Delivery to Swat took a day longer than promised, but tracking kept me updated.", verified: true },
  { rating: 5, title: "Upgraded from a 4-year-old phone — huge difference", body: "Screen is bright outdoors, camera is a big step up, and COD made it risk-free to try this store.", verified: true },
  { rating: 4, title: "Good phone, buy a case with it", body: "Performance and display are superb at this price. It is slippery without a case, so add one to your order.", verified: false },
];
const NAMES = ["Ahmed K.", "Fatima S.", "Rashid M.", "Bilal A.", "Ayesha T.", "Usman R."];
const DATES = ["2026-09-28", "2026-10-02", "2026-10-07"];

export function reviewsFor(phoneId: string, rating: number): Review[] {
  const seed = phoneId.split("").reduce((s, c) => s + c.charCodeAt(0), 0);
  return [0, 1, 2].map((i) => {
    const r = POOL[(seed + i * 2) % POOL.length];
    return {
      ...r,
      rating: Math.max(3, Math.min(5, Math.round(rating) + ((seed + i) % 2 === 0 ? 0 : -0) )),
      author: NAMES[(seed + i) % NAMES.length],
      date: DATES[i],
    };
  });
}
