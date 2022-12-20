const mongoose = require('mongoose')

const bulletinArticleSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
        },
        posted: {
            type: String,
            required: false,
        },
        content: {
            type: String,
            required: [true, 'Content is required'],
        },
        showDate: {
            type: Boolean,
            required: false,
        },
        showTime: {
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
    { timestamps: true }
)

module.exports = mongoose.model('BulletinArticle', bulletinArticleSchema)
