// ROUTER /api/materials

const {
  getMaterials,
  createMaterial,
  updateMaterial,
  deleteMaterial,
} = require("../controllers/materialController");
const { protect } = require("../middleware/authMiddleware");

const express = require("express");
const router = express.Router();

// ROUTE HANDLERS
router.route("/").get(getMaterials).post(protect, createMaterial);
router.route("/:id").delete(protect, deleteMaterial).put(protect, updateMaterial);

module.exports = router;
