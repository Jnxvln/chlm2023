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
        res.status(400)
        throw new Error("The `driver` field is required")
    }
    if (!req.body.dateHaul) {
        res.status(400)
        throw new Error("The `date haul` field is required")
    }
    if (!req.body.loadType) {
        res.status(400)
        throw new Error("The `load type` field is required")
    }
    if (!req.body.invoice) {
        res.status(400)
        throw new Error("The `invoice` field is required")
    }
    if (!req.body.from) {
        res.status(400)
        throw new Error("The `from` field required")
    }
    if (!req.body.to) {
        res.status(400)
        throw new Error("The `to` field is required")
    }
    if (!req.body.product) {
        res.status(400)
        throw new Error("The `product` field is required")
    }
    // #endregion

  const haul = await Haul.create({
    createdBy: req.user.id,
    updatedBy: req.user.id,
    driver: req.body.driver,
    dateHaul: req.body.dateHaul,
    truck: req.body.truck,
    broker: req.body.broker,
    chInvoice: req.body.chInvoice,
    loadType: req.body.loadType,
    invoice: req.body.invoice,
    from: req.body.from,
    to: req.body.to,
    product: req.body.product,
    tons: req.body.tons,
    rate: req.body.rate,
    miles: req.body.miles,
    payRate: req.body.payRate,
    driverPay: req.body.driverPay,
  });

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

  const updatedHaul = await Haul.findByIdAndUpdate(req.params.id, {
    updatedBy: req.user.id,
    driver: req.body.driver,
    dateHaul: req.body.dateHaul,
    truck: req.body.truck,
    broker: req.body.broker,
    chInvoice: req.body.chInvoice,
    loadType: req.body.loadType,
    invoice: req.body.invoice,
    from: req.body.from,
    to: req.body.to,
    product: req.body.product,
    tons: req.body.tons,
    rate: req.body.rate,
    miles: req.body.miles,
    payRate: req.body.payRate,
    driverPay: req.body.driverPay,
  }, { new: true });

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
