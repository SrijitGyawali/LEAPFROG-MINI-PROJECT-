import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function BookAppointment() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    api.get("/doctors").then((res) => {
      setDoctor(res.data.find((d) => d._id === doctorId) || null);
    });
  }, [doctorId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!date || !slot) return setError("Please select a date and a time slot.");
    setError("");
    setLoading(true);
    try {
      await api.post("/appointments", { doctorId, date, slot });
      setSuccess(true);
      setTimeout(() => navigate("/my-appointments"), 1800);
    } catch (err) {
      setError(err.response?.data?.message || "Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!doctor) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-ink border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <button
        onClick={() => navigate("/doctors")}
        className="flex items-center gap-1.5 text-sm text-muted hover:text-ink transition-colors mb-8"
      >
        ← Back to doctors
      </button>

      <div className="grid lg:grid-cols-[1fr_400px] gap-10 items-start">
        {/* Left — doctor info */}
        <div>
          <h1 className="font-display text-4xl font-semibold text-ink tracking-display-md mb-1">
            Book an appointment
          </h1>
          <p className="text-base text-muted mb-8">Confirm your slot with {doctor.name}</p>

          {/* Doctor card */}
          <div className="card p-6 mb-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-surface-card flex items-center justify-center text-lg font-bold text-ink">
                {doctor.name.split(" ").filter((w) => w !== "Dr.").map((w) => w[0]).join("").slice(0, 2)}
              </div>
              <div>
                <h2 className="text-base font-semibold text-ink">{doctor.name}</h2>
                <p className="text-sm text-muted">{doctor.specialty}</p>
                <p className="text-xs text-muted-soft mt-1">Appointment duration: 30 min</p>
              </div>
            </div>
          </div>

          {/* Info list */}
          <div className="space-y-3">
            {[
              { icon: "📅", label: "Flexible scheduling", desc: "Choose any available date from today onward" },
              { icon: "🔒", label: "No double bookings", desc: "Slots are locked the moment you confirm" },
              { icon: "❌", label: "Free cancellation", desc: "Cancel anytime from My Appointments" },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-3">
                <span className="text-lg mt-0.5">{item.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-ink">{item.label}</p>
                  <p className="text-xs text-muted">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — form */}
        <div className="card p-6">
          {success ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-3">✅</div>
              <h3 className="text-lg font-semibold text-ink mb-1">Appointment confirmed!</h3>
              <p className="text-sm text-muted">Redirecting to your appointments…</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <h3 className="text-base font-semibold text-ink">Select date & time</h3>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-3.5 py-2.5 rounded-md">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-ink mb-1.5">Date</label>
                <input
                  type="date"
                  min={today}
                  className="input"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink mb-1.5">Time slot</label>
                <div className="flex flex-wrap gap-2">
                  {doctor.availableSlots.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSlot(s)}
                      className={`text-sm px-3.5 py-2 rounded-md border font-medium transition-colors ${
                        slot === s
                          ? "bg-ink text-on-primary border-ink"
                          : "border-hairline text-body hover:border-ink"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Summary */}
              {date && slot && (
                <div className="bg-surface-soft rounded-md px-4 py-3 text-sm border border-hairline-soft">
                  <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-1">Summary</p>
                  <p className="text-ink font-medium">
                    {new Date(date + "T12:00:00").toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}{" "}
                    at {slot}
                  </p>
                  <p className="text-muted text-xs">{doctor.name} · {doctor.specialty}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !date || !slot}
                className="btn-primary w-full"
              >
                {loading ? "Booking…" : "Confirm booking →"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
