const asyncHandler = require('express-async-handler')
const UserMessage = require('../models/userMessageModel')

// @desc    Get user messages
// @route   GET /api/usermessages
// @access  Private
const getUserMessages = asyncHandler(async (req, res) => {
   const userMessages = await UserMessage.find().sort({
      createdAt: -1,
   })

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

   const userMessages = await UserMessage.find({
      recipient: req.params.userId,
   }).sort({ createdAt: -1 })

   res.status(200).send(userMessages)
})

// @desc    Create user message
// @route   POST /api/usermessages
// @access  Private
const createUserMessage = asyncHandler(async (req, res) => {
   // console.log('[userMessageController createUserMessage] REQ.BODY: ')
   // console.log(req.body)

   if (!req.body.recipientId) {
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

   if (!req.body.recipientId) {
      res.status(400)
      throw new Error('A user recipient is required to update a user message')
   }

   const updates = { ...req.body, updatedBy: req.user.id }

   const updatedMessage = await UserMessage.findByIdAndUpdate(
      req.params.messageId,
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

   // console.log('MESSAGE ID: ' + req.body.messageId)
   // console.log('USER ID: ' + req.body.userId)
   // console.log('SENDER ID: ' + userMessage.senderId)

   if (!userMessage) {
      res.status(400)
      throw new Error('User message to delete was not found')
   }

   // userMessage.remove()

   let updates

   if (req.user.id.toString() === userMessage.recipientId.toString()) {
      // console.log('RECIPIENT DELETING MESSAGE')
      updates = {
         ...req.body,
         updatedBy: req.user.id,
         recipientDeleted: true,
      }
   }

   if (req.user.id.toString() === userMessage.senderId.toString()) {
      // console.log('SENDER DELETING MESSAGE')
      updates = { ...req.body, updatedBy: req.user.id, senderDeleted: true }
   }

   const updatedMessage = await UserMessage.findByIdAndUpdate(
      req.body.messageId,
      updates,
      { new: true }
   )

   res.status(200).json(updatedMessage)
})

module.exports = {
   getUserMessages,
   getUserMessagesByUserId,
   createUserMessage,
   updateUserMessage,
   deleteUserMessage,
}
