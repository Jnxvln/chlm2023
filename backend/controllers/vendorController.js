const asyncHandler = require("express-async-handler");
const Vendor = require("../models/vendorModel");

// @desc    Get vendors
// @route   GET /api/vendors
// @access  Private
const getVendors = asyncHandler(async (req, res) => {
  const vendors = await Vendor.find();

  res.status(200).send(vendors);
});

// @desc    Create vendor
// @route   POST /api/vendors
// @access  Private
const createVendor = asyncHandler(async (req, res) => {
  if (!req.body.name || !req.body.shortName) {
    res.status(400);
    throw new Error("Please provide all required fields");
  }

  const vendorNameExists = await Vendor.findOne({ name: { $regex: req.body.name, $options: "i" } });
  const vendorShortNameExists = await Vendor.findOne({
    shortName: { $regex: req.body.shortName, $options: "i" },
  });

  if (vendorNameExists) {
    res.status(400);
    throw new Error("Vendor name already exists");
  }

  if (vendorShortNameExists) {
    res.status(400);
    throw new Error("Vendor short name already exists");
  }

  const vendor = await Vendor.create({
    createdBy: req.user.id,
    updatedBy: req.user.id,
    name: req.body.name,
    locations: req.body.locations,
    shortName: req.body.shortName,
    chtFuelSurcharge: req.body.chtFuelSurcharge || 0.0,
    vendorFuelSurcharge: req.body.vendorFuelSurcharge || 0.0,
    isActive: req.body.isActive,
  });

  res.status(200).json(vendor);
});

// @desc    Update vendor
// @route   PUT /api/vendors/:id
// @access  Private
const updateVendor = asyncHandler(async (req, res) => {
  const vendor = await Vendor.findById(req.params.id);

  if (!vendor) {
    res.status(400);
    throw new Error("Vendor not found");
  }

  // const vendorNameExists = await Vendor.findOne({ name: { $regex: req.body.name, $options: "i" } });
  // const vendorShortNameExists = await Vendor.findOne({
  //   shortName: { $regex: req.body.shortName, $options: "i" },
  // });

  // if (vendorNameExists) {
  //   res.status(400);
  //   throw new Error("Vendor name already exists");
  // }

  // if (vendorShortNameExists) {
  //   res.status(400);
  //   throw new Error("Vendor short name already exists");
  // }

  const updates = { ...req.body, updatedBy: req.user.id };

  const updatedVendor = await Vendor.findByIdAndUpdate(req.params.id, updates, { new: true });

  res.status(200).json(updatedVendor);
});

// @desc    Delete vendor
// @route   DELETE /api/vendors/:id
// @access  Private
const deleteVendor = asyncHandler(async (req, res) => {
  const vendor = await Vendor.findById(req.params.id);

  if (!vendor) {
    res.status(400);
    throw new Error("Vendor not found");
  }

  vendor.remove();

  res.status(200).json({ id: req.params.id });
});

module.exports = {
  getVendors,
  createVendor,
  updateVendor,
  deleteVendor,
};
