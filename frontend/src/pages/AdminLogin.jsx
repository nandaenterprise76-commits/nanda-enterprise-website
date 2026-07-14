import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export default function AdminLogin() {
  const { login, user } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to="/admin" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await login(email, password);
      toast.success("Welcome back, Admin.");
      nav("/admin");
    } catch (err) {
      const msg = err?.response?.data?.detail;
      toast.error(typeof msg === "string" ? msg : "Login failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-6 py-16" data-testid="admin-login-page">
      <div className="w-full max-w-md">
        <div className="ne-card p-10">
          <div className="w-12 h-12 bg-[color:var(--ne-accent)] flex items-center justify-center mb-6">
            <Lock className="w-5 h-5 text-black" strokeWidth={2.5} />
          </div>
          <div className="overline mb-2">// Restricted</div>
          <h1 className="text-3xl font-black uppercase text-white leading-tight">Admin Console</h1>
          <p className="text-white/50 text-sm mt-2">Sign in to manage brands, products and enquiries.</p>

          <form onSubmit={submit} className="mt-8 space-y-4">
            <div>
              <label className="mono text-[10px] tracking-widest text-white/50 uppercase">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                data-testid="login-email"
                className="mt-1 w-full bg-[color:var(--ne-surface-2)] border border-[color:var(--ne-border)] focus:border-[color:var(--ne-accent)] px-4 py-3 text-white outline-none rounded-none"
              />
            </div>
            <div>
              <label className="mono text-[10px] tracking-widest text-white/50 uppercase">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                data-testid="login-password"
                className="mt-1 w-full bg-[color:var(--ne-surface-2)] border border-[color:var(--ne-border)] focus:border-[color:var(--ne-accent)] px-4 py-3 text-white outline-none rounded-none"
              />
            </div>
            <button type="submit" disabled={busy} className="ne-btn-primary w-full justify-center disabled:opacity-60" data-testid="login-submit">
              {busy ? "SIGNING IN…" : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
