const asyncHandler = require("express-async-handler");
const Material = require("../models/materialModel");

// @desc    Get materials
// @route   GET /api/materials
// @access  Public
const getMaterials = asyncHandler(async (req, res) => {
  const materials = await Material.find({ isActive: true });

  res.status(200).send(materials);
});

// @desc    Create material
// @route   POST /api/materials
// @access  Private
const createMaterial = asyncHandler(async (req, res) => {
  if (!req.body.name || !req.body.category || !req.body.stock) {
    res.status(400);
    throw new Error("Please provide all required fields");
  }

  const materialExists = await Material.findOne({ name: { $regex: req.body.name, $options: "i" } });

  if (materialExists) {
    res.status(400);
    throw new Error("Material `name` already exists");
  }

  const materialData = { ...req.body, createdBy: req.user.id, updatedBy: req.user.id };

  const material = await Material.create(materialData);

  res.status(200).json(material);
});

// @desc    Update material
// @route   PUT /api/materials/:id
// @access  Private
const updateMaterial = asyncHandler(async (req, res) => {
  const material = await Material.findById(req.params.id);

  if (!material) {
    res.status(400);
    throw new Error("Material not found");
  }

  const materialData = { ...req.body, updatedBy: req.user.id };

  const updatedMaterial = await Material.findByIdAndUpdate(req.params.id, materialData, {
    new: true,
  });

  res.status(200).json(updatedMaterial);
});

// @desc    Delete material
// @route   DELETE /api/materials/:id
// @access  Private
const deleteMaterial = asyncHandler(async (req, res) => {
  const material = await Material.findById(req.params.id);

  if (!material) {
    res.status(400);
    throw new Error("Material not found");
  }

  material.remove();

  res.status(200).json({ id: req.params.id });
});

module.exports = {
  getMaterials,
  createMaterial,
  updateMaterial,
  deleteMaterial,
};
