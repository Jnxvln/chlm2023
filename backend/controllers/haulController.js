const asyncHandler = require("express-async-handler");
const Haul = require("../models/haulModel");

// @desc    Get hauls
// @route   GET /api/hauls
// @access  Private
const getHauls = asyncHandler(async (req, res) => {
  const hauls = await Haul.find();

  res.status(200).send(hauls);
});

// @desc    Create haul
// @route   POST /api/hauls
// @access  Private
const createHaul = asyncHandler(async (req, res) => {
  // #region DATA CHECKS
  if (!req.body.driver) {
    res.status(400);
    throw new Error("The `driver` field is required");
  }
  if (!req.body.dateHaul) {
    res.status(400);
    throw new Error("The `date haul` field is required");
  }
  if (!req.body.loadType) {
    res.status(400);
    throw new Error("The `load type` field is required");
  }
  if (!req.body.invoice) {
    res.status(400);
    throw new Error("The `invoice` field is required");
  }
  if (!req.body.from) {
    res.status(400);
    throw new Error("The `from` field required");
  }
  if (!req.body.vendorLocation) {
    res.status(400);
    throw new Error("The `vendor location` field required");
  }
  if (!req.body.to) {
    res.status(400);
    throw new Error("The `to` field is required");
  }
  if (!req.body.product) {
    res.status(400);
    throw new Error("The `product` field is required");
  }
  // #endregion

  const invoiceExists = await Haul.findOne({
    invoice: { $regex: req.body.invoice, $options: "i" },
  });

  if (invoiceExists) {
    res.status(400);
    throw new Error(`Invoice ${req.body.invoice} already exists`);
  }

  // Next, clear extraneous fields depending on loadType
  let overrides = {
    chInvoice: null,
    rate: null,
    miles: null,
    payRate: null,
    driverPay: null,
  };

  if (req.body.loadType === "enddump") {
    overrides.rate = req.body.rate;
  }

  if (req.body.loadType === "flatbedperc") {
    overrides.chInvoice = req.body.chInvoice;
    (overrides.payRate = req.body.payRate), (overrides.driverPay = req.body.driverPay);
  }

  if (req.body.loadType === "flatbedmi") {
    overrides.chInvoice = req.body.chInvoice;
    (overrides.rate = req.body.rate), (overrides.miles = req.body.miles);
  }

  const haulData = {
    ...req.body,
    timeHaul: req.body.dateHaul,
    createdBy: req.user.id,
    updatedBy: req.user.id,
  };

  const haul = await Haul.create(haulData);

  res.status(200).json(haul);
});

// @desc    Update haul
// @route   PUT /api/hauls/:id
// @access  Private
const updateHaul = asyncHandler(async (req, res) => {
  const haul = await Haul.findById(req.params.id);

  if (!haul) {
    res.status(400);
    throw new Error("Haul not found");
  }

  // Next, clear extraneous fields depending on loadType
  let overrides = {
    chInvoice: null,
    rate: null,
    miles: null,
    payRate: null,
    driverPay: null,
  };

  if (req.body.loadType === "enddump") {
    overrides.rate = req.body.rate;
  }

  if (req.body.loadType === "flatbedperc") {
    overrides.chInvoice = req.body.chInvoice;
    (overrides.payRate = req.body.payRate), (overrides.driverPay = req.body.driverPay);
  }

  if (req.body.loadType === "flatbedmi") {
    overrides.chInvoice = req.body.chInvoice;
    (overrides.rate = req.body.rate), (overrides.miles = req.body.miles);
  }

  const updates = { ...req.body, timeHaul: req.body.dateHaul, updatedBy: req.user.id };

  const updatedHaul = await Haul.findByIdAndUpdate(req.params.id, updates, { new: true });

  res.status(200).json(updatedHaul);
});

// @desc    Delete haul
// @route   DELETE /api/hauls/:id
// @access  Private
const deleteHaul = asyncHandler(async (req, res) => {
  const haul = await Haul.findById(req.params.id);

  if (!haul) {
    res.status(400);
    throw new Error("Haul not found");
  }

  haul.remove();

  res.status(200).json({ id: req.params.id });
});

module.exports = {
  getHauls,
  createHaul,
  updateHaul,
  deleteHaul,
};
