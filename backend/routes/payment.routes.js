const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/payment.controller");

router.get("/", paymentController.getPayments);
router.post("/", paymentController.addPayment);

module.exports = router;
