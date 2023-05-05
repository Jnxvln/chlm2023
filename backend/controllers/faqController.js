const asyncHandler = require('express-async-handler')
const Faq = require('../models/faqModel')

// @desc    Get All FAQs
// @route   GET /api/faq
// @access  Private
const getFaqs = asyncHandler(async (req, res) => {
    const faqs = await Faq.find()

    res.status(200).send(faqs)
})

// @desc    Get All FAQs
// @route   GET /api/faq-active
// @access  Public
const getActiveFaqs = asyncHandler(async (req, res) => {
    const activeFaqs = await Faq.find({ isActive: true })

    res.status(200).send(activeFaqs)
})

// @desc    Get FAQ by ID
// @route   GET /api/faq/:id
// @access  Public
const getFaqById = asyncHandler(async (req, res) => {
    const faq = await Faq.findOne({ _id: req.params.id })

    res.status(200).send(faq)
})

// @desc    Create FAQ
// @route   POST /api/faq
// @access  Private
const createFaq = asyncHandler(async (req, res) => {
    if (!req.body.question || !req.body.answer) {
        res.status(400)
        throw new Error('Question and Answer fields are required')
    }

    const faqExists = await Faq.findOne({
        question: { $regex: req.body.question, $options: 'i' },
        answer: { $regex: req.body.answer, $options: 'i' },
        isActive: true,
    })

    if (faqExists) {
        res.status(400)
        throw new Error(
            `A matching active FAQ already exists: ["${req.body.question} ${req.body.answer}"]`
        )
    }

    // const faq = await Faq.create({
    //     question: req.body.question,
    //     answer: req.body.answer,
    //     categories: req.body.categories,
    //     isActive: req.body.isActive,
    //     createdBy: req.user.id,
    //     updatedBy: req.user.id,
    // })
    const faq = await Faq.create(req.body)

    res.status(200).json(faq)
})

// @desc    Update FAQ
// @route   PUT /api/faq/:id
// @access  Private
const updateFaq = asyncHandler(async (req, res) => {
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

// @desc    Delete FAQ
// @route   DELETE /api/faq/:id
// @access  Private
const deleteFaq = asyncHandler(async (req, res) => {
    const faq = await Faq.findById(req.params.id)

    if (!faq) {
        res.status(400)
        throw new Error('FAQ not found')
    }

    faq.remove()

    res.status(200).json(faq)
})

module.exports = {
    getFaqs,
    getActiveFaqs,
    getFaqById,
    createFaq,
    updateFaq,
    deleteFaq,
}
