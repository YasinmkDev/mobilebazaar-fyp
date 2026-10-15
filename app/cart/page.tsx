"use client";
import Link from "next/link";
import { useCart, deliveryFor, FREE_DELIVERY_THRESHOLD } from "@/lib/cart";
import { formatPkr } from "@/lib/format";
import { phoneImage } from "@/lib/images";
import DeviceImage from "@/components/DeviceImage";

export default function CartPage() {
  const { items, subtotal, setQty, remove, count } = useCart();
  const delivery = deliveryFor(subtotal);
  const away = FREE_DELIVERY_THRESHOLD - subtotal;

  if (items.length === 0) {
    return (
      <div className="wrap section">
        <div className="empty">
          <h1 style={{ marginTop: 0 }}>Your cart is feeling light</h1>
          <p>No phones yet — start with our best sellers under Rs 50,000, or browse the full range.</p>
          <Link className="btn btn-primary" href="/shop">Browse phones</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="wrap section">
      <h1>Your cart ({count} {count === 1 ? "item" : "items"})</h1>
      <p className="sub">All costs shown upfront — no surprises at checkout. That is the MobileBazaar promise.</p>
      <div className="cart-layout">
        <div>
          {items.map(({ phone, variant, qty }) => (
            <article key={variant.sku} className="cart-row">
              <div className="cart-visual">
                <DeviceImage src={phoneImage(phone.slug)} alt="" imgClassName="device-img-sm" />
              </div>
              <div className="cart-info">
                <h3><Link href={`/phones/${phone.slug}`}>{phone.brand} {phone.model}</Link></h3>
                <p className="tagline">{variant.storageGb}GB · {variant.ramGb}GB RAM · PTA Approved · {phone.warranty}</p>
                <div className="qty-row">
                  <button type="button" aria-label="Decrease quantity" onClick={() => setQty(variant.sku, qty - 1)}>−</button>
                  <span aria-live="polite">{qty}</span>
                  <button type="button" aria-label="Increase quantity" onClick={() => setQty(variant.sku, qty + 1)}>+</button>
                  <button type="button" className="remove-btn" onClick={() => remove(variant.sku)}>Remove</button>
                </div>
              </div>
              <p className="price">{formatPkr(variant.pricePkr * qty)}</p>
            </article>
          ))}
        </div>
        <aside className="summary-card" aria-label="Order summary">
          <h2>Summary</h2>
          <dl>
            <div><dt>Subtotal</dt><dd className="price">{formatPkr(subtotal)}</dd></div>
            <div><dt>Delivery</dt><dd className="price">{delivery === 0 ? "FREE" : formatPkr(delivery)}</dd></div>
            <div className="total-row"><dt>Total</dt><dd className="price">{formatPkr(subtotal + delivery)}</dd></div>
          </dl>
          {away > 0
            ? <p className="hint">Add {formatPkr(away)} more for FREE delivery.</p>
            : <p className="hint">You unlocked FREE delivery ✓</p>}
          <Link className="btn btn-primary" href="/checkout" style={{ width: "100%" }}>Proceed to checkout</Link>
          <p className="hint">Guest checkout — no account needed. Pay cash when your phone arrives.</p>
        </aside>
      </div>
    </div>
  );
}
