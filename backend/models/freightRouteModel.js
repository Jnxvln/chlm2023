const mongoose = require('mongoose')

const freightRouteSchema = mongoose.Schema(
    {
        vendorId: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, 'A vendor is required'],
            ref: 'Vendor',
        },
        vendorLocationId: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, 'A vendor location is required'],
            ref: 'VendorLocation',
        },
        destination: {
            type: String,
            required: [true, 'A destination is required'],
        },
        freightCost: {
            type: Number,
            required: [true, 'Freight cost is required (or enter 0)'],
        },
        notes: {
            type: String,
            required: false,
        },
        type: {
            type: String,
            enum: ['yard', 'jobsite', 'residential'],
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
        isActive: {
            type: Boolean,
            required: false,
        },
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('FreightRoute', freightRouteSchema)
