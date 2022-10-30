const asyncHandler = require("express-async-handler");
const FreightRoute = require("../models/freightRouteModel");

// @desc    Get freight routes
// @route   GET /api/freight-routes
// @access  Private
const getFreightRoutes = asyncHandler(async (req, res) => {
  const freightRoutes = await FreightRoute.find();

  res.status(200).send(freightRoutes);
});

// @desc    Create freight route
// @route   POST /api/freight-routes
// @access  Private
const createFreightRoute = asyncHandler(async (req, res) => {
  if (!req.body.vendorId) {
    res.status(400);
    throw new Error("Vendor is required");
  }

  if (!req.body.destination) {
    res.status(400);
    throw new Error("Destination is required");
  }

  if (!req.body.freightCost || req.body.freightCost.toString().length <= 0) {
    res.status(400);
    throw new Error("Freight Cost is required");
  }

  const freightRoute = await FreightRoute.create({
    createdBy: req.user.id,
    updatedBy: req.user.id,
    vendorId: req.body.vendorId,
    destination: req.body.destination,
    freightCost: req.body.freightCost,
    notes: req.body.notes,
    isActive: req.body.isActive,
  });

  res.status(200).json(freightRoute);
});

// @desc    Update freight route
// @route   PUT /api/freight-routes/:id
// @access  Private
const updateFreightRoute = asyncHandler(async (req, res) => {
  const freightRoute = await FreightRoute.findById(req.params.id);

  if (!freightRoute) {
    res.status(400);
    throw new Error("Freight Route not found");
  }

  const updates = { ...req.body, updatedBy: req.user.id };

  const updatedFreightRoute = await FreightRoute.findByIdAndUpdate(req.params.id, updates, { new: true });

  res.status(200).json(updatedFreightRoute);
});

// @desc    Delete driver
// @route   DELETE /api/drivers/:id
// @access  Private
const deleteFreightRoute = asyncHandler(async (req, res) => {
  const freightRoute = await FreightRoute.findById(req.params.id);

  if (!freightRoute) {
    res.status(400);
    throw new Error("Freight Route not found");
  }

  freightRoute.remove();

  res.status(200).json({ id: req.params.id });
});

module.exports = {
  getFreightRoutes,
  createFreightRoute,
  updateFreightRoute,
  deleteFreightRoute,
};
