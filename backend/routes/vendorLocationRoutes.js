// ROUTER /api/vendor-locations

const {
  getVendorLocations,
  createVendorLocation,
  updateVendorLocation,
  deleteVendorLocation,
} = require("../controllers/vendorLocationController");
const { protect } = require("../middleware/authMiddleware");

const express = require("express");
const router = express.Router();

// ROUTE HANDLERS
router.route("/").get(protect, getVendorLocations).post(protect, createVendorLocation);
router.route("/:id").delete(protect, deleteVendorLocation).put(protect, updateVendorLocation);

module.exports = router;
