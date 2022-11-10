// ROUTER /api/material-categories

const {
  getMaterialCategories,
  createMaterialCategory,
  updateMaterialCategory,
  deleteMaterialCategory,
} = require("../controllers/materialCategoryController");
const { protect } = require("../middleware/authMiddleware");

const express = require("express");
const router = express.Router();

// ROUTE HANDLERS
router.route("/").get(getMaterialCategories).post(protect, createMaterialCategory);
router.route("/:id").delete(protect, deleteMaterialCategory).put(protect, updateMaterialCategory);

module.exports = router;
