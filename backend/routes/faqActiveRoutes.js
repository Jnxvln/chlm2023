// ROUTER /api/faq-active

const { getActiveFaqs } = require('../controllers/faqController')
// const { protect } = require('../middleware/authMiddleware')

const express = require('express')
const router = express.Router()

// ROUTE HANDLERS
router.route('/').get(getActiveFaqs)

module.exports = router
