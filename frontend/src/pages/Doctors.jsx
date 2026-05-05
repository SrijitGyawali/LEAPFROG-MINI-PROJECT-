import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const SPECIALTY_COLORS = {
  "General Physician": { bg: "bg-badge-emerald/10", text: "text-badge-emerald", dot: "bg-badge-emerald" },
  "Pediatrician":      { bg: "bg-badge-violet/10",  text: "text-badge-violet",  dot: "bg-badge-violet" },
  "Dermatologist":     { bg: "bg-badge-pink/10",    text: "text-badge-pink",    dot: "bg-badge-pink" },
  "Cardiologist":      { bg: "bg-badge-orange/10",  text: "text-badge-orange",  dot: "bg-badge-orange" },
};

const SPECIALTY_ICON = {
  "General Physician": "🩺",
  "Pediatrician": "👶",
  "Dermatologist": "✨",
  "Cardiologist": "❤️",
};

function DoctorInitials(name) {
  return name.split(" ").filter((w) => w !== "Dr.").map((w) => w[0]).join("").slice(0, 2);
}

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/doctors")
      .then((res) => setDoctors(res.data))
      .catch(() => setError("Failed to load doctors. Is the backend running?"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-ink border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-muted">Loading doctors…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <p className="text-error text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Page header */}
      <div className="mb-10">
        <h1 className="font-display text-4xl font-semibold text-ink tracking-display-md mb-2">
          Browse doctors
        </h1>
        <p className="text-base text-muted">
          {doctors.length} specialists available — pick one to see open slots.
        </p>
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-5">
        {doctors.map((doc) => {
          const colors = SPECIALTY_COLORS[doc.specialty] || { bg: "bg-surface-card", text: "text-muted", dot: "bg-muted" };
          const icon = SPECIALTY_ICON[doc.specialty] || "🏥";
          const initials = DoctorInitials(doc.name);

          return (
            <div
              key={doc._id}
              className="card p-6 flex flex-col gap-5 hover:shadow-md transition-shadow"
            >
              {/* Doctor info */}
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-full ${colors.bg} flex items-center justify-center text-xl shrink-0`}>
                  {icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-base font-semibold text-ink leading-tight">{doc.name}</h2>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${colors.dot} shrink-0`} />
                    <span className={`text-xs font-medium ${colors.text}`}>{doc.specialty}</span>
                  </div>
                </div>
              </div>

              {/* Slots */}
              <div>
                <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                  Available slots
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {doc.availableSlots.slice(0, 8).map((slot) => (
                    <span
                      key={slot}
                      className="text-xs border border-hairline text-body px-2.5 py-1 rounded-md"
                    >
                      {slot}
                    </span>
                  ))}
                  {doc.availableSlots.length > 8 && (
                    <span className="text-xs text-muted px-2 py-1">
                      +{doc.availableSlots.length - 8} more
                    </span>
                  )}
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={() => navigate(`/book/${doc._id}`)}
                className="btn-primary w-full mt-auto"
              >
                Book appointment →
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
