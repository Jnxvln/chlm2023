// ROUTER /api/hauls

const {
    getHauls,
    createHaul,
    updateHaul,
    deleteHaul,
  } = require("../controllers/haulController");
  const { protect } = require("../middleware/authMiddleware");
  
  const express = require("express");
  const router = express.Router();
  
  // ROUTE HANDLERS
  router.route("/").get(protect, getHauls).post(protect, createHaul);
  router.route("/:id").delete(protect, deleteHaul).put(protect, updateHaul);
  
  module.exports = router;
  