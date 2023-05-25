// ROUTER /api/users

const express = require('express')
const router = express.Router()
const {
    getUsers,
    registerUser,
    loginUser,
    updateUser,
    getMe,
} = require('../controllers/userController')
const { protect } = require('../middleware/authMiddleware')

router.route('/').get(protect, getUsers).post(protect, registerUser)

// router.post("/", registerUser);
router.post('/login', loginUser)
router.get('/me', protect, getMe)
router.route('/:id').post(protect, updateUser)

module.exports = router
