import { useEffect, useState } from "react";
import api from "../api/axios";

const STATUSES = ["Pending", "Confirmed", "Completed", "Cancelled"];

const STATUS_STYLE = {
  Pending:   "bg-yellow-50 text-yellow-700 border-yellow-200",
  Confirmed: "bg-blue-50 text-blue-700 border-blue-200",
  Completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Cancelled: "bg-red-50 text-red-600 border-red-200",
};

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function AdminDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    api.get("/appointments")
      .then((res) => setAppointments(res.data))
      .catch(() => setError("Failed to load appointments."))
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      const { data } = await api.patch(`/appointments/${id}/status`, { status });
      setAppointments((prev) => prev.map((a) => (a._id === id ? data : a)));
    } catch (err) {
      alert(err.response?.data?.message || "Update failed.");
    }
  };

  const filtered = filter === "All" ? appointments : appointments.filter((a) => a.status === filter);

  // Stats
  const stats = STATUSES.reduce((acc, s) => {
    acc[s] = appointments.filter((a) => a.status === s).length;
    return acc;
  }, {});

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
      <div className="mb-10">
        <h1 className="font-display text-4xl font-semibold text-ink tracking-display-md mb-1">
          Admin dashboard
        </h1>
        <p className="text-base text-muted">
          {appointments.length} total appointments across all doctors.
        </p>
      </div>

      {error && <p className="text-red-600 text-sm mb-6">{error}</p>}

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Pending",   count: stats.Pending,   cls: "text-yellow-700 bg-yellow-50 border-yellow-200" },
          { label: "Confirmed", count: stats.Confirmed, cls: "text-blue-700 bg-blue-50 border-blue-200" },
          { label: "Completed", count: stats.Completed, cls: "text-emerald-700 bg-emerald-50 border-emerald-200" },
          { label: "Cancelled", count: stats.Cancelled, cls: "text-red-600 bg-red-50 border-red-200" },
        ].map((s) => (
          <div key={s.label} className={`rounded-xl border p-4 ${s.cls}`}>
            <p className="text-2xl font-semibold font-display leading-none mb-1">{s.count}</p>
            <p className="text-xs font-medium opacity-80">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1 bg-surface-soft p-1 rounded-full w-fit mb-6">
        {["All", ...STATUSES].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
              filter === tab
                ? "bg-canvas text-ink shadow-sm"
                : "text-muted hover:text-ink"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-surface-soft border-b border-hairline">
                <th className="px-5 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">Patient</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">Doctor</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">Date</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">Slot</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline-soft">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-sm text-muted">
                    No appointments found.
                  </td>
                </tr>
              )}
              {filtered.map((a) => (
                <tr key={a._id} className="hover:bg-surface-soft/50 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-ink">{a.patient?.name}</p>
                    <p className="text-xs text-muted-soft">{a.patient?.email}</p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-ink">{a.doctor?.name}</p>
                    <p className="text-xs text-muted">{a.doctor?.specialty}</p>
                  </td>
                  <td className="px-5 py-4 text-body whitespace-nowrap">{formatDate(a.date)}</td>
                  <td className="px-5 py-4">
                    <span className="bg-surface-card text-ink text-xs font-mono px-2 py-1 rounded-md">
                      {a.slot}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-medium border px-2.5 py-1 rounded-full ${STATUS_STYLE[a.status]}`}>
                      {a.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <select
                      value={a.status}
                      onChange={(e) => handleStatusChange(a._id, e.target.value)}
                      className="text-xs border border-hairline rounded-md px-2.5 py-1.5 text-ink bg-canvas focus:outline-none focus:ring-2 focus:ring-ink/10 focus:border-ink transition-colors"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
