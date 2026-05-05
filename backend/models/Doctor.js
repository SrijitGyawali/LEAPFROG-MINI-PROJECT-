const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialty: { type: String, required: true },
  availableSlots: { type: [String], default: [] },
});

module.exports = mongoose.model("Doctor", doctorSchema);
