const mongoose = require("mongoose");

const drugSchema = mongoose.Schema(
  {
    type: {
      type: String,
      trim: true,
      enum: ["drops", "ointment", "tablets", "syringe"],
      lowercase: true,
    },
    name: {
      type: String,
      lowercase: true,
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
