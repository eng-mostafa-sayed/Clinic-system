const router = require("express").Router();
const Doctor = require("../controller/doctor.controller");
const auth = require("../middelware/auth");
router.post("/register", Doctor.register);
router.post("/login", Doctor.login);
router.post("/forgetpassword", Doctor.forgetPassword); // it needs the  email and new password
router.get("/logout", auth, Doctor.logOut); // depends on auth
router.get("/getpatients", auth, Doctor.getPatients); // depends on auth
router.get("/singlepatient", auth, Doctor.singlePatient); // depends on auth

module.exports = router;
