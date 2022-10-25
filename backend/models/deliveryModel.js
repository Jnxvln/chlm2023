const mongoose = require("mongoose");

const deliverySchema = mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "A user is required"],
      ref: "User",
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "A user is required"],
      ref: "User",
    },
    deliveryClient: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "A delivery client is required"],
      ref: "DeliveryClient",
    },
    deliveryDate: {
      type: String,
      required: [true, "Delivery date is required"],
    },
    contactPhone: {
      type: String,
      required: [true, "A contact phone is required"],
    },
    address: {
      type: String,
      required: false,
    },
    coordinates: {
      type: String,
      required: false,
    },
    productName: {
      type: String,
      required: [true, "A product name is required"],
    },
    productQuantity: {
      type: String,
      required: [true, "A product quantity is required"],
    },
    notes: {
      type: String,
      required: false,
    },
    directions: {
      type: String,
      required: false,
    },
    hasPaid: {
      type: Boolean,
      required: false,
    },
    directionsReminder: {
      type: Boolean,
      required: false,
    },
    completed: {
      type: Boolean,
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Delivery", deliverySchema);
