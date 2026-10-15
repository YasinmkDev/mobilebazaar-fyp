"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AdminShell from "@/components/AdminShell";
import { loadOrders, saveAllOrders, demoOrders, ORDER_STEPS, PAYMENT_LABELS, type Order } from "@/lib/orders";
import { totalRevenue, revenueByDay, topPhones, paymentMix, loadOverrides, loadCustomPhones } from "@/lib/admin";
import type { Phone } from "@/lib/types";
import { PHONES } from "@/lib/products";
import { formatPkr } from "@/lib/format";
import { TriangleAlert, RefreshCw, TrendingUp, Database } from "lucide-react";
import { checkSupabase, type SupabaseStatus } from "@/lib/supabase";

function Dashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [overrides, setOverrides] = useState<Record<string, { stock?: number }>>({});
  const [customs, setCustoms] = useState<Phone[]>([]);
  const [sb, setSb] = useState<SupabaseStatus | null>(null);
  useEffect(() => { setOrders(loadOrders()); setOverrides(loadOverrides()); setCustoms(loadCustomPhones()); checkSupabase().then(setSb); }, []);

  const stats = useMemo(() => ({
    revenue: totalRevenue(orders),
    count: orders.length,
    pending: orders.filter((o) => o.statusIndex < 2).length,
    delivered: orders.filter((o) => o.statusIndex === 4).length,
    byDay: revenueByDay(orders, 7),
    top: topPhones(orders),
    mix: paymentMix(orders),
  }), [orders]);

  const lowStock = useMemo(() =>
    [...PHONES, ...customs].flatMap((p) => p.variants.map((v) => ({
      name: `${p.brand} ${p.model}`, label: `${v.storageGb}GB · ${v.ramGb}GB RAM`,
      stock: overrides[v.sku]?.stock ?? v.stock, slug: p.slug,
    }))).filter((x) => x.stock <= 7).sort((a, b) => a.stock - b.stock).slice(0, 6),
  [overrides, customs]);

  const seedDemo = () => {
    const demo = demoOrders();
    const merged = [...loadOrders().filter((o) => !o.id.startsWith("MB-DEMO")), ...demo];
    saveAllOrders(merged); setOrders(merged);
  };
  const maxDay = Math.max(1, ...stats.byDay.map((d) => d.revenue));
  const mixTotal = Math.max(1, stats.mix.reduce((s, m) => s + m.count, 0));
  const deliveredPct = stats.count ? Math.round((stats.delivered / stats.count) * 100) : 0;
  const MIX_COLORS = ["var(--ink)", "var(--signal)", "#9a9aa0", "#d8d8dc"];

  return (
    <>
      <div className="page-head">
        <div>
          <p className="kicker">Overview</p>
          <h1 className="admin-h1">Dashboard</h1>
          <p className="sub" style={{ margin: 0 }}>How the store is doing — sales, stock and what needs you today.</p>
        </div>
        <button type="button" className="btn btn-outline page-head-btn" onClick={seedDemo}>
          <RefreshCw size={15} aria-hidden="true" /> {orders.length === 0 ? "Load demo orders" : "Refresh demo orders"}
        </button>
      </div>

      <div className="sb-banner" role="status">
        <Database size={17} aria-hidden="true" />
        <span className={"status-dot " + (sb?.tablesReady ? "ok" : sb?.reachable ? "warn" : "bad")} aria-hidden="true" />
        <span>{sb === null ? "Checking your Supabase project…" : sb.message}</span>
        {sb && !sb.tablesReady && sb.reachable && (
          <span className="sb-steps">Run <strong>supabase/migrations/001_initial_schema.sql</strong>, then <strong>supabase/seed.sql</strong> in the SQL Editor, then reload.</span>
        )}
      </div>

      {orders.length === 0 && (
        <div className="empty" style={{ marginBottom: 18 }}>
          <h3 style={{ marginTop: 0 }}>No orders yet — the till is quiet</h3>
          <p>Place a real order through the store checkout, or load clearly-labelled demo orders to explore the dashboard and your viva demo.</p>
        </div>
      )}

      <div className="kpi-grid">
        <div className="kpi">
          <span className="kpi-label">Total revenue</span>
          <strong className="price kpi-value">{formatPkr(stats.revenue)}</strong>
          <span className="kpi-spark" aria-hidden="true">
            {stats.byDay.map((d, i) => (
              <i key={i} style={{ height: `${Math.max(8, (d.revenue / maxDay) * 100)}%` }} className={i === stats.byDay.length - 1 ? "today" : ""} />
            ))}
          </span>
          <span className="kpi-sub">Last 7 days shown · all-time total</span>
        </div>
        <div className="kpi">
          <span className="kpi-label">Orders</span>
          <strong className="kpi-value">{stats.count}</strong>
          <span className="kpi-sub">{stats.byDay.reduce((s, d) => s + d.count, 0)} in the last 7 days</span>
        </div>
        <div className="kpi">
          <span className="kpi-label">Needs action</span>
          <strong className="kpi-value">{stats.pending}</strong>
          <span className="kpi-sub">{stats.pending > 0 ? "New or confirmed — move them along" : "All caught up"}</span>
          {stats.pending > 0 && <Link className="kpi-link" href="/admin/orders">Open orders →</Link>}
        </div>
        <div className="kpi">
          <span className="kpi-label">Delivered</span>
          <strong className="kpi-value">{stats.delivered}</strong>
          <span className="kpi-sub"><TrendingUp size={13} aria-hidden="true" style={{ verticalAlign: -2 }} /> {deliveredPct}% of all orders completed</span>
        </div>
      </div>

      <div className="admin-cols">
        <section className="panel" aria-labelledby="rev-h">
          <div className="panel-head">
            <h2 id="rev-h">Revenue — last 7 days</h2>
            <span className="panel-total price">{formatPkr(stats.byDay.reduce((s, d) => s + d.revenue, 0))}</span>
          </div>
          <div className="bar-chart" role="img" aria-label={"Daily revenue: " + stats.byDay.map((d) => `${d.label} ${formatPkr(d.revenue)}`).join(", ")}>
            {stats.byDay.map((d, i) => (
              <div key={d.label} className="bar-col">
                <div className={"bar" + (i === stats.byDay.length - 1 ? " today" : "")} style={{ height: `${Math.max(3, (d.revenue / maxDay) * 100)}%` }} title={`${d.label}: ${formatPkr(d.revenue)} (${d.count} orders)`} />
                <span>{d.label}</span>
                <small>{d.count > 0 ? formatPkr(d.revenue) : "—"}</small>
              </div>
            ))}
          </div>
          <h3 className="panel-sub-h">Payment mix</h3>
          {stats.mix.length === 0 ? <p className="tagline">No data yet.</p> : (
            <>
              <div className="mix-bar" aria-hidden="true">
                {stats.mix.map((m, i) => (
                  <i key={m.method} style={{ width: `${(m.count / mixTotal) * 100}%`, background: MIX_COLORS[i % MIX_COLORS.length] }} />
                ))}
              </div>
              <ul className="mix-legend">
                {stats.mix.map((m, i) => (
                  <li key={m.method}>
                    <span className="mix-dot" style={{ background: MIX_COLORS[i % MIX_COLORS.length] }} aria-hidden="true" />
                    {PAYMENT_LABELS[m.method as keyof typeof PAYMENT_LABELS] ?? m.method}
                    <b>{m.count} · {Math.round((m.count / mixTotal) * 100)}%</b>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>

        <section className="panel" aria-labelledby="low-h">
          <div className="panel-head">
            <h2 id="low-h"><TriangleAlert size={17} aria-hidden="true" style={{ verticalAlign: -3, marginRight: 7, color: "var(--signal)" }} />Low stock alerts</h2>
            <Link className="kpi-link" href="/admin/products">Inventory →</Link>
          </div>
          {lowStock.length === 0 ? <p className="tagline">All variants are comfortably stocked.</p> : (
            <ul className="stock-list">
              {lowStock.map((x) => (
                <li key={x.name + x.label}>
                  <div className="stock-meta"><span>{x.name} <small>{x.label}</small></span><strong className={x.stock <= 3 ? "crit" : ""}>{x.stock} left</strong></div>
                  <span className="stock-meter"><i style={{ width: `${Math.min(100, (x.stock / 15) * 100)}%` }} className={x.stock <= 3 ? "crit" : ""} /></span>
                </li>
              ))}
            </ul>
          )}
          <h3 className="panel-sub-h">Top phones by units sold</h3>
          {stats.top.length === 0 ? <p className="tagline">No sales yet.</p> : (
            <ol className="rank-list">
              {stats.top.map((t, i) => (
                <li key={t.name}><span className="rank-num">{i + 1}</span><span className="rank-name">{t.name}</span><strong>{t.units} sold · {formatPkr(t.revenue)}</strong></li>
              ))}
            </ol>
          )}
        </section>
      </div>

      <section className="panel" aria-labelledby="recent-h">
        <div className="panel-head">
          <h2 id="recent-h">Recent orders</h2>
          <Link className="kpi-link" href="/admin/orders">All orders →</Link>
        </div>
        {orders.length === 0 ? <p className="tagline">Nothing here yet.</p> : (
          <div style={{ overflowX: "auto" }}>
            <table className="admin-table">
              <thead><tr><th>Order</th><th>Customer</th><th>Items</th><th>Payment</th><th>Total</th><th>Status</th></tr></thead>
              <tbody>
                {orders.slice(0, 6).map((o) => (
                  <tr key={o.id}>
                    <td><Link href="/admin/orders" className="mono order-id-link">{o.id}</Link></td>
                    <td>{o.customer.name} · {o.customer.city}</td>
                    <td className="num">{o.items.reduce((s, i) => s + i.qty, 0)}</td>
                    <td>{PAYMENT_LABELS[o.payment]}</td>
                    <td className="price">{formatPkr(o.total)}</td>
                    <td><span className={"status-pill st-" + o.statusIndex}>{ORDER_STEPS[o.statusIndex]}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}

export default function AdminDashboardPage() {
  return <AdminShell><Dashboard /></AdminShell>;
}
