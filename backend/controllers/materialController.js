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

  const material = await Material.create({
    createdBy: req.user.id,
    name: req.body.name,
    category: req.body.category,
    image: req.body.image,
    binNumber: req.body.binNumber,
    size: req.body.size,
    stock: req.body.stock,
    notes: req.body.notes,
    description: req.body.description,
    isFeatured: req.body.isFeatured,
    isActive: req.body.isActive,
    isTruckable: req.body.isTruckable,
  });

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

  const updatedMaterial = await Material.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

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
