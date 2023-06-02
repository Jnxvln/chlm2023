// ROUTER /api/usermessages

const {
    getUserMessages,
    getUserMessagesByUserId,
    createUserMessage,
    updateUserMessage,
    deleteUserMessage,
} = require('../controllers/userMessageController')
const { protect } = require('../middleware/authMiddleware')

const express = require('express')
const router = express.Router()

// ROUTE HANDLERS
router.route('/').get(protect, getUserMessages).post(protect, createUserMessage)

router.route('/user/:userId').get(protect, getUserMessagesByUserId)

router
    .route('/:messageId')
    .put(protect, updateUserMessage)
    .delete(protect, deleteUserMessage)

module.exports = router
