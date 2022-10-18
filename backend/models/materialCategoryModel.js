const mongoose = require("mongoose");

const materialCategorySchema = mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "A user is required"],
      ref: "User",
    },
    name: {
      type: String,
      required: [true, "Category name is required"],
    },
    isPublic: {
      type: Boolean,
      default: true,
      required: false
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("MaterialCategory", materialCategorySchema);
