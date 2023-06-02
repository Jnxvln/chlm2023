const mongoose = require('mongoose')

const userMessageSchema = mongoose.Schema(
    {
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, 'A recipient user is required'],
            ref: 'User',
        },
        message: {
            type: String,
            required: [true, 'A message is required'],
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, 'A sender user is required'],
            ref: 'User',
        },
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            required: false,
            ref: 'User',
        },
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('UserMessage', userMessageSchema)
