const patientModel = require("../database/models/patient.model");
const doctorModel = require("../database/models/doctor.model");
const { responseGenerator } = require("../helpers/response.generator.helper");

class Patient {
  static add = async (req, res) => {
    try {
      const patientData = await new patientModel({
        ...req.body,
        doctorId: req.doctor._id,
      });
      await patientData.save();
      responseGenerator(res, 200, patientData, "patient added successfully");
    } catch (e) {
      responseGenerator(res, 400, e.message, "add failed");
    }
  };
  static addCheck = async (req, res) => {
    try {
      // res.send(req.body);
      const patientid = await req.headers.id;
      const patient = await patientModel.findById(patientid);
      ////how to push the check data here ?????????
      // patientModel.updateOne(
      //   { _id: patientid },
      //   {
      //     $push: {
      //       allChecks: { $each: await req.body },
      //     },
      //   }
      // );
      patient.allChecks.push(req.body);
      await patient.save();
      responseGenerator(res, 200, patient, "patient checked successfully");
    } catch (e) {
      responseGenerator(res, 400, e.message, "checking failed");
    }
  };
}

module.exports = Patient;
