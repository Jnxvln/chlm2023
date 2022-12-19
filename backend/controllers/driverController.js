const asyncHandler = require('express-async-handler')
const Driver = require('../models/driverModel')

// @desc    Get drivers
// @route   GET /api/drivers
// @access  Private
const getDrivers = asyncHandler(async (req, res) => {
    const drivers = await Driver.find()

    res.status(200).send(drivers)
})

// @desc    Get driver by ID
// @route   GET /api/drivers/:id
// @access  Private
const getDriverById = asyncHandler(async (req, res) => {
    const driver = await Driver.findOne({ _id: req.params.id })

    res.status(200).send(driver)
})

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
        res.status(400)
        throw new Error('Please provide all required fields')
    }

    const driverExists = await Driver.findOne({
        firstName: { $regex: req.body.firstName, $options: 'i' },
        lastName: { $regex: req.body.lastName, $options: 'i' },
        isActive: true,
    })

    if (driverExists) {
        res.status(400)
        throw new Error(
            `An active driver named "${req.body.firstName} ${req.body.lastName}" already exists`
        )
    }

    const driver = await Driver.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        defaultTruck: req.body.defaultTruck,
        endDumpPayRate: req.body.endDumpPayRate,
        flatBedPayRate: req.body.flatBedPayRate,
        ncRate: req.body.ncRate,
        dateHired: req.body.dateHired,
        dateReleased: req.body.dateReleased,
        createdBy: req.user.id,
        updatedBy: req.user.id,
        isActive: req.body.isActive,
    })

    res.status(200).json(driver)
})

// @desc    Update driver
// @route   PUT /api/drivers/:id
// @access  Private
const updateDriver = asyncHandler(async (req, res) => {
    const driver = await Driver.findById(req.params.id)

    if (!driver) {
        res.status(400)
        throw new Error('Driver not found')
    }

    const updates = { ...req.body, updatedBy: req.user.id }

    const updatedDriver = await Driver.findByIdAndUpdate(
        req.params.id,
        updates,
        { new: true }
    )

    res.status(200).json(updatedDriver)
})

// @desc    Delete driver
// @route   DELETE /api/drivers/:id
// @access  Private
const deleteDriver = asyncHandler(async (req, res) => {
    const driver = await Driver.findById(req.params.id)

    if (!driver) {
        res.status(400)
        throw new Error('Driver not found')
    }

    driver.remove()

    res.status(200).json(driver)
})

module.exports = {
    getDrivers,
    getDriverById,
    createDriver,
    updateDriver,
    deleteDriver,
}
