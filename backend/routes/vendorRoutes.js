// ROUTER /api/vendors

const {
  getVendors,
  createVendor,
  updateVendor,
  deleteVendor,
} = require("../controllers/vendorController");
const { protect } = require("../middleware/authMiddleware");

const express = require("express");
const router = express.Router();

// ROUTE HANDLERS
router.route("/").get(protect, getVendors).post(protect, createVendor);
router.route("/:id").delete(protect, deleteVendor).put(protect, updateVendor);

module.exports = router;
