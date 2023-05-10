const mongoose = require('mongoose')

const storeSettingsSchema = mongoose.Schema(
    {
        siteMessages: [
            {
                message: {
                    type: String,
                    required: [true, 'A message is required'],
                },
                dateStart: {
                    type: String,
                    required: [true, 'A start date is required'],
                },
                dateEnd: {
                    type: String,
                    required: false,
                },
                page: {
                    type: String,
                    required: [true, 'Page to display on is required'],
                },
                createdBy: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                    required: [true, 'A user is required'],
                },
                updatedBy: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                    required: false,
                },
                isActive: {
                    type: Boolean,
                    required: false,
                },
            },
        ],

        operatingHours: {
            monFri: {
                hours: {
                    type: String,
                    required: [true, 'Mon-Fri hours required'],
                },
                updatedBy: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                    required: false,
                },
            },
            saturday: {
                hours: {
                    type: String,
                    required: [true, 'Saturday hours required'],
                },
                updatedBy: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                    required: false,
                },
            },
            sunday: {
                hours: {
                    type: String,
                    required: [true, 'Sunday hours required'],
                },
                updatedBy: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                    required: false,
                },
            },
        },

        storeOpen: {
            status: {
                type: Boolean,
                required: false,
            },
            updatedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: false,
            },
        },
    },
    { timestamps: true }
)

module.exports = mongoose.model('StoreSettings', storeSettingsSchema)
