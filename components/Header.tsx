"use client";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { ShoppingCart } from "lucide-react";

export default function Header() {
  const { count } = useCart();
  return (
    <>
      <div className="trust-strip">
        <div className="wrap">
          <span><b>PTA</b> APPROVED</span>
          <span><b>WARRANTY</b> OFFICIAL</span>
          <span><b>COD</b> NATIONWIDE</span>
          <span><b>OPEN PARCEL</b> BEFORE YOU PAY</span>
          <span><b>EMI</b> FROM RS 1,454/MO</span>
        </div>
      </div>
      <header className="site-header">
        <div className="wrap bar">
          <Link href="/" className="logo"><em>MobileBazaar</em><span className="dotmark">PK·EST·2026</span></Link>
          <form className="header-search" action="/shop" role="search">
            <input name="q" type="search" placeholder="Search phones — try “Galaxy A56” or “gaming”" aria-label="Search phones" />
            <button type="submit">Search</button>
          </form>
          <nav className="nav-links" aria-label="Main">
            <Link href="/shop">Shop</Link>
            <Link href="/shop?bucket=u30">Under Rs 30k</Link>
            <Link href="/#compare-note">Compare</Link>
            <Link href="/track">Track Order</Link>
          </nav>
          <Link href="/cart" className="cart-link" aria-label={`Cart, ${count} items`}>
            <ShoppingCart size={19} aria-hidden="true" /> Cart{count > 0 && <span className="cart-badge">{count}</span>}
          </Link>
        </div>
      </header>
    </>
  );
}
