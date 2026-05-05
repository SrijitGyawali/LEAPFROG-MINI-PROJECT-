import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const STATUS_STYLE = {
  Pending:   "bg-yellow-50 text-yellow-700 border-yellow-200",
  Confirmed: "bg-blue-50 text-blue-700 border-blue-200",
  Completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Cancelled: "bg-red-50 text-red-600 border-red-200",
};

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function AppointmentCard({ appt, onCancel }) {
  const [cancelling, setCancelling] = useState(false);
  const isPast = new Date(appt.date) < new Date() || appt.status === "Cancelled" || appt.status === "Completed";

  const handleCancel = async () => {
    if (!window.confirm("Cancel this appointment?")) return;
    setCancelling(true);
    try {
      await onCancel(appt._id);
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className={`card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${isPast ? "opacity-60" : ""}`}>
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-surface-card flex items-center justify-center text-base shrink-0">
          🩺
        </div>
        <div>
          <p className="text-sm font-semibold text-ink">{appt.doctor?.name}</p>
          <p className="text-xs text-muted">{appt.doctor?.specialty}</p>
          <p className="text-xs text-muted-soft mt-1">
            {formatDate(appt.date)} · {appt.slot}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:shrink-0">
        <span className={`text-xs font-medium border px-2.5 py-1 rounded-full ${STATUS_STYLE[appt.status]}`}>
          {appt.status}
        </span>
        {!isPast && appt.status !== "Confirmed" && (
          <button
            onClick={handleCancel}
            disabled={cancelling}
            className="text-xs font-medium text-muted hover:text-red-600 border border-hairline hover:border-red-200 px-3 py-1.5 rounded-md transition-colors disabled:opacity-50"
          >
            {cancelling ? "Cancelling…" : "Cancel"}
          </button>
        )}
        {!isPast && appt.status === "Confirmed" && (
          <button
            onClick={handleCancel}
            disabled={cancelling}
            className="text-xs font-medium text-muted hover:text-red-600 border border-hairline hover:border-red-200 px-3 py-1.5 rounded-md transition-colors disabled:opacity-50"
          >
            {cancelling ? "Cancelling…" : "Cancel"}
          </button>
        )}
      </div>
    </div>
  );
}

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchAppointments = async () => {
    try {
      const { data } = await api.get("/appointments/me");
      setAppointments(data);
    } catch {
      setError("Failed to load appointments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAppointments(); }, []);

  const handleCancel = async (id) => {
    try {
      await api.patch(`/appointments/${id}/cancel`);
      setAppointments((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status: "Cancelled" } : a))
      );
    } catch (err) {
      alert(err.response?.data?.message || "Cancel failed.");
    }
  };

  const now = new Date();
  const upcoming = appointments.filter(
    (a) => new Date(a.date) >= now && a.status !== "Cancelled" && a.status !== "Completed"
  );
  const past = appointments.filter(
    (a) => new Date(a.date) < now || a.status === "Cancelled" || a.status === "Completed"
  );

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-ink border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="font-display text-4xl font-semibold text-ink tracking-display-md mb-1">
            My appointments
          </h1>
          <p className="text-base text-muted">
            {upcoming.length} upcoming · {past.length} past
          </p>
        </div>
        <button onClick={() => navigate("/doctors")} className="btn-primary hidden sm:block">
          Book new →
        </button>
      </div>

      {error && (
        <p className="text-red-600 text-sm mb-6">{error}</p>
      )}

      {appointments.length === 0 ? (
        <div className="card-surface p-16 text-center">
          <p className="text-4xl mb-4">📭</p>
          <h2 className="text-base font-semibold text-ink mb-2">No appointments yet</h2>
          <p className="text-sm text-muted mb-6">Browse our doctors and book your first appointment.</p>
          <button onClick={() => navigate("/doctors")} className="btn-primary">
            Browse doctors →
          </button>
        </div>
      ) : (
        <div className="space-y-10">
          {/* Upcoming */}
          <section>
            <h2 className="text-xs font-semibold text-muted uppercase tracking-wider mb-4">
              Upcoming ({upcoming.length})
            </h2>
            {upcoming.length === 0 ? (
              <p className="text-sm text-muted-soft">No upcoming appointments.</p>
            ) : (
              <div className="space-y-3">
                {upcoming.map((a) => (
                  <AppointmentCard key={a._id} appt={a} onCancel={handleCancel} />
                ))}
              </div>
            )}
          </section>

          {/* Past */}
          {past.length > 0 && (
            <section>
              <h2 className="text-xs font-semibold text-muted uppercase tracking-wider mb-4">
                Past & cancelled ({past.length})
              </h2>
              <div className="space-y-3">
                {past.map((a) => (
                  <AppointmentCard key={a._id} appt={a} onCancel={handleCancel} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
