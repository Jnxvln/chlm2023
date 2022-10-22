const mongoose = require("mongoose");

const vendorSchema = mongoose.Schema(
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
    name: {
      type: String,
      required: [true, "Name field required"],
    },
    shortName: {
      type: String,
      required: [true, "Short name field required"],
    },
    chtFuelSurcharge: {
      type: String,
      required: false,
    },
    vendorFuelSurcharge: {
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
);

module.exports = mongoose.model("Vendor", vendorSchema);
