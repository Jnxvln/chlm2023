// ROUTER /api/vendor-products

const {
    getVendorProducts,
    getVendorProductsByVendorId,
    createVendorProduct,
    updateVendorProduct,
    deleteVendorProduct,
} = require('../controllers/vendorProductController')
const { protect } = require('../middleware/authMiddleware')
const express = require('express')
const router = express.Router()

// API URL:  /api/vendor-products

// ROUTE HANDLERS
router
    .route('/')
    .get(protect, getVendorProducts)
    .post(protect, createVendorProduct)
router.route('/vendor/:vendorId').get(protect, getVendorProductsByVendorId)
router
    .route('/:id')
    .delete(protect, deleteVendorProduct)
    .put(protect, updateVendorProduct)

module.exports = router
