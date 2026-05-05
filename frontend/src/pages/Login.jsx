import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) {
    navigate(user.role === "admin" ? "/admin" : "/doctors", { replace: true });
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", form);
      login(data.token, data.user);
      navigate(data.user.role === "admin" ? "/admin" : "/doctors");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-canvas flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-semibold text-ink tracking-display-sm mb-2">
            Welcome back
          </h1>
          <p className="text-sm text-muted">Sign in to your ClinicApp account</p>
        </div>

        {/* Card */}
        <div className="card p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-3.5 py-2.5 rounded-md mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-ink mb-1.5">Email address</label>
              <input
                type="email"
                className="input"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                autoComplete="email"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-ink">Password</label>
              </div>
              <input
                type="password"
                className="input"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                autoComplete="current-password"
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? "Signing in…" : "Sign in →"}
            </button>
          </form>
        </div>

        {/* Footer link */}
        <p className="text-center text-sm text-muted mt-5">
          Don't have an account?{" "}
          <Link to="/signup" className="text-ink font-semibold hover:underline underline-offset-2">
            Sign up free
          </Link>
        </p>

        {/* Demo hint */}
        <div className="mt-6 bg-surface-card rounded-lg p-4 border border-hairline-soft">
          <p className="text-xs font-semibold text-ink mb-2">Demo credentials</p>
          <div className="space-y-1 text-xs text-muted font-mono">
            <p>patient@clinic.com / patient123</p>
            <p>admin@clinic.com / admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
