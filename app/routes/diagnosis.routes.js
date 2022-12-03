const router = require("express").Router();
const Diagnosis = require("../controller/diagnosis.controller");

const auth = require("../middelware/auth");

/// CRUD= create read update Delete
//create
router.post("/", auth, Diagnosis.addDiagnosis);
//read
router.get("/", auth, Diagnosis.getAllDiagnosis);
//update
router.put("/:id", auth, Diagnosis.editDiagnosis);
//delete
router.delete("/:id", auth, Diagnosis.deleteSingleDiagnosis);

module.exports = router;
