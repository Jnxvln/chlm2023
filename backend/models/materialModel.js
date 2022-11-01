const mongoose = require("mongoose");

const materialSchema = mongoose.Schema(
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
    category: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Category field required"],
      ref: "MaterialCategory",
    },
    image: {
      type: String,
      required: false,
    },
    binNumber: {
      type: String,
      required: false,
    },
    size: {
      type: String,
      required: false,
    },
    stock: {
      type: String,
      enum: ["new", "in", "low", "out", "notavail"],
      default: "in",
      required: [true, "The `stock` field is required"],
    },
    notes: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    isFeatured: {
      type: Boolean,
      required: false,
    },
    isActive: {
      type: Boolean,
      required: false,
    },
    isTruckable: {
      type: Boolean,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Material", materialSchema);
