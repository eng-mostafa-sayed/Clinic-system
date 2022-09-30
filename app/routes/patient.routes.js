const router = require("express").Router();
const Patient = require("../controller/patient.controller");
const auth = require("../middelware/auth");

router.post("/add", auth, Patient.add);

/// new routes
router.get("/", auth, Patient.getAllPatients);
router.post("/", auth, Patient.add);
router.get("/last", auth, Patient.getLatestPatients);
router.get("/waiting", auth, Patient.getWaitingList);
router.post("/waiting/:id", auth, Patient.addToWaitingList);

router.put("/:id", auth, Patient.addCheck);
router.put("/v/:id", auth, Patient.addVisualAcuity); // to add the visual acuity
router.get("/:id", auth, Patient.getSinglePatient);
router.delete("/:id", auth, Patient.deleteSinglePatient);

module.exports = router;
