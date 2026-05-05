const express = require("express");
const router = express.Router();
const {
  getMyAppointments,
  bookAppointment,
  cancelAppointment,
  getAllAppointments,
  updateStatus,
} = require("../controllers/appointmentController");
const { protect, adminOnly } = require("../middleware/auth");

router.get("/me", protect, getMyAppointments);
router.post("/", protect, bookAppointment);
router.patch("/:id/cancel", protect, cancelAppointment);
router.get("/", protect, adminOnly, getAllAppointments);
router.patch("/:id/status", protect, adminOnly, updateStatus);

module.exports = router;
