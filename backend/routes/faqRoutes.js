// ROUTER /api/faq

const {
    getFaqs,
    getFaqById,
    createFaq,
    updateFaq,
    deleteFaq,
} = require('../controllers/faqController')
const { protect } = require('../middleware/authMiddleware')

const express = require('express')
const router = express.Router()

// ROUTE HANDLERS
router.route('/').get(protect, getFaqs).post(protect, createFaq)
router
    .route('/:id')
    .get(getFaqById)
    .delete(protect, deleteFaq)
    .put(protect, updateFaq)

module.exports = router
