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
      const patient = await patientModel.findById(req.params.id);
      ////how to push the check data here ?????????
      // patientModel.updateOne(
      //   { _id: patientid },
      //   {
      //     $push: {
      //       allChecks: { $each: await req.body },
      //     },
      //   }
      // );
      //check if the patient in the waiting list or not
      if (patient.waiting) {
        await patient.allChecks.push(req.body);
        patient.waiting = false;
        patient.waitingTime = "";
        patient.date = new Date()
          .toISOString()
          .replace(/T/, " ")
          .replace(/\..+/, "")
          .substring(0, 11);
        await patient.save();
        await responseGenerator(res, 200, {}, "patient checked successfully");
      }
      //if not in waiting list
      else {
        await responseGenerator(
          res,
          401,
          {},
          "patient not in the waiting list"
        );
      }
    } catch (e) {
      responseGenerator(res, 400, e.message, "checking failed");
    }
  };
  static addVisualAcuity = async (req, res) => {
    try {
      const patient = await patientModel.findByIdAndUpdate(req.params.id, {
        visualAcuity: req.body,
      });
      // /// to remove the patient from the waiting
      // patient.waiting = false;
      // patient.waitingTime = "";
      await patient.save();
      await responseGenerator(
        res,
        200,
        await patientModel.findById(req.params.id),
        "patient's visualAcuity added successfully"
      );
    } catch (e) {
      responseGenerator(res, 400, e.message, "checking failed");
    }
  };
  static getAllPatients = async (req, res) => {
    try {
      const patients = await patientModel.find().sort({ createdAt: 1 });
      responseGenerator(res, 200, patients, "data fetched");
    } catch (e) {
      responseGenerator(res, 500, e.message, "error in data");
    }
  };
  static getSinglePatient = async (req, res) => {
    try {
      const patient = await patientModel.findById(req.params.id);
      if (!patient) throw new Error("patient not found");
      responseGenerator(res, 200, patient, "data fetched");
    } catch (e) {
      responseGenerator(res, 500, e.message, "error in data");
    }
  };
  static deleteSinglePatient = async (req, res) => {
    try {
      const patient = await patientModel.findByIdAndDelete(req.params.id);
      if (!patient) throw new Error("patient not found");
      responseGenerator(res, 200, patient, "data deleted");
    } catch (e) {
      responseGenerator(res, 500, e.message, "error in data");
    }
  };
  static getLatestPatients = async (req, res) => {
    try {
      const patientData = await patientModel.find().sort({ date: 1 });

      let data = patientData.filter(
        (patient) =>
          patient.date.includes(
            //"2022-09-25 "
            `${new Date()
              .toISOString()
              .replace(/T/, " ")
              .replace(/\..+/, "")
              .substring(0, 11)}`
          ) && !patient.waiting
      );
      if (!data) throw new Error("no patients");
      responseGenerator(res, 200, data, "data fetched");
    } catch (e) {
      responseGenerator(res, 500, e.message, "error in data");
    }
  };
  static addToWaitingList = async (req, res) => {
    try {
      const patientData = await patientModel
        .findByIdAndUpdate(req.params.id, {
          appointmentType: req.body.appointmentType,
          waiting: true,
          waitingTime: `${new Date()
            .toISOString()
            .replace(/T/, " ")
            .replace(/\..+/, "")
            .substring(10)}`,
        })
        .sort({ waitingTime: 1 });

      if (!patientData) throw new Error("no patients");
      responseGenerator(res, 200, patientData, "data fetched");
    } catch (e) {
      responseGenerator(res, 500, e.message, "error in data");
    }
  };
  static getWaitingList = async (req, res) => {
    try {
      const patientData = await patientModel
        .find({ waiting: true })
        .sort({ waitingTime: 1 });

      if (!patientData) throw new Error("no patients");
      responseGenerator(res, 200, patientData, "data fetched");
    } catch (e) {
      responseGenerator(res, 500, e.message, "error in data");
    }
  };
  static removeFromWaitingList = async (req, res) => {
    try {
      const patientData = await patientModel.findByIdAndUpdate(req.params.id, {
        waiting: false,
        waitingTime: "",
        date: new Date()
          .toISOString()
          .replace(/T/, " ")
          .replace(/\..+/, "")
          .substring(0, 11),
      });
      if (!patientData) throw new Error("no patient");
      responseGenerator(res, 200, patientData, "data fetched");
    } catch (e) {
      responseGenerator(res, 500, e.message, "error in data");
    }
  };
  static editPatient = async (req, res) => {
    try {
      const patientData = await patientModel.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        phoneNumber: req.body.phoneNumber,
        age: req.body.age,
        gender: req.body.gender,
        appointmentType: req.body.appointmentType,
      });
      if (!patientData) throw new Error("no patient");
      responseGenerator(res, 200, patientData, "patient edited successfully");
    } catch (e) {
      responseGenerator(res, 500, e.message, "error in data");
    }
  };
}

module.exports = Patient;
