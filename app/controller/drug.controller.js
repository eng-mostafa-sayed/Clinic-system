const drugModel = require("../database/models/drug.model");
const { responseGenerator } = require("../helpers/response.generator.helper");

class drug {
  static addDrug = async (req, res) => {
    try {
      const drugData = await new drugModel({
        ...req.body,
      });
      await drugData.save();
      responseGenerator(res, 200, drugData, "drug added successfully");
    } catch (e) {
      responseGenerator(res, 400, e.message, " drug add failed");
    }
  };
  //edit drug
  static editDrug = async (req, res) => {
    try {
      const drug = await drugModel.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        type: req.body.type,
      });
      await drug.save();
      await responseGenerator(
        res,
        200,
        await drugModel.findById(req.params.id),
        "drug had been edited successfully"
      );
    } catch (e) {
      responseGenerator(res, 400, e.message, "checking failed");
    }
  };
  static getAllDrugs = async (req, res) => {
    try {
      const drugs = await drugModel.find().sort({ name: 1 });
      responseGenerator(res, 200, drugs, "drug's data fetched");
    } catch (e) {
      responseGenerator(res, 500, e.message, "error in drug data");
    }
  };

  static deleteSingleDrug = async (req, res) => {
    try {
      const drug = await drugModel.findByIdAndDelete(req.params.id);
      if (!drug) throw new Error("drug not found");
      responseGenerator(res, 200, drug, "data deleted");
    } catch (e) {
      responseGenerator(res, 500, e.message, "error in data");
    }
  };
}
module.exports = drug;
