const mongoose = require("mongoose");

const materialSchema = mongoose.Schema(
  {
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
