require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");
const Doctor = require("./models/Doctor");
const Appointment = require("./models/Appointment");

const SLOTS = ["09:00","09:30","10:00","10:30","11:00","11:30","14:00","14:30","15:00","15:30"];

const doctors = [
  { name: "Dr. Sarah Mitchell", specialty: "General Physician", availableSlots: SLOTS },
  { name: "Dr. James Patel",    specialty: "Pediatrician",      availableSlots: SLOTS },
  { name: "Dr. Anika Sharma",   specialty: "Dermatologist",     availableSlots: SLOTS },
  { name: "Dr. Robert Chen",    specialty: "Cardiologist",      availableSlots: SLOTS },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");

  // Wipe all collections
  await Promise.all([
    User.deleteMany(),
    Doctor.deleteMany(),
    Appointment.deleteMany(),
  ]);
  console.log("Collections cleared");

  // Create admin
  await User.create({
    name: "Admin",
    email: "admin@clinic.com",
    password: "admin123",
    role: "admin",
  });

  // Create sample patient
  await User.create({
    name: "John Patient",
    email: "patient@clinic.com",
    password: "patient123",
    role: "patient",
  });

  // Create doctors
  await Doctor.insertMany(doctors);

  console.log("Seed complete!");
  console.log("  Admin:   admin@clinic.com   / admin123");
  console.log("  Patient: patient@clinic.com / patient123");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
