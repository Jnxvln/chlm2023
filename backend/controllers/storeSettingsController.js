const asyncHandler = require('express-async-handler')
const StoreSettings = require('../models/storeSettingsModel')

// @desc    Get store settings
// @route   GET /api/settings/store
// @access  Private
const getStoreSettings = asyncHandler(async (req, res) => {
    // const storeSettings = await StoreSettings.find()
    const storeSettings = await StoreSettings.findOne()

    res.status(200).send(storeSettings)
})

// @desc    Create store settings
// @route   POST /api/settings/store
// @access  Private
const createStoreSettings = asyncHandler(async (req, res) => {
    const storeSettings = await StoreSettings.create(req.body)

    res.status(200).json(storeSettings)
})

// @desc    Update store settings
// @route   PUT /api/settings/store/:id
// @access  Private
const updateStoreSettings = asyncHandler(async (req, res) => {
    const storeSettings = await StoreSettings.findById(req.params.id)

    if (!storeSettings) {
        res.status(400)
        throw new Error('Store Settings not found')
    }

    const updatedStoreSettings = await StoreSettings.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    )

    // console.log(
    //     '[storeSettingsController updateStoreSettings] updated settings: '
    // )
    // console.log(updatedStoreSettings)

    res.status(200).json(updatedStoreSettings)
})

// @desc    Delete store settings
// @route   DELETE /api/settings/store/:id
// @access  Private
const deleteStoreSettings = asyncHandler(async (req, res) => {
    const storeSettings = await StoreSettings.findById(req.params.id)

    if (!storeSettings) {
        res.status(400)
        throw new Error('Store settings not found')
    }

    storeSettings.remove()

    res.status(200).json(storeSettings)
})

module.exports = {
    getStoreSettings,
    createStoreSettings,
    updateStoreSettings,
    deleteStoreSettings,
}
