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
            type: String,
            default: `${new Date()
              .toISOString()
              .replace(/T/, " ")
              .replace(/\..+/, "")}`,
          },
        },
      },
    ],
    visualAcuity: {
      right: {
        d: {
          sph: { type: String, default: "none" },
          cyl: { type: String, default: "none" },
          axis: { type: String, default: "none" },
        },
        r: {
          sph: { type: String, default: "none" },
          cyl: { type: String, default: "none" },
          axis: { type: String, default: "none" },
        },
      },
      left: {
        d: {
          sph: { type: String, default: "none" },
          cyl: { type: String, default: "none" },
          axis: { type: String, default: "none" },
        },
        r: {
          sph: { type: String, default: "none" },
          cyl: { type: String, default: "none" },
          axis: { type: String, default: "none" },
        },
      },
    },

    //mediaclHistory: {},
    date: {
      type: String,
      default: `${new Date()
        .toISOString()
        .replace(/T/, " ")
        .replace(/\..+/, "")}`,
    },
    waiting: {
      type: Boolean,
      default: false,
    },
    waitingTime: {
      type: String,
      default: "",
    },
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
patientSchema.statics.checkDate = async () => {
  const patientData = await Patient.find();

  let d = patientData.filter((patient) =>
    patient.date.includes(
      "2022-09-25"
      //`${new Date().toISOString().replace(/T/, " ").replace(/\..+/, "")}`
    )
  );
  console.log(d);
  if (!d) throw new Error("no patients");
  return d;
};
const Patient = mongoose.model("Patient", patientSchema);
module.exports = Patient;
