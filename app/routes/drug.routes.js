const router = require("express").Router();
const Drug = require("../controller/drug.controller");
const auth = require("../middelware/auth");

/// CRUD= create read update Delete
//create
router.post("/", auth, Drug.addDrug);
//read
router.get("/", auth, Drug.getAllDrugs);
//update
router.put("/:id", auth, Drug.editDrug);
//delete
router.delete("/:id", auth, Drug.deleteSingleDrug);

module.exports = router;
