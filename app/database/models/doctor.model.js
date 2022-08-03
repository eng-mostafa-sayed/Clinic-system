const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");

const doctorSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    type: {
      type: String,
      required: true,
      trim: true,
      enum: ["doctor", "nurse"],
      default: "doctor",
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      validate(value) {
        if (!validator.isEmail(value)) throw new Error("invalid email format");
      },
    },
    gender: {
      type: String,
      required: false,
      trim: true,
      enum: ["male", "female"],
      lowercase: true,
    },
    /// specification, certificate, proficiency
    specification: {
      type: String,
      required: function () {
        return this.type == "doctor";
      },
      trim: true,
    },
    certificates: [{ certificate: { type: String, trim: true } }],
    proficiency: {
      type: String,
      required: function () {
        return this.type == "doctor";
      },
      trim: true,
    },

    tokens: [
      {
        token: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);
doctorSchema.virtual("Patient", {
  ref: "Patient",
  localField: "_id",
  foreignField: "doctorId",
});

doctorSchema.methods.toJSON = function () {
  const deleted = ["password", "__v", "tokens"];
  const data = this.toObject();
  deleted.forEach((d) => delete data[d]);
  return data;
};
doctorSchema.pre("save", async function (next) {
  if (this.isModified("password"))
    this.password = await bcrypt.hash(
      this.password,
      Number(process.env.BCRYPTSALT)
    );
  next();
});
doctorSchema.methods.generateToken = async function () {
  const Doctor = this;
  // if(user.tokens>3)
  const token = jwt.sign({ _id: Doctor._id }, process.env.JWTKEY);
  Doctor.tokens = Doctor.tokens.concat({ token });
  await Doctor.save();
  return token;
};

doctorSchema.statics.login = async (name, password) => {
  const doctorData = await Doctor.findOne({ name });
  if (!doctorData) throw new Error("invalid name");
  const isMatched = await bcrypt.compare(password, doctorData.password);
  if (!isMatched) throw new Error("invalid password");
  return doctorData;
};
doctorSchema.statics.forgetPassword = async (email, password) => {
  const doctorData = await Doctor.findOne({ email });
  const name = doctorData.name;
  if (!doctorData) throw new Error("email not founded");
  // how to make the forget password
  const newhashedPassword = await bcrypt.hash(
    password,
    Number(process.env.BCRYPTSALT)
  );
  await Doctor.findOneAndUpdate(
    { email },
    { $set: { password: newhashedPassword, name, email } }
  );
  return doctorData;
};
const Doctor = mongoose.model("Doctor", doctorSchema);
module.exports = Doctor;
