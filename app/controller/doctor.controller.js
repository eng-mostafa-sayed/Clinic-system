const doctorModel = require("../database/models/doctor.model");
const { responseGenerator } = require("../helpers/response.generator.helper");
const patientModel = require("../database/models/patient.model");

class Doctor {
  static register = async (req, res) => {
    try {
      const data = await new doctorModel(req.body);
      await data.save();
      responseGenerator(res, 200, data, "registered");
    } catch (e) {
      responseGenerator(res, 400, e.message, "bad data");
    }
  };

  static login = async (req, res) => {
    try {
      const doctorData = await doctorModel.login(
        req.body.name,
        req.body.password
      );
      if (!doctorData)
        return responseGenerator(res, 500, "", "user not founded");
      const token = await doctorData.generateToken();
      responseGenerator(
        res,
        200,
        { user: doctorData, token },
        "successfull login"
      );
    } catch (e) {
      responseGenerator(res, 400, e.message, "bad data");
    }
  };

  static forgetPassword = async (req, res) => {
    try {
      const doctorData = await doctorModel.forgetPassword(
        req.body.email,
        req.body.password
      );
      responseGenerator(res, 200, doctorData, "password changed sucessfully");
    } catch (e) {
      responseGenerator(res, 400, e.message, "bad data");
    }
  };
  static logOut = async (req, res) => {
    try {
      //comming from the auth
      req.doctor.tokens = [];
      await req.doctor.save();
      res.send({
        apiStatus: true,
        data: req.Doctor,
        message: "logged out",
      });
    } catch (e) {
      res
        .status(500)
        .send({ apiStatus: false, data: e.message, message: "error" });
    }
  };

  static getPatients = async (req, res) => {
    try {
      const patients = await patientModel.find().sort({ name: 1 });
      responseGenerator(res, 200, patients, "data fetched");
    } catch (e) {
      responseGenerator(res, 500, e.message, "error in data");
    }
  };
  static singlePatient = async (req, res) => {
    try {
      const patient = await patientModel.findById(req.body.id);
      if (!patient) throw new Error("patient not found");
      responseGenerator(res, 200, patient, "data fetched");
    } catch (e) {
      responseGenerator(res, 500, e.message, "error in data");
    }
  };
  //////////////////////////////search for patient //////////////////
  static searchPatient = async (req, res) => {
    try {
      const patient = await patientModel.find(req.body);
      if (!patient) throw new Error("patient not found");
      responseGenerator(res, 200, patient, "data fetched");
    } catch (e) {
      responseGenerator(res, 500, e.message, "error in data");
    }
  };

  ///////////////////////////////////////////////////////////////////////////
  static all = async (req, res) => {
    try {
      const allUsers = await doctorModel.find().sort({ name: 1, _id: 1 });
      res.status(200).send({
        apiStatus: true,
        data: allUsers,
        message: "all doctors fetched",
      });
    } catch (e) {
      res.status(500).send({
        apiStatus: false,
        data: e.message,
        message: "error in fetching",
      });
    }
  };
}
module.exports = Doctor;
