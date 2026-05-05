import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Mini booking widget shown in the hero card
function BookingMockup() {
  const days = [null, null, null, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];
  const slots = ["09:00", "09:30", "10:00", "10:30", "11:00"];
  const selected = { day: 14, slot: "10:00" };

  return (
    <div className="bg-canvas rounded-xl border border-hairline shadow-[0_8px_32px_rgba(0,0,0,0.1)] p-5 w-full max-w-[340px]">
      {/* Doctor header */}
      <div className="flex items-center gap-3 pb-4 border-b border-hairline">
        <div className="w-9 h-9 rounded-full bg-badge-emerald/20 flex items-center justify-center text-sm font-semibold text-ink shrink-0">
          SM
        </div>
        <div>
          <p className="text-sm font-semibold text-ink leading-tight">Dr. Sarah Mitchell</p>
          <p className="text-xs text-muted mt-0.5">General Physician · 30 min</p>
        </div>
        <span className="ml-auto text-xs bg-badge-emerald/10 text-badge-emerald font-medium px-2 py-0.5 rounded-full">
          Available
        </span>
      </div>

      {/* Calendar */}
      <div className="pt-3 pb-2">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-ink">May 2026</span>
          <div className="flex gap-1">
            <button className="w-6 h-6 rounded flex items-center justify-center text-muted hover:bg-surface-soft text-xs">‹</button>
            <button className="w-6 h-6 rounded flex items-center justify-center text-muted hover:bg-surface-soft text-xs">›</button>
          </div>
        </div>
        <div className="grid grid-cols-7 text-center gap-y-0.5">
          {["M","T","W","T","F","S","S"].map((d, i) => (
            <div key={i} className="text-[10px] text-muted font-medium py-1">{d}</div>
          ))}
          {days.map((d, i) =>
            d === null ? (
              <div key={i} />
            ) : (
              <div
                key={i}
                className={`text-xs py-1.5 rounded-md cursor-pointer font-medium transition-colors ${
                  d === selected.day
                    ? "bg-ink text-on-primary"
                    : d < 5
                    ? "text-muted-soft cursor-default"
                    : "text-body hover:bg-surface-soft"
                }`}
              >
                {d}
              </div>
            )
          )}
        </div>
      </div>

      {/* Slots */}
      <div className="pt-2 pb-3 border-t border-hairline">
        <p className="text-[10px] text-muted font-semibold uppercase tracking-wider mb-2 pt-2">Select a time</p>
        <div className="flex flex-wrap gap-1.5">
          {slots.map((slot) => (
            <button
              key={slot}
              className={`text-xs px-3 py-1.5 rounded-md border font-medium transition-colors ${
                slot === selected.slot
                  ? "bg-ink text-on-primary border-ink"
                  : "border-hairline text-body hover:border-ink"
              }`}
            >
              {slot}
            </button>
          ))}
        </div>
      </div>

      {/* Confirm */}
      <button className="w-full bg-ink text-on-primary text-sm font-semibold py-2.5 rounded-md mt-1 hover:bg-primary-active transition-colors">
        Confirm Booking →
      </button>
    </div>
  );
}

const FEATURES = [
  {
    icon: "🩺",
    badge: "4 specialties",
    badgeCls: "bg-badge-violet/10 text-badge-violet",
    title: "Browse top doctors",
    body: "Find general physicians, pediatricians, dermatologists, and cardiologists — all with real-time slot availability shown upfront.",
  },
  {
    icon: "⚡",
    badge: "Instant confirmation",
    badgeCls: "bg-badge-emerald/10 text-badge-emerald",
    title: "Book in seconds, 24/7",
    body: "No phone calls, no waiting on hold. Pick your date and time slot and the system blocks double-bookings automatically.",
  },
  {
    icon: "📋",
    badge: "Cancel anytime",
    badgeCls: "bg-badge-orange/10 text-badge-orange",
    title: "Stay in control",
    body: "See your upcoming and past appointments in one place. Cancel a visit with a single click — no questions asked.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Create your account",
    body: "Sign up in under 30 seconds with just your name and email. No credit card, no paperwork.",
  },
  {
    n: "02",
    title: "Pick a doctor and slot",
    body: "Browse specialists by category, choose a date on the calendar, and select an open time slot.",
  },
  {
    n: "03",
    title: "Show up and get seen",
    body: "You're confirmed. Manage or cancel from your dashboard — we handle the scheduling so you don't have to.",
  },
];

