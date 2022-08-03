require("dotenv").config();
require("./app/database/DB.Connection");
const express = require("express");
const cors = require("cors");
//import routes
const doctorRoutes = require("./app/routes/doctor.routes");

const patientRoutes = require("./app/routes/patient.routes");
const helperMethod = require("./app/helpers/response.generator.helper");
//create express app
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/doctor", doctorRoutes);
app.use("/api/patient", patientRoutes);

//error handling for non intiated routes
app.all("*", (req, res) => {
  helperMethod.responseGenerator(res, 404, "Invalid url", "not found");
});
app.listen(process.env.PORT, () =>
  console.log(`http://localhost:${process.env.PORT}`)
);
