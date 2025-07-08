const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/payment.controller");

router.get("/", paymentController.getPayments);
router.post("/", paymentController.addPayment);

// Update payment by ID
router.put("/:id", paymentController.updatePayment);

// Delete payment by ID
router.delete("/:id", paymentController.deletePayment);

module.exports = router;
