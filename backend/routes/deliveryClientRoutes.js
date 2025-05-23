// ROUTER /api/delivery-clients

const {
    getDeliveryClients,
    getDeliveryClientById,
    createDeliveryClient,
    updateDeliveryClient,
    deleteDeliveryClient,
} = require('../controllers/deliveryClientController')
const { protect } = require('../middleware/authMiddleware')

const express = require('express')
const router = express.Router()

// ROUTE HANDLERS
router
    .route('/')
    .get(protect, getDeliveryClients)
    .post(protect, createDeliveryClient)
router
    .route('/:id')
    .get(protect, getDeliveryClientById)
    .delete(protect, deleteDeliveryClient)
    .put(protect, updateDeliveryClient)

module.exports = router
