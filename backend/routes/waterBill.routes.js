const express = require("express");
const router = express.Router();
const waterBillController = require("../controllers/waterBill.controller");

router.get("/", waterBillController.getDailyBills);
router.post("/", waterBillController.addWaterBill);

module.exports = router;
