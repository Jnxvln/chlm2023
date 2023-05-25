const asyncHandler = require('express-async-handler')
const StoreSettings = require('../models/storeSettingsModel')

// @desc    Get all site messages
// @route   GET /api/settings/messages
// @access  Private
const getSiteMessages = asyncHandler(async (req, res) => {
    const storeSettings = await StoreSettings.find()

    if (!storeSettings) {
        res.status(400).json({
            error: 'Store settings could not be fetched inside site messages controller',
        })
    }

    if (!storeSettings.siteMessages || storeSettings.siteMessages.length <= 0) {
        res.status(400).json({
            error: 'Cannot retrieve site messages',
        })
    }

    const messages = storeSettings.siteMessages
    res.status(200).send(messages)
})

// @desc    Create site message
// @route   POST /api/settings/messages
// @access  Private
const createSiteMessage = asyncHandler(async (req, res) => {
    if (!req.body.message) {
        res.status(400)
        throw new Error('Question and Answer fields are required')
    }

    if (!req.body.dateStart) {
        res.status(400)
        throw new Error('Start date is required')
    }

    if (!req.body.page) {
        res.status(400)
        throw new Error('Page to display on is required')
    }

    if (!req.user) {
        res.status(400)
        throw new Error('A user is required to create a site message')
    }

    let _settings = await StoreSettings.find()
    // let _existingMessages = _settings.data.siteMessages

    console.log(
        '[SiteMessagesController createSiteMessage] Existing settings: '
    )
    console.log(_settings)

    // const faq = await Faq.create(req.body)

    res.status(200).json({ message: 'Test' })
})

// @desc    Update site message
// @route   PUT /api/settings/messages/:id
// @access  Private
const updateSiteMessage = asyncHandler(async (req, res) => {
    const faq = await Faq.findById(req.params.id)

    if (!faq) {
        res.status(400)
        throw new Error('FAQ not found')
    }

    const updates = { ...req.body, updatedBy: req.user.id }

    const updatedFaq = await Faq.findByIdAndUpdate(req.params.id, updates, {
        new: true,
    })

    res.status(200).json(updatedFaq)
})

// @desc    Delete site message
// @route   DELETE /api/settings/messages/:id
// @access  Private
const deleteSiteMessage = asyncHandler(async (req, res) => {
    const faq = await Faq.findById(req.params.id)

    if (!faq) {
        res.status(400)
        throw new Error('FAQ not found')
    }

    faq.remove()

    res.status(200).json(faq)
})

module.exports = {
    getSiteMessages,
    createSiteMessage,
    updateSiteMessage,
    deleteSiteMessage,
}
