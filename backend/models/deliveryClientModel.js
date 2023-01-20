const mongoose = require('mongoose')

const deliveryClientSchema = mongoose.Schema(
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
            required: false,
        },
        companyName: {
            type: String,
            required: false,
        },
        address: {
            type: String,
            required: false,
        },
        coordinates: {
            type: String,
            required: false,
        },
        directions: {
            type: String,
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

module.exports = mongoose.model('DeliveryClient', deliveryClientSchema)
