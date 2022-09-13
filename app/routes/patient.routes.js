const router = require("express").Router();
const Patient = require("../controller/patient.controller");
const auth = require("../middelware/auth");

router.post("/add", auth, Patient.add);
router.post("/addcheck", auth, Patient.addCheck);

/// new routes
router.get("/", auth, Patient.getAllPatients);
router.get("/:id", auth, Patient.getSinglePatient);
router.delete("/:id", auth, Patient.deleteSinglePatient);
router.get("/latestPatients", auth, Patient.add);

module.exports = router;
