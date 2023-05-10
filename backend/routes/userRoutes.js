// ROUTER /api/users

const express = require('express')
const router = express.Router()
const {
    getUsers,
    registerUser,
    loginUser,
    getMe,
} = require('../controllers/userController')
const { protect } = require('../middleware/authMiddleware')

router.route('/').get(protect, getUsers).post(protect, registerUser)
// router.post("/", registerUser);
router.post('/login', loginUser)
router.get('/me', protect, getMe)

module.exports = router
