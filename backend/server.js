require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const vehicleRoutes = require("./routes/vehicle.routes");
const waterBillRoutes = require("./routes/waterBill.routes");
const paymentRoutes = require("./routes/payment.routes");
const authMiddleware = require("./middleware/auth.middleware");

const startWeeklySummaryCron = require("./weeklySummaryCron");
const {
  getWeeklyServiceSummaryData,
} = require("./controllers/payment.controller");

// Import mongoose and schema for second DB to save summary manually
const mongooseSecondary = require("mongoose");
const weeklySummarySchema = require("./models/WeeklySummary.model");

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to primary DB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// Connect to second DB (for saving summary)
const secondDb = mongooseSecondary.createConnection(
  process.env.SECOND_MONGO_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
const WeeklySummary = secondDb.model("WeeklySummary", weeklySummarySchema);

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/vehicles", authMiddleware, vehicleRoutes);
app.use("/api/waterbills", authMiddleware, waterBillRoutes);
app.use("/api/payments", authMiddleware, paymentRoutes);

app.get("/", (req, res) => {
  res.send("Car Wash Water Bill Backend Running");
});

app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);

  // Start the weekly cron job (runs every Monday 10 PM)
  startWeeklySummaryCron();

  // Manually run weekly summary and save on startup for testing
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

    // Save to second DB
    const savedSummary = await WeeklySummary.create(summary);
    console.log(
      `✅ Manual weekly summary saved to DB with id: ${savedSummary._id}`
    );

    console.log("✅ Manual weekly summary complete on startup.");
  } catch (err) {
    console.error(
      "❌ Error running summary on startup:",
      err.stack || err.message
    );
  }
});
