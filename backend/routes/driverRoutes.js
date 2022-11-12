// ROUTER /api/drivers

const {
    getDrivers,
    createDriver,
    updateDriver,
    deleteDriver,
} = require('../controllers/driverController')
const { protect } = require('../middleware/authMiddleware')

const express = require('express')
const router = express.Router()

// ROUTE HANDLERS
router.route('/').get(protect, getDrivers).post(protect, createDriver)
router.route('/:id').delete(protect, deleteDriver).put(protect, updateDriver)

module.exports = router
