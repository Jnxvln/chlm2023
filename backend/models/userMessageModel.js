const mongoose = require('mongoose')

const userMessageSchema = mongoose.Schema(
   {
      recipientId: {
         type: mongoose.Schema.Types.ObjectId,
         required: [true, 'A recipient user is required'],
         ref: 'User',
      },
      senderId: {
         type: mongoose.Schema.Types.ObjectId,
         required: [true, 'A sender user is required'],
         ref: 'User',
      },
      title: {
         type: String,
         required: false,
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
      recipientDeleted: {
         type: Boolean,
         required: false,
         default: false,
      },
      senderDeleted: {
         type: Boolean,
         required: false,
         default: false,
      },
      messageViewed: {
         type: Boolean,
         required: false,
         default: false,
      },
   },
   {
      timestamps: true,
   }
)

module.exports = mongoose.model('UserMessage', userMessageSchema)
