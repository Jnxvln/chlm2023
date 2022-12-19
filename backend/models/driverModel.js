const mongoose = require('mongoose')

const driverSchema = mongoose.Schema(
    {
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
        firstName: {
            type: String,
            required: [true, 'First name field required'],
        },
        lastName: {
            type: String,
            required: [true, 'Last name field required'],
        },
        endDumpPayRate: {
            type: String,
            required: [true, 'End dump pay rate required'],
        },
        flatBedPayRate: {
            type: String,
            required: [true, 'Flat bed pay rate required'],
        },
        ncRate: {
            type: String,
            required: [true, 'NC rate required'],
        },
        defaultTruck: {
            type: String,
            required: false,
        },
        dateHired: {
            type: String,
            required: false,
        },
        dateReleased: {
            type: String,
            required: false,
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

module.exports = mongoose.model('Driver', driverSchema)
