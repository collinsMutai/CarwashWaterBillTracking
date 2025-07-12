require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Import routes
const authRoutes = require("./routes/auth.routes");
const vehicleRoutes = require("./routes/vehicle.routes");
const waterBillRoutes = require("./routes/waterBill.routes");
const paymentRoutes = require("./routes/payment.routes");
const authMiddleware = require("./middleware/auth.middleware");

// Import cron and summary job
const startWeeklySummaryCron = require("./weeklySummaryCron");
const {
  getWeeklyServiceSummaryData,
} = require("./controllers/payment.controller");

const app = express();
const PORT = process.env.PORT || 5000;

// Connect MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// Middleware
app.use(cors());
app.use(express.json());

// Public routes
app.use("/api/auth", authRoutes);

// Protected routes
app.use("/api/vehicles", authMiddleware, vehicleRoutes);
app.use("/api/waterbills", authMiddleware, waterBillRoutes);
app.use("/api/payments", authMiddleware, paymentRoutes);

app.get("/", (req, res) => {
  res.send("Car Wash Water Bill Backend Running");
});

// Start server
app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);

  // ✅ Start the weekly cron job
  startWeeklySummaryCron();

  // ✅ Run the weekly summary job manually at server start (for logging)
  try {
    console.log("📆 Manually running weekly summary on startup...");

    const summary = await getWeeklyServiceSummaryData();

    console.log(
      `📊 Weekly Summary: ${summary.weekStart.toDateString()} - ${summary.weekEnd.toDateString()}`
    );

    summary.services.forEach((s) => {
      console.log(
        `🚗 ${s.registration} | ${s.description} | Washes: ${s.numberOfWashes} | Total Fee: KES ${s.totalServiceFee}`
      );
    });

    console.log("✅ Manual weekly summary complete on startup.");
  } catch (err) {
    console.error("❌ Error running summary on startup:", err.message);
  }
});
