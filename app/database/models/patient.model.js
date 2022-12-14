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
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    phoneNumber: {
      type: String,
      required: true,
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
    appointmentType: {
      type: String,
      default: "none",
      trim: true,
      lowercase: true,
      enum: ["check up", "consultation", "none"],
    },
    allChecks: [
      {
        treatments: [
          {
            type: { type: String },
            treatment: { type: String },
            period: { type: String },
            noOfTakes: { type: String },
            note: { type: String, default: "", trim: true },
          },
        ],
        note: { type: String, default: "", trim: true },
        diagnosis: { type: String },
        date: {
          type: String,
          default: `${new Date().toLocaleDateString("en-EG", {
            timeZone: "Africa/Cairo",
          })}`,
        },
      },
    ],
    visualAcuity: {
      //ipd
      far: { type: String, default: "........" },
      near: { type: String, default: "........" },
      //bcva
      rbcva: { type: String, default: "........" },
      lbcva: { type: String, default: "........" },
      //right //
      rdsph: { type: String, default: "........" },
      rdcyl: { type: String, default: "........" },
      rdaxis: { type: String, default: "........" },
      //right // r
      rrsph: { type: String, default: "........" },
      rrcyl: { type: String, default: "........" },
      rraxis: { type: String, default: "........" },
      //left // d
      ldsph: { type: String, default: "........" },
      ldcyl: { type: String, default: "........" },
      ldaxis: { type: String, default: "........" },
      //left // r
      lrsph: { type: String, default: "........" },
      lrcyl: { type: String, default: "........" },
      lraxis: { type: String, default: "........" },
      note: { type: String, default: "", trim: true },
    },
    mediaclHistory: { type: String }, // without print
    //mediaclHistory: {},// Diagnosis //disases
    date: {
      type: String,
      default: `${new Date().toLocaleDateString("en-EG", {
        timeZone: "Africa/Cairo",
      })}`,
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
  const token = jwt.sign({ _id: user._id }, process.env.JWTKEY, {
    expiresIn: process.env.JWT_EXPIRE,
  });
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
