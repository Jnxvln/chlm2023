const mongoose = require('mongoose')

const waitListSchema = mongoose.Schema(
    {
        firstName: {
            type: String,
            required: false,
        },
        lastName: {
            type: String,
            required: false,
        },
        phone: {
            type: String,
            required: [true, 'Phone number is required'],
        },
        email: {
            type: String,
            required: false,
        },
        material: {
            type: String,
            required: [true, 'Material is required'],
        },
        quantity: {
            type: String,
            required: [true, 'A quantity is required (or N/A)'],
        },
        status: {
            type: String,
            required: [true, 'A status is required'],
        },
        notes: {
            type: String,
            required: false,
        },
        reminder: {
            type: Boolean,
            required: false,
        },
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('WaitList', waitListSchema)
