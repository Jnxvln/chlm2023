const mongoose = require('mongoose')

const materialCategorySchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Category name is required'],
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
        isPublic: {
            type: Boolean,
            default: true,
            required: false,
        },
        isActive: {
            type: Boolean,
            default: true,
            required: false,
        },
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('MaterialCategory', materialCategorySchema)
