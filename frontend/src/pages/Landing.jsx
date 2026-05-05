import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/* ─── SVG Icons ─── */
const IconUsers = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const IconZap = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);
const IconShieldCheck = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    <polyline points="9 12 11 14 15 10"/>
  </svg>
);

/* ─── Scroll-reveal hook ─── */
function useReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -48px 0px" }
    );
    document.querySelectorAll("[data-reveal]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

/* ─── Parallax hook (background blobs + hero card) ─── */
function useParallax(blob1Ref, blob2Ref, blob3Ref, cardRef) {
  useEffect(() => {
    const targets = [
      { ref: blob1Ref, speed: 0.09 },
      { ref: blob2Ref, speed: -0.13 },
      { ref: blob3Ref, speed: 0.06 },
      { ref: cardRef,  speed: -0.04 },
    ];
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const y = window.scrollY;
          targets.forEach(({ ref, speed }) => {
            if (ref.current) {
              ref.current.style.transform = `translateY(${y * speed}px)`;
            }
          });
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [blob1Ref, blob2Ref, blob3Ref, cardRef]);
}

/* ─── Counting number hook ─── */
function useCounter(target, duration = 1400, delay = 700) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => {
      const start = performance.now();
      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 4);
        setCount(Math.floor(ease * target));
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, delay);
    return () => clearTimeout(timer);
  }, [target, duration, delay]);
  return count;
}

