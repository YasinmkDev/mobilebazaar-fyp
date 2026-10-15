export interface OrderItem { sku: string; name: string; variantLabel: string; pricePkr: number; qty: number; }
export type PaymentMethod = "cod" | "jazzcash" | "easypaisa" | "bank";
export interface Order {
  id: string;
  placedAt: string; // ISO
  customer: { name: string; phone: string; city: string; address: string; email?: string; note?: string };
  payment: PaymentMethod;
  items: OrderItem[];
  subtotal: number;
  delivery: number;
  total: number;
  statusIndex: number; // 0 Placed → 1 Confirmed → 2 Packed → 3 Shipped → 4 Delivered
}
export const ORDER_STEPS = ["Order placed", "Confirmed", "Packed", "Shipped", "Delivered"] as const;
const KEY = "mobilebazaar-orders-v1";

export function loadOrders(): Order[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Order[]) : [];
  } catch { return []; }
}
export function saveOrder(order: Order) {
  try {
    const all = loadOrders();
    localStorage.setItem(KEY, JSON.stringify([order, ...all]));
  } catch { /* storage unavailable */ }
}
export function findOrder(id: string): Order | undefined {
  return loadOrders().find((o) => o.id.toLowerCase() === id.trim().toLowerCase());
}
export function newOrderId(): string {
  return "MB-" + Math.random().toString(36).slice(2, 7).toUpperCase();
}

export function updateOrderStatus(id: string, statusIndex: number): Order | undefined {
  try {
    const all = loadOrders();
    const next = all.map((o) => (o.id === id ? { ...o, statusIndex } : o));
    localStorage.setItem(KEY, JSON.stringify(next));
    return next.find((o) => o.id === id);
  } catch { return undefined; }
}

export function saveAllOrders(orders: Order[]) {
  try { localStorage.setItem(KEY, JSON.stringify(orders)); } catch { /* ignore */ }
}

/** Demo orders for the admin dashboard / viva — clearly sample customers,
    generated on demand from the admin panel, never silently. */
export function demoOrders(): Order[] {
  const mk = (id: string, daysAgo: number, name: string, city: string, payment: PaymentMethod,
    items: OrderItem[], statusIndex: number): Order => {
    const subtotal = items.reduce((s, i) => s + i.pricePkr * i.qty, 0);
    const delivery = subtotal >= 50000 ? 0 : 350;
    const d = new Date(); d.setDate(d.getDate() - daysAgo);
    return {
      id, placedAt: d.toISOString(), customer: { name, phone: "0345 0000000", city, address: "Sample address (demo order)" },
      payment, items, subtotal, delivery, total: subtotal + delivery, statusIndex,
    };
  };
  const item = (sku: string, name: string, variantLabel: string, pricePkr: number, qty = 1): OrderItem =>
    ({ sku, name, variantLabel, pricePkr, qty });
  return [
    mk("MB-DEMO1", 0, "Sample — Ahmed K.", "Swat", "cod", [item("samsung-galaxy-a56-256", "Samsung Galaxy A56", "256GB · 12GB RAM", 156799)], 1),
    mk("MB-DEMO2", 0, "Sample — Fatima S.", "Mingora", "jazzcash", [item("infinix-hot-60-pro-128", "Infinix Hot 60 Pro", "128GB · 8GB RAM", 61999)], 0),
    mk("MB-DEMO3", 1, "Sample — Rashid M.", "Peshawar", "cod", [item("xiaomi-poco-x7-pro-256", "Xiaomi Poco X7 Pro", "256GB · 12GB RAM", 139999)], 3),
    mk("MB-DEMO4", 2, "Sample — Bilal A.", "Islamabad", "bank", [item("apple-iphone-17-256", "Apple iPhone 17", "256GB · 12GB RAM", 380799)], 4),
    mk("MB-DEMO5", 3, "Sample — Ayesha T.", "Lahore", "cod", [item("tecno-spark-go-2-64", "Tecno Spark Go 2", "64GB · 4GB RAM", 21499, 2)], 4),
    mk("MB-DEMO6", 5, "Sample — Usman R.", "Karachi", "easypaisa", [item("samsung-galaxy-a36-128", "Samsung Galaxy A36", "128GB · 8GB RAM", 119999)], 4),
    mk("MB-DEMO7", 6, "Sample — Ahmed K.", "Swat", "cod", [item("infinix-smart-20-128", "Infinix Smart 20", "128GB · 8GB RAM", 39499)], 2),
    mk("MB-DEMO8", 8, "Sample — Fatima S.", "Mardan", "cod", [item("xiaomi-redmi-note-14-256", "Xiaomi Redmi Note 14", "256GB · 12GB RAM", 72799)], 4),
  ];
}
export const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  cod: "Cash on Delivery",
  jazzcash: "JazzCash",
  easypaisa: "EasyPaisa",
  bank: "Bank transfer",
};
