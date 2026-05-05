const express = require("express");
const router = express.Router();
const { getDoctors, createDoctor } = require("../controllers/doctorController");
const { protect, adminOnly } = require("../middleware/auth");

router.get("/", protect, getDoctors);
router.post("/", protect, adminOnly, createDoctor);

module.exports = router;
