// ROUTER /api/freight-routes

const { getFreightRoutes, createFreightRoute, updateFreightRoute, deleteFreightRoute } = require("../controllers/freightRouteController");
const { protect } = require("../middleware/authMiddleware");

const express = require("express");
const router = express.Router();

// ROUTE HANDLERS
router.route("/").get(protect, getFreightRoutes).post(protect, createFreightRoute);
router.route("/:id").delete(protect, deleteFreightRoute).put(protect, updateFreightRoute);

module.exports = router;
