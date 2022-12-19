const mongoose = require('mongoose')

const driverSchema = mongoose.Schema(
    {
        firstName: {
            type: String,
            required: [true, 'First name field required'],
        },
        lastName: {
            type: String,
            required: [true, 'Last name field required'],
        },
        defaultTruck: {
            type: String,
            required: false,
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
        dateHired: {
            type: String,
            required: false,
        },
        dateReleased: {
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
