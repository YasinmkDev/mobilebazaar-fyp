"use client";
import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { adminLoggedIn, adminLogout } from "@/lib/admin";
import { loadOrders } from "@/lib/orders";
import { LayoutDashboard, Package, Smartphone, Store, PackageSearch, LogOut, type LucideIcon } from "lucide-react";
import { DotLoader } from "./Skeleton";

const SECTION_NAMES: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/orders": "Orders",
  "/admin/products": "Products",
};

export default function AdminShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const [needsAction, setNeedsAction] = useState(0);

  useEffect(() => {
    if (!adminLoggedIn()) { router.replace("/admin/login"); return; }
    setReady(true);
    setNeedsAction(loadOrders().filter((o) => o.statusIndex < 2).length);
  }, [router, pathname]);

  if (!ready) return (
    <div className="page-loader" role="status">
      <DotLoader size="lg" />
      <p className="page-loader-text">Checking admin session</p>
    </div>
  );

  const links: { href: string; label: string; Icon: LucideIcon; badge?: number }[] = [
    { href: "/admin", label: "Dashboard", Icon: LayoutDashboard },
    { href: "/admin/orders", label: "Orders", Icon: Package, badge: needsAction },
    { href: "/admin/products", label: "Products", Icon: Smartphone },
  ];
  const today = new Date().toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" });

  return (
    <div className="admin-layout">
      <aside className="admin-side" aria-label="Admin navigation">
        <div className="admin-brand-block">
          <span className="brand-text"><span className="dotmark" aria-hidden="true">MB</span>Mobile<em>Bazaar</em></span>
          <span className="admin-brand-sub">Store operations</span>
        </div>

        <p className="side-label">Manage</p>
        <nav className="side-nav">
          {links.map(({ href, label, Icon, badge }) => (
            <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined}
              className={"side-link" + (pathname === href ? " active" : "")}>
              <Icon size={17} aria-hidden="true" />{label}
              {badge ? <span className="side-badge">{badge}</span> : null}
            </Link>
          ))}
        </nav>

        <p className="side-label">Storefront</p>
        <nav className="side-nav">
          <Link href="/" className="side-link"><Store size={17} aria-hidden="true" />View store</Link>
          <Link href="/track" className="side-link"><PackageSearch size={17} aria-hidden="true" />Customer tracking</Link>
        </nav>

        <div className="side-user">
          <span className="avatar admin-avatar" aria-hidden="true">A</span>
          <div className="side-user-meta">
            <b>Store Admin</b>
            <span>admin@mobilebazaar.pk</span>
          </div>
          <button type="button" className="side-logout" aria-label="Log out"
            onClick={() => { adminLogout(); router.replace("/admin/login"); }}>
            <LogOut size={16} aria-hidden="true" />
          </button>
        </div>
        <p className="admin-note">Demo auth on this device. Production uses Supabase Auth + an admin role.</p>
      </aside>

      <div className="admin-main">
        <div className="admin-topbar">
          <p className="topbar-crumb">Admin <span aria-hidden="true">/</span> <b>{SECTION_NAMES[pathname] ?? "Console"}</b></p>
          <p className="topbar-date">{today}</p>
        </div>
        {children}
      </div>
    </div>
  );
}
