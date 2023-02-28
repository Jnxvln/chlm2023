const asyncHandler = require('express-async-handler')
const Delivery = require('../models/deliveryModel')
const formatCoords = require('../utils/formatCoords')

// @desc    Get deliveries
// @route   GET /api/deliveries
// @access  Private
const getDeliveries = asyncHandler(async (req, res) => {
    const deliveries = await Delivery.find()

    res.status(200).send(deliveries)
})

// @desc    Create delivery
// @route   POST /api/deliveries
// @access  Private
const createDelivery = asyncHandler(async (req, res) => {
    // #region Error checks
    if (!req.body.deliveryClient) {
        res.status(400)
        throw new Error('A delivery client is required')
    }

    if (!req.body.deliveryDate) {
        res.status(400)
        throw new Error('Delivery date is required')
    }

    if (!req.body.contactPhone) {
        res.status(400)
        throw new Error('Contact phone is required')
    }

    if (!req.body.productName) {
        res.status(400)
        throw new Error('Product name is required')
    }

    if (!req.body.productQuantity) {
        res.status(400)
        throw new Error('Product quantity is required')
    }
    //   #endregion

    // Check if coordinates are numbers, truncate to 6 digits if so}
    const coords = formatCoords(req.body.coordinates)

    const delivery = await Delivery.create({
        createdBy: req.user.id,
        updatedBy: req.user.id,
        deliveryClient: req.body.deliveryClient,
        deliveryDate: req.body.deliveryDate,
        contactPhone: req.body.contactPhone,
        address: req.body.address,
        coordinates: coords,
        productName: req.body.productName,
        productQuantity: req.body.productQuantity,
        notes: req.body.notes,
        directions: req.body.directions,
        hasPaid: req.body.hasPaid,
        directionsReminder: req.body.directionsReminder,
        completed: req.body.completed,
    })

    res.status(200).json(delivery)
})

// @desc    Update delivery
// @route   PUT /api/deliveries/:id
// @access  Private
const updateDelivery = asyncHandler(async (req, res) => {
    const delivery = await Delivery.findById(req.params.id)

    if (!delivery) {
        res.status(400)
        throw new Error('Delivery not found')
    }

    // Check if coordinates are numbers, truncate to 6 digits if so}
    const coords = formatCoords(req.body.coordinates)

    const updatedDelivery = await Delivery.findByIdAndUpdate(
        req.params.id,
        {
            updatedBy: req.user.id,
            deliveryClient: req.body.deliveryClient,
            deliveryDate: req.body.deliveryDate,
            contactPhone: req.body.contactPhone,
            address: req.body.address,
            coordinates: coords,
            productName: req.body.productName,
            productQuantity: req.body.productQuantity,
            notes: req.body.notes,
            directions: req.body.directions,
            hasPaid: req.body.hasPaid,
            directionsReminder: req.body.directionsReminder,
            completed: req.body.completed,
        },
        { new: true }
    )

    res.status(200).json(updatedDelivery)
})

// @desc    Delete delivery
// @route   DELETE /api/deliveries/:id
// @access  Private
const deleteDelivery = asyncHandler(async (req, res) => {
    const delivery = await Delivery.findById(req.params.id)

    if (!delivery) {
        res.status(400)
        throw new Error('Delivery not found')
    }

    delivery.remove()

    res.status(200).json({ id: req.params.id })
})

module.exports = {
    getDeliveries,
    createDelivery,
    updateDelivery,
    deleteDelivery,
}
