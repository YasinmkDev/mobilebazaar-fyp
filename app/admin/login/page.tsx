"use client";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { adminLogin, DEMO_ADMIN } from "@/lib/admin";
import { ShieldCheck, Package, BarChart3, LockKeyhole } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (adminLogin(email, password)) router.replace("/admin");
    else setError("Those details do not match the admin account. Check the demo credentials below.");
  };

  return (
    <div className="login-split">
      <aside className="login-brand" aria-hidden="true">
        <span className="brand-text light"><span className="dotmark">MB</span>Mobile<em>Bazaar</em></span>
        <div className="login-brand-mid">
          <p className="kicker light">Store operations</p>
          <h2>Run the whole store<br />from one console.</h2>
          <ul className="login-points">
            <li><Package size={18} /> Orders, statuses and customer tracking in sync</li>
            <li><BarChart3 size={18} /> Revenue, payment mix and best sellers at a glance</li>
            <li><ShieldCheck size={18} /> Inventory and prices you control in seconds</li>
          </ul>
        </div>
        <p className="login-brand-foot">MobileBazaar · FYP demonstration build</p>
      </aside>

      <div className="login-form-side">
        <div className="login-card">
          <span className="login-lock"><LockKeyhole size={20} aria-hidden="true" /></span>
          <h1>Admin sign in</h1>
          <p className="sub">Store management is staff-only. Customers never see this page.</p>
          <form onSubmit={submit}>
            <label>Email
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" required placeholder="admin@mobilebazaar.pk" />
            </label>
            <label>Password
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required placeholder="••••••••" />
            </label>
            {error && <p className="field-error" role="alert">{error}</p>}
            <button type="submit" className="btn btn-primary login-btn">Sign in to admin</button>
          </form>
          <div className="demo-creds">
            <p className="option-label">Demo credentials — for the FYP viva</p>
            <p className="mono">{DEMO_ADMIN.email} / {DEMO_ADMIN.password}</p>
            <p className="hint">In production these are replaced by Supabase Auth with hashed passwords and an admin role.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
