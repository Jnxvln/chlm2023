const asyncHandler = require('express-async-handler')
const VendorLocation = require('../models/vendorLocationModel')

// @desc    Get vendor locations
// @route   GET /api/vendor-locations
// @access  Private
const getVendorLocations = asyncHandler(async (req, res) => {
    const vendorLocations = await VendorLocation.find()

    res.status(200).send(vendorLocations)
})

// @desc    Create vendor location
// @route   POST /api/vendor-locations
// @access  Private
const createVendorLocation = asyncHandler(async (req, res) => {
    if (!req.body.name) {
        res.status(400)
        throw new Error('Name field is required')
    }

    if (!req.body.vendorId) {
        res.status(400)
        throw new Error('A vendor is required')
    }

    const vendorLocationExists = await VendorLocation.findOne({
        name: { $regex: req.body.name, $options: 'i' },
        vendorId: req.body.vendorId,
    })

    if (vendorLocationExists) {
        res.status(400)
        throw new Error('This location already exists')
    }

    const vendorLocationData = {
        ...req.body,
        createdBy: req.user.id,
        updatedBy: req.user.id,
    }

    const vendorLocation = await VendorLocation.create(vendorLocationData)

    res.status(200).json(vendorLocation)
})

// @desc    Update vendor location
// @route   PUT /api/vendor-locations/:id
// @access  Private
const updateVendorLocation = asyncHandler(async (req, res) => {
    const vendorLocation = await VendorLocation.findById(req.params.id)

    if (!vendorLocation) {
        res.status(400)
        throw new Error('Vendor location not found')
    }

    const updates = { ...req.body, updatedBy: req.user.id }

    const updatedVendorLocation = await VendorLocation.findByIdAndUpdate(
        req.params.id,
        updates,
        {
            new: true,
        }
    )

    res.status(200).json(updatedVendorLocation)
})

// @desc    Delete vendor location
// @route   DELETE /api/vendor-locations/:id
// @access  Private
const deleteVendorLocation = asyncHandler(async (req, res) => {
    const vendorLocation = await VendorLocation.findById(req.params.id)

    if (!vendorLocation) {
        res.status(400)
        throw new Error('Vendor location not found')
    }

    vendorLocation.remove()

    res.status(200).json({ id: req.params.id })
})

module.exports = {
    getVendorLocations,
    createVendorLocation,
    updateVendorLocation,
    deleteVendorLocation,
}
