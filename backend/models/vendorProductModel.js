const mongoose = require("mongoose");

const vendorProductSchema = mongoose.Schema(
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
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "A vendor is required"],
      ref: "Vendor",
    },
    name: {
      type: String,
      required: [true, "Product name is required"],
    },
    productCost: {
      type: Number,
      required: [true, "Product cost is required (or enter 0)"],
    },
    notes: {
      type: String,
      required: false,
    },
    isActive: {
      type: Boolean,
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("VendorProduct", vendorProductSchema);
