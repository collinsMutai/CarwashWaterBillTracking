const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/payment.controller");
const authMiddleware = require("../middleware/auth.middleware"); // your JWT middleware

// Protect all routes
router.get("/", authMiddleware, paymentController.getPayments);
router.post("/", authMiddleware, paymentController.addPayment);
router.put("/:id", authMiddleware, paymentController.updatePayment);
router.delete("/:id", authMiddleware, paymentController.deletePayment);
router.get(
  "/weekly-services",
  authMiddleware,
  paymentController.getWeeklyServices
);
router.post(
  "/generate-weekly-summary",
  authMiddleware,
  paymentController.generateWeeklySummaryNow
);
router.get(
  "/weekly-invoice",
  // authMiddleware,
  paymentController.generateWeeklyInvoice
);
router.get("/weekly-invoice/pdf", paymentController.downloadWeeklyInvoicePdf);

module.exports = router;
