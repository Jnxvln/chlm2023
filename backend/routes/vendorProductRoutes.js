// ROUTER /api/vendor-products

const { getVendorProducts, createVendorProduct, updateVendorProduct, deleteVendorProduct } = require("../controllers/vendorProductController");
const { protect } = require("../middleware/authMiddleware");

const express = require("express");
const router = express.Router();

// ROUTE HANDLERS
router.route("/").get(protect, getVendorProducts).post(protect, createVendorProduct);
router.route("/:id").delete(protect, deleteVendorProduct).put(protect, updateVendorProduct);

module.exports = router;
