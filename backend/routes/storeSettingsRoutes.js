// ROUTER /api/settings/store

const {
    getStoreSettings,
    createStoreSettings,
    updateStoreSettings,
    deleteStoreSettings,
} = require('../controllers/storeSettingsController')
const { protect } = require('../middleware/authMiddleware')

const express = require('express')
const router = express.Router()

// ROUTE HANDLERS
router
    .route('/')
    .get(protect, getStoreSettings)
    .post(protect, createStoreSettings)
router
    .route('/:id')
    .delete(protect, deleteStoreSettings)
    .put(protect, updateStoreSettings)

module.exports = router
