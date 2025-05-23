const asyncHandler = require('express-async-handler')
const DeliveryClient = require('../models/deliveryClientModel')
const Delivery = require('../models/deliveryModel')
const formatCoords = require('../utils/formatCoords')

// @desc    Get delivery clients
// @route   GET /api/deliveries/clients
// @access  Private
const getDeliveryClients = asyncHandler(async (req, res) => {
    const deliveryClients = await DeliveryClient.find()

    res.status(200).send(deliveryClients)
})

// @desc    Get delivery client by ID
// @route   GET /api/deliveries/clients/:id
// @access  Private
const getDeliveryClientById = asyncHandler(async (req, res) => {
    const deliveryClient = await DeliveryClient.findOne({ _id: req.params.id })

    res.status(200).send(deliveryClient)
})

// @desc    Create delivery client
// @route   POST /api/deliveries/clients
// @access  Private
const createDeliveryClient = asyncHandler(async (req, res) => {
    const clientExists = await DeliveryClient.findOne({
        firstName: { $regex: req.body.firstName, $options: 'i' },
        lastName: { $regex: req.body.lastName, $options: 'i' },
        phone: req.body.phone,
    })

    if (clientExists) {
        res.status(400)
        throw new Error(
            `Client "${req.body.firstName} ${req.body.lastName}" with phone "${req.body.phone}" already exists`
        )
    }

    // Check if coordinates are numbers, truncate to 6 digits if so}
    const coords = formatCoords(req.body.coordinates)

    const deliveryClient = await DeliveryClient.create({
        createdBy: req.user.id,
        updatedBy: req.user.id,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phone: req.body.phone,
        companyName: req.body.companyName,
        address: req.body.address,
        coordinates: coords,
        directions: req.body.directions,
    })

    res.status(200).json(deliveryClient)
})

// @desc    Update delivery client
// @route   PUT /api/deliveries/clients/:id
// @access  Private
const updateDeliveryClient = asyncHandler(async (req, res) => {
    const deliveryClient = await DeliveryClient.findById(req.params.id)

    if (!deliveryClient) {
        res.status(400)
        throw new Error('Delivery client not found')
    }

    // Check if coordinates are numbers, truncate to 6 digits if so}
    const coords = formatCoords(req.body.coordinates)

    const updatedDeliveryClient = await DeliveryClient.findByIdAndUpdate(
        req.params.id,
        {
            updatedBy: req.user.id,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            phone: req.body.phone,
            companyName: req.body.companyName,
            address: req.body.address,
            coordinates: coords,
            directions: req.body.directions,
        },
        { new: true }
    )

    res.status(200).json(updatedDeliveryClient)
})

// @desc    Delete delivery client
// @route   DELETE /api/deliveries/clients/:id
// @access  Private
const deleteDeliveryClient = asyncHandler(async (req, res) => {
    const deliveryClient = await DeliveryClient.findById(req.params.id)

    if (!deliveryClient) {
        res.status(400)
        throw new Error('Delivery client not found')
    }

    // Delete all deliveries associated with this client
    try {
        await Delivery.deleteMany({ deliveryClient: req.params.id })
    } catch (error) {
        console.error(
            "An error occurred while trying to delete all of delivery client's deliveries: "
        )
        console.error(error.message)
        res.status(400).json({
            error: "An error occurred while trying to delete all of delivery client's deliveries",
        })
    }

    // Now attempt to remove the delivery client itself:
    try {
        await deliveryClient.remove()
        res.status(200).json({ id: req.params.id })
    } catch (error) {
        console.error(
            'An error occurred while trying to delete delivery client'
        )
        res.status(400).json({
            error: 'An error occurred while trying to delete delivery client',
        })
    }
})

module.exports = {
    getDeliveryClients,
    getDeliveryClientById,
    createDeliveryClient,
    updateDeliveryClient,
    deleteDeliveryClient,
}
