const mongoose = require("mongoose");

const drugSchema = mongoose.Schema(
  {
    type: {
      type: String,
      trim: true,
      enum: [
        "drops",
        "ointment",
        "tablets",
        "vial",
        "ampule",
        "sdu",
        "capsule",
      ],
      lowercase: true,
    },
    name: {
      type: String,
      lowercase: true,
      trim: true,
    },
  },
  { timestamps: true }
);

drugSchema.methods.toJSON = function () {
  const deleted = ["password", "__v"];
  const data = this.toObject();
  deleted.forEach((d) => delete data[d]);
  return data;
};

const Drug = mongoose.model("Drug", drugSchema);
module.exports = Drug;
