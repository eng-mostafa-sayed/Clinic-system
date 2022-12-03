const mongoose = require("mongoose");

const diagnosisSchema = mongoose.Schema(
  {
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

const Drug = mongoose.model("Diagnosis", diagnosisSchema);
module.exports = Drug;
