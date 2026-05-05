import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setMobileOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const navLink = (to, label) => (
    <Link
      to={to}
      onClick={() => setMobileOpen(false)}
      className={`text-sm font-medium px-3 py-1.5 rounded-md transition-colors ${
        isActive(to)
          ? "bg-surface-soft text-ink"
          : "text-muted hover:text-ink hover:bg-surface-soft"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 bg-canvas border-b border-hairline">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="font-display text-base font-semibold text-ink tracking-display-xs shrink-0">
          ClinicApp
        </Link>

        {/* Desktop center nav */}
        <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
          {!user && (
            <>
              {navLink("/", "Home")}
              {navLink("/login", "Doctors")}
            </>
          )}
          {user?.role === "patient" && (
            <>
              {navLink("/doctors", "Browse Doctors")}
              {navLink("/my-appointments", "My Appointments")}
            </>
          )}
          {user?.role === "admin" && navLink("/admin", "Dashboard")}
        </nav>

        {/* Desktop right */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          {!user ? (
            <>
              <Link to="/login" className="text-sm font-semibold text-ink px-4 py-2 rounded-md hover:bg-surface-soft transition-colors">
                Sign in
              </Link>
              <Link to="/signup" className="btn-primary">
                Get started
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-surface-card border border-hairline flex items-center justify-center text-xs font-semibold text-ink">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-ink">{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-muted hover:text-ink px-3 py-1.5 rounded-md hover:bg-surface-soft transition-colors"
              >
                Sign out
              </button>
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-md hover:bg-surface-soft transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <div className="w-5 flex flex-col gap-1">
            <span className={`block h-0.5 bg-ink transition-all ${mobileOpen ? "rotate-45 translate-y-1.5" : ""}`} />
            <span className={`block h-0.5 bg-ink transition-all ${mobileOpen ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 bg-ink transition-all ${mobileOpen ? "-rotate-45 -translate-y-1.5" : ""}`} />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-hairline bg-canvas px-4 py-3 flex flex-col gap-1">
          {!user && (
            <>
              {navLink("/", "Home")}
              {navLink("/login", "Sign in")}
              {navLink("/signup", "Get started")}
            </>
          )}
          {user?.role === "patient" && (
            <>
              {navLink("/doctors", "Browse Doctors")}
              {navLink("/my-appointments", "My Appointments")}
            </>
          )}
          {user?.role === "admin" && navLink("/admin", "Dashboard")}
          {user && (
            <button
              onClick={handleLogout}
              className="text-sm font-medium text-left text-muted hover:text-ink px-3 py-1.5 rounded-md hover:bg-surface-soft transition-colors"
            >
              Sign out
            </button>
          )}
        </div>
      )}
    </header>
  );
}
