const mongoose = require('mongoose')

const faqSchema = mongoose.Schema(
    {
        question: {
            type: String,
            required: [true, 'A question is required'],
        },
        answer: {
            type: String,
            required: [true, 'An answer is required'],
        },
        categories: {
            type: [String],
            required: false,
        },
        urls: {
            text: String,
            url: String,
            isExternal: Boolean,
        },
        isActive: {
            type: Boolean,
            required: false,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, 'A user is required'],
            ref: 'User',
        },
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, 'A user is required'],
            ref: 'User',
        },
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('faq', faqSchema)
