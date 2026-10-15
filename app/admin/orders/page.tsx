"use client";
import { useEffect, useMemo, useState } from "react";
import AdminShell from "@/components/AdminShell";
import { loadOrders, updateOrderStatus, ORDER_STEPS, PAYMENT_LABELS, type Order } from "@/lib/orders";
import { formatPkr } from "@/lib/format";
import { ChevronDown, ArrowRight, Check } from "lucide-react";

function OrdersAdmin() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<"all" | number>("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("newest");

  useEffect(() => setOrders(loadOrders()), []);

  const visible = useMemo(() => {
    let list = filter === "all" ? [...orders] : orders.filter((o) => o.statusIndex === filter);
    const q = query.trim().toLowerCase();
    if (q) list = list.filter((o) =>
      (o.id + " " + o.customer.name + " " + o.customer.city + " " + o.customer.phone).toLowerCase().includes(q));
    list.sort((a, b) =>
      sort === "oldest" ? a.placedAt.localeCompare(b.placedAt)
      : sort === "total-desc" ? b.total - a.total
      : sort === "total-asc" ? a.total - b.total
      : b.placedAt.localeCompare(a.placedAt));
    return list;
  }, [orders, filter, query, sort]);

  const advance = (o: Order) => {
    if (o.statusIndex >= ORDER_STEPS.length - 1) return;
    const updated = updateOrderStatus(o.id, o.statusIndex + 1);
    if (updated) setOrders(loadOrders());
  };
  const setStatus = (o: Order, idx: number) => {
    updateOrderStatus(o.id, idx);
    setOrders(loadOrders());
  };

  return (
    <>
      <div className="page-head">
        <div>
          <p className="kicker">Workflow</p>
          <h1 className="admin-h1">Orders</h1>
          <p className="sub" style={{ margin: 0 }}>Every status change here is instantly what the customer sees on their tracking page — one shared order record.</p>
        </div>
      </div>
      <div className="shop-tools">
        <input type="search" placeholder="Search orders — ID, customer, city, phone…" value={query}
          onChange={(e) => setQuery(e.target.value)} aria-label="Search orders" style={{ flex: 1, minWidth: 200 }} />
        <label className="sort-label">Sort
          <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort orders">
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="total-desc">Total: high to low</option>
            <option value="total-asc">Total: low to high</option>
          </select>
        </label>
      </div>
      <div className="filter-chips" role="group" aria-label="Filter by status">
        <button type="button" className={"fchip" + (filter === "all" ? " on" : "")} aria-pressed={filter === "all"} onClick={() => setFilter("all")}>
          All <span>{orders.length}</span>
        </button>
        {ORDER_STEPS.map((s, i) => {
          const n = orders.filter((o) => o.statusIndex === i).length;
          return (
            <button key={s} type="button" className={"fchip" + (filter === i ? " on" : "")} aria-pressed={filter === i} onClick={() => setFilter(i)}>
              {s} <span>{n}</span>
            </button>
          );
        })}
      </div>

      {visible.length === 0 ? (
        <div className="empty"><h3>No orders at this stage</h3><p>When an order reaches this status, it will appear here ready for action.</p></div>
      ) : visible.map((o) => (
        <article key={o.id} className="panel order-card">
          <button type="button" className="order-head" aria-expanded={openId === o.id} onClick={() => setOpenId(openId === o.id ? null : o.id)}>
            <span className="oh-main"><strong className="mono">{o.id}</strong><span className="oh-customer">{o.customer.name} · {o.customer.city}</span></span>
            <span className="price oh-total">{formatPkr(o.total)}</span>
            <span className={"status-pill st-" + o.statusIndex}>{ORDER_STEPS[o.statusIndex]}</span>
            <ChevronDown size={17} aria-hidden="true" className={"oh-chev" + (openId === o.id ? " open" : "")} />
          </button>
          {openId === o.id && (
            <div className="order-detail">
              <p className="tagline">Placed {new Date(o.placedAt).toLocaleString("en-PK")} · {PAYMENT_LABELS[o.payment]}{o.payment !== "cod" ? " (pending verification flow)" : ""} · Phone {o.customer.phone} · {o.customer.address}</p>
              <ul className="summary-items">
                {o.items.map((i) => (
                  <li key={i.sku}><span>{i.name} — {i.variantLabel} × {i.qty}</span><span className="price">{formatPkr(i.pricePkr * i.qty)}</span></li>
                ))}
                <li><span>Delivery</span><span className="price">{o.delivery === 0 ? "FREE" : formatPkr(o.delivery)}</span></li>
              </ul>
              <div className="order-actions">
                <label>Set status
                  <select value={o.statusIndex} onChange={(e) => setStatus(o, Number(e.target.value))} aria-label={`Status for ${o.id}`} style={{ marginLeft: 8 }}>
                    {ORDER_STEPS.map((s, i) => <option key={s} value={i}>{s}</option>)}
                  </select>
                </label>
                {o.statusIndex < ORDER_STEPS.length - 1 && (
                  <button type="button" className="btn btn-green" onClick={() => advance(o)}>
                    Advance to {ORDER_STEPS[o.statusIndex + 1]} <ArrowRight size={15} aria-hidden="true" />
                  </button>
                )}
                {o.statusIndex === ORDER_STEPS.length - 1 && <span className="chip done-chip"><Check size={13} aria-hidden="true" /> Delivered — order complete</span>}
              </div>
            </div>
          )}
        </article>
      ))}
    </>
  );
}

export default function AdminOrdersPage() {
  return <AdminShell><OrdersAdmin /></AdminShell>;
}
