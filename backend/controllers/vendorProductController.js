const asyncHandler = require("express-async-handler");
const VendorProduct = require("../models/vendorProductModel");

// @desc    Get vendor products
// @route   GET /api/vendor-products
// @access  Private
const getVendorProducts = asyncHandler(async (req, res) => {
  const products = await VendorProduct.find();

  res.status(200).send(products);
});

// @desc    Create vendor product
// @route   POST /api/vendor-products
// @access  Private
const createVendorProduct = asyncHandler(async (req, res) => {
  if (!req.body.vendorId) {
    res.status(400);
    throw new Error("A vendor is required");
  }

  if (!req.body.name) {
    res.status(400);
    throw new Error("Product name is required");
  }

  if (!req.body.vendorLocationId) {
    res.status(400);
    throw new Error("Vendor location is required");
  }

  if (!req.body.productCost || req.body.productCost.toString().length <= 0) {
    res.status(400);
    throw new Error("Product cost is required (or enter 0.00)");
  }

  const vendorProductExists = await VendorProduct.findOne({
    vendorId: req.body.vendorId,
    vendorLocationId: req.body.vendorLocationId,
    name: { $regex: req.body.name, $options: "i" },
  });

  if (vendorProductExists) {
    res.status(400);
    throw new Error("Product already exists");
  }

  const vendorProduct = await VendorProduct.create({
    createdBy: req.user.id,
    updatedBy: req.user.id,
    vendorId: req.body.vendorId,
    vendorLocationId: req.body.vendorLocationId,
    name: req.body.name,
    productCost: req.body.productCost,
    notes: req.body.notes,
    isActive: req.body.isActive,
  });

  res.status(200).json(vendorProduct);
});

// @desc    Update vendor product
// @route   PUT /api/vendor-products/:id
// @access  Private
const updateVendorProduct = asyncHandler(async (req, res) => {
  const vendorProduct = await VendorProduct.findById(req.params.id);

  if (!vendorProduct) {
    res.status(400);
    throw new Error("Vendor Product not found");
  }

  const updates = { ...req.body, updatedBy: req.user.id };

  const updatedVendorProduct = await VendorProduct.findByIdAndUpdate(req.params.id, updates, {
    new: true,
  });

  res.status(200).json(updatedVendorProduct);
});

// @desc    Delete vendor product
// @route   DELETE /api/vendor-products/:id
// @access  Private
const deleteVendorProduct = asyncHandler(async (req, res) => {
  const vendorProduct = await VendorProduct.findById(req.params.id);

  if (!vendorProduct) {
    res.status(400);
    throw new Error("Vendor Product not found");
  }

  vendorProduct.remove();

  res.status(200).json({ id: req.params.id });
});

module.exports = {
  getVendorProducts,
  createVendorProduct,
  updateVendorProduct,
  deleteVendorProduct,
};
