// ROUTER /api/deliveries

const {
  getDeliveries,
  createDelivery,
  updateDelivery,
  deleteDelivery,
} = require("../controllers/deliveryController");
const { protect } = require("../middleware/authMiddleware");

const express = require("express");
const router = express.Router();

// ROUTE HANDLERS
router.route("/").get(protect, getDeliveries).post(protect, createDelivery);
router
  .route("/:id")
  .delete(protect, deleteDelivery)
  .put(protect, updateDelivery);

module.exports = router;
