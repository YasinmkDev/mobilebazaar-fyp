"use client";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart, deliveryFor } from "@/lib/cart";
import { formatPkr } from "@/lib/format";
import { saveOrder, newOrderId, PAYMENT_LABELS, type Order, type PaymentMethod } from "@/lib/orders";
import { recordOrderInSupabase } from "@/lib/orders-sync";

interface Errors { [k: string]: string }

export default function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const router = useRouter();
  const delivery = deliveryFor(subtotal);
  const [payment, setPayment] = useState<PaymentMethod>("cod");
  const [errors, setErrors] = useState<Errors>({});
  const [form, setForm] = useState({ name: "", phone: "", city: "", address: "", email: "", note: "" });
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  if (items.length === 0) {
    return (
      <div className="wrap section"><div className="empty">
        <h1 style={{ marginTop: 0 }}>Nothing to check out yet</h1>
        <p>Your cart is empty — add a phone first, then come back. We will keep the checkout this simple.</p>
        <Link className="btn btn-primary" href="/shop">Browse phones</Link>
      </div></div>
    );
  }

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const errs: Errors = {};
    if (form.name.trim().length < 3) errs.name = "Please enter your full name.";
    if (!/^0?3\d{9}$/.test(form.phone.replace(/[\s-]/g, ""))) errs.phone = "Enter a valid mobile number, e.g. 0345 1234567.";
    if (form.city.trim().length < 2) errs.city = "Which city should we deliver to?";
    if (form.address.trim().length < 10) errs.address = "Add a complete address — house, street and area — so the rider finds you first try.";
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) errs.email = "That email looks incomplete (email is optional).";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const id = newOrderId();
    const order: Order = {
      id, placedAt: new Date().toISOString(),
      customer: { name: form.name.trim(), phone: form.phone.trim(), city: form.city.trim(), address: form.address.trim(), email: form.email.trim() || undefined, note: form.note.trim() || undefined },
      payment,
      items: items.map(({ phone, variant, qty }) => ({
        sku: variant.sku, name: `${phone.brand} ${phone.model}`,
        variantLabel: `${variant.storageGb}GB · ${variant.ramGb}GB RAM`,
        pricePkr: variant.pricePkr, qty,
      })),
      subtotal, delivery, total: subtotal + delivery, statusIndex: 0,
    };
    saveOrder(order);
    void recordOrderInSupabase(order); // mirror to the Supabase business record
    clear();
    router.push(`/track?order=${id}&new=1`);
  };

  return (
    <div className="wrap section">
      <h1>Checkout</h1>
      <p className="sub">Guest checkout · 6 short fields · all costs already included. No account, no card, no surprise fees.</p>
      <form className="cart-layout" onSubmit={submit} noValidate>
        <div className="form-card">
          <h2>Where do we deliver?</h2>
          <label>Full name
            <input value={form.name} onChange={set("name")} autoComplete="name" aria-invalid={!!errors.name} />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </label>
          <label>Mobile number (rider will call this)
            <input value={form.phone} onChange={set("phone")} inputMode="tel" autoComplete="tel" placeholder="0345 1234567" aria-invalid={!!errors.phone} />
            {errors.phone && <span className="field-error">{errors.phone}</span>}
          </label>
          <label>City
            <input value={form.city} onChange={set("city")} autoComplete="address-level2" aria-invalid={!!errors.city} />
            {errors.city && <span className="field-error">{errors.city}</span>}
          </label>
          <label>Complete address
            <textarea value={form.address} onChange={set("address")} rows={3} autoComplete="street-address" aria-invalid={!!errors.address} />
            {errors.address && <span className="field-error">{errors.address}</span>}
          </label>
          <label>Email (optional, for your receipt)
            <input value={form.email} onChange={set("email")} type="email" autoComplete="email" aria-invalid={!!errors.email} />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </label>
          <label>Delivery note (optional)
            <input value={form.note} onChange={set("note")} placeholder="e.g. Call on arrival" />
          </label>

          <h2 style={{ marginTop: 26 }}>How will you pay?</h2>
          <div className="pay-options" role="radiogroup" aria-label="Payment method">
            {(Object.keys(PAYMENT_LABELS) as PaymentMethod[]).map((m) => (
              <label key={m} className={"pay-option" + (payment === m ? " selected" : "")}>
                <input type="radio" name="payment" checked={payment === m} onChange={() => setPayment(m)} />
                <span><strong>{PAYMENT_LABELS[m]}</strong>
                  <small>{m === "cod" ? "Pay the rider when your phone arrives. Safest, most popular."
                    : "We will send payment details; your order is confirmed once payment is verified."}</small>
                </span>
              </label>
            ))}
          </div>
        </div>

        <aside className="summary-card" aria-label="Order summary">
          <h2>Your order</h2>
          <ul className="summary-items">
            {items.map(({ phone, variant, qty }) => (
              <li key={variant.sku}><span>{phone.brand} {phone.model} · {variant.storageGb}GB × {qty}</span><span className="price">{formatPkr(variant.pricePkr * qty)}</span></li>
            ))}
          </ul>
          <dl>
            <div><dt>Subtotal</dt><dd className="price">{formatPkr(subtotal)}</dd></div>
            <div><dt>Delivery</dt><dd className="price">{delivery === 0 ? "FREE" : formatPkr(delivery)}</dd></div>
            <div className="total-row"><dt>{payment === "cod" ? "Pay on delivery" : "Total"}</dt><dd className="price">{formatPkr(subtotal + delivery)}</dd></div>
          </dl>
          <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>
            Place order — {formatPkr(subtotal + delivery)}
          </button>
          <p className="hint">By placing this order you agree to our 7-day return policy. PTA status of every phone is verifiable via SMS 8484.</p>
        </aside>
      </form>
    </div>
  );
}
