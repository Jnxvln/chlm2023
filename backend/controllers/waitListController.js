const asyncHandler = require('express-async-handler')
const WaitList = require('../models/waitListModel')

// @desc    Get entries
// @route   GET /api/waitlist
// @access  Private
const getEntries = asyncHandler(async (req, res) => {
    const entries = await WaitList.find()

    res.status(200).send(entries)
})

// @desc    Get entry by ID
// @route   GET /api/waitlist/:id
// @access  Private
const getEntryById = asyncHandler(async (req, res) => {
    const entry = await WaitList.findOne({ _id: req.params.id })

    res.status(200).send(entry)
})

// @desc    Create entry
// @route   POST /api/waitlist
// @access  Private
const createEntry = asyncHandler(async (req, res) => {
    if (
        !req.body.phone ||
        !req.body.material ||
        !req.body.quantity ||
        !req.body.status
    ) {
        res.status(400)
        throw new Error(
            'Please provide all required fields (phone, material, quantity, status)'
        )
    }

    const entryExists = await WaitList.findOne({
        phone: { $regex: req.body.phone, $options: 'i' },
        material: { $regex: req.body.material, $options: 'i' },
    })

    if (entryExists) {
        res.status(400)
        throw new Error(
            `Entry for "${req.body.firstName} ${req.body.lastName}, ${req.body.quantity} ${req.body.material}" already exists`
        )
    }

    const entry = await WaitList.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phone: req.body.phone,
        email: req.body.email,
        material: req.body.material,
        quantity: req.body.quantity,
        status: req.body.status,
        notes: req.body.notes,
        reminder: req.body.reminder,
    })

    res.status(200).json(entry)
})

// @desc    Update entry
// @route   PUT /api/waitlist/:id
// @access  Private
const updateEntry = asyncHandler(async (req, res) => {
    console.log('[SERVER waitListController] req.body: ')
    console.log(req.body)

    const entry = await WaitList.findById(req.params.id)

    console.log('[SERVER waitListController updateEntry] entry found: ')
    console.log(entry)

    if (!entry) {
        console.log('ERROR: Cannot find waitlist entry')
        res.status(400)
        throw new Error('Waitlist entry not found')
    }

    const updates = { ...req.body, updatedBy: req.user.id }

    const updatedEntry = await WaitList.findByIdAndUpdate(
        req.params.id,
        updates,
        { new: true }
    )

    console.log('[SERVER waitListController updateEntry] updated entry: ')
    console.log(updateEntry)

    res.status(200).json(updatedEntry)
})

// @desc    Delete entry
// @route   DELETE /api/waitlist/:id
// @access  Private
const deleteEntry = asyncHandler(async (req, res) => {
    const entry = await WaitList.findById(req.params.id)

    if (!entry) {
        res.status(400)
        throw new Error('Waitlist entry not found')
    }

    entry.remove()

    res.status(200).json(entry)
})

module.exports = {
    getEntries,
    getEntryById,
    createEntry,
    updateEntry,
    deleteEntry,
}
