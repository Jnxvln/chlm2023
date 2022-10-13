// ROUTER /api/materials

const {
  getMaterials,
  createMaterial,
  updateMaterial,
  deleteMaterial,
} = require("../controllers/materialController");

const express = require("express");
const router = express.Router();

// ROUTE HANDLERS
router.route("/").get(getMaterials).post(createMaterial);
router.route("/:id").delete(deleteMaterial).put(updateMaterial);

module.exports = router;
