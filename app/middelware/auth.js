require("dotenv").config();
const jwt = require("jsonwebtoken");
const doctorModel = require("../database/models/doctor.model");
const auth = async (req, res, next) => {
  try {
    // get doctor cuurent token => from header
    const token = await req.header("Authorization").replace("bearer ", "");
    // convet token using jwt to get doctorId
    const decodedToken = await jwt.verify(token, process.env.JWTKEY);

    // search db (_id, token)
    const doctorData = await doctorModel.findOne({
      _id: decodedToken._id,
      "tokens.token": token,
    });
    // if(! doctor) unauthorized
    if (!doctorData) {
      throw new Error("unauth");
    }
    // continue
    req.doctor = doctorData;
    req.token = token;
    next();
  } catch (e) {
    res.status(500).send({
      apiStatus: false,
      data: e.message,
      message: "unauth",
    });
  }
};
module.exports = auth;
