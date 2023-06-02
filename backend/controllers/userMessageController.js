const asyncHandler = require('express-async-handler')
const UserMessage = require('../models/userMessageModel')

// @desc    Get user messages
// @route   GET /api/usermessages
// @access  Private
const getUserMessages = asyncHandler(async (req, res) => {
    const userMessages = await UserMessage.find()

    res.status(200).send(userMessages)
})

// @desc    Get UserMessages by user id
// @route   GET /api/usermessages/user/:userId
// @access  Private
const getUserMessagesByUserId = asyncHandler(async (req, res) => {
    if (req.user.id !== req.params.userId) {
        res.status(403)
        throw new Error("Not authorized to view another user's messages")
    }

    const userMessages = await UserMessage.findOne({ user: req.params.userId })

    res.status(200).send(userMessages)
})

// @desc    Create user message
// @route   POST /api/usermessages
// @access  Private
const createUserMessage = asyncHandler(async (req, res) => {
    if (!req.body.recipient) {
        res.status(400)
        throw new Error('A user recipient is required')
    }

    if (!req.body.message) {
        res.status(400)
        throw new Error('Message is required')
    }

    const data = {
        ...req.body,
        createdBy: req.user.id,
    }

    const msg = await UserMessage.create(data)

    res.status(200).json(msg)
})

// @desc    Update user message
// @route   PUT /api/usermessages/:messageId
// @access  Private
const updateUserMessage = asyncHandler(async (req, res) => {
    const userMessage = await UserMessage.findById(req.params.messageId)

    if (!userMessage) {
        res.status(400)
        throw new Error('User message to update was not found')
    }

    if (!req.body.recipient) {
        res.status(400)
        throw new Error('A user recipient is required to update a user message')
    }

    if (!req.body.message) {
        res.status(400)
        throw new Error('A message is required to update a user message ')
    }

    const updates = { ...req.body, updatedBy: req.user.id }

    const updatedMessage = await UserMessage.findByIdAndUpdate(
        req.params.id,
        updates,
        { new: true }
    )

    res.status(200).json(updatedMessage)
})

// @desc    Delete user message
// @route   DELETE /api/usermessages/:messageId
// @access  Private
const deleteUserMessage = asyncHandler(async (req, res) => {
    const userMessage = await UserMessage.findById(req.params.messageId)

    if (!userMessage) {
        res.status(400)
        throw new Error('User message to delete was not found')
    }

    userMessage.remove()

    res.status(200).json(userMessage)
})

module.exports = {
    getUserMessages,
    getUserMessagesByUserId,
    createUserMessage,
    updateUserMessage,
    deleteUserMessage,
}
