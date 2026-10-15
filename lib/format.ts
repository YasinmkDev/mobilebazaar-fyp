export const formatPkr = (n: number) => "Rs " + n.toLocaleString("en-PK");

export const PRICE_BUCKETS = [
  { id: "u30", label: "Under Rs 30,000", test: (p: number) => p < 30000 },
  { id: "30-50", label: "Rs 30,000 – 50,000", test: (p: number) => p >= 30000 && p < 50000 },
  { id: "50-80", label: "Rs 50,000 – 80,000", test: (p: number) => p >= 50000 && p < 80000 },
  { id: "80-150", label: "Rs 80,000 – 150,000", test: (p: number) => p >= 80000 && p < 150000 },
  { id: "150plus", label: "Rs 150,000+", test: (p: number) => p >= 150000 },
] as const;
