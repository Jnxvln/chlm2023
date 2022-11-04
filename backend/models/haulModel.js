const mongoose = require("mongoose");

const haulSchema = mongoose.Schema(
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
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "A driver is required"],
      ref: "Driver",
    },
    dateHaul: {
      type: Date,
      required: [true, "Haul date is required"],
    },
    timeHaul: {
      type: Date,
      required: [true, "Time of haul is required"],
    },
    truck: {
      type: String,
      required: false,
    },
    broker: {
      type: String,
      required: false,
    },
    chInvoice: {
      type: String,
      required: false,
    },
    loadType: {
      type: String,
      required: [true, "Load type is required"],
    },
    invoice: {
      type: String,
      required: [true, "Invoice field is required"],
    },
    from: {
      type: String,
      required: [true, "The `from` field is required"],
    },
    vendorLocation: {
      type: String,
      required: [true, "The `vendor location` field is required"],
    },
    to: {
      type: String,
      required: [true, "The `to` field is required"],
    },
    product: {
      type: String,
      required: [true, "The `product` field is required"],
    },
    tons: {
      type: Number,
      required: false,
    },
    rate: {
      type: Number,
      required: false,
    },
    miles: {
      type: Number,
      reuqired: false,
    },
    payRate: {
      type: Number,
      required: false,
    },
    driverPay: {
      type: Number,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Haul", haulSchema);
