const mongoose = require("mongoose");

const materialSchema = mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "A user is required"],
      ref: "User",
    },
    text: {
      type: String,
      required: [true, "Material `text` field required"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Material", materialSchema);
