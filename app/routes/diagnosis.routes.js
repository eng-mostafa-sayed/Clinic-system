const router = require("express").Router();
const Diagnosis = require("../controller/diagnosis.controller");
const auth = require("../middelware/auth");

/// CRUD= create read update Delete
//create
router.post("/", auth, Diagnosis.addDrug);
//read
router.get("/", auth, Diagnosis.getAllDrugs);
//update
router.put("/:id", auth, Diagnosis.editDrug);
//delete
router.delete("/:id", auth, Diagnosis.deleteSingleDrug);

module.exports = router;
