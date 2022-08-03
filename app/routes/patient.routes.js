const router = require("express").Router();
const Patient = require("../controller/patient.controller");
const auth = require("../middelware/auth");

router.post("/add", auth, Patient.add);
router.post("/addcheck", auth, Patient.addCheck);

module.exports = router;
