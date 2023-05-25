const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')

// @desc    Get users
// @route   GET /api/users
// @access  Private
const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}, '-password')

    res.status(200).json(users)
})

// @desc    Get user data
// @route   GET /api/users/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
    res.status(200).json(req.user)
})

// @desc    Register user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, role, password } = req.body

    if (!firstName) {
        res.status(400)
        throw new Error('First name is required')
    }

    if (!lastName) {
        res.status(400)
        throw new Error('Last name is required')
    }

    if (!email) {
        res.status(400)
        throw new Error('Email is required')
    }

    if (!password) {
        res.status(400)
        throw new Error('Password is required')
    }

    // Check if exists
    const userExists = await User.findOne({
        email: { $regex: req.body.email, $options: 'i' },
    })

    if (userExists) {
        res.status(400)
        throw new Error('User already exists')
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create user
    const user = await User.create({
        firstName,
        lastName,
        email,
        role: role ? role : 'user',
        password: hashedPassword,
    })

    if (user) {
        res.status(201).json({
            _id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        })
    } else {
        res.status(400)
        throw new Error('Invalid user data')
    }
})

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    // Check for user email
    const user = await User.findOne({
        email: { $regex: req.body.email, $options: 'i' },
    })

    if (user && (await bcrypt.compare(password, user.password))) {
        res.json({
            _id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        })
    } else {
        res.status(400)
        throw new Error('Invalid credentials')
    }
})

// @desc        Update a user
// @route       POST /api/users/:id
// @access      Protected
const updateUser = asyncHandler(async (req, res) => {
    const { firstName, lastName, email } = req.body

    // #region Error Checks
    if (!firstName) {
        res.status(400)
        throw new Error('First name is required')
    }

    if (!lastName) {
        res.status(400)
        throw new Error('Last name is required')
    }

    if (!email) {
        res.status(400)
        throw new Error('E-mail is required')
    }
    // #endregion

    // Check for user
    const user = await User.findById(req.params.id)

    // console.log('[userController.js updateUser()] user found: ')
    // console.log(user)

    if (!user) {
        res.status(400)
        throw new Error('User not found')
    }

    const userData = { firstName, lastName, email, updatedBy: req.user.id }

    // console.log('[userController updateUser()] userData: ')
    // console.log(userData)

    const updatedUser = await User.findByIdAndUpdate(req.params.id, userData, {
        new: true,
    }).select('-password')

    // console.log('[userController.js updateUser] updatedUser: ')
    // console.log(updatedUser)

    res.status(200).json(updatedUser)
})

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    })
}

module.exports = {
    getUsers,
    getMe,
    registerUser,
    loginUser,
    updateUser,
}