export default function Landing() {
  const { user } = useAuth();
  const ctaTo = user ? (user.role === "admin" ? "/admin" : "/doctors") : "/signup";

  return (
    <div className="bg-canvas min-h-screen">
      {/* ── HERO ── */}
      <section className="py-20 md:py-28 px-4">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_auto] gap-14 items-center">
          {/* Left */}
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 bg-surface-card border border-hairline text-xs font-medium text-muted px-3 py-1.5 rounded-full mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-badge-emerald inline-block"></span>
              4 specialist doctors now available
            </div>

            <h1 className="font-display text-[2.8rem] md:text-6xl font-semibold text-ink leading-[1.05] tracking-display-xl mb-5">
              The smarter way to book your clinic visit.
            </h1>

            <p className="text-base text-body leading-relaxed mb-8">
              Skip the phone calls. Browse doctors, pick a time slot, and confirm your appointment in seconds — all from your browser.
            </p>

            <div className="flex items-center gap-3 flex-wrap">
              <Link to={ctaTo} className="btn-primary">
                Get started free →
              </Link>
              <Link to="/login" className="btn-secondary">
                Sign in
              </Link>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-3 mt-8">
              <div className="flex -space-x-2">
                {["#fb923c", "#ec4899", "#8b5cf6", "#34d399"].map((bg, i) => (
                  <div
                    key={i}
                    className="w-7 h-7 rounded-full border-2 border-canvas flex items-center justify-center text-[10px] font-bold text-white"
                    style={{ backgroundColor: bg }}
                  >
                    {["J", "A", "R", "M"][i]}
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted">
                <span className="font-semibold text-ink">1,200+</span> appointments booked this month
              </p>
            </div>
          </div>

          {/* Right — booking mockup */}
          <div className="flex justify-center lg:justify-end">
            <BookingMockup />
          </div>
        </div>
      </section>

      {/* ── LOGOS / TRUST BAR ── */}
      <section className="py-8 px-4 border-y border-hairline-soft bg-surface-soft">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-center gap-8">
          {["General Medicine", "Pediatrics", "Dermatology", "Cardiology"].map((s) => (
            <span key={s} className="text-sm font-medium text-muted-soft">{s}</span>
          ))}
        </div>
      </section>

      {/* ── FEATURE CARDS ── */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-display text-4xl font-semibold text-ink tracking-display-md mb-3">
              Everything you need, nothing you don't.
            </h2>
            <p className="text-base text-body max-w-md mx-auto">
              A focused feature set built for patients and clinic staff — no bloat.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <div key={i} className="card-surface p-8 flex flex-col gap-3">
                <span className="text-3xl">{f.icon}</span>
                <span className={`self-start text-xs font-semibold px-2.5 py-1 rounded-full ${f.badgeCls}`}>
                  {f.badge}
                </span>
                <h3 className="text-base font-semibold text-ink leading-snug">{f.title}</h3>
                <p className="text-sm text-body leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-24 px-4 bg-surface-soft border-y border-hairline-soft">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-display text-4xl font-semibold text-ink tracking-display-md mb-3">
              Up and running in 3 steps.
            </h2>
            <p className="text-base text-body max-w-md mx-auto">
              From zero to booked appointment in under two minutes.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {STEPS.map((s, i) => (
              <div key={i}>
                <span className="font-display text-6xl font-semibold text-hairline leading-none block mb-4">
                  {s.n}
                </span>
                <h3 className="text-base font-semibold text-ink mb-2">{s.title}</h3>
                <p className="text-sm text-body leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ADMIN HIGHLIGHT ── */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-semibold text-badge-violet bg-badge-violet/10 px-2.5 py-1 rounded-full">
              For clinic staff
            </span>
            <h2 className="font-display text-4xl font-semibold text-ink tracking-display-md mt-4 mb-4">
              Admin tools that keep the clinic running.
            </h2>
            <p className="text-base text-body leading-relaxed mb-6">
              Clinic admins get a dedicated dashboard to view every appointment, update statuses from Pending to Confirmed or Completed, and keep the schedule on track.
            </p>
            <ul className="space-y-2">
              {["View all patient appointments in one table", "Update statuses with a single dropdown", "Instantly see Pending → Confirmed → Completed flow"].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-body">
                  <span className="text-badge-emerald mt-0.5">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Mock admin table */}
          <div className="card overflow-hidden">
            <div className="px-5 py-3 border-b border-hairline bg-surface-soft">
              <p className="text-xs font-semibold text-muted uppercase tracking-wider">Admin Dashboard</p>
            </div>
            <div className="divide-y divide-hairline-soft">
              {[
                { patient: "John P.", doctor: "Dr. Mitchell", slot: "09:00", status: "Confirmed", sc: "bg-blue-50 text-blue-700" },
                { patient: "Anna R.", doctor: "Dr. Patel", slot: "10:30", status: "Pending", sc: "bg-yellow-50 text-yellow-700" },
                { patient: "Sam K.", doctor: "Dr. Sharma", slot: "14:00", status: "Completed", sc: "bg-emerald-50 text-emerald-700" },
              ].map((row, i) => (
                <div key={i} className="px-5 py-3 flex items-center justify-between gap-3 text-sm">
                  <div>
                    <p className="font-medium text-ink">{row.patient}</p>
                    <p className="text-xs text-muted">{row.doctor} · {row.slot}</p>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${row.sc} border-transparent`}>
                    {row.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BAND ── */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-surface-card rounded-xl p-12 md:p-16 text-center">
            <h2 className="font-display text-4xl font-semibold text-ink tracking-display-md mb-3">
              Ready to skip the waiting room?
            </h2>
            <p className="text-base text-body mb-8">
              Join patients already booking smarter. It's free.
            </p>
            <Link to={ctaTo} className="btn-primary inline-block">
              Book your first appointment →
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-surface-dark py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            <div className="md:col-span-2">
              <p className="font-display text-base font-semibold text-on-dark mb-3">ClinicApp</p>
              <p className="text-sm text-on-dark-soft leading-relaxed max-w-xs">
                The simplest way to schedule and manage clinic appointments — for patients and clinic staff alike.
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-on-dark uppercase tracking-wider mb-4">Product</p>
              <ul className="space-y-2.5">
                {["Browse Doctors", "Book Appointment", "My Appointments"].map((l) => (
                  <li key={l}>
                    <a href="#" className="text-sm text-on-dark-soft hover:text-on-dark transition-colors">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold text-on-dark uppercase tracking-wider mb-4">Legal</p>
              <ul className="space-y-2.5">
                {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((l) => (
                  <li key={l}>
                    <a href="#" className="text-sm text-on-dark-soft hover:text-on-dark transition-colors">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-surface-elevated pt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-on-dark-soft">© 2026 ClinicApp. All rights reserved.</p>
            <p className="text-xs text-on-dark-soft">A student project — not a real clinic.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
