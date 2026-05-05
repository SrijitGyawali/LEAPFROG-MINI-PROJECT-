const Appointment = require("../models/Appointment");

// Patient: get my appointments
const getMyAppointments = async (req, res) => {
  const appointments = await Appointment.find({ patient: req.user._id })
    .populate("doctor", "name specialty")
    .sort({ date: 1, slot: 1 });
  res.json(appointments);
};

// Patient: book appointment
const bookAppointment = async (req, res) => {
  const { doctorId, date, slot } = req.body;
  if (!doctorId || !date || !slot)
    return res.status(400).json({ message: "doctorId, date, and slot are required" });

  // Normalise date to midnight UTC so the compound index works correctly
  const day = new Date(date);
  day.setUTCHours(0, 0, 0, 0);

  try {
    const appt = await Appointment.create({
      patient: req.user._id,
      doctor: doctorId,
      date: day,
      slot,
    });
    await appt.populate("doctor", "name specialty");
    res.status(201).json(appt);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "That slot is already booked for this doctor on this date." });
    }
    throw err;
  }
};

// Patient: cancel own appointment
const cancelAppointment = async (req, res) => {
  const appt = await Appointment.findById(req.params.id);
  if (!appt) return res.status(404).json({ message: "Appointment not found" });
  if (appt.patient.toString() !== req.user._id.toString())
    return res.status(403).json({ message: "Not your appointment" });
  if (appt.status === "Cancelled")
    return res.status(400).json({ message: "Already cancelled" });

  appt.status = "Cancelled";
  await appt.save();
  res.json(appt);
};

// Admin: get all appointments
const getAllAppointments = async (req, res) => {
  const appointments = await Appointment.find()
    .populate("patient", "name email")
    .populate("doctor", "name specialty")
    .sort({ createdAt: -1 });
  res.json(appointments);
};

// Admin: update status
const updateStatus = async (req, res) => {
  const { status } = req.body;
  const allowed = ["Pending", "Confirmed", "Cancelled", "Completed"];
  if (!allowed.includes(status))
    return res.status(400).json({ message: "Invalid status" });

  const appt = await Appointment.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  ).populate("patient", "name email").populate("doctor", "name specialty");

  if (!appt) return res.status(404).json({ message: "Appointment not found" });
  res.json(appt);
};

module.exports = { getMyAppointments, bookAppointment, cancelAppointment, getAllAppointments, updateStatus };
