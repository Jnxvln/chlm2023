const asyncHandler = require("express-async-handler");
const Driver = require("../models/driverModel");

// @desc    Get drivers
// @route   GET /api/drivers
// @access  Private
const getDrivers = asyncHandler(async (req, res) => {
  const drivers = await Driver.find();

  res.status(200).send(drivers);
});

// @desc    Create driver
// @route   POST /api/drivers
// @access  Private
const createDriver = asyncHandler(async (req, res) => {
  if (
    !req.body.firstName ||
    !req.body.lastName ||
    !req.body.endDumpPayRate ||
    !req.body.flatBedPayRate ||
    !req.body.ncRate
  ) {
    res.status(400);
    throw new Error("Please provide all required fields");
  }

  const driver = await Driver.create({
    createdBy: req.user.id,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    endDumpPayRate: req.body.endDumpPayRate,
    flatBedPayRate: req.body.flatBedPayRate,
    ncRate: req.body.ncRate,
    defaultTruck: req.body.defaultTruck,
    dateHired: req.body.dateHired,
    dateReleased: req.body.dateReleased,
    isActive: req.body.isActive,
  });

  res.status(200).json(driver);
});

// @desc    Update driver
// @route   PUT /api/drivers/:id
// @access  Private
const updateDriver = asyncHandler(async (req, res) => {
  const driver = await Driver.findById(req.params.id);

  if (!driver) {
    res.status(400);
    throw new Error("Driver not found");
  }

  const updatedDriver = await Driver.findByIdAndUpdate(req.params.id, req.body, { new: true });

  res.status(200).json(updatedDriver);
});

// @desc    Delete driver
// @route   DELETE /api/drivers/:id
// @access  Private
const deleteDriver = asyncHandler(async (req, res) => {
  const driver = await Driver.findById(req.params.id);

  if (!driver) {
    res.status(400);
    throw new Error("Driver not found");
  }

  driver.remove();

  res.status(200).json({ id: req.params.id });
});

module.exports = {
  getDrivers,
  createDriver,
  updateDriver,
  deleteDriver,
};
