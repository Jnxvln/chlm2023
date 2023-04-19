// ROUTER /api/waitlist

const {
    getEntries,
    getEntryById,
    createEntry,
    updateEntry,
    deleteEntry,
} = require('../controllers/waitListController')
const { protect } = require('../middleware/authMiddleware')

const express = require('express')
const router = express.Router()

// ROUTE HANDLERS
router.route('/').get(protect, getEntries).post(protect, createEntry)
router
    .route('/:id')
    .get(protect, getEntryById)
    .delete(protect, deleteEntry)
    .put(protect, updateEntry)

module.exports = router
