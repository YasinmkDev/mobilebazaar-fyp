"use client";
import { Suspense, useEffect, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { findOrder, loadOrders, ORDER_STEPS, PAYMENT_LABELS, type Order } from "@/lib/orders";
import { formatPkr } from "@/lib/format";
import { PackageCheck } from "lucide-react";

function TrackInner() {
  const params = useSearchParams();
  const isNew = params.get("new") === "1";
  const [input, setInput] = useState(params.get("order") ?? "");
  const [order, setOrder] = useState<Order | undefined>(undefined);
  const [notFoundMsg, setNotFoundMsg] = useState("");
  const [recent, setRecent] = useState<Order[]>([]);

  useEffect(() => {
    setRecent(loadOrders());
    const id = params.get("order");
    if (id) setOrder(findOrder(id));
  }, [params]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const found = findOrder(input);
    setOrder(found);
    setNotFoundMsg(found ? "" : "We could not find that order number on this device. Check the number from your confirmation and try again.");
  };

  return (
    <div className="wrap section">
      {isNew && order && (
        <div className="success-banner" role="status">
          <h1><PackageCheck size={27} aria-hidden="true" style={{ verticalAlign: -4, marginRight: 9 }} />Order placed — thank you, {order.customer.name.split(" ")[0]}!</h1>
          <p>Your order <strong>{order.id}</strong> is confirmed in our system. {order.payment === "cod"
            ? `Keep ${formatPkr(order.total)} ready — you pay the rider when it arrives.`
            : "We will contact you shortly with payment details to complete verification."}</p>
        </div>
      )}
      {!isNew && <h1>Track your order</h1>}
      <p className="sub">Enter the order number from your confirmation (for example MB-AB12C).</p>

      <form className="track-form" onSubmit={submit}>
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="MB-XXXXX" aria-label="Order number" />
        <button type="submit" className="btn btn-green">Track</button>
      </form>
      {notFoundMsg && <p className="field-error" role="alert">{notFoundMsg}</p>}

      {order && (
        <div className="track-card">
          <h2>{order.id} — {order.items.map((i) => i.name).join(", ")}</h2>
          <p className="tagline">Placed {new Date(order.placedAt).toLocaleString("en-PK")} · Deliver to {order.customer.city} · {PAYMENT_LABELS[order.payment]} · Total <span className="price">{formatPkr(order.total)}</span></p>
          <ol className="timeline">
            {ORDER_STEPS.map((step, i) => (
              <li key={step} className={i <= order.statusIndex ? "done" : ""} aria-current={i === order.statusIndex ? "step" : undefined}>
                <span className="dot">{i <= order.statusIndex ? "✓" : i + 1}</span>
                <span>{step}{i === order.statusIndex ? " — we are here now" : ""}</span>
              </li>
            ))}
          </ol>
          <p className="hint">What happens next: we call {order.customer.phone} to confirm, pack your phone with a packaging video, and hand it to the courier. You can open the parcel before paying.</p>
        </div>
      )}

      {!order && recent.length > 0 && (
        <div className="track-card">
          <h2>Your recent orders on this device</h2>
          <ul className="summary-items">
            {recent.map((o) => (
              <li key={o.id}>
                <button type="button" className="link-btn" onClick={() => { setInput(o.id); setOrder(o); }}>{o.id}</button>
                <span>{o.items.map((i) => i.name).join(", ")} · <span className="price">{formatPkr(o.total)}</span></span>
              </li>
            ))}
          </ul>
        </div>
      )}
      <p style={{ marginTop: 20 }}><Link href="/shop">← Continue shopping</Link></p>
    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={<div className="wrap" style={{ padding: 32 }}>Loading tracking…</div>}>
      <TrackInner />
    </Suspense>
  );
}