/* ─── Booking widget mockup ─── */
function BookingMockup() {
  const days = [null, null, null, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];
  const slots = ["09:00", "09:30", "10:00", "10:30", "11:00"];
  const selected = { day: 14, slot: "10:00" };

  return (
    <div className="bg-canvas rounded-xl border border-hairline shadow-[0_16px_48px_rgba(0,0,0,0.12)] p-5 w-full max-w-[320px]">
      {/* Doctor header */}
      <div className="flex items-center gap-3 pb-4 border-b border-hairline">
        <div className="w-9 h-9 rounded-full bg-badge-emerald/20 flex items-center justify-center text-sm font-bold text-ink shrink-0">
          SM
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-ink">Dr. Sarah Mitchell</p>
          <p className="text-xs text-muted">General Physician · 30 min</p>
        </div>
        <span className="text-xs bg-badge-emerald/10 text-badge-emerald font-medium px-2 py-0.5 rounded-full shrink-0">
          Available
        </span>
      </div>

      {/* Mini calendar */}
      <div className="pt-3 pb-2">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-semibold text-ink">May 2026</span>
          <div className="flex gap-1">
            <button className="w-6 h-6 rounded flex items-center justify-center text-muted text-xs hover:bg-surface-soft">‹</button>
            <button className="w-6 h-6 rounded flex items-center justify-center text-muted text-xs hover:bg-surface-soft">›</button>
          </div>
        </div>
        <div className="grid grid-cols-7 text-center gap-y-0.5">
          {["M","T","W","T","F","S","S"].map((d, i) => (
            <div key={i} className="text-[10px] text-muted font-medium py-1">{d}</div>
          ))}
          {days.map((d, i) =>
            d === null ? <div key={i} /> : (
              <div key={i} className={`text-xs py-1.5 rounded-md cursor-pointer font-medium transition-colors ${
                d === selected.day
                  ? "bg-ink text-on-primary"
                  : d < 5
                  ? "text-hairline cursor-default"
                  : "text-body hover:bg-surface-soft"
              }`}>
                {d}
              </div>
            )
          )}
        </div>
      </div>

      {/* Time slots */}
      <div className="pt-3 pb-3 border-t border-hairline">
        <p className="text-[10px] text-muted font-semibold uppercase tracking-wider mb-2">Select a time</p>
        <div className="flex flex-wrap gap-1.5">
          {slots.map((s) => (
            <button key={s} className={`text-xs px-3 py-1.5 rounded-md border font-medium transition-colors ${
              s === selected.slot ? "bg-ink text-on-primary border-ink" : "border-hairline text-body hover:border-ink"
            }`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Confirm */}
      <button className="w-full bg-ink text-on-primary text-sm font-semibold py-2.5 rounded-md hover:bg-primary-active transition-colors">
        Confirm Booking →
      </button>
    </div>
  );
}

/* ─── Data ─── */
const FEATURES = [
  {
    Icon: IconUsers,
    iconBg: "bg-badge-violet/10",
    iconColor: "text-badge-violet",
    badge: "4 specialties",
    badgeCls: "bg-badge-violet/10 text-badge-violet",
    title: "Browse top doctors",
    body: "Find general physicians, pediatricians, dermatologists, and cardiologists — all with real-time slot availability shown upfront.",
  },
  {
    Icon: IconZap,
    iconBg: "bg-badge-emerald/10",
    iconColor: "text-badge-emerald",
    badge: "Instant confirmation",
    badgeCls: "bg-badge-emerald/10 text-badge-emerald",
    title: "Book in seconds, 24/7",
    body: "No phone calls, no waiting on hold. Pick your date and time slot and the system blocks double-bookings automatically.",
  },
  {
    Icon: IconShieldCheck,
    iconBg: "bg-badge-orange/10",
    iconColor: "text-badge-orange",
    badge: "Cancel anytime",
    badgeCls: "bg-badge-orange/10 text-badge-orange",
    title: "Stay in control",
    body: "See your upcoming and past appointments in one place. Cancel a visit with a single click — no questions asked.",
  },
];

const STEPS = [
  { n: "01", title: "Create your account", body: "Sign up in under 30 seconds with just your name and email. No credit card, no paperwork." },
  { n: "02", title: "Pick a doctor and slot", body: "Browse specialists by category, choose a date on the calendar, and select an open time slot." },
  { n: "03", title: "Show up and get seen", body: "You're confirmed. Manage or cancel from your dashboard — we handle the scheduling." },
];

/* ─── Main component ─── */
export default function Landing() {
  const { user } = useAuth();
  const ctaTo = user ? (user.role === "admin" ? "/admin" : "/doctors") : "/signup";

  // Hooks
  useReveal();
  const blob1 = useRef(null);
  const blob2 = useRef(null);
  const blob3 = useRef(null);
  const heroCardParallax = useRef(null);
  useParallax(blob1, blob2, blob3, heroCardParallax);
  const count = useCounter(1200);

  return (
    <div className="bg-canvas min-h-screen overflow-x-hidden">

      {/* ══════════════════════════════════════════
          HERO
      ══════════════════════════════════════════ */}
      <section className="relative py-20 md:py-28 px-4 overflow-hidden">

        {/* Dot grid background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, #d1d5db 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            opacity: 0.55,
          }}
        />
        {/* Fade dot grid at top & bottom */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-canvas via-transparent to-canvas" />
        {/* Fade dot grid at sides */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-canvas via-transparent to-canvas" />

        {/* Parallax blobs */}
        <div
          ref={blob1}
          className="absolute -top-40 -right-20 w-[560px] h-[560px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)" }}
        />
        <div
          ref={blob2}
          className="absolute top-10 -left-32 w-[460px] h-[460px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(52,211,153,0.10) 0%, transparent 70%)" }}
        />
        <div
          ref={blob3}
          className="absolute bottom-0 right-1/3 w-[300px] h-[300px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(251,146,60,0.08) 0%, transparent 70%)" }}
        />

        {/* Hero content */}
        <div className="relative max-w-6xl mx-auto grid lg:grid-cols-[1fr_auto] gap-14 items-center">

          {/* Left copy — CSS entrance with staggered delays */}
          <div className="max-w-xl">
            <div className="hero-in" style={{ animationDelay: "0ms" }}>
              <span className="inline-flex items-center gap-2 bg-surface-card border border-hairline text-xs font-medium text-muted px-3 py-1.5 rounded-full mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-badge-emerald inline-block animate-pulse" />
                4 specialist doctors now available
              </span>
            </div>

            <h1
              className="hero-in font-display text-[2.8rem] md:text-6xl font-semibold text-ink leading-[1.05] tracking-display-xl mb-5"
              style={{ animationDelay: "80ms" }}
            >
              The smarter way to book your clinic visit.
            </h1>

            <p
              className="hero-in text-base text-body leading-relaxed mb-8"
              style={{ animationDelay: "180ms" }}
            >
              Skip the phone calls. Browse doctors, pick a time slot, and confirm your appointment in seconds — all from your browser.
            </p>

            <div
              className="hero-in flex items-center gap-3 flex-wrap"
              style={{ animationDelay: "270ms" }}
            >
              <Link to={ctaTo} className="btn-primary">Get started free →</Link>
              <Link to="/login" className="btn-secondary">Sign in</Link>
            </div>

            {/* Social proof with counter */}
            <div
              className="hero-in flex items-center gap-3 mt-8"
              style={{ animationDelay: "380ms" }}
            >
              <div className="flex -space-x-2">
                {["#fb923c","#ec4899","#8b5cf6","#34d399"].map((bg, i) => (
                  <div
                    key={i}
                    className="w-7 h-7 rounded-full border-2 border-canvas flex items-center justify-center text-[10px] font-bold text-white"
                    style={{ backgroundColor: bg }}
                  >
                    {["J","A","R","M"][i]}
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted">
                <span className="font-semibold text-ink">{count.toLocaleString()}+</span> appointments booked this month
              </p>
            </div>
          </div>

          {/* Right — floating booking mockup with parallax wrapper */}
          <div ref={heroCardParallax} className="flex justify-center lg:justify-end will-change-transform">
            <div className="card-entrance" style={{ animationDelay: "200ms" }}>
              <div className="card-float">
                <BookingMockup />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          TRUST BAR
      ══════════════════════════════════════════ */}
      <section
        data-reveal="up"
        className="py-8 px-4 border-y border-hairline-soft bg-surface-soft"
        style={{ animationDelay: "0ms" }}
      >
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-center gap-10">
          {["General Medicine", "Pediatrics", "Dermatology", "Cardiology"].map((s, i) => (
            <span
              key={s}
              className="text-sm font-medium text-muted-soft flex items-center gap-2"
            >
              <span className="w-1 h-1 rounded-full bg-hairline inline-block" />
              {s}
            </span>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FEATURES
      ══════════════════════════════════════════ */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">

          <div data-reveal="up" className="text-center mb-14">
            <h2 className="font-display text-4xl font-semibold text-ink tracking-display-md mb-3">
              Everything you need, nothing you don't.
            </h2>
            <p className="text-base text-body max-w-md mx-auto">
              A focused feature set built for patients and clinic staff — no bloat.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                data-reveal="up"
                className="card-surface p-8 flex flex-col gap-3 hover:shadow-md transition-shadow duration-300"
                style={{ animationDelay: `${i * 110}ms` }}
              >
                <div className={`w-10 h-10 rounded-lg ${f.iconBg} flex items-center justify-center`}>
                  <f.Icon className={`w-5 h-5 ${f.iconColor}`} />
                </div>
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

      {/* ══════════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════════ */}
      <section className="py-24 px-4 bg-surface-soft border-y border-hairline-soft">
        <div className="max-w-6xl mx-auto">

          <div data-reveal="up" className="text-center mb-14">
            <h2 className="font-display text-4xl font-semibold text-ink tracking-display-md mb-3">
              Up and running in 3 steps.
            </h2>
            <p className="text-base text-body max-w-md mx-auto">
              From zero to booked appointment in under two minutes.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10 relative">
            {/* Connector line (desktop) */}
            <div className="hidden md:block absolute top-10 left-1/6 right-1/6 h-px bg-hairline" style={{ left: "16.6%", right: "16.6%" }} />

            {STEPS.map((s, i) => (
              <div
                key={i}
                data-reveal="up"
                style={{ animationDelay: `${i * 130}ms` }}
              >
                <span className="font-display text-6xl font-semibold text-hairline leading-none block mb-4 select-none">
                  {s.n}
                </span>
                <h3 className="text-base font-semibold text-ink mb-2">{s.title}</h3>
                <p className="text-sm text-body leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          ADMIN HIGHLIGHT
      ══════════════════════════════════════════ */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-14 items-center">

          {/* Left copy */}
          <div data-reveal="left">
            <span className="text-xs font-semibold text-badge-violet bg-badge-violet/10 px-2.5 py-1 rounded-full">
              For clinic staff
            </span>
            <h2 className="font-display text-4xl font-semibold text-ink tracking-display-md mt-4 mb-4">
              Admin tools that keep the clinic running.
            </h2>
            <p className="text-base text-body leading-relaxed mb-6">
              Clinic admins get a dedicated dashboard to view every appointment, update statuses, and keep the schedule on track.
            </p>
            <ul className="space-y-3">
              {[
                "View all patient appointments in one table",
                "Update statuses with a single dropdown",
                "Filter by Pending, Confirmed, Completed, or Cancelled",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-body">
                  <svg className="w-4 h-4 text-badge-emerald mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Right — mock admin table */}
          <div data-reveal="right" style={{ animationDelay: "120ms" }}>
            <div className="card overflow-hidden">
              <div className="px-5 py-3 border-b border-hairline bg-surface-soft flex items-center justify-between">
                <p className="text-xs font-semibold text-muted uppercase tracking-wider">Admin Dashboard</p>
                <span className="text-xs text-muted-soft">3 appointments</span>
              </div>
              <div className="divide-y divide-hairline-soft">
                {[
                  { patient: "John P.",  doctor: "Dr. Mitchell", slot: "09:00", status: "Confirmed", sc: "bg-blue-50 text-blue-700" },
                  { patient: "Anna R.",  doctor: "Dr. Patel",    slot: "10:30", status: "Pending",   sc: "bg-yellow-50 text-yellow-700" },
                  { patient: "Sam K.",   doctor: "Dr. Sharma",   slot: "14:00", status: "Completed", sc: "bg-emerald-50 text-emerald-700" },
                ].map((row, i) => (
                  <div key={i} className="px-5 py-3.5 flex items-center justify-between gap-3 hover:bg-surface-soft/60 transition-colors">
                    <div>
                      <p className="text-sm font-medium text-ink">{row.patient}</p>
                      <p className="text-xs text-muted">{row.doctor} · {row.slot}</p>
                    </div>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${row.sc}`}>
                      {row.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          STATS ROW
      ══════════════════════════════════════════ */}
      <section className="py-16 px-4 border-y border-hairline-soft bg-surface-soft">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: "1,200+", label: "Appointments booked" },
            { value: "4",      label: "Specialties available" },
            { value: "10",     label: "Daily time slots per doctor" },
            { value: "< 2 min", label: "Average booking time" },
          ].map((s, i) => (
            <div
              key={i}
              data-reveal="up"
              className="text-center"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <p className="font-display text-3xl font-semibold text-ink tracking-display-sm mb-1">{s.value}</p>
              <p className="text-xs text-muted font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CTA BAND
      ══════════════════════════════════════════ */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div
            data-reveal="scale"
            className="relative bg-surface-card rounded-xl p-12 md:p-16 text-center overflow-hidden"
          >
            {/* Decorative blob inside CTA */}
            <div
              className="absolute -top-16 -right-16 w-64 h-64 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)" }}
            />
            <div
              className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(52,211,153,0.07) 0%, transparent 70%)" }}
            />

            <div className="relative">
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
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════ */}
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
                    <a href="#" className="text-sm text-on-dark-soft hover:text-on-dark transition-colors">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold text-on-dark uppercase tracking-wider mb-4">Legal</p>
              <ul className="space-y-2.5">
                {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((l) => (
                  <li key={l}>
                    <a href="#" className="text-sm text-on-dark-soft hover:text-on-dark transition-colors">{l}</a>
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
