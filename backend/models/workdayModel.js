const mongoose = require('mongoose')

const workdaySchema = mongoose.Schema(
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
        date: {
            type: Date,
            required: [true, 'The workday date is required'],
        },
        driverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Driver',
            required: [true, 'A driver is required'],
        },
        haulIds: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'Haul',
            required: false,
        },
        chhours: {
            type: Number,
            required: false,
        },
        nchours: {
            type: Number,
            required: false,
        },
        ncReasons: {
            type: String,
            required: false,
        },
        notes: {
            type: String,
            required: false,
        },
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('Workday', workdaySchema)
