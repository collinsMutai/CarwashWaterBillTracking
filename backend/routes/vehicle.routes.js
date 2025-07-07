const express = require("express");
const router = express.Router();
const vehicleController = require("../controllers/vehicle.controller");

router.get("/", vehicleController.searchVehicles);
router.post("/", vehicleController.addVehicle);

module.exports = router;
