const asyncHandler = require("express-async-handler");

// @desc    Get materials
// @route   GET /api/materials
// @access  Private
const getMaterials = asyncHandler(async (req, res) => {
  res.status(200).send({ message: "GET Materials" });
});

// @desc    Create material
// @route   POST /api/materials
// @access  Private
const createMaterial = asyncHandler(async (req, res) => {
  if (!req.body.text) {
    res.status(400);
    throw new Error("Please add a text field");
  }
  res.status(200).send({ message: "CREATE Material" });
});

// @desc    Update material
// @route   PUT /api/materials/:id
// @access  Private
const updateMaterial = asyncHandler(async (req, res) => {
  res.status(200).send({ message: `UPDATE Material ${req.params.id}` });
});

// @desc    Delete material
// @route   DELETE /api/materials/:id
// @access  Private
const deleteMaterial = asyncHandler(async (req, res) => {
  res.status(200).send({ message: `DELETE Material ${req.params.id}` });
});

module.exports = {
  getMaterials,
  createMaterial,
  updateMaterial,
  deleteMaterial,
};
