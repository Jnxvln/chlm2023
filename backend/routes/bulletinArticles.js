// ROUTER /api/bulletin/articles

const {
    getBulletinArticles,
    getBulletinArticleById,
    createBulletinArticle,
    updateBulletinArticle,
    deleteBulletinArticle,
} = require('../controllers/bulletinArticleController')
const { protect } = require('../middleware/authMiddleware')

const express = require('express')
const router = express.Router()

// ROUTE HANDLERS
router.route('/').get(getBulletinArticles).post(protect, createBulletinArticle)
router
    .route('/:id')
    .get(getBulletinArticleById)
    .delete(protect, deleteBulletinArticle)
    .put(protect, updateBulletinArticle)

module.exports = router
