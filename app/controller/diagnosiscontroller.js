const diagnosisModel = require("../database/models/diagnosis.model");
const { responseGenerator } = require("../helpers/response.generator.helper");

class diagnosis {
  static addDiagnosis = async (req, res) => {
    try {
      const diagnosisData = await new diagnosisModel({
        ...req.body,
      });
      await diagnosisData.save();
      responseGenerator(
        res,
        200,
        diagnosisData,
        "diagnosis added successfully"
      );
    } catch (e) {
      responseGenerator(res, 400, e.message, " diagnosis add failed");
    }
  };
  //edit diagnosis
  static editDiagnosis = async (req, res) => {
    try {
      const diagnosis = await diagnosisModel.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        type: req.body.type,
      });
      await diagnosis.save();
      await responseGenerator(
        res,
        200,
        await diagnosisModel.findById(req.params.id),
        "diagnosis had been edited successfully"
      );
    } catch (e) {
      responseGenerator(res, 400, e.message, "checking failed");
    }
  };
  static getAllDiagnosiss = async (req, res) => {
    try {
      const diagnosiss = await diagnosisModel.find().sort({ name: 1 });
      responseGenerator(res, 200, diagnosiss, "diagnosis's data fetched");
    } catch (e) {
      responseGenerator(res, 500, e.message, "error in diagnosis data");
    }
  };

  static deleteSingleDiagnosis = async (req, res) => {
    try {
      const diagnosis = await diagnosisModel.findByIdAndDelete(req.params.id);
      if (!diagnosis) throw new Error("diagnosis not found");
      responseGenerator(res, 200, diagnosis, "data deleted");
    } catch (e) {
      responseGenerator(res, 500, e.message, "error in data");
    }
  };
}
module.exports = diagnosis;
