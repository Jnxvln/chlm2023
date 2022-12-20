const asyncHandler = require('express-async-handler')
const BulletinArticle = require('../models/bulletinArticle')

// @desc    Get bulletin articles
// @route   GET /api/bulletin/articles
// @access  Public
const getBulletinArticles = asyncHandler(async (req, res) => {
    const articles = await BulletinArticle.find()

    res.status(200).send(articles)
})

// @desc    Get bulletin article by ID
// @route   GET /api/bulletin/articles/:id
// @access  Public
const getBulletinArticleById = asyncHandler(async (req, res) => {
    const article = await BulletinArticle.findOne({ _id: req.params.id })

    res.status(200).send(article)
})

// @desc    Create bulletin article
// @route   POST /api/bulletin/articles
// @access  Private
const createBulletinArticle = asyncHandler(async (req, res) => {
    if (!req.body.title) {
        res.status(400)
        throw new Error('Bulletin article title is required')
    }

    if (!req.body.content) {
        res.status(400)
        throw new Error('Bulletin article content is required')
    }

    const article = await BulletinArticle.create({
        title: req.body.title,
        posted: req.body.posted,
        content: req.body.content,
        showDate: req.body.showDate,
        showTime: req.body.showTime,
        createdBy: req.user.id,
        updatedBy: req.user.id,
    })

    res.status(200).json(article)
})

// @desc    Update bulletin article
// @route   PUT /api/bulletin/articles/:id
// @access  Private
const updateBulletinArticle = asyncHandler(async (req, res) => {
    const article = await BulletinArticle.findById(req.params.id)

    if (!article) {
        res.status(400)
        throw new Error('Bulletin article not found')
    }

    let updates = { ...req.body, updatedBy: req.user.id }

    const updatedArticle = await BulletinArticle.findByIdAndUpdate(
        req.params.id,
        updates,
        { new: true }
    )

    res.status(200).json(updatedArticle)
})

// @desc    Delete bulletin article
// @route   DELETE /api/bulletin/articles/:id
// @access  Private
const deleteBulletinArticle = asyncHandler(async (req, res) => {
    const article = await BulletinArticle.findById(req.params.id)

    if (!article) {
        res.status(400)
        throw new Error('Bulletin article not found')
    }

    article.remove()

    res.status(200).json(article)
})

module.exports = {
    getBulletinArticles,
    getBulletinArticleById,
    createBulletinArticle,
    updateBulletinArticle,
    deleteBulletinArticle,
}
