const mongoose = require("mongoose");

const vendorLocationSchema = mongoose.Schema(
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
      required: [true, "Name field required"],
    },
    isActive: {
      type: Boolean,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("VendorLocation", vendorLocationSchema);
