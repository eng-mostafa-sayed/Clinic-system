const mongoose = require("mongoose");
const patientSchema = mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Doctor",
    },
    name: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      default: 0,
      min: 1,
      max: 100,
    },
    fileNo: {
      type: Number,
      required: true,
      trim: true,
      unique: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    gender: {
      type: String,
      required: true,
      trim: true,
      enum: ["male", "female"],
      lowercase: true,
    },
    status: {
      // to determine of he make it from web true=online appointment, no=offline appointment
      type: Boolean,
      default: false,
    },
    allChecks: [
      {
        check: {
          treatments: [
            {
              treatment: { type: String },
              period: { type: String },
              noOfTakes: { type: String },
              notes: { type: String },
            },
          ],
          date: {
            type: Date,
            default: Date.Now,
          },
        },
      },
    ],
    visualAcuity: { type: String },
    //mediaclHistory: {},
  },
  { timestamps: true }
);

patientSchema.methods.toJSON = function () {
  const deleted = ["password", "__v"];
  const data = this.toObject();
  deleted.forEach((d) => delete data[d]);
  return data;
};
patientSchema.pre("save", async function (next) {
  if (this.isModified("password"))
    this.password = await bcrypt.hash(this.password, 12);
  next();
});
patientSchema.methods.generateToken = async function () {
  const user = this;
  // if(user.tokens>3)
  const token = jwt.sign({ _id: user._id }, process.env.JWTKEY);
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};
const Patient = mongoose.model("Patient", patientSchema);
module.exports = Patient;
