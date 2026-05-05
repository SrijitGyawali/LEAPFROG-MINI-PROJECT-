const Doctor = require("../models/Doctor");

const getDoctors = async (req, res) => {
  const doctors = await Doctor.find();
  res.json(doctors);
};

const createDoctor = async (req, res) => {
  const { name, specialty, availableSlots } = req.body;
  if (!name || !specialty)
    return res.status(400).json({ message: "Name and specialty required" });
  const doctor = await Doctor.create({ name, specialty, availableSlots: availableSlots || [] });
  res.status(201).json(doctor);
};

module.exports = { getDoctors, createDoctor };
